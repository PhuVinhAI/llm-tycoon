/**
 * engine.test.ts — drives runEngine() to completion with fully injected deps
 * (mock callAI + in-memory session/state), asserting the emitted event
 * sequence and that persistence hooks fire. No network, no real disk state.
 */
import { afterEach, beforeEach, expect, test } from 'bun:test';
// The engine reads PATHS.gameDoc from disk; ensure a build exists.
import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
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
function makeDeps(script: { runtime: string[]; player: string[]; gameOverAt?: number }): {
  deps: EngineDeps;
  saved: Record<string, unknown>;
} {
  const saved: Record<string, unknown> = {};
  let runtimeIdx = 0;
  let playerIdx = 0;

  const callAI = (async (cfg): Promise<CallResult> => {
    const isRuntime = cfg.model === 'mock-runtime';
    const arr = isRuntime ? script.runtime : script.player;
    const idx = isRuntime ? runtimeIdx++ : playerIdx++;
    const content = arr[Math.min(idx, arr.length - 1)] ?? 'ok';
    return { content, usage: { prompt_tokens: 100, completion_tokens: 10 }, fallback: null };
  }) as EngineDeps['callAI'];

  const sessionDir = join(tmp, 'sess');
  mkdirSync(sessionDir, { recursive: true });

  const history = {
    initSession: async () => ({ id: 'sess-1', dir: sessionDir }),
    findSessionById: async () => null,
    findPreviousSession: async () => null,
    closeSession: async (_id: string, s: object) => {
      saved.closed = s;
    },
    setContinuedFrom: async () => {},
    writeSave: async (_d: string, c: string) => {
      saved.save = c;
    },
    writeLessons: async (_d: string, c: string) => {
      saved.lessons = c;
      return join(sessionDir, 'lessons_1.md');
    },
    loadLessonsChain: async () => null,
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
