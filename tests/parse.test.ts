/**
 * parse.test.ts — pure parsers in src/engine/parse.ts.
 */
import { expect, test } from 'bun:test';
import { detectGameOver, extractSaveBlock } from '../src/engine/parse.ts';

test('extractSaveBlock: fenced code block', () => {
  const text = `Some intro

\`\`\`
=== SAVE LLM-TYCOON
foo: 1
bar: 2
=== END SAVE ===
\`\`\`

Trailing`;
  const block = extractSaveBlock(text);
  expect(block).toBeTruthy();
  expect(block?.startsWith('=== SAVE LLM-TYCOON')).toBe(true);
  expect(block?.includes('foo: 1')).toBe(true);
  expect(block?.includes('=== END SAVE ===')).toBe(true);
  expect(block?.includes('```')).toBe(false);
});

test('extractSaveBlock: raw span (no fence)', () => {
  const text = '=== SAVE LLM-TYCOON\nfoo: 1\n=== END SAVE ===';
  expect(extractSaveBlock(text)).toBe(text);
});

test('extractSaveBlock: returns null when start missing', () => {
  expect(extractSaveBlock('only end here\n=== END SAVE ===')).toBe(null);
});

test('extractSaveBlock: returns null when end missing', () => {
  expect(extractSaveBlock('=== SAVE LLM-TYCOON\nfoo: 1')).toBe(null);
});

test('extractSaveBlock: empty / non-string input → null', () => {
  expect(extractSaveBlock('')).toBe(null);
  expect(extractSaveBlock(null)).toBe(null);
  expect(extractSaveBlock(undefined)).toBe(null);
  expect(extractSaveBlock(123)).toBe(null);
});

test('detectGameOver: each keyword matches case-insensitively', () => {
  for (const kw of [
    'game over',
    'Game Over',
    'GAME OVER',
    'Burned Out',
    'BANKRUPT',
    'bankrupt',
    'Heading to HeadQuarters',
    'game ended',
    'sign Term Sheet',
    'TERM SHEET!',
  ]) {
    expect(detectGameOver(`Some preamble ... ${kw} ...`)).toBe(true);
  }
});

test('detectGameOver: explicit sentinel matches even without keyword', () => {
  expect(detectGameOver('Some text === GAME OVER ===')).toBe(true);
});

test('detectGameOver: returns false on normal turn text', () => {
  expect(detectGameOver('Your turn: research something. Budget: $10K.')).toBe(false);
  expect(detectGameOver('')).toBe(false);
  expect(detectGameOver(null)).toBe(false);
  expect(detectGameOver(undefined)).toBe(false);
});
