/**
 * call.ts — single chat.completion call with bounded retry.
 *
 * Knows NOTHING about config: callers pass a `ClientConfig` (from client.ts)
 * and a message array. Retries/backoff are surfaced through optional hooks
 * (`onRetry`, `onRetryProgress`) instead of writing to the terminal, so the
 * engine can re-emit them as typed events and each renderer decides how to
 * display them.
 *
 * Resilience:
 *  - Empty `content` + empty `reasoning_content` → bounded retry with
 *    exponential backoff (DeepSeek-style thinking models sometimes return
 *    `{content:"",reasoning_content:""}` on a clean 200).
 *  - finish_reason in NON_RETRY_EMPTY is deterministic → not retried.
 *  - Network errors / 5xx / 408 / 429 are retried on the same schedule.
 */

import type OpenAI from 'openai';
import type { Usage } from '../engine/tokens.ts';
import type { ClientConfig } from './client.ts';
import { readRetryPolicy } from './retry.ts';

export interface Message {
  role: string;
  content: string;
}

export type Fallback = 'reasoning' | null;

export interface CallResult {
  content: string;
  usage: Usage | null;
  fallback: Fallback;
}

export interface DebugSink {
  write(label: string, data: object): Promise<void> | void;
}

export interface CallHooks {
  debug?: DebugSink | null;
  onRetry?: (info: { attempt: number; ceil: number; waitMs: number; reason: string }) => void;
  onRetryProgress?: (p: { elapsedMs: number; totalMs: number }) => void;
}

interface Choice {
  message?: { content?: string | null; reasoning_content?: string | null };
  finish_reason?: string;
}

/**
 * Turn one `choices[0]` into a normalized assistant payload or a rejection.
 * Reasoning-only responses are success-with-fallback so the loop doesn't stall
 * when a thinking model withholds `content` but produced reasoning.
 */
export function extractAssistantText(
  choice: Choice | null | undefined,
): { ok: true; content: string; fallback: Fallback } | { ok: false; reason: string } {
  const msg = choice?.message ?? {};
  const content = msg.content ?? '';
  const reasoning = msg.reasoning_content ?? '';
  if (!content && !reasoning) return { ok: false, reason: 'empty' };
  if (!content) return { ok: true, content: reasoning, fallback: 'reasoning' };
  return { ok: true, content, fallback: null };
}

/**
 * finish_reasons meaning the model *decided* not to emit text — retrying the
 * same provider/model won't change the outcome.
 */
export const NON_RETRY_EMPTY: ReadonlySet<string> = new Set([
  'length',
  'content_filter',
  'function_call',
  'tool_calls',
  'refusal',
]);

/** Sleep `ms`, ticking `onProgress({elapsedMs,totalMs})` roughly every 500ms. */
function sleepWithTicks(
  ms: number,
  onProgress?: (p: { elapsedMs: number; totalMs: number }) => void,
): Promise<void> {
  return new Promise((resolve) => {
    if (ms <= 0) return resolve();
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= ms) {
        clearInterval(interval);
        resolve();
        return;
      }
      onProgress?.({ elapsedMs: elapsed, totalMs: ms });
    }, 500);
  });
}

interface Snapshot {
  kind: 'transport' | 'empty';
  status?: number | undefined;
  sample?: string | undefined;
  finishReason?: string | null | undefined;
  prompt_tokens?: number | null | undefined;
  completion_tokens?: number | null | undefined;
}

