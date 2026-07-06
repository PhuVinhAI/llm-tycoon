/**
 * game.js — main orchestrator for one run.
 *
 * Responsibilities (everything else lives in dedicated modules):
 *  1. Decide the run mode (new | resume | continue | history).
 *  2. Discover / create the session, build runtime + player configs.
 *  3. Drive the turn loop: player turn ←→ runtime turn, with token trim.
 *  4. Persist state periodically (auto-save) and on signal.
 *  5. Capture the end-of-game SAVE block and lessons summary.
 *
 * Bug-fix history (vs. previous version):
 *  - Runtime message splice was `splice(1, 2)`, deleting the init assistant
 *    message and the first player turn — leaving the game doc at [0]
 *    directly followed by the FIRST runtime response, which lacks its
 *    triggering user message. Now `startIndex = 2` keeps the init pair
 *    (indices 0–1) intact.
 *  - `state.turn++` happened BEFORE the API calls, so a mid-turn failure
 *    saved a half-completed turn to disk forever. Now state.turn is bumped
 *    to its real value only AFTER both player and runtime responses return.
 *  - No state was saved per turn. SIGKILL / OOM lost all progress. We now
 *    auto-save on a configurable cadence (default: every turn).
 *  - On error the previous version called `process.exit(1)` without
 *    closing the session in history.json. We funnel through a single
 *    `shutdown()` that always closes the session metadata and persists
 *    state, even on error paths.
 */

import { readFileSync, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  RUNTIME, PLAYER, GAME_CONFIG,
  GAME_DOC_PATH, STATE_PATH, RESULT_PATH,
  FLAG_SESSION_ID,
} from './config.js';

import {
  recordUsage, trimContext, formatTokens, createTokenTracker,
} from './tokens.js';
import { detectGameOver, extractSaveBlock } from './parse.js';
import {
  buildPlayerSystemPrompt, buildLessonsPrompt, SAVE_PROMPT,
} from './prompts.js';
import {
  initSession, findSessionById, closeSession, setContinuedFrom,
  writeSave as writeSessionSave, writeLessons as writeSessionLessons,
  loadLessonsChain, findPreviousSession, listHistoryFormatted,
} from './session.js';
import { SessionLog, DebugLog } from './logger.js';
import { saveAtomic, loadState, deleteState } from './state.js';
import { buildClientConfig } from './clients.js';
import { callAI } from './ai.js';

// ─── State factories ──────────────────────────────────────────────────────
function freshState({ sessionId, sessionDir, gameDoc, gameDocHash, continueSave, playerSystemPrompt, startMs }) {
  return {
    turn: 0,
    gameDocHash,
    sessionId,
    sessionDir,
    runtimeMessages: [],
    runtimeTokens: createTokenTracker({ limit: GAME_CONFIG.tokenLimitPerTurn }),
    playerMessages: [{ role: 'system', content: playerSystemPrompt }],
    playerTokens: createTokenTracker({ limit: GAME_CONFIG.tokenLimitPerTurn }),
    runtimeLastResponse: '',
    gameOver: false,
    continueSave,
    gameDocRef: gameDoc,
    stats: { startMs },
  };
}

function rehydrateState(saved, playerSystemPrompt, startMs) {
  const t = (s) => {
    const tr = createTokenTracker({ limit: GAME_CONFIG.tokenLimitPerTurn });
    if (s) {
      tr.prompt = typeof s.prompt === 'number' ? s.prompt : 0;
      tr.completion = typeof s.completion === 'number' ? s.completion : 0;
      if (Array.isArray(s.pairs)) tr.pairs = s.pairs;
    }
    return tr;
  };
  return {
    turn: saved.turn ?? 0,
    gameDocHash: saved.gameDocHash,
    sessionId: saved.sessionId,
    sessionDir: saved.sessionDir,
    runtimeMessages: Array.isArray(saved.runtimeMessages) ? saved.runtimeMessages : [],
    runtimeTokens: t(saved.runtimeTokens),
    playerMessages: Array.isArray(saved.playerMessages) && saved.playerMessages.length > 0
      ? saved.playerMessages
      : [{ role: 'system', content: playerSystemPrompt }],
    playerTokens: t(saved.playerTokens),
    runtimeLastResponse: saved.runtimeLastResponse ?? '',
    gameOver: saved.gameOver ?? false,
    continueSave: null,
    gameDocRef: null,
    stats: { startMs },
  };
}

async function persistState(state) {
  await saveAtomic(STATE_PATH, {
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
  });
}

