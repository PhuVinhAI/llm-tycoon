/**
 * tests/tokens.test.js — verifies the bug fixes for cumulative token
 * accounting and correct context trimming (the previous version overwrote
 * `usage.total_tokens` every turn and trimmed with the wrong delta).
 *
 * Run: `npm test` (uses node:test built-in runner).
 */
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  createTokenTracker, recordUsage, trimContext, formatTokens,
} from '../tokens.js';

test('createTokenTracker starts empty', () => {
  const t = createTokenTracker();
  assert.equal(t.prompt, 0);
  assert.equal(t.completion, 0);
  assert.equal(t.pairs.length, 0);
});

test('recordUsage mirrors prompt + accumulates completion', () => {
  const t = createTokenTracker();
  recordUsage(t, { prompt_tokens: 1000, completion_tokens: 50 });
  recordUsage(t, { prompt_tokens: 1500, completion_tokens: 60 });
  assert.equal(t.prompt, 1500, 'prompt should mirror LATEST value, not accumulate');
  assert.equal(t.completion, 110, 'completion should accumulate across turns');
  assert.equal(t.pairs.length, 2);
});

test('recordUsage handles partial/missing usage fields', () => {
  const t = createTokenTracker();
  recordUsage(t, {});                       // empty usage
  recordUsage(t, { prompt_tokens: 100 });   // no completion field
  assert.equal(t.prompt, 100);
  assert.equal(t.completion, 0);
  assert.equal(t.pairs.length, 2);
});

test('recordUsage is a no-op for null/undefined usage', () => {
  const t = createTokenTracker();
  recordUsage(t, null);
  recordUsage(t, undefined);
  assert.equal(t.pairs.length, 0);
});

test('trimContext removes oldest pair and subtracts its completion', () => {
  const t = createTokenTracker({ limit: 100 });
  recordUsage(t, { prompt_tokens: 200, completion_tokens: 50 });
  recordUsage(t, { prompt_tokens: 210, completion_tokens: 40 });

  const messages = [
    { role: 'system', content: 'sys' },
    { role: 'user', content: 'u1' },
    { role: 'assistant', content: 'a1' },
    { role: 'user', content: 'u2' },
    { role: 'assistant', content: 'a2' },
  ];

  const trimmed = trimContext({ messages, tracker: t, startIndex: 1 });
  assert.equal(trimmed, true);
  assert.equal(messages.length, 3);
  assert.equal(messages[0].role, 'system');
  assert.equal(messages[1].content, 'u2');
  assert.equal(messages[2].content, 'a2');
  assert.equal(t.completion, 40, 'subtracted the oldest pair completion');
  assert.equal(t.pairs.length, 1);
});

test('trimContext preserves runtime init pair when startIndex=2', () => {
  // This is the exact bug fix from the previous version: splice(1, 2) was
  // removing the runtime model's init response and the first player turn,
  // leaving the game doc followed by a runtime response with no triggering
  // user message.
  const t = createTokenTracker({ limit: 100 });
  recordUsage(t, { prompt_tokens: 200, completion_tokens: 50 });
  recordUsage(t, { prompt_tokens: 210, completion_tokens: 40 });

  const messages = [
    { role: 'user', content: 'gameDoc' },        // [0] init (game doc)
    { role: 'assistant', content: 'initAck' },   // [1] init ack
    { role: 'user', content: 'u1' },             // [2]
    { role: 'assistant', content: 'a1' },        // [3]
    { role: 'user', content: 'u2' },             // [4]
    { role: 'assistant', content: 'a2' },        // [5]
  ];

  const trimmed = trimContext({ messages, tracker: t, startIndex: 2 });
  assert.equal(trimmed, true);
  assert.equal(messages.length, 4);
  assert.equal(messages[0].content, 'gameDoc', 'game doc preserved');
  assert.equal(messages[1].content, 'initAck', 'init ack preserved');
  assert.equal(messages[2].content, 'u2');
  assert.equal(messages[3].content, 'a2');
});

test('trimContext never drops below startIndex', () => {
  const t = createTokenTracker({ limit: 10 });
  recordUsage(t, { prompt_tokens: 999, completion_tokens: 999 });
  const messages = [
    { role: 'system', content: 'sys' },
    { role: 'user', content: 'u1' },
    { role: 'assistant', content: 'a1' },
  ];
  trimContext({ messages, tracker: t, startIndex: 1 });
  // Length 3 → startIndex 1+2 trim → length 1 (just system). After that,
  // `messages.length > startIndex` is false so we stop, preserving the
  // system prompt at [0].
  assert.equal(messages.length, 1);
  assert.equal(messages[0].role, 'system');
});

test('trimContext is a no-op when prompt under limit', () => {
  const t = createTokenTracker({ limit: 1000 });
  recordUsage(t, { prompt_tokens: 200, completion_tokens: 50 });
  const messages = [
    { role: 'system', content: 'sys' },
    { role: 'user', content: 'u1' },
    { role: 'assistant', content: 'a1' },
  ];
  const trimmed = trimContext({ messages, tracker: t, startIndex: 1 });
  assert.equal(trimmed, false);
  assert.equal(messages.length, 3);
});

test('formatTokens handles small / k / m', () => {
  assert.equal(formatTokens(0), '0');
  assert.equal(formatTokens(999), '999');
  assert.equal(formatTokens(1000), '1.0K');
  assert.equal(formatTokens(1234), '1.2K');
  assert.equal(formatTokens(1_500_000), '1.50M');
});

test('formatTokens guards against invalid input', () => {
  assert.equal(formatTokens(NaN), '?');
  assert.equal(formatTokens(undefined), '?');
  assert.equal(formatTokens('hello'), '?');
});
