/**
 * parse.js — content parsers used by both the runtime path (save blocks) and
 *            the loop's end-of-game detection.
 *
 * Both functions are pure and robust to malformed input:
 *  - `extractSaveBlock` falls back from fenced → raw → null.
 *  - `detectGameOver` matches keywords case-insensitively AND honours an
 *    explicit `=== GAME OVER ===` sentinel if the runtime ever emits one.
 */

import { GAME_OVER_KEYWORDS } from './config.js';

const SAVE_START = '=== SAVE LLM-TYCOON';
const SAVE_END = '=== END SAVE ===';
const GAME_OVER_SENTINEL = '=== GAME OVER ===';

/**
 * Finds the SAVE block delimited by SAVE_START ... SAVE_END in `text`.
 * Returns the block content (trimmed), or null if neither marker is present.
 *
 * Two extraction strategies:
 *   1. Prefer a fenced code block (some LLMs wrap the SAVE block in ```).
 *   2. Otherwise slice the raw span between the two markers.
 *
 * @param {string|undefined|null} text
 * @returns {string|null}
 */
export function extractSaveBlock(text) {
  if (!text || typeof text !== 'string') return null;

  // 1) Fenced-code preference.
  const codeMatch = text.match(
    /```[\s\S]*?(=== SAVE LLM-TYCOON[\s\S]*?=== END SAVE ===[\s\S]*?)```/
  );
  if (codeMatch) return codeMatch[1].trim();

  // 2) Raw span.
  const start = text.indexOf(SAVE_START);
  if (start === -1) return null;
  const end = text.indexOf(SAVE_END, start);
  if (end === -1) return null;
  return text.slice(start, end + SAVE_END.length).trim();
}

/**
 * Returns true if the runtime output indicates the game has ended.
 *
 * - Explicit sentinel (`=== GAME OVER ===`) wins immediately.
 * - Otherwise, any case-insensitive keyword from `GAME_OVER_KEYWORDS` counts.
 *
 * @param {string|undefined|null} text
 * @returns {boolean}
 */
export function detectGameOver(text) {
  if (!text || typeof text !== 'string') return false;
  if (text.includes(GAME_OVER_SENTINEL)) return true;
  const lower = text.toLowerCase();
  for (const kw of GAME_OVER_KEYWORDS) {
    if (lower.includes(kw)) return true;
  }
  return false;
}