async function persistResult(state) {
  const totalMs = Date.now() - state.stats.startMs;
  await saveAtomic(RESULT_PATH, {
    turns: state.turn,
    gameOver: state.gameOver,
    totalMs,
    lastResponse: (state.runtimeLastResponse || '').slice(-3000),
    config: { runtime: RUNTIME.model, player: PLAYER.model },
  });
  console.log('   Result: game_result.json');
}

// ─── Game doc loader ──────────────────────────────────────────────────────
async function loadGameDoc() {
  if (!existsSync(GAME_DOC_PATH)) {
    console.error('❌ Game document not found. Run `npm run build` first.');
    process.exit(1);
  }
  return readFileSync(GAME_DOC_PATH, 'utf8');
}

/**
 * Tiny non-cryptographic djb2-ish hash, used to detect game-doc revisions
 * between sessions. Good enough for "has it changed?".
 */
function hashString(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i);
    h |= 0;
  }
  return h.toString(36);
}

function bytesKB(s) {
  return (Buffer.byteLength(s) / 1024).toFixed(0);
}

// ─── Shutdown gate (one funnel for all exit paths) ────────────────────────
// Bug-fix: the previous version set `_shuttingDown=true` synchronously then
// awaited `persistState` — a second SIGINT during that await would call
// `process.exit(0)` immediately, killing the process while the first
// shutdown's writeFile+rename were still queued. The state file was left
// unflushed. We now capture the in-flight promise and have re-entries await
// it before exiting so all writes reach disk.
let _shutdownInflight = null;

async function shutdown({ state, reason, exitCode = 0 }) {
  if (_shutdownInflight) {
    // Second (or later) signal — wait for the first shutdown's writes to
    // actually flush, then exit. The first shutdown handles the persistence;
    // we don't re-do it.
    try { await _shutdownInflight; } catch { /* swallow */ }
    process.exit(exitCode);
    return;
  }
  if (state) state._shuttingDown = true;

  console.log(`\n⏸️  ${reason} — saving state...`);
  _shutdownInflight = (async () => {
    try {
      // Best-effort: record the interrupt in the JSONL log before any heavy
      // write so a follow-up turn inspection sees it.
      if (state && state.log) {
        await state.log
          .write({ type: 'interrupt', reason, turn: state.turn })
          .catch(() => { /* never mask real error */ });
      }
      if (state) {
        await persistState(state);
        await closeSession(state.sessionId, {
          turns: state.turn,
          gameOver: state.gameOver,
          totalMs: Date.now() - state.stats.startMs,
        });
        console.log(`   Saved at turn ${state.turn}.`);
      }
    } catch (e) {
      console.error(`   ⚠️ Failed to flush on shutdown: ${e.message}`);
    }
  })();
  await _shutdownInflight;
  process.exit(exitCode);
}

// ─── Runtime init & loop ──────────────────────────────────────────────────
// Bug-fix: previous version used `process.removeAllListeners('SIGINT')` which
// also wiped any handlers installed by callers (tests, debuggers). We now
// keep named references and use `process.off`.
const _sigHandlers = { SIGINT: null, SIGTERM: null };

function installSignalHandlers(state) {
  _sigHandlers.SIGINT = () => shutdown({ state, reason: 'Received SIGINT', exitCode: 0 });
  _sigHandlers.SIGTERM = () => shutdown({ state, reason: 'Received SIGTERM', exitCode: 0 });
  process.on('SIGINT', _sigHandlers.SIGINT);
  process.on('SIGTERM', _sigHandlers.SIGTERM);
}

function uninstallSignalHandlers() {
  if (_sigHandlers.SIGINT) {
    process.off('SIGINT', _sigHandlers.SIGINT);
    _sigHandlers.SIGINT = null;
  }
  if (_sigHandlers.SIGTERM) {
    process.off('SIGTERM', _sigHandlers.SIGTERM);
    _sigHandlers.SIGTERM = null;
  }
}

