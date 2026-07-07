/**
 * tokens.ts — token accounting and context trimming.
 *
 * Model:
 *  - `tracker.prompt` mirrors `usage.prompt_tokens` from the latest call — the
 *    actual context size heading into the model; used as the trim trigger.
 *  - `tracker.completion` is a cumulative total of generated tokens.
 *  - `pairs` is a queue of `{prompt, completion}` per turn. On trim we pop the
 *    oldest pair and subtract its completion; the next call refreshes the real
 *    post-trim prompt size.
 *  - `startIndex` marks the frozen prefix: index 2+ for the runtime (game doc +
 *    init ack at [0]/[1] is sacred), index 1+ for the player (system prompt at
 *    [0] is sacred).
 *
 * Trim policy: SINGLE pair per call, so the next `callAI` reports the real size
 * before we decide to trim again.
 */

import { z } from 'zod';
import { DEFAULT_TOKEN_LIMIT } from '../config/constants.ts';

export const TokenPairSchema = z.object({
  prompt: z.number(),
  completion: z.number(),
});
export type TokenPair = z.infer<typeof TokenPairSchema>;

/** Persisted shape of a tracker (limit is runtime-only, re-supplied on load). */
export const TokenTrackerSchema = z.object({
  prompt: z.number().default(0),
  completion: z.number().default(0),
  pairs: z.array(TokenPairSchema).default([]),
});

export interface TokenTracker {
  limit: number;
  /** Latest reported prompt size; updated by `recordUsage`. */
  prompt: number;
  /** Cumulative completion tokens this session. */
  completion: number;
  /** Queue of pairs in message order. */
  pairs: TokenPair[];
}

export interface Usage {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
}

/** Create an empty token tracker. `limit` is the per-turn prompt threshold. */
export function createTokenTracker(opts: { limit?: number } = {}): TokenTracker {
  return {
    limit: opts.limit ?? DEFAULT_TOKEN_LIMIT,
    prompt: 0,
    completion: 0,
    pairs: [],
  };
}

/**
 * Record one API call's usage. Missing fields are treated as 0 so a partial
 * usage object from a proxy still moves state forward.
 */
export function recordUsage(tracker: TokenTracker, usage: Usage | null | undefined): void {
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
 * Trim ONE oldest removable pair when `tracker.prompt` exceeds `tracker.limit`.
 * The pair sits at `startIndex` (user) and `startIndex+1` (assistant); the
 * frozen prefix is never removed. Returns true if a pair was removed.
 *
 * If `pairs` is shorter than `messages` allows (partial rehydrate), force-splice
 * anyway so the next call doesn't 400 on an oversized context.
 */
export function trimContext(args: {
  messages: Array<{ role: string }>;
  tracker: TokenTracker;
  startIndex?: number;
}): boolean {
  const { messages, tracker } = args;
  const startIndex = args.startIndex ?? 1;
  if (!tracker || messages.length <= startIndex) return false;
  if (tracker.prompt <= tracker.limit) return false;

  const pair = tracker.pairs.shift();
  if (!pair) {
    console.warn(
      '⚠️  trimContext: pairs drained but messages remain — forcing splice without accounting',
    );
    messages.splice(startIndex, 2);
    return true;
  }
  tracker.completion = Math.max(0, tracker.completion - pair.completion);
  messages.splice(startIndex, 2);
  return true;
}

/** Pretty-print a token count (e.g. 12.3K, 1.20M). */
export function formatTokens(n: number): string {
  if (typeof n !== 'number' || !Number.isFinite(n)) return '?';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}
