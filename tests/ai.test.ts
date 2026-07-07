/**
 * ai.test.ts — extractAssistantText (pure) + callAI retry loop via a stub
 * client. The two retry-observability tests target the `onRetry` hook (the TS
 * rewrite surfaces retries as hook callbacks / engine events instead of
 * console.warn lines).
 *
 * Retry backoff is cancelled (AI_RETRY_BASE_DELAY_MS='0') for most tests so the
 * suite runs fast. Because bun test shares one process across files, the env is
 * set/restored around the callAI tests rather than assumed process-isolated.
 */
import { afterAll, beforeAll, expect, test } from 'bun:test';
import { callAI, extractAssistantText, NON_RETRY_EMPTY } from '../src/ai/call.ts';
import type { ClientConfig } from '../src/ai/client.ts';

const saved: Record<string, string | undefined> = {};
beforeAll(() => {
  for (const k of ['AI_RETRY_ATTEMPTS', 'AI_RETRY_BASE_DELAY_MS', 'AI_RETRY_MULTIPLIER']) {
    saved[k] = process.env[k];
  }
  process.env.AI_RETRY_ATTEMPTS = '3';
  process.env.AI_RETRY_BASE_DELAY_MS = '0';
  process.env.AI_RETRY_MULTIPLIER = '1';
});
afterAll(() => {
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
});

// ─── extractAssistantText ───────────────────────────────────────────────────
test('extractAssistantText returns content + no fallback when both present', () => {
  const r = extractAssistantText({ message: { content: 'hello world', reasoning_content: 'x' } });
  expect(r.ok).toBe(true);
  if (r.ok) {
    expect(r.content).toBe('hello world');
    expect(r.fallback).toBe(null);
  }
});

test('extractAssistantText falls back to reasoning when content is empty', () => {
  const r = extractAssistantText({
    message: { content: '', reasoning_content: 'pure reasoning only' },
  });
  expect(r.ok).toBe(true);
  if (r.ok) {
    expect(r.content).toBe('pure reasoning only');
    expect(r.fallback).toBe('reasoning');
  }
});

test('extractAssistantText treats null content as empty too', () => {
  const r = extractAssistantText({
    message: { content: null, reasoning_content: 'still reasoning' },
  });
  expect(r.ok).toBe(true);
  if (r.ok) expect(r.fallback).toBe('reasoning');
});

test('REGRESSION — rejects when BOTH content+reasoning are empty strings', () => {
  const r = extractAssistantText({
    message: { content: '', reasoning_content: '' },
    finish_reason: 'stop',
  });
  expect(r.ok).toBe(false);
  if (!r.ok) expect(r.reason).toBe('empty');
});

test('REGRESSION — rejects when BOTH content+reasoning are null', () => {
  const r = extractAssistantText({
    message: { content: null, reasoning_content: null },
    finish_reason: 'stop',
  });
  expect(r.ok).toBe(false);
});

test('extractAssistantText rejects when message is missing / null / undefined', () => {
  expect(extractAssistantText({ finish_reason: 'stop' }).ok).toBe(false);
  expect(extractAssistantText(null).ok).toBe(false);
  expect(extractAssistantText(undefined).ok).toBe(false);
});

test('extractAssistantText prefers real content over a populated reasoning field', () => {
  const r = extractAssistantText({
    message: { content: 'final answer', reasoning_content: '...' },
  });
  expect(r.ok).toBe(true);
  if (r.ok) {
    expect(r.content).toBe('final answer');
    expect(r.fallback).toBe(null);
  }
});

test('extractAssistantText treats whitespace-only responses as valid text', () => {
  const r = extractAssistantText({ message: { content: '   ', reasoning_content: '' } });
  expect(r.ok).toBe(true);
  if (r.ok) {
    expect(r.content).toBe('   ');
    expect(r.fallback).toBe(null);
  }
});

// ─── callAI stub harness ────────────────────────────────────────────────────
interface Scenario {
  response?: unknown;
  error?: { message: string; status?: number | undefined; code?: string; type?: string };
}

