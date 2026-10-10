import { expect, test } from 'bun:test';
import { loadConfig } from '../src/config/env.ts';
import { runEngine } from '../src/engine/engine.ts';
import type { EngineEvent } from '../src/engine/events.ts';

test('text-only API harness rejects the 1.0 package before network or session writes', async () => {
  const config = loadConfig({ AI_RUNTIME_API_KEY: 'test', AI_PLAYER_API_KEY: 'test' });
  let sideEffects = 0;
  const forbidden = async (): Promise<never> => {
    sideEffects += 1;
    throw new Error('unexpected side effect');
  };
  const events: EngineEvent[] = [];
  for await (const event of runEngine({
    mode: 'new',
    config,
    signal: new AbortController().signal,
    deps: {
      callAI: forbidden,
      loadState: forbidden,
      saveAtomic: forbidden,
      deleteState: forbidden,
    },
  })) {
    events.push(event);
  }
  expect(sideEffects).toBe(0);
  expect(events).toHaveLength(1);
  expect(events[0]).toMatchObject({ type: 'error', fatal: true });
  const error = events[0];
  if (error?.type === 'error') expect(error.message).toContain('Python execution');
});
