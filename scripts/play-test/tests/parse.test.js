/**
 * tests/parse.test.js — verifies the pure parsers in parse.js. Includes
 * edge cases for the bug-fix that previously matched "game over" too
 * broadly in lowercased text.
 */
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { extractSaveBlock, detectGameOver } from '../parse.js';

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
  assert.ok(block);
  assert.ok(block.startsWith('=== SAVE LLM-TYCOON'));
  assert.ok(block.includes('foo: 1'));
  assert.ok(block.includes('=== END SAVE ==='));
  assert.ok(!block.includes('```'), 'fence markers stripped');
});

test('extractSaveBlock: raw span (no fence)', () => {
  const text = '=== SAVE LLM-TYCOON\nfoo: 1\n=== END SAVE ===';
  const block = extractSaveBlock(text);
  assert.equal(block, text);
});

test('extractSaveBlock: returns null when start missing', () => {
  assert.equal(extractSaveBlock('only end here\n=== END SAVE ==='), null);
});

test('extractSaveBlock: returns null when end missing', () => {
  assert.equal(extractSaveBlock('=== SAVE LLM-TYCOON\nfoo: 1'), null);
});

test('extractSaveBlock: empty / non-string input → null', () => {
  assert.equal(extractSaveBlock(''), null);
  assert.equal(extractSaveBlock(null), null);
  assert.equal(extractSaveBlock(undefined), null);
  assert.equal(extractSaveBlock(123), null);
});

test('detectGameOver: each keyword matches case-insensitively', () => {
  for (const kw of [
    'game over', 'Game Over', 'GAME OVER',
    'Burned Out', 'BANKRUPT', 'bankrupt',
    'Heading to HeadQuarters',
    'game ended',
    'sign Term Sheet', 'TERM SHEET!',
  ]) {
    assert.equal(detectGameOver(`Some preamble ... ${kw} ...`), true, `keyword: ${kw}`);
  }
});

test('detectGameOver: explicit sentinel matches even without keyword', () => {
  assert.equal(detectGameOver('Some text === GAME OVER ==='), true);
});

test('detectGameOver: returns false on normal turn text', () => {
  assert.equal(detectGameOver('Your turn: research something. Budget: $10K.'), false);
  assert.equal(detectGameOver(''), false);
  assert.equal(detectGameOver(null), false);
  assert.equal(detectGameOver(undefined), false);
});
