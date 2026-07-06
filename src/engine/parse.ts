/**
 * parse.ts — pure parsers for runtime output: SAVE-block extraction and
 * end-of-game detection. Both are robust to malformed / non-string input.
 */

import { z } from 'zod';
import { GAME_OVER_KEYWORDS } from '../config/constants.ts';

const SAVE_START = '=== SAVE LLM-TYCOON';
const SAVE_END = '=== END SAVE ===';
const GAME_OVER_SENTINEL = '=== GAME OVER ===';

/** Result of a SAVE-block extraction: `block` is null when markers are absent. */
export const SaveResultSchema = z.object({
  block: z.string().nullable(),
  raw: z.string(),
});
export type SaveResult = z.infer<typeof SaveResultSchema>;

/**
 * Find the SAVE block delimited by SAVE_START ... SAVE_END. Prefers a fenced
 * code block (some models wrap it in ```), else the raw span. Returns the
 * trimmed block, or null if either marker is missing.
 */
export function extractSaveBlock(text: unknown): string | null {
  if (!text || typeof text !== 'string') return null;

  const codeMatch = text.match(
    /```[\s\S]*?(=== SAVE LLM-TYCOON[\s\S]*?=== END SAVE ===[\s\S]*?)```/,
  );
  if (codeMatch?.[1]) return codeMatch[1].trim();

  const start = text.indexOf(SAVE_START);
  if (start === -1) return null;
  const end = text.indexOf(SAVE_END, start);
  if (end === -1) return null;
  return text.slice(start, end + SAVE_END.length).trim();
}

/**
 * Returns true if runtime output indicates the game has ended: the explicit
 * `=== GAME OVER ===` sentinel wins immediately, otherwise any case-insensitive
 * keyword from `GAME_OVER_KEYWORDS`.
 */
export function detectGameOver(text: unknown): boolean {
  if (!text || typeof text !== 'string') return false;
  if (text.includes(GAME_OVER_SENTINEL)) return true;
  const lower = text.toLowerCase();
  return GAME_OVER_KEYWORDS.some((kw) => lower.includes(kw));
}
