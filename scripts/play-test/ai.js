/**
 * ai.js — single API-call wrapper.
 *
 * Pure concern split: this module knows NOTHING about config.js. Callers pass
 * a fully-built `ClientConfig` from clients.js and a message array. The
 * optional `debug` sink captures request/response/error snapshots.
 *
 * Resilience upgrades over the previous version:
 *  - Pure helper `extractAssistantText(choice)` exported so the helper can
 *    be unit-tested without a live OpenAI client.
 *  - Empty `content` + empty `reasoning_content` triggers a bounded retry
 *    with exponential backoff (DeepSeek-style thinking models sometimes
 *    return `{content:"",reasoning_content:""}` on a clean 200 OK — more
 *    often than you'd guess).
 *  - finish_reason IN {length, content_filter, function_call, tool_calls,
 *    refusal} is treated as DETERMINISTIC and not retried. The model
 *    decided not to emit text; the next attempt will pick the same action.
 *  - Network errors / 5xx / 408 / 429 are retried with the same schedule.
 *  - Retry policy is read PER CALL (not module-load) so tests and ops
 *    tooling can tune it at runtime without a process restart.
 *  - Debug sink gets a `retry` event per retry iteration so backoff traces
 *    are visible from the session's `debug/` directory even though the
 *    user-facing console warning might be cut off.
 */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Read the retry policy from process.env on every call. This is intentionally
 * NOT cached at module load so that tests can override per-test and ops
 * tooling can tune live.
 *
 * @returns {{ max:number, ceil:number, base:number, mult:number }}
 */
function readRetryPolicy() {
  const max = Math.max(0, Number(process.env.AI_RETRY_ATTEMPTS ?? 3));
  return {
    max,
    ceil: Math.max(1, max),
    base: Math.max(0, Number(process.env.AI_RETRY_BASE_DELAY_MS ?? 1500)),
    mult: Math.max(1, Number(process.env.AI_RETRY_MULTIPLIER ?? 2)),
  };
}

/**
 * @typedef {{
 *   client: import('openai').OpenAI,
 *   model: string,
 *   extraBody?: object,
 *   label?: string,
 * }} ClientConfig
 *
 * @typedef {{
 *   write: (label: string, data: object) => Promise<void>|void,
 * }} DebugSink
 */

/**
 * Pure helper: turn one `choices[0]` into either a normalized assistant
 * text payload or a structured rejection. No side effects, no logging,
 * fully unit-testable.
 *
 * Reasoning-only responses are treated as success-with-fallback so the
 * player loop doesn't stall when a thinking model decides to withhold its
 * raw `content` but still produced reasoning. Caller logs a warning in
 * that case.
 *
 * @param {{ message?: { content?: string|null, reasoning_content?: string|null }, finish_reason?: string }|null|undefined} choice
 * @returns {{ ok: true, content: string, fallback: 'reasoning'|null } | { ok: false, reason: string }}
 */
export function extractAssistantText(choice) {
  const msg = choice?.message ?? {};
  const content = msg.content ?? '';
  const reasoning = msg.reasoning_content ?? '';
  if (!content && !reasoning) {
    return { ok: false, reason: 'empty' };
  }
  if (!content) {
    return { ok: true, content: reasoning, fallback: 'reasoning' };
  }
  return { ok: true, content, fallback: null };
}

/**
 * Finish reasons that mean the model *decided* not to emit text — retrying
 * into the same provider/model is unlikely to change the outcome. Exported
 * so tests can pin the exact membership against accidental edits.
 */
export const NON_RETRY_EMPTY = new Set([
  'length',
  'content_filter',
  'function_call',
  'tool_calls',
  'refusal',
]);

/**
 * One chat.completion call with bounded retry on transient failures.
 *
 * @param {ClientConfig} cfg from buildClientConfig()
 * @param {Array<{ role:string, content:string }>} messages
 * @param {DebugSink|null} [debug] optional sink
 * @returns {Promise<{ content:string, usage:any, fallback:string|null }>}
 */