async function runLoop(state, runtimeCfg, playerCfg, log) {
  installSignalHandlers(state);

  // If we resumed a session, runtime is already initialised.
  if (state.runtimeMessages.length === 0) {
    console.log('🔧 Initializing Runtime AI...');
    let init = state.gameDocRef;
    if (state.continueSave) init += '\n\n---\n\n' + state.continueSave;
    state.runtimeMessages = [{ role: 'user', content: init }];

    let res;
    try {
      res = await callAI(runtimeCfg, state.runtimeMessages, state.debug);
    } catch (err) {
      await log.write({ type: 'runtime_init_error', message: err.message }).catch(() => {});
      return shutdown({ state, reason: `Runtime init failed: ${err.message}`, exitCode: 1 });
    }
    state.runtimeLastResponse = res.content;
    state.runtimeMessages.push({ role: 'assistant', content: res.content });
    recordUsage(state.runtimeTokens, res.usage);
    await log.write({
      type: 'runtime_init',
      content: res.content.slice(0, 2000),
      usage: res.usage,
      fallback: res.fallback,
    });
    const promptKB = formatTokens(state.runtimeTokens.prompt);
    console.log(`✅ Runtime AI initialized (prompt: ${promptKB})`);
    console.log(`📊 Runtime ${promptKB} prompt | Player ${formatTokens(state.playerTokens.prompt)} prompt`);
    console.log('═══ GAME START ═══');
    console.log(res.content.slice(0, 500) + (res.content.length > 500 ? '...' : ''));
    console.log('');
  } else {
    console.log(`\n═══ RESUMED from turn ${state.turn} ═══`);
    console.log(
      (state.runtimeLastResponse || '').slice(0, 500) +
      (state.runtimeLastResponse.length > 500 ? '...' : '')
    );
    console.log('');
  }

  while (
    state.turn < GAME_CONFIG.maxTurns &&
    !state.gameOver &&
    !state._shuttingDown
  ) {
    const turnNo = state.turn + 1;
    const turnStart = Date.now();
    console.log(`── Turn ${turnNo} ──`);

    // 1. Player sees the last runtime output and decides an action.
    state.playerMessages.push({ role: 'user', content: state.runtimeLastResponse });
    let playerRes;
    try {
      playerRes = await callAI(playerCfg, state.playerMessages, state.debug);
    } catch (err) {
      console.error(`❌ Player failed: ${err.message}`);
      await log.write({ type: 'player_error', turn: turnNo, message: err.message }).catch(() => {});
      return shutdown({ state, reason: 'Player failed', exitCode: 1 });
    }
    const playerAction = playerRes.content;
    state.playerMessages.push({ role: 'assistant', content: playerAction });
    recordUsage(state.playerTokens, playerRes.usage);
    console.log(`  Player: ${playerAction.slice(0, 150)}${playerAction.length > 150 ? '...' : ''}`);

    // Player context: trim oldest (user+assistant) pair right after the
    // system prompt at index 0.
    if (trimContext({
      messages: state.playerMessages, tracker: state.playerTokens, startIndex: 1,
    })) {
      console.log(`  ✂️  Trimmed player context → ${formatTokens(state.playerTokens.prompt)}`);
    }

    // 2. Runtime processes the action and emits the next state.
    state.runtimeMessages.push({ role: 'user', content: playerAction });
    let runtimeRes;
    try {
      runtimeRes = await callAI(runtimeCfg, state.runtimeMessages, state.debug);
    } catch (err) {
      console.error(`❌ Runtime failed: ${err.message}`);
      await log.write({ type: 'runtime_error', turn: turnNo, message: err.message }).catch(() => {});
      return shutdown({ state, reason: 'Runtime failed', exitCode: 1 });
    }
    const runtimeResult = runtimeRes.content;
    state.runtimeMessages.push({ role: 'assistant', content: runtimeResult });
    state.runtimeLastResponse = runtimeResult;
    recordUsage(state.runtimeTokens, runtimeRes.usage);

    // Runtime context: keep init pair (game doc + init ack) at [0]/[1];
    // trim starts at index 2.
    if (trimContext({
      messages: state.runtimeMessages, tracker: state.runtimeTokens, startIndex: 2,
    })) {
      console.log(`  ✂️  Trimmed runtime context → ${formatTokens(state.runtimeTokens.prompt)}`);
    }

    // Only NOW bump the turn counter — if either API call had thrown, we
    // have already shut down above, so reaching this line with turnNo
    // means the turn is genuinely complete.
    state.turn = turnNo;
    const turnMs = Date.now() - turnStart;
    console.log(`  Engine: ${runtimeResult.slice(0, 200)}${runtimeResult.length > 200 ? '...' : ''} (${(turnMs / 1000).toFixed(1)}s)`);
    console.log(`  📊 Runtime ${formatTokens(state.runtimeTokens.prompt)} | Player ${formatTokens(state.playerTokens.prompt)}`);

    await log.write({
      type: 'turn',
      turn: turnNo,
      player_action: playerAction.slice(0, 2000),
      runtime_result: runtimeResult.slice(0, 2000),
      turn_ms: turnMs,
      usage: { runtime: runtimeRes.usage, player: playerRes.usage },
    });

    // Auto-save cadence. Saves ALL of state so a SIGKILL loses at most
    // autosaEvery-1 turns of progress.
    if (GAME_CONFIG.autoSaveEvery > 0 && state.turn % GAME_CONFIG.autoSaveEvery === 0) {
      try {
        await persistState(state);
      } catch (e) {
        console.warn(`⚠️  auto-save failed: ${e.message}`);
      }
    }

    if (detectGameOver(runtimeResult)) {
      state.gameOver = true;
      console.log('═══ GAME ENDED ═══');
    }
  }

  // Detach our signal listeners on clean exits (we manage our own flow below).
  uninstallSignalHandlers();

  // Bug-fix (reviewer #1): `finaliseRun` can throw on a SAVE or Lessons
  // API call failure. Wrap it so `game_result.json` still gets written and
  // stale `game_state.json` gets cleaned up — otherwise the user is left
  // with no result file and a state pointing at an unsummarised session.
  try {
    await finaliseRun(state, runtimeCfg, playerCfg, log);
  } catch (err) {
    console.error(
      `⚠️  End-of-run finalisation failed (continuing to game_result.json anyway): ${err.message}`
    );
    if (err && err.stack && process.env.DEBUG) console.error(err.stack);
  }
  try {
    await persistResult(state);
  } catch (err) {
    console.error(`⚠️  game_result.json write failed: ${err.message}`);
  }
  if (state.gameOver && existsSync(STATE_PATH)) {
    try { await deleteState(); } catch { /* best-effort */ }
  } else {
    console.log('   Resume: npm run play -- --resume');
  }
}

