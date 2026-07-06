/**
 * engine.ts — the turn loop as an async generator.
 *
 * `runEngine()` yields typed EngineEvents and performs the real disk IO
 * (persist state, close session, write logs) exactly where the original
 * game.js did. It NEVER calls process.exit and installs no signal handlers —
 * the caller passes an AbortSignal and decides the exit code from the emitted
 * events. This is what lets the Ink and plain renderers share one loop.
 *
 * Behaviour preserved from game.js:
 *  - runtime init keeps its [0]/[1] pair; player trims from index 1, runtime
 *    from index 2.
 *  - turn counter bumps only AFTER both calls return (a mid-turn failure never
 *    persists a half-turn).
 *  - autosave cadence; SAVE-block + lessons finalisation; state deletion on a
 *    clean game-over; result file written on every completion.
 *  - explicit resume with a changed game doc is a hard error (no silent demote).
 */

import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { callAI as realCallAI } from '../ai/call.ts';
import { buildClientConfig } from '../ai/client.ts';
import type { AppConfig } from '../config/env.ts';
import { PATHS } from '../config/paths.ts';
import * as realHistory from '../session/history.ts';
import { DebugLog, SessionLog } from '../session/logger.ts';
import type { PersistedState } from '../session/schema.ts';
import { deleteState, loadState, saveAtomic } from '../session/state.ts';
import { streamCall } from './call-stream.ts';
import type { EngineEvent, RunMode, TokenSnapshot } from './events.ts';
import { detectGameOver, extractSaveBlock } from './parse.ts';
import { buildLessonsPrompt, buildPlayerSystemPrompt, SAVE_PROMPT } from './prompts.ts';
import { createTokenTracker, recordUsage, type TokenTracker, trimContext } from './tokens.ts';

// ─── Injectable dependencies (defaults are the real modules) ────────────────
export interface EngineDeps {
  callAI: typeof realCallAI;
  history: typeof realHistory;
  loadState: typeof loadState;
  saveAtomic: typeof saveAtomic;
  deleteState: typeof deleteState;
}

const defaultDeps: EngineDeps = {
  callAI: realCallAI,
  history: realHistory,
  loadState,
  saveAtomic,
  deleteState,
};

export interface RunEngineOptions {
  mode: RunMode;
  config: AppConfig;
  signal: AbortSignal;
  sessionId?: string;
  deps?: Partial<EngineDeps>;
}

// ─── Internal in-memory state ───────────────────────────────────────────────
interface EngineState {
  turn: number;
  gameDocHash: string;
  sessionId: string;
  sessionDir: string;
  runtimeMessages: Array<{ role: string; content: string }>;
  runtimeTokens: TokenTracker;
  playerMessages: Array<{ role: string; content: string }>;
  playerTokens: TokenTracker;
  runtimeLastResponse: string;
  gameOver: boolean;
  continueSave: string | null;
  gameDocRef: string | null;
  startMs: number;
  log: SessionLog;
  debug: DebugLog;
  endReason: 'game_over' | 'max_turns' | 'interrupt' | 'error' | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────
/** Tiny non-cryptographic djb2-ish hash, to detect game-doc revisions. */
function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return h.toString(36);
}

function snapshot(state: EngineState): TokenSnapshot {
  return {
    runtimePrompt: state.runtimeTokens.prompt,
    runtimeCompletion: state.runtimeTokens.completion,
    playerPrompt: state.playerTokens.prompt,
    playerCompletion: state.playerTokens.completion,
    limit: state.runtimeTokens.limit,
  };
}

function trackerFrom(
  saved:
    | {
        prompt?: number;
        completion?: number;
        pairs?: Array<{ prompt: number; completion: number }>;
      }
    | undefined,
  limit: number,
): TokenTracker {
  const tr = createTokenTracker({ limit });
  if (saved) {
    tr.prompt = typeof saved.prompt === 'number' ? saved.prompt : 0;
    tr.completion = typeof saved.completion === 'number' ? saved.completion : 0;
    if (Array.isArray(saved.pairs)) tr.pairs = saved.pairs;
  }
  return tr;
}

