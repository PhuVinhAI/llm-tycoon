import OpenAI from 'openai';
import { RUNTIME, PLAYER, GAME_CONFIG } from './config.js';

// ─── OpenAI Clients ────────────────────────────────────────────────────────
export const runtimeClient = new OpenAI({
  apiKey: RUNTIME.apiKey,
  baseURL: RUNTIME.baseUrl,
  maxRetries: 5,
  timeout: 120_000,
});

export const playerClient = new OpenAI({
  apiKey: PLAYER.apiKey,
  baseURL: PLAYER.baseUrl,
  maxRetries: 5,
  timeout: 60_000,
});

// ─── API Call ──────────────────────────────────────────────────────────────
export async function callAI(client, config, messages) {
  const body = {
    model: config.model,
    messages,
  };

  if (GAME_CONFIG.reasoningEffort) {
    body.reasoning_effort = GAME_CONFIG.reasoningEffort;
  }

  const response = await client.chat.completions.create(body);

  const choice = response.choices?.[0];
  const content = choice?.message?.content || choice?.message?.reasoning_content;
  if (!content) {
    throw new Error(`Invalid API response: ${JSON.stringify(response).slice(0, 500)}`);
  }

  return {
    content,
    usage: response.usage,
  };
}