async function finaliseRun(state, runtimeCfg, playerCfg, log) {
  const totalMs = Date.now() - state.stats.startMs;
  console.log('\n═══ GENERATING SAVE & LESSONS ═══');

  // SAVE block from runtime
  state.runtimeMessages.push({ role: 'user', content: SAVE_PROMPT });
  try {
    const saveRes = await callAI(runtimeCfg, state.runtimeMessages, state.debug);
    const block = extractSaveBlock(saveRes.content);
    if (block) {
      await writeSessionSave(state.sessionDir, block);
      console.log('  💾 SAVE block written');
    } else {
      await writeSessionSave(state.sessionDir, saveRes.content);
      console.log('  ⚠️  No SAVE markers found — saved raw output');
    }
    state.runtimeMessages.push({ role: 'assistant', content: saveRes.content });
    await log.write({ type: 'save', content: saveRes.content.slice(0, 2000) });
  } catch (err) {
    console.log(`  ⚠️  SAVE block failed: ${err.message}`);
  }

  // Lessons from player
  state.playerMessages.push({ role: 'user', content: buildLessonsPrompt(state.turn) });
  try {
    const lessonsRes = await callAI(playerCfg, state.playerMessages, state.debug);
    await writeSessionLessons(state.sessionDir, lessonsRes.content);
    await log.write({ type: 'lessons', content: lessonsRes.content.slice(0, 2000) });
    console.log('  📝 Lessons file written');
  } catch (err) {
    console.log(`  ⚠️  Lessons skipped: ${err.message}`);
  }

  console.log(`\n═══ TEST COMPLETE ═══`);
  console.log(`   Turns: ${state.turn} | Time: ${(totalMs / 1000).toFixed(1)}s`);
  await log.write({
    type: 'summary',
    turns: state.turn,
    gameOver: state.gameOver,
    totalMs,
    config: { runtime: RUNTIME.model, player: PLAYER.model },
  });
  await closeSession(state.sessionId, {
    turns: state.turn,
    gameOver: state.gameOver,
    totalMs,
  });
}