function toPersisted(state: EngineState): PersistedState {
  return {
    turn: state.turn,
    gameDocHash: state.gameDocHash,
    sessionId: state.sessionId,
    sessionDir: state.sessionDir,
    runtimeMessages: state.runtimeMessages,
    runtimeTokens: {
      prompt: state.runtimeTokens.prompt,
      completion: state.runtimeTokens.completion,
      pairs: state.runtimeTokens.pairs,
    },
    playerMessages: state.playerMessages,
    playerTokens: {
      prompt: state.playerTokens.prompt,
      completion: state.playerTokens.completion,
      pairs: state.playerTokens.pairs,
    },
    runtimeLastResponse: state.runtimeLastResponse,
    gameOver: state.gameOver,
  };
}

// ─── The generator ──────────────────────────────────────────────────────────
export async function* runEngine(opts: RunEngineOptions): AsyncGenerator<EngineEvent, void> {
  const deps = { ...defaultDeps, ...opts.deps };
  const { config, signal } = opts;
  const limit = config.game.tokenLimitPerTurn;

  // Load game doc.
  if (!existsSync(PATHS.gameDoc)) {
    yield {
      type: 'error',
      who: 'system',
      turn: 0,
      message: 'Game document not found. Run `bun run build` first.',
      fatal: true,
    };
    return;
  }
  const gameDoc = readFileSync(PATHS.gameDoc, 'utf8');
  const gameDocHash = hashString(gameDoc);
  const gameDocKB = Math.round(Buffer.byteLength(gameDoc) / 1024);

  // Build clients (may throw on missing key → surface as fatal error).
  let runtimeCfg: ReturnType<typeof buildClientConfig>;
  let playerCfg: ReturnType<typeof buildClientConfig>;
  try {
    runtimeCfg = buildClientConfig(config.runtime, 'runtime', { timeoutMs: 120_000 });
    playerCfg = buildClientConfig(config.player, 'player', { timeoutMs: 60_000 });
  } catch (err) {
    yield { type: 'error', who: 'system', turn: 0, message: (err as Error).message, fatal: true };
    return;
  }

  yield { type: 'phase', phase: 'init' };

  // Resolve mode → state.
  let state: EngineState;
  let effectiveMode: RunMode = opts.mode;

  if (opts.mode === 'resume') {
    const saved = await deps.loadState();
    if (!saved) {
      yield {
        type: 'error',
        who: 'system',
        turn: 0,
        message: 'No saved state found. Use new or continue.',
        fatal: true,
      };
      return;
    }
    if (saved.gameDocHash && saved.gameDocHash !== gameDocHash) {
      yield {
        type: 'error',
        who: 'system',
        turn: 0,
        message: 'Cannot resume: game document changed since last save. Use new or continue.',
        fatal: true,
      };
      return;
    }
    const session = await deps.history.findSessionById(saved.sessionId);
    if (!session) {
      yield {
        type: 'error',
        who: 'system',
        turn: 0,
        message: `Saved session "${saved.sessionId}" no longer exists on disk.`,
        fatal: true,
      };
      return;
    }
    const log = new SessionLog(join(session.sessionDir, 'game.jsonl'), {
      tail: config.game.historyTail,
    });
    await log.init();
    const debug = new DebugLog(join(session.sessionDir, 'debug'));
    await debug.init();
    await log.write({ type: 'resume', turn: saved.turn });
    state = {
      turn: saved.turn,
      gameDocHash: saved.gameDocHash,
      sessionId: saved.sessionId,
      sessionDir: saved.sessionDir,
      runtimeMessages: saved.runtimeMessages,
      runtimeTokens: trackerFrom(saved.runtimeTokens, limit),
      playerMessages:
        saved.playerMessages.length > 0
          ? saved.playerMessages
          : [{ role: 'system', content: buildPlayerSystemPrompt(null) }],
      playerTokens: trackerFrom(saved.playerTokens, limit),
      runtimeLastResponse: saved.runtimeLastResponse,
      gameOver: saved.gameOver,
      continueSave: null,
      gameDocRef: null,
      startMs: Date.now(),
      log,
      debug,
      endReason: null,
    };
  } else {
    // new | continue
    let continueSave: string | null = null;
    let lessons: string | null = null;
    let parentSession: Awaited<ReturnType<typeof deps.history.findSessionById>> = null;

    if (opts.mode === 'continue') {
      parentSession = opts.sessionId
        ? await deps.history.findSessionById(opts.sessionId)
        : await deps.history.findPreviousSession(null);
      if (parentSession) {
        const savePath = join(parentSession.sessionDir, 'save.txt');
        if (existsSync(savePath)) continueSave = await readFile(savePath, 'utf8');
        lessons = await deps.history.loadLessonsChain(parentSession.id);
      }
    }

    if (existsSync(PATHS.state)) await deps.deleteState();

    const sess = await deps.history.initSession({
      runtime: config.runtime,
      player: config.player,
      maxTurns: config.game.maxTurns,
    });
    if (parentSession) await deps.history.setContinuedFrom(sess.id, parentSession.id);

    const log = new SessionLog(join(sess.dir, 'game.jsonl'), { tail: config.game.historyTail });
    await log.init();
    const debug = new DebugLog(join(sess.dir, 'debug'));
    await debug.init();
    await log.write({
      type: 'config',
      runtime: config.runtime.model,
      player: config.player.model,
      mode: opts.mode,
      lessons: !!lessons,
      continue: !!continueSave,
      continuedFrom: parentSession?.id ?? null,
    });

    state = {
      turn: 0,
      gameDocHash,
      sessionId: sess.id,
      sessionDir: sess.dir,
      runtimeMessages: [],
      runtimeTokens: createTokenTracker({ limit }),
      playerMessages: [{ role: 'system', content: buildPlayerSystemPrompt(lessons) }],
      playerTokens: createTokenTracker({ limit }),
      runtimeLastResponse: '',
      gameOver: false,
      continueSave,
      gameDocRef: gameDoc,
      startMs: Date.now(),
      log,
      debug,
      endReason: null,
    };
    effectiveMode = opts.mode;
  }

  yield {
    type: 'run_start',
    mode: effectiveMode,
    runtimeModel: config.runtime.model,
    playerModel: config.player.model,
    maxTurns: config.game.maxTurns,
    sessionId: state.sessionId,
    gameDocKB,
  };

  let resultPath: string | null = null;
  try {
    yield* runLoop(state, runtimeCfg, playerCfg, config, deps, signal);
    // SAVE block + lessons + result only on a natural end (not interrupt/error).
    if (state.endReason === 'game_over' || state.endReason === 'max_turns') {
      resultPath = yield* collectFinalArtifacts(
        state,
        runtimeCfg,
        playerCfg,
        deps,
        Date.now() - state.startMs,
      );
    }
  } finally {
    // Always flush state + close the session, even on abort / throw.
    try {
      await deps.saveAtomic(PATHS.state, toPersisted(state));
    } catch {
      /* best-effort */
    }
    try {
      await deps.history.closeSession(state.sessionId, {
        turns: state.turn,
        gameOver: state.gameOver,
        totalMs: Date.now() - state.startMs,
      });
    } catch {
      /* best-effort */
    }
  }

  // Clean up state file on a genuine game-over; keep it for resume otherwise.
  // deleteState is idempotent (internal existsSync), so no outer guard needed.
  if (state.gameOver) {
    try {
      await deps.deleteState();
    } catch {
      /* best-effort */
    }
  }

  yield { type: 'phase', phase: 'done' };
  yield {
    type: 'run_end',
    turns: state.turn,
    gameOver: state.gameOver,
    totalMs: Date.now() - state.startMs,
    resultPath,
  };
}

