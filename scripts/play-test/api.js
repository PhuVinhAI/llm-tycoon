import OpenAI from 'openai';
import { RUNTIME, PLAYER, GAME_CONFIG } from './config.js';
import { logApiDebug } from './logger.js';

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

  // ── Debug: log request ──
  const lastMsg = messages[messages.length - 1];
  const firstMsg = messages[0];
  const firstContent = firstMsg?.content || '';
  // Save block detection: check if marker appears near END of the message
  // (the game doc itself contains SAVE format definition, so simple .includes() false-positives)
  const lastSaveMarker = firstContent.lastIndexOf('=== SAVE LLM-TYCOON');
  const hasSaveBlock = lastSaveMarker > (firstContent.length - 2000);
  const hasGameDoc = firstContent.includes('LLM TYCOON') || firstContent.includes('Game Info');
  const firstRole = firstMsg?.role;
  logApiDebug('request', {
    model: config.model,
    baseUrl: config.baseUrl,
    messageCount: messages.length,
    firstMessageRole: firstRole,
    hasSaveBlock,
    hasGameDoc,
    firstMessagePreview: firstContent.slice(0, 500),
    lastMessageRole: lastMsg?.role,
    lastMessagePreview: (lastMsg?.content || '').slice(0, 300),
    reasoning_effort: body.reasoning_effort || null,
  });

  let response;
  try {
    response = await client.chat.completions.create(body);
  } catch (err) {
    // ── Debug: log error (wrapped so debug never masks the real error) ──
    try {
      logApiDebug('error', {
        model: config.model,
        status: err.status,
        message: err.message,
        code: err.code,
        type: err.type,
        headers: err.headers,
        body: err.error,
      });
    } catch {}
    throw err;
  }

  const choice = response.choices?.[0];
  const content = choice?.message?.content || choice?.message?.reasoning_content;

  // ── Debug: log response ──
  logApiDebug('response', {
    model: config.model,
    contentLength: content?.length || 0,
    contentPreview: (content || '').slice(0, 500),
    usage: response.usage,
    finishReason: choice?.finish_reason,
  });

  if (!content) {
    throw new Error(`Invalid API response: ${JSON.stringify(response).slice(0, 500)}`);
  }

  return {
    content,
    usage: response.usage,
  };
}
