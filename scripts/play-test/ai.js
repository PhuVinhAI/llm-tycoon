/**
 * ai.js — single API-call wrapper.
 *
 * Pure concern split: this module knows NOTHING about config.js. Callers pass
 * a fully-built `ClientConfig` from clients.js and a message array. The
 * optional `debug` sink captures request/response/error snapshots.
 *
 * Removing the previous default-client factories is what makes
 * `--history` work without an `.env` — those factories used to instantiate
 * OpenAI clients at module-load time, which triggered `requireKey`.
 */

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
 * One chat.completion call.
 *
 * Robustness:
 *  - Debug records are emitted for request, response, and error independently
 *    so a network failure still leaves a snapshot of what we sent.
 *  - Empty `content` falls back to `reasoning_content` only as a last resort
 *    with a stderr warning (a reasoning-only model usually means misconfig).
 *  - If both are missing, throws a descriptive error.
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
    // The runtime's game doc references "SAVE LLM-TYCOON" as a literal format
    // string, so a naive substring search would false-positive on every turn.
    // Look only at the tail of the first message (where the actual format
    // spec lives).
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

  let response;
  try {
    response = await cfg.client.chat.completions.create(body);
  } catch (err) {
    if (debug) {
      try {
        await debug.write('error', {
          model: cfg.model,
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
    throw err;
  }

  const choice = response.choices?.[0];
  const content = choice?.message?.content;
  const reasoning = choice?.message?.reasoning_content;

  if (debug) {
    await debug.write('response', {
      model: cfg.model,
      contentLength: content?.length ?? 0,
      contentPreview: (content || '').slice(0, 500),
      reasoningLength: reasoning?.length ?? 0,
      usage: response.usage,
      finishReason: choice?.finish_reason,
    });
  }

  if (!content) {
    if (reasoning) {
      console.warn(
        '⚠️  Model returned `reasoning_content` only — falling back. ' +
          'A reasoning-only model is probably not what you want for the player loop.'
      );
      return { content: reasoning, usage: response.usage, fallback: 'reasoning' };
    }
    throw new Error(
      `Invalid API response (no content + no reasoning_content): ${JSON.stringify(response).slice(0, 500)}`
    );
  }
  return { content, usage: response.usage, fallback: null };
}