// ─── Turn loop ──────────────────────────────────────────────────────────────
async function* runLoop(
  state: EngineState,
  runtimeCfg: ReturnType<typeof buildClientConfig>,
  playerCfg: ReturnType<typeof buildClientConfig>,
  config: AppConfig,
  deps: EngineDeps,
  signal: AbortSignal,
): AsyncGenerator<EngineEvent, void> {
  // Runtime init (skipped on resume — runtime already has history).
  if (state.runtimeMessages.length === 0) {
    let init = state.gameDocRef ?? '';
    if (state.continueSave) init += `\n\n---\n\n${state.continueSave}`;
    state.runtimeMessages = [{ role: 'user', content: init }];

    let res: Awaited<ReturnType<typeof deps.callAI>>;
    try {
      res = yield* streamCall('runtime', (hooks) =>
        deps.callAI(runtimeCfg, state.runtimeMessages, { ...hooks, debug: state.debug }),
      );
    } catch (err) {
      await state.log
        .write({ type: 'runtime_init_error', message: (err as Error).message })
        .catch(() => {});
      state.endReason = 'error';
      yield {
        type: 'error',
        who: 'runtime',
        turn: 0,
        message: `Runtime init failed: ${(err as Error).message}`,
        fatal: true,
      };
      return;
    }
    state.runtimeLastResponse = res.content;
    state.runtimeMessages.push({ role: 'assistant', content: res.content });
    recordUsage(state.runtimeTokens, res.usage);
    await state.log.write({
      type: 'runtime_init',
      content: res.content.slice(0, 2000),
      usage: res.usage,
      fallback: res.fallback,
    });
    yield { type: 'runtime_init', content: res.content, usage: res.usage, fallback: res.fallback };
  } else {
    yield { type: 'resumed', turn: state.turn, lastResponse: state.runtimeLastResponse };
  }

  yield { type: 'phase', phase: 'playing' };
  yield { type: 'tokens', turn: state.turn, snapshot: snapshot(state) };

  while (state.turn < config.game.maxTurns && !state.gameOver) {
    if (signal.aborted) {
      state.endReason = 'interrupt';
      yield { type: 'interrupt', reason: String(signal.reason ?? 'aborted'), turn: state.turn };
      await state.log
        .write({ type: 'interrupt', reason: String(signal.reason ?? 'aborted'), turn: state.turn })
        .catch(() => {});
      return;
    }

    const turnNo = state.turn + 1;
    const turnStart = Date.now();
    yield { type: 'turn_start', turn: turnNo };

    // 1. Player sees last runtime output, decides an action.
    state.playerMessages.push({ role: 'user', content: state.runtimeLastResponse });
    let playerRes: Awaited<ReturnType<typeof deps.callAI>>;
    try {
      playerRes = yield* streamCall('player', (hooks) =>
        deps.callAI(playerCfg, state.playerMessages, { ...hooks, debug: state.debug }),
      );
    } catch (err) {
      await state.log
        .write({ type: 'player_error', turn: turnNo, message: (err as Error).message })
        .catch(() => {});
      state.endReason = 'error';
      yield {
        type: 'error',
        who: 'player',
        turn: turnNo,
        message: (err as Error).message,
        fatal: true,
      };
      return;
    }
    const playerAction = playerRes.content;
    state.playerMessages.push({ role: 'assistant', content: playerAction });
    recordUsage(state.playerTokens, playerRes.usage);
    yield {
      type: 'player_action',
      turn: turnNo,
      content: playerAction,
      usage: playerRes.usage,
      fallback: playerRes.fallback,
    };

    if (
      trimContext({ messages: state.playerMessages, tracker: state.playerTokens, startIndex: 1 })
    ) {
      yield { type: 'trim', who: 'player', turn: turnNo, newPrompt: state.playerTokens.prompt };
    }

    // 2. Runtime processes the action, emits the next state.
    state.runtimeMessages.push({ role: 'user', content: playerAction });
    let runtimeRes: Awaited<ReturnType<typeof deps.callAI>>;
    try {
      runtimeRes = yield* streamCall('runtime', (hooks) =>
        deps.callAI(runtimeCfg, state.runtimeMessages, { ...hooks, debug: state.debug }),
      );
    } catch (err) {
      await state.log
        .write({ type: 'runtime_error', turn: turnNo, message: (err as Error).message })
        .catch(() => {});
      state.endReason = 'error';
      yield {
        type: 'error',
        who: 'runtime',
        turn: turnNo,
        message: (err as Error).message,
        fatal: true,
      };
      return;
    }
    const runtimeResult = runtimeRes.content;
    state.runtimeMessages.push({ role: 'assistant', content: runtimeResult });
    state.runtimeLastResponse = runtimeResult;
    recordUsage(state.runtimeTokens, runtimeRes.usage);

    if (
      trimContext({ messages: state.runtimeMessages, tracker: state.runtimeTokens, startIndex: 2 })
    ) {
      yield { type: 'trim', who: 'runtime', turn: turnNo, newPrompt: state.runtimeTokens.prompt };
    }

    // Bump the turn counter only now — both calls returned.
    state.turn = turnNo;
    const turnMs = Date.now() - turnStart;
    yield {
      type: 'engine_result',
      turn: turnNo,
      content: runtimeResult,
      usage: runtimeRes.usage,
      fallback: runtimeRes.fallback,
      turnMs,
    };
    yield { type: 'tokens', turn: turnNo, snapshot: snapshot(state) };

    await state.log.write({
      type: 'turn',
      turn: turnNo,
      player_action: playerAction.slice(0, 2000),
      runtime_result: runtimeResult.slice(0, 2000),
      turn_ms: turnMs,
      usage: { runtime: runtimeRes.usage, player: playerRes.usage },
    });

    if (config.game.autoSaveEvery > 0 && state.turn % config.game.autoSaveEvery === 0) {
      try {
        await deps.saveAtomic(PATHS.state, toPersisted(state));
        yield { type: 'autosave', turn: state.turn };
      } catch (e) {
        yield {
          type: 'error',
          who: 'system',
          turn: state.turn,
          message: `auto-save failed: ${(e as Error).message}`,
          fatal: false,
        };
      }
    }

    if (detectGameOver(runtimeResult)) {
      state.gameOver = true;
      state.endReason = 'game_over';
      yield { type: 'game_over', turn: state.turn };
    }
  }

  // Natural loop exit without a game-over → hit the max-turns ceiling.
  if (state.endReason === null) state.endReason = 'max_turns';
}

