import OpenAI from 'openai';
import { RUNTIME, PLAYER } from './config.js';

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
  const response = await client.chat.completions.create({
    model: config.model,
    messages,
  });

  const choice = response.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error(`Invalid API response: ${JSON.stringify(response).slice(0, 500)}`);
  }

  return {
    content: choice.message.content,
    usage: response.usage,
  };
}
