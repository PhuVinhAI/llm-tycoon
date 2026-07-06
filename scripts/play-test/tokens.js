/**
 * tokens.js — token accounting and context trimming.
 *
 * Why this exists:
 *  - The previous version stored `state.runtimeTokens = usage.total_tokens`,
 *    which overwrites the prior value every turn instead of accumulating.
 *    Combined with subtracting only `completion_tokens` on trim, totals were
 *    meaningless past turn ~3 and trimming triggered at the wrong times.
 *
 * New model:
 *  - `tracker.prompt` mirrors `usage.prompt_tokens` from the latest call —
 *    this is the actual size of the context heading into the model. Use it
 *    as the trim trigger.
 *  - `tracker.completion` is a cumulative total of generated tokens (useful
 *    for billing + log display).
 *  - `pairs` is a queue of `{prompt, completion}` per turn. On trim we pop
 *    the oldest pair and subtract its completion (the next API call will
 *    refresh the actual prompt size — we don't paper over that with a
 *    guess because the post-trim size depends on exact tokenisation).
 *  - `startIndex` lets the caller decide which prefix is "frozen": index 2+
 *    for the runtime model (game doc + init ack at [0]/[1] is sacred), or
 *    index 1+ for the player (system prompt at [0] is sacred).
 *
 * Trim policy:
 *  - SINGLE pair per call. The next `callAI` refreshes `tracker.prompt` with
 *    the real post-trim value; if still over the limit, the following turn
 *    triggers another trim. This avoids the "while loop drains everything"
 *    bug from the previous version.
 */

export const DEFAULT_TOKEN_LIMIT = 180_000;

/**
 * @typedef {{ prompt:number, completion:number }} TokenPair
 */

/**
 * Create an empty token tracker. `limit` is the per-turn prompt threshold —
 * once `tracker.prompt > limit`, the caller should trim.
 *
 * @param {{ limit?: number }} [opts]
 */
export function createTokenTracker({ limit = DEFAULT_TOKEN_LIMIT } = {}) {
  return {
    limit,
    /** Latest reported prompt size; updated by `recordUsage`. */
    prompt: 0,
    /** Cumulative completion tokens this session. */
    completion: 0,
    /** Queue of pairs in message order. */
    pairs: /** @type {TokenPair[]} */ ([]),
  };
}

/**
 * Record one API call's usage. Returns the pair that was appended.
 *
 * Defensive: missing fields are treated as 0 so a partial usage object from
 * some proxy still moves state forward.
 *
 * @param {ReturnType<typeof createTokenTracker>} tracker
 * @param {{ prompt_tokens?:number, completion_tokens?:number, total_tokens?:number }|null|undefined} usage
 */
export function recordUsage(tracker, usage) {
  if (!usage) return;
  if (typeof usage.prompt_tokens === 'number') {
    tracker.prompt = usage.prompt_tokens;
  }
  if (typeof usage.completion_tokens === 'number') {
    tracker.completion += usage.completion_tokens;
  }
  tracker.pairs.push({
    prompt: usage.prompt_tokens ?? 0,
    completion: usage.completion_tokens ?? 0,
  });
}

/**
 * Trim ONE oldest removable pair when `tracker.prompt` exceeds
 * `tracker.limit`. Mutates `messages` and `tracker` in place.
 *
 * Returns true if one pair was removed.
 *
 * The pair to trim sits at index `startIndex` (user) and `startIndex+1`
 * (assistant). The frozen prefix (player system prompt at [0], or runtime
 * game doc + init ack at [0..1]) is never removed.
 *
 * Failure mode handled: if `pairs` is shorter than `messages` allows (e.g.
 * after a partial rehydrate), force-splice anyway so the next API call
 * doesn't 400 on an oversized context. Token accounting for that one
 * call will be approximate.
 *
 * @param {{
 *   messages: Array<{ role: string }>,
 *   tracker: ReturnType<typeof createTokenTracker>,
 *   startIndex?: number,
 * }} args
 */
export function trimContext({ messages, tracker, startIndex = 1 }) {
  if (!tracker || messages.length <= startIndex) return false;
  if (tracker.prompt <= tracker.limit) return false;

  const pair = tracker.pairs.shift();
  if (!pair) {
    console.warn(
      '⚠️  trimContext: pairs drained but messages remain — forcing splice without accounting'
    );
    messages.splice(startIndex, 2);
    return true;
  }
  tracker.completion = Math.max(0, tracker.completion - pair.completion);
  messages.splice(startIndex, 2);
  return true;
}

/**
 * Pretty-print a token count.
 * @param {number} n
 */
export function formatTokens(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '?';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}
