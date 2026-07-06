/**
 * ai.test.js — covers the pure validation helper AND the retry loop of
 * callAI via a stub OpenAI client.
 *
 * The regression for the bug that crashed the play-test run at turn 63:
 * a DeepSeek-style thinking model returned `{content:"",reasoning_content:""}`
 * on a 200 OK. The previous validator threw unconditionally, terminating
 * the entire game. With extractAssistantText + the retry loop in callAI,
 * the same scenario now recovers transparently.
 *
 * node:test runs each file in its own process, so the `before` hook here
 * setting AI_RETRY_BASE_DELAY_MS='0' only affects THIS file's retry loops
 * (extracting 1.5s+3s real-time waits would make the suite painful).
 */

import { test, before } from 'node:test';
import assert from 'node:assert/strict';

import { extractAssistantText, callAI, NON_RETRY_EMPTY } from '../ai.js';

// Cancel any real-time backoff so stub tests run in <100ms total.
before(() => {
  process.env.AI_RETRY_ATTEMPTS = '3';
  process.env.AI_RETRY_BASE_DELAY_MS = '0';
  process.env.AI_RETRY_MULTIPLIER = '1';
});

// ─── extractAssistantText (pure helper) ───────────────────────────────────

test('extractAssistantText returns content + no fallback when both present', () => {
  const r = extractAssistantText({
    message: { content: 'hello world', reasoning_content: 'thinking...' },
  });
  assert.equal(r.ok, true);
  assert.equal(r.content, 'hello world');
  assert.equal(r.fallback, null);
});

test('extractAssistantText falls back to reasoning when content is empty', () => {
  const r = extractAssistantText({
    message: { content: '', reasoning_content: 'pure reasoning only' },
  });
  assert.equal(r.ok, true);
  assert.equal(r.content, 'pure reasoning only');
  assert.equal(r.fallback, 'reasoning');
});

test('extractAssistantText treats null content as empty too', () => {
  const r = extractAssistantText({
    message: { content: null, reasoning_content: 'still reasoning' },
  });
  assert.equal(r.ok, true);
  assert.equal(r.fallback, 'reasoning');
});

test('REGRESSION — rejects when BOTH content+reasoning are empty strings', () => {
  // The exact shape that killed the game at turn 63. MUST reject so the
  // retry loop can take over (or throw on exhaustion).
  const r = extractAssistantText({
    message: { content: '', reasoning_content: '' },
    finish_reason: 'stop',
  });
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'empty');
});

test('REGRESSION — rejects when BOTH content+reasoning are null', () => {
  const r = extractAssistantText({
    message: { content: null, reasoning_content: null },
    finish_reason: 'stop',
  });
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'empty');
});

test('extractAssistantText rejects when message is missing', () => {
  const r = extractAssistantText({ finish_reason: 'stop' });
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'empty');
});

test('extractAssistantText rejects when choice is null', () => {
  const r = extractAssistantText(null);
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'empty');
});

test('extractAssistantText rejects when choice is undefined', () => {
  const r = extractAssistantText(undefined);
  assert.equal(r.ok, false);
  assert.equal(r.reason, 'empty');
});

test('extractAssistantText prefers real content over a populated reasoning field', () => {
  const r = extractAssistantText({
    message: { content: 'final answer', reasoning_content: '...' },
  });
  assert.equal(r.ok, true);
  assert.equal(r.content, 'final answer');
  assert.equal(r.fallback, null);
});

test('extractAssistantText treats whitespace-only responses as valid text', () => {
  // We deliberately don't trim here: a one-char "ok" is worse than letting
  // the caller decide. The validator's job is "is there ANY text", not
  // "is this text meaningful".
  const r = extractAssistantText({
    message: { content: '   ', reasoning_content: '' },
  });
  assert.equal(r.ok, true);
  assert.equal(r.content, '   ');
  assert.equal(r.fallback, null);
});

// ─── callAI retry loop (stub client) ──────────────────────────────────────

/**
 * Builds a fake OpenAI client that returns scripted responses per call.
 * Each scenario is either `{ response }` (a full chat.completion shape)
 * or `{ error: { message, status } }` (a thrown API error).
 */
