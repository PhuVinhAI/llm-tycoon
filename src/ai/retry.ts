/**
 * retry.ts — retry policy read from process.env on every call (NOT cached at
 * module load), so tests can override per-test and ops tooling can tune live.
 */

export interface RetryPolicy {
  /** Configured attempt count (AI_RETRY_ATTEMPTS). */
  max: number;
  /** Effective ceiling used for the loop (≥1) so a `0` config never loops forever. */
  ceil: number;
  /** Base backoff delay in ms (AI_RETRY_BASE_DELAY_MS). */
  base: number;
  /** Backoff multiplier per attempt (AI_RETRY_MULTIPLIER). */
  mult: number;
}

export function readRetryPolicy(): RetryPolicy {
  const max = Math.max(0, Number(process.env.AI_RETRY_ATTEMPTS ?? 3));
  return {
    max,
    ceil: Math.max(1, max),
    base: Math.max(0, Number(process.env.AI_RETRY_BASE_DELAY_MS ?? 1500)),
    mult: Math.max(1, Number(process.env.AI_RETRY_MULTIPLIER ?? 2)),
  };
}
