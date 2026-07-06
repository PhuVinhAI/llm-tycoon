/**
 * engineReducer.test.ts — the pure view-model reducer, replayed over a recorded
 * event sequence (no React, no Ink).
 */
import { expect, test } from 'bun:test';
import { engineReducer, initialViewState } from '../src/cli/state/engineReducer.ts';
import type { EngineEvent } from '../src/engine/events.ts';

function fold(events: EngineEvent[]) {
  return events.reduce(engineReducer, initialViewState);
}

const snap = (rp: number, pp: number) => ({
  runtimePrompt: rp,
  runtimeCompletion: 0,
  playerPrompt: pp,
  playerCompletion: 0,
  limit: 1000,
});

test('folds a full game into the view model', () => {
  const state = fold([
    {
      type: 'run_start',
      mode: 'new',
      runtimeModel: 'R',
      playerModel: 'P',
      maxTurns: 10,
      sessionId: 's1',
      gameDocKB: 100,
    },
    { type: 'phase', phase: 'init' },
    { type: 'runtime_init', content: 'Welcome', usage: null, fallback: null },
    { type: 'phase', phase: 'playing' },
    { type: 'turn_start', turn: 1 },
    { type: 'player_action', turn: 1, content: 'research', usage: null, fallback: null },
    { type: 'engine_result', turn: 1, content: 'ok', usage: null, fallback: null, turnMs: 500 },
    { type: 'tokens', turn: 1, snapshot: snap(200, 150) },
    { type: 'autosave', turn: 1 },
    { type: 'game_over', turn: 1 },
    { type: 'save', block: '=== SAVE ===', raw: '=== SAVE ===' },
    { type: 'lessons', content: 'lessons', path: '/x/lessons_1.md' },
    { type: 'run_end', turns: 1, gameOver: true, totalMs: 1234, resultPath: '/x/result.json' },
  ]);

  expect(state.sessionId).toBe('s1');
  expect(state.runtimeModel).toBe('R');
  expect(state.maxTurns).toBe(10);
  expect(state.turn).toBe(1);
  expect(state.tokens.runtimePrompt).toBe(200);
  expect(state.autosaves).toBe(1);
  expect(state.gameOver).toBe(true);
  expect(state.saveWritten).toBe(true);
  expect(state.lessonsPath).toBe('/x/lessons_1.md');
  expect(state.finished).toBe(true);
  expect(state.result).toMatchObject({ turns: 1, resultPath: '/x/result.json' });
  // Transcript captured init + player + engine lines.
  expect(state.transcript.length).toBe(3);
});

test('retry then retry_progress updates the activity model', () => {
  const state = fold([
    { type: 'retry', who: 'runtime', attempt: 2, ceil: 3, waitMs: 1000, reason: 'empty' },
    { type: 'retry_progress', who: 'runtime', elapsedMs: 400, totalMs: 1000 },
  ]);
  expect(state.activity.kind).toBe('retrying');
  expect(state.activity.retry).toMatchObject({ attempt: 2, ceil: 3, elapsedMs: 400 });
});

test('trims and errors accumulate; unknown-safe', () => {
  const state = fold([
    { type: 'trim', who: 'player', turn: 1, newPrompt: 100 },
    { type: 'trim', who: 'runtime', turn: 1, newPrompt: 200 },
    { type: 'error', who: 'system', turn: 1, message: 'boom', fatal: false },
    { type: 'interrupt', reason: 'user quit', turn: 1 },
  ]);
  expect(state.trims).toBe(2);
  expect(state.errors.length).toBe(2);
  expect(state.errors[1]).toContain('user quit');
});