function makeStubClient(scenarios) {
  let i = 0;
  const calls = [];
  const client = {
    chat: {
      completions: {
        create: async (body) => {
          calls.push(body);
          const s = scenarios[i++];
          if (!s) throw new Error(`Stub ran out of scenarios at call ${i}`);
          if (s.error) {
            const err = new Error(s.error.message);
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
  return { client, calls };
}

/** Convenience: N consecutive empty-stop responses. */
function emptyStop(n) {
  return Array.from({ length: n }, () => ({
    response: {
      choices: [{
        message: { content: '', reasoning_content: '' },
        finish_reason: 'stop',
      }],
      usage: { prompt_tokens: 100, completion_tokens: 0, total_tokens: 100 },
    },
  }));
}

test('callAI retries through empty responses and returns the first valid one', async () => {
  const { client, calls } = makeStubClient([
    ...emptyStop(2),
    { response: {
      choices: [{ message: { content: 'final', reasoning_content: '' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 100, completion_tokens: 5, total_tokens: 105 },
    } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
  assert.equal(result.content, 'final');
  assert.equal(result.fallback, null);
  assert.equal(calls.length, 3);
});

test('callAI throws "after 3 attempts" when every attempt is empty', async () => {
  const { client, calls } = makeStubClient(emptyStop(5)); // 3 are used, 2 unused
  const cfg = { client, model: 'stub', label: 'stub' };
  await assert.rejects(
    callAI(cfg, [{ role: 'user', content: 'hi' }]),
    (err) => {
      assert.match(err.message, /Invalid API response after 3 attempts/);
      assert.match(err.message, /empty content\+reasoning/);
      return true;
    }
  );
  assert.equal(calls.length, 3);
});

test('callAI honours AI_RETRY_ATTEMPTS=1 (no retry, one attempt)', async () => {
  // Override on a single call by temporarily editing env. readRetryPolicy
  // is per-call, so this works without re-import.
  const prev = process.env.AI_RETRY_ATTEMPTS;
  process.env.AI_RETRY_ATTEMPTS = '1';
  try {
    const { client, calls } = makeStubClient([
      ...emptyStop(2),
      { response: { choices: [{ message: { content: 'never', reasoning_content: '' }, finish_reason: 'stop' }] } },
    ]);
    const cfg = { client, model: 'stub', label: 'stub' };
    await assert.rejects(
      callAI(cfg, [{ role: 'user', content: 'hi' }]),
      /after 1 attempt/
    );
    assert.equal(calls.length, 1, 'should not have retried');
  } finally {
    process.env.AI_RETRY_ATTEMPTS = prev;
  }
});

test('callAI throws immediately on finish_reason=length (no retry)', async () => {
  const { client, calls } = makeStubClient([
    { response: {
      choices: [{ message: { content: '', reasoning_content: '' }, finish_reason: 'length' }],
      usage: { prompt_tokens: 100, completion_tokens: 0, total_tokens: 100 },
    } },
    // Would-be-success should NEVER be reached.
    { response: { choices: [{ message: { content: 'would work', reasoning_content: '' }, finish_reason: 'stop' }] } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  await assert.rejects(
    callAI(cfg, [{ role: 'user', content: 'hi' }]),
    /finish_reason=length/
  );
  assert.equal(calls.length, 1, 'should NOT retry on length');
});

test('callAI throws immediately on finish_reason=content_filter (no retry)', async () => {
  const { client, calls } = makeStubClient([
    { response: {
      choices: [{ message: { content: '', reasoning_content: '' }, finish_reason: 'content_filter' }],
    } },
    { response: { choices: [{ message: { content: 'ignored', reasoning_content: '' }, finish_reason: 'stop' }] } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  await assert.rejects(
    callAI(cfg, [{ role: 'user', content: 'hi' }]),
    /finish_reason=content_filter/
  );
  assert.equal(calls.length, 1, 'should NOT retry on content_filter');
});

test('callAI throws immediately on finish_reason=function_call (no retry)', async () => {
  const { client, calls } = makeStubClient([
    { response: {
      choices: [{ message: { content: '', reasoning_content: '' }, finish_reason: 'function_call' }],
    } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  await assert.rejects(
    callAI(cfg, [{ role: 'user', content: 'hi' }]),
    /finish_reason=function_call/
  );
  assert.equal(calls.length, 1);
});

test('callAI throws immediately on finish_reason=tool_calls (no retry)', async () => {
  const { client, calls } = makeStubClient([
    { response: {
      choices: [{ message: { content: '', reasoning_content: '' }, finish_reason: 'tool_calls' }],
    } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  await assert.rejects(
    callAI(cfg, [{ role: 'user', content: 'hi' }]),
    /finish_reason=tool_calls/
  );
  assert.equal(calls.length, 1);
});

test('callAI retries through 5xx transport errors then succeeds', async () => {
  const { client, calls } = makeStubClient([
    { error: { message: 'upstream exploded', status: 500 } },
    { error: { message: 'still broken', status: 502 } },
    { response: {
      choices: [{ message: { content: 'recovered', reasoning_content: '' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
    } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
  assert.equal(result.content, 'recovered');
  assert.equal(calls.length, 3);
});

test('callAI retries through 429 rate-limit then succeeds', async () => {
  const { client, calls } = makeStubClient([
    { error: { message: 'rate limited', status: 429 } },
    { response: {
      choices: [{ message: { content: 'ok', reasoning_content: '' }, finish_reason: 'stop' }],
    } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
  assert.equal(result.content, 'ok');
  assert.equal(calls.length, 2);
});

test('callAI throws immediately on 401 unauthorized (no retry)', async () => {
  const { client, calls } = makeStubClient([
    { error: { message: 'unauthorized', status: 401 } },
    { response: { choices: [{ message: { content: 'never', reasoning_content: '' }, finish_reason: 'stop' }] } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  await assert.rejects(
    callAI(cfg, [{ role: 'user', content: 'hi' }]),
    /unauthorized/
  );
  assert.equal(calls.length, 1, 'auth errors are user-fixable, no retry');
});

test('callAI throws immediately on 400 bad request (no retry)', async () => {
  const { client, calls } = makeStubClient([
    { error: { message: 'malformed payload', status: 400 } },
    { response: { choices: [{ message: { content: 'never', reasoning_content: '' }, finish_reason: 'stop' }] } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  await assert.rejects(
    callAI(cfg, [{ role: 'user', content: 'hi' }]),
    /malformed payload/
  );
  assert.equal(calls.length, 1, 'bad request is user-fixable, no retry');
});

test('callAI falls back to reasoning_content when content is empty but reasoning is present', async () => {
  const { client } = makeStubClient([
    { response: {
      choices: [{
        message: { content: '', reasoning_content: 'thinking out loud...' },
        finish_reason: 'stop',
      }],
    } },
  ]);
  // Suppress the stderr warning that the fallback emits to keep test output clean.
  const origWarn = console.warn;
  console.warn = () => {};
  try {
    const cfg = { client, model: 'stub', label: 'stub' };
    const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
    assert.equal(result.content, 'thinking out loud...');
    assert.equal(result.fallback, 'reasoning');
  } finally {
    console.warn = origWarn;
  }
});

test('callAI retries through a network error with NO status (retries on "!status")', async () => {
  // Covers the retryable=true branch when err.status is undefined (e.g.
  // ECONNRESET, DNS failure). The status-less path is important because
  // bare-thrown errors (vs APIError) are common in node-fetch wrappers.
  const { client, calls } = makeStubClient([
    { error: { message: 'ECONNRESET thrown by socket', status: undefined } },
    { response: {
      choices: [{ message: { content: 'recovered', reasoning_content: '' }, finish_reason: 'stop' }],
    } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
  assert.equal(result.content, 'recovered');
  assert.equal(calls.length, 2);
});

test('callAI throws immediately on finish_reason=refusal (no retry)', async () => {
  // Per OpenAI spec, `refusal` means the model declined to answer. Retrying
  // into the same model/prompt will get the same refusal back. Treat as
  // deterministic non-retryable.
  const { client, calls } = makeStubClient([
    { response: {
      choices: [{ message: { content: '', reasoning_content: '' }, finish_reason: 'refusal' }],
    } },
    { response: { choices: [{ message: { content: 'never', reasoning_content: '' }, finish_reason: 'stop' }] } },
  ]);
  const cfg = { client, model: 'stub', label: 'stub' };
  await assert.rejects(
    callAI(cfg, [{ role: 'user', content: 'hi' }]),
    /finish_reason=refusal/
  );
  assert.equal(calls.length, 1, 'should NOT retry on refusal');
});

test('NON_RETRY_EMPTY set membership is pinned against accidental edits', () => {
  // A future contributor removing `'refusal'` (thinking it duplicates
  // 'content_filter') or adding `'stop'` (thinking the whitelist means
  // "always active") shouldn't be possible without updating this test.
  const expected = ['length', 'content_filter', 'function_call', 'tool_calls', 'refusal'];
  assert.deepEqual(
    [...NON_RETRY_EMPTY].sort(),
    [...expected].sort(),
    'NON_RETRY_EMPTY set membership changed — update both this test AND the comment in ai.js'
  );
});

test('callAI logs retry progress + elapsed-time pair on retry wait', async () => {
  // Capture only console.warn (NOT the per-500ms progress dots on stderr
  // — those are cosmetic and would be noisy if we tapped stderr).
  const prevBase = process.env.AI_RETRY_BASE_DELAY_MS;
  const prevMult = process.env.AI_RETRY_MULTIPLIER;
  process.env.AI_RETRY_BASE_DELAY_MS = '60';
  process.env.AI_RETRY_MULTIPLIER = '1';
  const warns = [];
  const origWarn = console.warn;
  console.warn = (...args) => warns.push(args.join(' '));
  try {
    const { client } = makeStubClient([
      ...emptyStop(2),
      { response: {
        choices: [{ message: { content: 'final', reasoning_content: '' }, finish_reason: 'stop' }],
      } },
    ]);
    const cfg = { client, model: 'stub', label: 'stub' };
    const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
    assert.equal(result.content, 'final');
    assert.ok(
      warns.some((w) => w.includes('retry 2/3 — waiting 60ms')),
      'pre-wait line should print attempt + planned wait\nactual warns: ' + warns.join(' | ')
    );
    assert.ok(
      warns.some((w) => /retry 2\/3 completed after \d+ms/.test(w)),
      'post-wait line should print attempt + actual elapsed\nactual warns: ' + warns.join(' | ')
    );
  } finally {
    console.warn = origWarn;
    process.env.AI_RETRY_BASE_DELAY_MS = prevBase;
    process.env.AI_RETRY_MULTIPLIER = prevMult;
  }
});

test('callAI does NOT log "completed after" when AI_RETRY_BASE_DELAY_MS=0', async () => {
  // The whole retry-wait block is gated on rp.base > 0, so with zero base
  // delay both the pre/post lines are skipped (no fake "0ms waits").
  const prevBase = process.env.AI_RETRY_BASE_DELAY_MS;
  process.env.AI_RETRY_BASE_DELAY_MS = '0';
  const warns = [];
  const origWarn = console.warn;
  console.warn = (...args) => warns.push(args.join(' '));
  try {
    const { client } = makeStubClient([
      ...emptyStop(2),
      { response: {
        choices: [{ message: { content: 'final', reasoning_content: '' }, finish_reason: 'stop' }],
      } },
    ]);
    const cfg = { client, model: 'stub', label: 'stub' };
    const result = await callAI(cfg, [{ role: 'user', content: 'hi' }]);
    assert.equal(result.content, 'final');
    assert.equal(
      warns.filter((w) => w.includes('retry') && (w.includes('waiting') || w.includes('completed after'))).length,
      0,
      'no retry log lines should appear with AI_RETRY_BASE_DELAY_MS=0\nactual: ' + warns.join(' | ')
    );
  } finally {
    console.warn = origWarn;
    process.env.AI_RETRY_BASE_DELAY_MS = prevBase;
  }
});
