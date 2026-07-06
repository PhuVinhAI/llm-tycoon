/**
 * engine.test.ts — drives runEngine() to completion with fully injected deps
 * (mock callAI + in-memory session/state), asserting the emitted event
 * sequence and that persistence hooks fire. No network, no real disk state.
 */
import { afterEach, beforeEach, expect, test } from 'bun:test';
// The engine reads PATHS.gameDoc from disk; ensure a build exists.
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { CallResult } from '../src/ai/call.ts';
import { loadConfig } from '../src/config/env.ts';
import { PATHS } from '../src/config/paths.ts';
import type { EngineDeps } from '../src/engine/engine.ts';
import { runEngine } from '../src/engine/engine.ts';
import type { EngineEvent } from '../src/engine/events.ts';

const CONFIG = loadConfig({
  AI_RUNTIME_API_KEY: 'test',
  AI_PLAYER_API_KEY: 'test',
  AI_RUNTIME_MODEL: 'mock-runtime',
  AI_PLAYER_MODEL: 'mock-player',
  GAME_MAX_TURNS: '10',
  GAME_AUTOSAVE_TURNS: '1',
});

let tmp: string;

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), 'llmt-engine-'));
});
afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

/** In-memory stand-ins for the session + state modules. */
function makeDeps(script: {
  runtime: string[];
  player: string[];
  gameOverAt?: number;
  /** When set, findPreviousSession returns this closed parent (a continue). */
  parent?: { id: string; sessionDir: string; turns: number; continues: number };
}): {
  deps: EngineDeps;
  saved: Record<string, unknown>;
} {
  const saved: Record<string, unknown> = {};
  let runtimeIdx = 0;
  let playerIdx = 0;
  const runtimeCalls: Array<{ count: number; lastUser: string }> = [];
  saved.runtimeCalls = runtimeCalls;

  const callAI = (async (cfg, messages): Promise<CallResult> => {
    const isRuntime = cfg.model === 'mock-runtime';
    if (isRuntime) {
      const users = messages.filter((m) => m.role === 'user');
      runtimeCalls.push({
        count: messages.length,
        lastUser: users[users.length - 1]?.content ?? '',
      });
    }
    const arr = isRuntime ? script.runtime : script.player;
    const idx = isRuntime ? runtimeIdx++ : playerIdx++;
    const content = arr[Math.min(idx, arr.length - 1)] ?? 'ok';
    return { content, usage: { prompt_tokens: 100, completion_tokens: 10 }, fallback: null };
  }) as EngineDeps['callAI'];

  const sessionDir = join(tmp, 'sess');
  mkdirSync(sessionDir, { recursive: true });

  const parentEntry = script.parent
    ? {
        id: script.parent.id,
        date: '2026-01-01',
        startedAt: '2026-01-01T00:00:00.000Z',
        endedAt: '2026-01-01T01:00:00.000Z',
        runtime: 'mock-runtime',
        player: 'mock-player',
        maxTurns: 10,
        turns: script.parent.turns,
        totalMs: 1000,
        gameOver: false,
        sessionDir: script.parent.sessionDir,
        continuedFrom: null,
        continues: script.parent.continues,
      }
    : null;

  const history = {
    initSession: async () => {
      saved.initCalled = true;
      return { id: 'sess-1', dir: sessionDir };
    },
    findSessionById: async () => null,
    findPreviousSession: async () => parentEntry,
    reopenSession: async (id: string, o: { continues: number }) => {
      saved.reopened = { id, ...o };
    },
    closeSession: async (_id: string, s: object) => {
      saved.closed = s;
    },
    setContinuedFrom: async () => {},
    writeSave: async (dir: string, c: string) => {
      saved.save = c;
      saved.saveDir = dir;
    },
    writeLessons: async (dir: string, c: string) => {
      saved.lessons = c;
      saved.lessonsDir = dir;
      return join(dir, 'lessons_1.md');
    },
    loadLessonsChain: async () => (script.parent ? 'Bài học ván trước.' : null),
    listHistory: async () => [],
    listHistoryFormatted: async () => '',
    loadHistory: async () => [],
  } as unknown as EngineDeps['history'];

  const deps: EngineDeps = {
    callAI,
    history,
    loadState: async () => null,
    saveAtomic: async (p: string, d: unknown) => {
      saved[p === PATHS.state ? 'state' : 'result'] = d;
    },
    deleteState: async () => {
      saved.deleted = true;
    },
  };
  return { deps, saved };
}

async function collect(gen: AsyncGenerator<EngineEvent>): Promise<EngineEvent[]> {
  const out: EngineEvent[] = [];
  for await (const ev of gen) out.push(ev);
  return out;
}

