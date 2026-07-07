/**
 * call-stream.ts — bridge a `callAI` invocation into the event stream.
 *
 * callAI reports retries through callbacks (onRetry / onRetryProgress). This
 * wraps one call as an async generator that yields `retry` / `retry_progress`
 * events live (via a promise-signalled queue) and RETURNS the CallResult, so
 * the engine can `const res = yield* streamCall(...)`.
 */

import type { CallHooks, CallResult } from '../ai/call.ts';
import type { EngineEvent, Speaker } from './events.ts';

export async function* streamCall(
  who: Speaker,
  invoke: (hooks: CallHooks) => Promise<CallResult>,
): AsyncGenerator<EngineEvent, CallResult> {
  const queue: EngineEvent[] = [];
  let wake: (() => void) | null = null;
  let done = false;
  const signal = () => {
    const w = wake;
    wake = null;
    w?.();
  };
  const push = (ev: EngineEvent) => {
    queue.push(ev);
    signal();
  };

  const resultP = invoke({
    onRetry: (info) => push({ type: 'retry', who, ...info }),
    onRetryProgress: (p) => push({ type: 'retry_progress', who, ...p }),
  }).finally(() => {
    done = true;
    signal();
  });

  // Surface a rejection reason even while we drain the queue.
  resultP.catch(() => {});

  while (true) {
    while (queue.length > 0) {
      yield queue.shift() as EngineEvent;
    }
    if (done) break;
    await new Promise<void>((resolve) => {
      wake = resolve;
    });
  }

  return await resultP;
}