export async function callAI(cfg, messages, debug = null) {
  const body = {
    model: cfg.model,
    messages,
    ...(cfg.extraBody || {}),
  };

  if (debug) {
    const first = messages[0];
    const last = messages[messages.length - 1];
    const firstContent = first?.content || '';
    // The runtime's game doc references "SAVE LLM-TYCOON" as a literal
    // format string, so a naive substring search would false-positive on
    // every turn. Look only at the tail of the first message.
    const saveIdx = firstContent.lastIndexOf('=== SAVE LLM-TYCOON');
    const hasSaveBlockNearTail = saveIdx > firstContent.length - 2000 && saveIdx !== -1;
    await debug.write('request', {
      model: cfg.model,
      label: cfg.label || cfg.model,
      messageCount: messages.length,
      firstRole: first?.role ?? null,
      lastRole: last?.role ?? null,
      firstPreview: firstContent.slice(0, 500),
      lastPreview: (last?.content || '').slice(0, 300),
      hasSaveBlockNearTail,
      reasoning_effort: body.reasoning_effort ?? null,
      extraBody: cfg.extraBody || {},
    });
  }

  const rp = readRetryPolicy();
  let lastReason = 'unset';
  let lastSnapshot = null;
  let attempted = 0;

  for (let attempt = 1; ; attempt++) {
    if (attempt > rp.ceil) break;
    attempted = attempt;

    if (attempt > 1 && rp.base > 0) {
      const waitMs = Math.round(rp.base * Math.pow(rp.mult, attempt - 2));
      // Display `/rp.ceil` (not `/rp.max`) so a misconfigured
      // AI_RETRY_ATTEMPTS=0 never produces a 'retry 2/0' line in the log.
      console.warn(
        `⏳ callAI[${cfg.label || cfg.model}] retry ${attempt}/${rp.ceil}` +
        ` after ${waitMs}ms (last: ${lastReason})`
      );
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
      await sleep(waitMs);
    }

    let response;
    try {
      response = await cfg.client.chat.completions.create(body);
    } catch (err) {
      if (debug) {
        try {
          await debug.write('error', {
            model: cfg.model,
            attempt,
            status: err.status,
            message: err.message,
            code: err.code,
            type: err.type,
            headers: err.headers,
            body: err.error,
          });
        } catch {
          /* never mask real error */
        }
      }
      const status = err.status;
      const retryable =
        !status || status >= 500 || status === 408 || status === 429;
      if (!retryable) {
        throw err;
      }
      lastReason = `error ${status || 'network'}: ${(err.message || '').slice(0, 120)}`;
      lastSnapshot = {
        kind: 'transport',
        status,
        sample: (err.message || '').slice(0, 200),
      };
      continue;
    }

    const choice = response.choices?.[0];
    const extracted = extractAssistantText(choice);
    const finishReason = choice?.finish_reason;

    if (debug) {
      try {
        await debug.write('response', {
          model: cfg.model,
          attempt,
          label: cfg.label || cfg.model,
          contentLength: (choice?.message?.content ?? '').length,
          contentPreview: (choice?.message?.content ?? '').slice(0, 500),
          reasoningLength: (choice?.message?.reasoning_content ?? '').length,
          usage: response.usage,
          finishReason,
          extractedOk: extracted.ok,
        });
        if (!extracted.ok) {
          await debug.write('empty_response', {
            model: cfg.model,
            attempt,
            finishReason,
            usage: response.usage,
            rawPreview: JSON.stringify(response).slice(0, 400),
          });
        }
      } catch {
        /* never mask the real error path */
      }
    }

    if (extracted.ok) {
      if (extracted.fallback === 'reasoning') {
        console.warn(
          '⚠️  Model returned `reasoning_content` only — falling back. ' +
            'A reasoning-only model is probably not what you want for the player loop.'
        );
      }
      return {
        content: extracted.content,
        usage: response.usage,
        fallback: extracted.fallback,
      };
    }

    // Empty response. Non-retryable finish_reasons mean the model
    // *decided* not to emit text — retrying into a different attempt
    // doesn't change that decision.
    if (NON_RETRY_EMPTY.has(finishReason)) {
      throw new Error(
        `Model returned no text with finish_reason=${finishReason}.` +
        (response.usage
          ? ` prompt_tokens=${response.usage.prompt_tokens ?? '?'},` +
            ` completion_tokens=${response.usage.completion_tokens ?? '?'}.`
          : '')
      );
    }

    lastReason = `empty content+reasoning (finish=${finishReason || '?'})`;
    lastSnapshot = {
      kind: 'empty',
      finishReason: finishReason || null,
      prompt_tokens: response.usage?.prompt_tokens ?? null,
      completion_tokens: response.usage?.completion_tokens ?? null,
    };
  }

  const baseMsg =
    `Invalid API response after ${attempted} ` +
    `attempt${attempted === 1 ? '' : 's'} (${lastReason})`;
  throw new Error(
    lastSnapshot
      ? `${baseMsg}: ${JSON.stringify(lastSnapshot).slice(0, 300)}`
      : baseMsg
  );
}
