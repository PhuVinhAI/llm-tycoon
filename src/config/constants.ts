/**
 * constants.ts — game-wide constants with no dependencies.
 *
 * GAME_OVER_KEYWORDS is consumed by both the runtime-output parser
 * (engine/parse.ts) and the player system prompt (engine/prompts.ts), so it
 * lives here to keep the two in lockstep.
 */

/** Case-insensitive phrases that signal the game has ended. */
export const GAME_OVER_KEYWORDS = Object.freeze([
  'game over',
  'burned out',
  'bankrupt',
  'heading to headquarters',
  'game ended',
  'term sheet',
]) satisfies readonly string[];

/** Default per-turn prompt-token threshold that triggers context trimming. */
export const DEFAULT_TOKEN_LIMIT = 180_000;
