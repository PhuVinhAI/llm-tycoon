/**
 * clients.js — OpenAI SDK client factories.
 *
 * Each `buildClientConfig` returns a small wrapper rather than the raw client,
 * so the game loop can pass it around without remembering which model name
 * goes with which client. The wrapper also exposes `extraBody` so `ai.js` can
 * stay agnostic of reasoning-effort support.
 *
 * Bug-fix history:
 *  - Previous version always sent `reasoning_effort` on every call. That
 *    causes 400 Bad Request from OpenAI when the runtime or player model is
 *    not an o-series. Default behaviour now toggles per-model; the env vars
 *    `*_REASONING_FORCE=true` opt back into the previous "always attach"
 *    behaviour for proxy setups.
 */

import OpenAI from 'openai';

/**
 * Models for which OpenAI accepts `reasoning_effort`. The regex matches the
 * `o1`, `o3`, `o4-mini`, future `o5`-style families.
 */
const REASONING_MODEL_RE = /^o\d(?:[-a-z].*)?$/i;

/**
 * Decide whether the call should carry `reasoning_effort`. Only attaches if:
 *   1. The user configured a value via env, AND
 *   2. The model looks like an o-series (or the user explicitly forced it).
 *
 * @param {{ model: string, reasoningEffort: string|null|undefined, reasoningForce?: boolean }} cfg
 * @returns {boolean}
 */
export function shouldAttachReasoning({ model, reasoningEffort, reasoningForce }) {
  if (!reasoningEffort) return false;
  if (reasoningForce) return true;
  return REASONING_MODEL_RE.test(model);
}

/**
 * Build a fully-typed config bundle for ai.js. The bundle shape is:
 *   `{ client: OpenAI, model: string, extraBody: object }`.
 *
 * `extraBody` is merged into the chat.completions body alongside `model` and
 * `messages`. Today it only ever carries `reasoning_effort`, but the
 * indirection lets us add e.g. `temperature` without churning ai.js.
 *
 * @param {{
 *   apiKey: string,
 *   baseUrl: string,
 *   model: string,
 *   reasoningEffort?: string|null,
 *   reasoningForce?: boolean,
 *   timeoutMs?: number,
 *   maxRetries?: number,
 * }} cfg
 */
export function buildClientConfig(cfg) {
  const client = new OpenAI({
    apiKey: cfg.apiKey,
    baseURL: cfg.baseUrl,
    maxRetries: typeof cfg.maxRetries === 'number' ? cfg.maxRetries : 5,
    timeout: typeof cfg.timeoutMs === 'number' ? cfg.timeoutMs : 120_000,
  });

  const extraBody = {};
  if (shouldAttachReasoning(cfg)) {
    extraBody.reasoning_effort = cfg.reasoningEffort;
  }

  return {
    client,
    model: cfg.model,
    extraBody,
    /**
     * Stable identifier for debug logs (we don't leak the API key).
     */
    label: `${cfg.model} @ ${cfg.baseUrl}`,
  };
}