// ─── Entry point ──────────────────────────────────────────────────────────
export async function runGame(mode) {
  // History view is a quick-path mode — no AI calls, no state file.
  if (mode === 'history') {
    console.log(await listHistoryFormatted());
    return;
  }

  const startMs = Date.now();
  console.log('🏭 LLM Tycoon — Play Test');
  console.log(`   Mode:    ${mode}`);
  console.log(`   Runtime: ${RUNTIME.model} @ ${RUNTIME.baseUrl}`);
  console.log(`   Player:  ${PLAYER.model} @ ${PLAYER.baseUrl}`);
  console.log(`   Max turns: ${GAME_CONFIG.maxTurns}\n`);

  const gameDoc = await loadGameDoc();
  const gameDocHash = hashString(gameDoc);
  console.log(`📄 Game document loaded (${bytesKB(gameDoc)} KB)`);

  const runtimeCfg = buildClientConfig({
    apiKey: RUNTIME.apiKey, baseUrl: RUNTIME.baseUrl, model: RUNTIME.model,
    reasoningEffort: RUNTIME.reasoningEffort, reasoningForce: RUNTIME.reasoningForce,
    timeoutMs: 120_000,
  });
  const playerCfg = buildClientConfig({
    apiKey: PLAYER.apiKey, baseUrl: PLAYER.baseUrl, model: PLAYER.model,
    reasoningEffort: PLAYER.reasoningEffort, reasoningForce: PLAYER.reasoningForce,
    timeoutMs: 60_000,
  });

  // Resolve mode → final mode (auto-detect / hash-mismatch fallback).
  let effectiveMode = mode;

  let saved = null;
  // Distinguish an EXPLICIT --resume (user typed the flag) from auto-detect.
  const explicitResume = mode === 'resume';
  if (effectiveMode === 'resume') {
    saved = await loadState();
    if (!saved) {
      console.error('❌ No saved state found. Use --new or --continue.');
      process.exit(1);
    }
  }
  if (saved && saved.gameDocHash && saved.gameDocHash !== gameDocHash) {
    // Bug-fix (reviewer #2): explicit --resume must NOT silently demote to
    // --new. The user asked to resume; an out-of-date game doc is a
    // blocking mismatch they need to acknowledge.
    if (explicitResume) {
      console.error(
        '❌ Cannot --resume: game document changed since last save.\n' +
          '   Run `npm run play -- --new` or `npm run play -- --continue` instead.'
      );
      process.exit(1);
    }
    console.warn('⚠️  Game document changed since last save — starting a new session.');
    effectiveMode = 'new';
    saved = null;
  }

  let state;
  let log;
  let debug;

  if (effectiveMode === 'resume' && saved) {
    const session = await findSessionById(saved.sessionId);
    if (!session) {
      console.error(`❌ Saved session "${saved.sessionId}" no longer exists on disk.`);
      process.exit(1);
    }
    log = new SessionLog(join(session.sessionDir, 'game.jsonl'), {
      tail: GAME_CONFIG.historyTail,
    });
    await log.init();
    debug = new DebugLog(join(session.sessionDir, 'debug'));
    await debug.init();
    await log.write({ type: 'resume', turn: saved.turn });
    state = rehydrateState(saved, buildPlayerSystemPrompt(null), startMs);
    console.log(`✅ Resumed from turn ${state.turn} (session: ${state.sessionId})`);
  } else {
    // continue | new (also catches resume→new fallback)
    let continueSave = null;
    let lessons = null;
    let parentSession = null;

    if (effectiveMode === 'continue') {
      parentSession = FLAG_SESSION_ID
        ? await findSessionById(FLAG_SESSION_ID)
        : await findPreviousSession(null);
      if (parentSession) {
        const savePath = join(parentSession.sessionDir, 'save.txt');
        if (existsSync(savePath)) {
          continueSave = await readFile(savePath, 'utf8');
          console.log(`💾 Loaded save from session ${parentSession.id}`);
        }
        lessons = await loadLessonsChain(parentSession.id);
        if (lessons) console.log(`📝 Loaded lessons chain from session ${parentSession.id}`);
      }
      if (!continueSave) console.log('⚠️  No save found, starting fresh.');
      if (!lessons) console.log('⚠️  No lessons found.');
    }

    if (existsSync(STATE_PATH)) await deleteState();

    const sess = await initSession({
      runtime: RUNTIME, player: PLAYER, maxTurns: GAME_CONFIG.maxTurns,
    });
    if (parentSession) await setContinuedFrom(sess.id, parentSession.id);
    log = new SessionLog(join(sess.dir, 'game.jsonl'), {
      tail: GAME_CONFIG.historyTail,
    });
    await log.init();
    debug = new DebugLog(join(sess.dir, 'debug'));
    await debug.init();

    state = freshState({
      sessionId: sess.id,
      sessionDir: sess.dir,
      gameDoc,
      gameDocHash,
      continueSave,
      playerSystemPrompt: buildPlayerSystemPrompt(lessons),
      startMs,
    });
    console.log(`📝 Session: ${sess.id}`);
    await log.write({
      type: 'config',
      runtime: RUNTIME.model,
      player: PLAYER.model,
      mode: effectiveMode,
      lessons: !!lessons,
      continue: !!continueSave,
      continuedFrom: parentSession?.id || null,
    });
  }

  state.debug = debug;
  state.log = log;

  await runLoop(state, runtimeCfg, playerCfg, log);
}