/** One chat.completion call with bounded retry on transient failures. */
export async function callAI(
  cfg: ClientConfig,
  messages: Message[],
  hooks: CallHooks = {},
): Promise<CallResult> {
  const { debug, onRetry, onRetryProgress } = hooks;
  const body = {
    model: cfg.model,
    messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
    ...cfg.extraBody,
  };

  if (debug) {
    const first = messages[0];
    const last = messages[messages.length - 1];
    const firstContent = first?.content ?? '';
    // The game doc references "SAVE LLM-TYCOON" as a literal format string, so a
    // naive search false-positives every turn. Look only at the tail.
    const saveIdx = firstContent.lastIndexOf('=== SAVE LLM-TYCOON');
    const hasSaveBlockNearTail = saveIdx > firstContent.length - 2000 && saveIdx !== -1;
    await debug.write('request', {
      model: cfg.model,
      label: cfg.label,
      messageCount: messages.length,
      firstRole: first?.role ?? null,
      lastRole: last?.role ?? null,
      firstPreview: firstContent.slice(0, 500),
      lastPreview: (last?.content ?? '').slice(0, 300),
      hasSaveBlockNearTail,
      extraBody: cfg.extraBody,
    });
  }

  const rp = readRetryPolicy();
  let lastReason = 'unset';
  let lastSnapshot: Snapshot | null = null;
  let attempted = 0;

  for (let attempt = 1; attempt <= rp.ceil; attempt++) {
    attempted = attempt;

    if (attempt > 1 && rp.base > 0) {
      const waitMs = Math.round(rp.base * rp.mult ** (attempt - 2));
      onRetry?.({ attempt, ceil: rp.ceil, waitMs, reason: lastReason });
      if (debug) {
        try {
          await debug.write('retry', {
            model: cfg.model,
            attempt,
            waitMs,
            reason: lastReason,
            lastSnapshot,
          });
        } catch {
          /* never mask real error */
        }
      }
      await sleepWithTicks(waitMs, onRetryProgress);
    }

    let response: OpenAI.Chat.Completions.ChatCompletion;
    try {
      response = await cfg.client.chat.completions.create(body);
    } catch (err) {
      const e = err as { status?: number; message?: string; code?: string; type?: string };
      if (debug) {
        try {
          await debug.write('error', {
            model: cfg.model,
            attempt,
            status: e.status,
            message: e.message,
            code: e.code,
            type: e.type,
          });
        } catch {
          /* never mask real error */
        }
      }
      const status = e.status;
      const retryable = !status || status >= 500 || status === 408 || status === 429;
      if (!retryable) throw err;
      lastReason = `error ${status ?? 'network'}: ${(e.message ?? '').slice(0, 120)}`;
      lastSnapshot = { kind: 'transport', status, sample: (e.message ?? '').slice(0, 200) };
      continue;
    }

    const choice = response.choices?.[0] as Choice | undefined;
    const extracted = extractAssistantText(choice);
    const finishReason = choice?.finish_reason;

    if (debug) {
      try {
        await debug.write('response', {
          model: cfg.model,
          attempt,
          label: cfg.label,
          contentLength: (choice?.message?.content ?? '').length,
          contentPreview: (choice?.message?.content ?? '').slice(0, 500),
          reasoningLength: (choice?.message?.reasoning_content ?? '').length,
          usage: response.usage,
          finishReason,
          extractedOk: extracted.ok,
        });
      } catch {
        /* never mask the real error path */
      }
    }

    if (extracted.ok) {
      return {
        content: extracted.content,
        usage: (response.usage as Usage | undefined) ?? null,
        fallback: extracted.fallback,
      };
    }

    // Empty response. Deterministic finish_reasons aren't retried.
    if (finishReason && NON_RETRY_EMPTY.has(finishReason)) {
      throw new Error(
        `Model returned no text with finish_reason=${finishReason}.` +
          (response.usage
            ? ` prompt_tokens=${response.usage.prompt_tokens ?? '?'},` +
              ` completion_tokens=${response.usage.completion_tokens ?? '?'}.`
            : ''),
      );
    }

    lastReason = `empty content+reasoning (finish=${finishReason ?? '?'})`;
    lastSnapshot = {
      kind: 'empty',
      finishReason: finishReason ?? null,
      prompt_tokens: response.usage?.prompt_tokens ?? null,
      completion_tokens: response.usage?.completion_tokens ?? null,
    };
  }

  const baseMsg = `Invalid API response after ${attempted} attempt${attempted === 1 ? '' : 's'} (${lastReason})`;
  throw new Error(
    lastSnapshot ? `${baseMsg}: ${JSON.stringify(lastSnapshot).slice(0, 300)}` : baseMsg,
  );
}
