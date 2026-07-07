/**
 * client.ts — OpenAI SDK client factory.
 *
 * `buildClientConfig` returns a small wrapper (not the raw client) so the game
 * loop can pass it around without tracking which model goes with which client.
 * `extraBody` carries `reasoning_effort` when applicable, keeping `call.ts`
 * agnostic of reasoning-effort support.
 *
 * SDK `maxRetries` is set to 0: `call.ts` owns retry/backoff so retries are
 * observable as engine events (no hidden double-backoff inside the SDK).
 */

import OpenAI from 'openai';
import type { ModelConfig } from '../config/env.ts';
import { requireKey } from '../config/env.ts';

/** Models for which OpenAI accepts `reasoning_effort` (o1/o3/o4-mini/…). */
const REASONING_MODEL_RE = /^o\d(?:[-a-z].*)?$/i;

export interface ClientConfig {
  client: OpenAI;
  model: string;
  extraBody: Record<string, unknown>;
  /** Stable identifier for debug logs (never leaks the API key). */
  label: string;
}

/**
 * Whether the call should carry `reasoning_effort`: only when the user set a
 * value AND the model looks like an o-series (or explicitly forced it).
 */
export function shouldAttachReasoning(cfg: {
  model: string;
  reasoningEffort: string | null | undefined;
  reasoningForce?: boolean;
}): boolean {
  if (!cfg.reasoningEffort) return false;
  if (cfg.reasoningForce) return true;
  return REASONING_MODEL_RE.test(cfg.model);
}

/**
 * Build a config bundle for `call.ts` from a validated `ModelConfig`.
 * `which` labels the role ('runtime' | 'player') in the missing-key error.
 */
export function buildClientConfig(
  model: ModelConfig,
  which: string,
  opts: { timeoutMs?: number } = {},
): ClientConfig {
  const client = new OpenAI({
    apiKey: requireKey(model.apiKey, which),
    baseURL: model.baseUrl,
    maxRetries: 0,
    timeout: opts.timeoutMs ?? 120_000,
  });

  const extraBody: Record<string, unknown> = {};
  if (shouldAttachReasoning(model)) {
    extraBody.reasoning_effort = model.reasoningEffort;
  }

  return {
    client,
    model: model.model,
    extraBody,
    label: `${model.model} @ ${model.baseUrl}`,
  };
}