test('runEngine plays a full game to a game-over and finalises', async () => {
  if (!existsSync(PATHS.gameDoc)) {
    throw new Error('build/LLM-TYCOON.md missing — run `bun run build` before tests');
  }
  const { deps, saved } = makeDeps({
    runtime: ['Welcome! Turn 1 state.', 'Turn 2 state.', 'You did it — GAME OVER ==='],
    player: ['research', 'freelance', 'đồng ý'],
  });
  const controller = new AbortController();

  const events = await collect(
    runEngine({ mode: 'new', config: CONFIG, signal: controller.signal, deps }),
  );
  const types = events.map((e) => e.type);

  expect(types).toContain('run_start');
  expect(types).toContain('runtime_init');
  expect(types).toContain('turn_start');
  expect(types).toContain('player_action');
  expect(types).toContain('engine_result');
  expect(types).toContain('game_over');
  expect(types).toContain('save');
  expect(types).toContain('lessons');
  expect(types).toContain('run_end');

  // Game-over deletes the state file and writes save + lessons + result.
  expect(saved.deleted).toBe(true);
  expect(saved.save).toBeTruthy();
  expect(saved.lessons).toBeTruthy();
  expect(saved.result).toBeTruthy();

  const runEnd = events.find((e) => e.type === 'run_end');
  expect(runEnd).toMatchObject({ gameOver: true });
});

test('runEngine stops cleanly on an aborted signal', async () => {
  const { deps } = makeDeps({
    runtime: ['Turn state forever'],
    player: ['keep going'],
  });
  const controller = new AbortController();
  controller.abort('user quit');

  const events = await collect(
    runEngine({ mode: 'new', config: CONFIG, signal: controller.signal, deps }),
  );
  const types = events.map((e) => e.type);
  expect(types).toContain('interrupt');
  expect(types).toContain('run_end');
  // No SAVE/lessons on an interrupt.
  expect(types).not.toContain('save');
});

test('continue reuses the parent dir, splits init into two runtime calls, and sums turns', async () => {
  if (!existsSync(PATHS.gameDoc)) {
    throw new Error('build/LLM-TYCOON.md missing — run `bun run build` before tests');
  }
  // The engine reads save.txt off disk directly (not via deps).
  const parentDir = join(tmp, 'parent');
  mkdirSync(parentDir, { recursive: true });
  const SAVE = '=== SAVE LLM-TYCOON v0.4 ===\ndate: 2016-12 | cash: 43669\n=== END SAVE ===';
  writeFileSync(join(parentDir, 'save.txt'), SAVE);

  const { deps, saved } = makeDeps({
    // [0] boot on doc, [1] resume after SAVE load, [2] turn-1 state (game over), [3] SAVE block
    runtime: [
      'BOOT: pick language',
      'RESUMED at 2016-12 menu',
      'You win — GAME OVER ===',
      '=== SAVE ... ===',
    ],
    player: ['tiếp tục', 'đồng ý'],
    parent: { id: 'parent-1', sessionDir: parentDir, turns: 100, continues: 0 },
  });

  const events = await collect(
    runEngine({ mode: 'continue', config: CONFIG, signal: new AbortController().signal, deps }),
  );

  // Continue must NOT allocate a new session; it reopens the parent in place.
  expect(saved.initCalled).toBeUndefined();
  expect(saved.reopened).toMatchObject({ id: 'parent-1', continues: 1 });

  // Runtime init is TWO calls: doc-only boot, then a second message carrying SAVE.
  const rc = saved.runtimeCalls as Array<{ count: number; lastUser: string }>;
  expect(rc[0]?.count).toBe(1); // boot: just the doc
  expect(rc[1]?.lastUser).toContain('=== SAVE LLM-TYCOON'); // load: SAVE handed over separately
  expect(rc[1]?.lastUser).not.toBe(rc[0]?.lastUser);

  // runtime_init surfaces the RESUME output, not the boot prompt.
  const init = events.find((e) => e.type === 'runtime_init');
  expect(init).toMatchObject({ content: 'RESUMED at 2016-12 menu' });

  // Save + lessons land in the PARENT dir (reuse-dir); turns are cumulative.
  expect(saved.saveDir).toBe(parentDir);
  expect(saved.lessonsDir).toBe(parentDir);
  expect(saved.closed).toMatchObject({ turns: 101 }); // 100 prior + 1 this run

  // A continue marker was logged for run #1.
  const marker = readFileSync(join(parentDir, 'game.jsonl'), 'utf8');
  expect(marker).toContain('"type":"continue"');
  expect(marker).toContain('"run":1');
});
