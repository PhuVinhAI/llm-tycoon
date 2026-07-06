/**
 * tokens.test.ts — cumulative token accounting + context trimming.
 */
import { expect, test } from 'bun:test';
import {
  createTokenTracker,
  formatTokens,
  recordUsage,
  trimContext,
} from '../src/engine/tokens.ts';

test('createTokenTracker starts empty', () => {
  const t = createTokenTracker();
  expect(t.prompt).toBe(0);
  expect(t.completion).toBe(0);
  expect(t.pairs.length).toBe(0);
});

test('recordUsage mirrors prompt + accumulates completion', () => {
  const t = createTokenTracker();
  recordUsage(t, { prompt_tokens: 1000, completion_tokens: 50 });
  recordUsage(t, { prompt_tokens: 1500, completion_tokens: 60 });
  expect(t.prompt).toBe(1500);
  expect(t.completion).toBe(110);
  expect(t.pairs.length).toBe(2);
});

test('recordUsage handles partial/missing usage fields', () => {
  const t = createTokenTracker();
  recordUsage(t, {});
  recordUsage(t, { prompt_tokens: 100 });
  expect(t.prompt).toBe(100);
  expect(t.completion).toBe(0);
  expect(t.pairs.length).toBe(2);
});

test('recordUsage is a no-op for null/undefined usage', () => {
  const t = createTokenTracker();
  recordUsage(t, null);
  recordUsage(t, undefined);
  expect(t.pairs.length).toBe(0);
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
  expect(trimmed).toBe(true);
  expect(messages.length).toBe(3);
  expect(messages[0]?.role).toBe('system');
  expect(messages[1]?.content).toBe('u2');
  expect(messages[2]?.content).toBe('a2');
  expect(t.completion).toBe(40);
  expect(t.pairs.length).toBe(1);
});

test('trimContext preserves runtime init pair when startIndex=2', () => {
  const t = createTokenTracker({ limit: 100 });
  recordUsage(t, { prompt_tokens: 200, completion_tokens: 50 });
  recordUsage(t, { prompt_tokens: 210, completion_tokens: 40 });

  const messages = [
    { role: 'user', content: 'gameDoc' },
    { role: 'assistant', content: 'initAck' },
    { role: 'user', content: 'u1' },
    { role: 'assistant', content: 'a1' },
    { role: 'user', content: 'u2' },
    { role: 'assistant', content: 'a2' },
  ];

  const trimmed = trimContext({ messages, tracker: t, startIndex: 2 });
  expect(trimmed).toBe(true);
  expect(messages.length).toBe(4);
  expect(messages[0]?.content).toBe('gameDoc');
  expect(messages[1]?.content).toBe('initAck');
  expect(messages[2]?.content).toBe('u2');
  expect(messages[3]?.content).toBe('a2');
});

test('trimContext preserves the SAVE block when startIndex=4 (continue init)', () => {
  const t = createTokenTracker({ limit: 100 });
  recordUsage(t, { prompt_tokens: 200, completion_tokens: 50 });
  recordUsage(t, { prompt_tokens: 210, completion_tokens: 40 });

  // Continue freezes [doc, boot, load-request(SAVE), resume] = indices 0..3.
  const messages = [
    { role: 'user', content: 'gameDoc' },
    { role: 'assistant', content: 'boot' },
    { role: 'user', content: 'load SAVE block …' },
    { role: 'assistant', content: 'resume' },
    { role: 'user', content: 'u1' },
    { role: 'assistant', content: 'a1' },
    { role: 'user', content: 'u2' },
    { role: 'assistant', content: 'a2' },
  ];

  const trimmed = trimContext({ messages, tracker: t, startIndex: 4 });
  expect(trimmed).toBe(true);
  expect(messages.length).toBe(6);
  // Frozen prefix (incl. the SAVE block at index 2) is untouched.
  expect(messages[0]?.content).toBe('gameDoc');
  expect(messages[1]?.content).toBe('boot');
  expect(messages[2]?.content).toBe('load SAVE block …');
  expect(messages[3]?.content).toBe('resume');
  // Oldest removable turn (u1/a1) is what got spliced.
  expect(messages[4]?.content).toBe('u2');
  expect(messages[5]?.content).toBe('a2');
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
  expect(messages.length).toBe(1);
  expect(messages[0]?.role).toBe('system');
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
  expect(trimmed).toBe(false);
  expect(messages.length).toBe(3);
});

test('formatTokens handles small / k / m', () => {
  expect(formatTokens(0)).toBe('0');
  expect(formatTokens(999)).toBe('999');
  expect(formatTokens(1000)).toBe('1.0K');
  expect(formatTokens(1234)).toBe('1.2K');
  expect(formatTokens(1_500_000)).toBe('1.50M');
});

test('formatTokens guards against invalid input', () => {
  expect(formatTokens(Number.NaN)).toBe('?');
  expect(formatTokens(undefined as unknown as number)).toBe('?');
  expect(formatTokens('hello' as unknown as number)).toBe('?');
});