function makeStubClient(scenarios: Scenario[]) {
  let i = 0;
  const calls: unknown[] = [];
  const client = {
    chat: {
      completions: {
        create: async (body: unknown) => {
          calls.push(body);
          const s = scenarios[i++];
          if (!s) throw new Error(`Stub ran out of scenarios at call ${i}`);
          if (s.error) {
            const err = new Error(s.error.message) as Error & {
              status?: number | undefined;
              code?: string;
              type?: string;
            };
            err.status = s.error.status;
            if (s.error.code !== undefined) err.code = s.error.code;
            if (s.error.type !== undefined) err.type = s.error.type;
            throw err;
          }
          return s.response;
        },
      },
    },
  };
  const cfg = { client, model: 'stub', extraBody: {}, label: 'stub' } as unknown as ClientConfig;
  return { cfg, calls };
}

function emptyStop(n: number): Scenario[] {
  return Array.from({ length: n }, () => ({
    response: {
      choices: [{ message: { content: '', reasoning_content: '' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 100, completion_tokens: 0, total_tokens: 100 },
    },
  }));
}

test('callAI retries through empty responses and returns the first valid one', async () => {
  const { cfg, calls } = makeStubClient([
    ...emptyStop(2),
    {
      response: {
        choices: [{ message: { content: 'final', reasoning_content: '' }, finish_reason: 'stop' }],
        usage: { prompt_tokens: 100, completion_tokens: 5, total_tokens: 105 },
      },
    },
  ]);
  const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
  expect(result.content).toBe('final');
  expect(result.fallback).toBe(null);
  expect(calls.length).toBe(3);
});

test('callAI throws "after 3 attempts" when every attempt is empty', async () => {
  const { cfg, calls } = makeStubClient(emptyStop(5));
  await expect(callAI(cfg, [{ role: 'user', content: 'hi' }])).rejects.toThrow(
    /Invalid API response after 3 attempts/,
  );
  expect(calls.length).toBe(3);
});

test('callAI honours AI_RETRY_ATTEMPTS=1 (no retry, one attempt)', async () => {
  const prev = process.env.AI_RETRY_ATTEMPTS;
  process.env.AI_RETRY_ATTEMPTS = '1';
  try {
    const { cfg, calls } = makeStubClient([
      ...emptyStop(2),
      {
        response: {
          choices: [
            { message: { content: 'never', reasoning_content: '' }, finish_reason: 'stop' },
          ],
        },
      },
    ]);
    await expect(callAI(cfg, [{ role: 'user', content: 'hi' }])).rejects.toThrow(/after 1 attempt/);
    expect(calls.length).toBe(1);
  } finally {
    process.env.AI_RETRY_ATTEMPTS = prev;
  }
});

for (const fr of ['length', 'content_filter', 'function_call', 'tool_calls', 'refusal']) {
  test(`callAI throws immediately on finish_reason=${fr} (no retry)`, async () => {
    const { cfg, calls } = makeStubClient([
      {
        response: {
          choices: [{ message: { content: '', reasoning_content: '' }, finish_reason: fr }],
        },
      },
      {
        response: {
          choices: [
            { message: { content: 'never', reasoning_content: '' }, finish_reason: 'stop' },
          ],
        },
      },
    ]);
    await expect(callAI(cfg, [{ role: 'user', content: 'hi' }])).rejects.toThrow(
      new RegExp(`finish_reason=${fr}`),
    );
    expect(calls.length).toBe(1);
  });
}

test('callAI retries through 5xx transport errors then succeeds', async () => {
  const { cfg, calls } = makeStubClient([
    { error: { message: 'upstream exploded', status: 500 } },
    { error: { message: 'still broken', status: 502 } },
    {
      response: {
        choices: [
          { message: { content: 'recovered', reasoning_content: '' }, finish_reason: 'stop' },
        ],
      },
    },
  ]);
  const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
  expect(result.content).toBe('recovered');
  expect(calls.length).toBe(3);
});

test('callAI retries through 429 rate-limit then succeeds', async () => {
  const { cfg, calls } = makeStubClient([
    { error: { message: 'rate limited', status: 429 } },
    {
      response: {
        choices: [{ message: { content: 'ok', reasoning_content: '' }, finish_reason: 'stop' }],
      },
    },
  ]);
  const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
  expect(result.content).toBe('ok');
  expect(calls.length).toBe(2);
});

for (const status of [401, 400]) {
  test(`callAI throws immediately on ${status} (user-fixable, no retry)`, async () => {
    const { cfg, calls } = makeStubClient([
      { error: { message: 'user-fixable failure', status } },
      {
        response: {
          choices: [
            { message: { content: 'never', reasoning_content: '' }, finish_reason: 'stop' },
          ],
        },
      },
    ]);
    await expect(callAI(cfg, [{ role: 'user', content: 'hi' }])).rejects.toThrow(
      /user-fixable failure/,
    );
    expect(calls.length).toBe(1);
  });
}

test('callAI falls back to reasoning_content when content is empty but reasoning present', async () => {
  const { cfg } = makeStubClient([
    {
      response: {
        choices: [
          {
            message: { content: '', reasoning_content: 'thinking out loud...' },
            finish_reason: 'stop',
          },
        ],
      },
    },
  ]);
  const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
  expect(result.content).toBe('thinking out loud...');
  expect(result.fallback).toBe('reasoning');
});

test('callAI retries through a network error with NO status', async () => {
  const { cfg, calls } = makeStubClient([
    { error: { message: 'ECONNRESET thrown by socket', status: undefined } },
    {
      response: {
        choices: [
          { message: { content: 'recovered', reasoning_content: '' }, finish_reason: 'stop' },
        ],
      },
    },
  ]);
  const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
  expect(result.content).toBe('recovered');
  expect(calls.length).toBe(2);
});

test('NON_RETRY_EMPTY set membership is pinned against accidental edits', () => {
  const expected = ['length', 'content_filter', 'function_call', 'tool_calls', 'refusal'];
  expect([...NON_RETRY_EMPTY].sort()).toEqual([...expected].sort());
});

// ─── retry observability via the onRetry hook ───────────────────────────────
test('callAI invokes onRetry with attempt/wait info when backoff is active', async () => {
  const prevBase = process.env.AI_RETRY_BASE_DELAY_MS;
  const prevMult = process.env.AI_RETRY_MULTIPLIER;
  process.env.AI_RETRY_BASE_DELAY_MS = '20';
  process.env.AI_RETRY_MULTIPLIER = '1';
  try {
    const { cfg } = makeStubClient([
      ...emptyStop(2),
      {
        response: {
          choices: [
            { message: { content: 'final', reasoning_content: '' }, finish_reason: 'stop' },
          ],
        },
      },
    ]);
    const retries: Array<{ attempt: number; ceil: number; waitMs: number; reason: string }> = [];
    const result = await callAI(cfg, [{ role: 'user', content: 'hi' }], {
      onRetry: (info) => retries.push(info),
    });
    expect(result.content).toBe('final');
    expect(retries.length).toBe(2);
    expect(retries[0]).toMatchObject({ attempt: 2, ceil: 3, waitMs: 20 });
    expect(retries[0]?.reason).toMatch(/empty content\+reasoning/);
  } finally {
    process.env.AI_RETRY_BASE_DELAY_MS = prevBase;
    process.env.AI_RETRY_MULTIPLIER = prevMult;
  }
});

test('callAI does NOT invoke onRetry when AI_RETRY_BASE_DELAY_MS=0', async () => {
  const { cfg } = makeStubClient([
    ...emptyStop(2),
    {
      response: {
        choices: [{ message: { content: 'final', reasoning_content: '' }, finish_reason: 'stop' }],
      },
    },
  ]);
  const retries: unknown[] = [];
  const result = await callAI(cfg, [{ role: 'user', content: 'hi' }], {
    onRetry: (info) => retries.push(info),
  });
  expect(result.content).toBe('final');
  expect(retries.length).toBe(0);
});