// ─── End-of-run: SAVE block + lessons ───────────────────────────────────────
async function* collectFinalArtifacts(
  state: EngineState,
  runtimeCfg: ReturnType<typeof buildClientConfig>,
  playerCfg: ReturnType<typeof buildClientConfig>,
  deps: EngineDeps,
  totalMs: number,
): AsyncGenerator<EngineEvent, string> {
  yield { type: 'phase', phase: 'finalising' };

  // SAVE block from runtime.
  state.runtimeMessages.push({ role: 'user', content: SAVE_PROMPT });
  try {
    const saveRes = await deps.callAI(runtimeCfg, state.runtimeMessages, { debug: state.debug });
    const block = extractSaveBlock(saveRes.content);
    await deps.history.writeSave(state.sessionDir, block ?? saveRes.content);
    state.runtimeMessages.push({ role: 'assistant', content: saveRes.content });
    await state.log.write({ type: 'save', content: saveRes.content.slice(0, 2000) });
    yield { type: 'save', block, raw: saveRes.content };
  } catch (err) {
    yield {
      type: 'error',
      who: 'runtime',
      turn: state.turn,
      message: `SAVE block failed: ${(err as Error).message}`,
      fatal: false,
    };
  }

  // Lessons from player.
  state.playerMessages.push({ role: 'user', content: buildLessonsPrompt(state.turn) });
  try {
    const lessonsRes = await deps.callAI(playerCfg, state.playerMessages, { debug: state.debug });
    const path = (await deps.history.writeLessons(state.sessionDir, lessonsRes.content)) ?? null;
    await state.log.write({ type: 'lessons', content: lessonsRes.content.slice(0, 2000) });
    yield { type: 'lessons', content: lessonsRes.content, path };
  } catch (err) {
    yield {
      type: 'error',
      who: 'player',
      turn: state.turn,
      message: `Lessons skipped: ${(err as Error).message}`,
      fatal: false,
    };
  }

  await state.log.write({ type: 'summary', turns: state.turn, gameOver: state.gameOver, totalMs });

  // Result file.
  await deps.saveAtomic(PATHS.result, {
    turns: state.turn,
    gameOver: state.gameOver,
    totalMs,
    lastResponse: (state.runtimeLastResponse || '').slice(-3000),
    config: { runtime: runtimeCfg.model, player: playerCfg.model },
  });
  return PATHS.result;
}
