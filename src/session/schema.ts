/**
 * schema.ts — Zod schemas for all persisted JSON: game_state.json, the token
 * trackers within it, and logs/history.json entries. Parsing is lenient
 * (defaults + safeParse at call sites) so old saves keep loading.
 */

import { z } from 'zod';
import { TokenTrackerSchema } from '../engine/tokens.ts';

export const MessageSchema = z.object({
  role: z.string(),
  content: z.string(),
});
export type StoredMessage = z.infer<typeof MessageSchema>;

// ─── game_state.json ────────────────────────────────────────────────────────
export const StateSchema = z.object({
  turn: z.number().int().default(0),
  gameDocHash: z.string(),
  sessionId: z.string(),
  sessionDir: z.string(),
  runtimeMessages: z.array(MessageSchema).default([]),
  runtimeTokens: TokenTrackerSchema,
  playerMessages: z.array(MessageSchema).default([]),
  playerTokens: TokenTrackerSchema,
  runtimeLastResponse: z.string().default(''),
  gameOver: z.boolean().default(false),
});
export type PersistedState = z.infer<typeof StateSchema>;

// ─── logs/history.json ──────────────────────────────────────────────────────
export const HistoryEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  startedAt: z.string(),
  endedAt: z.string().nullable(),
  runtime: z.string(),
  player: z.string(),
  maxTurns: z.number(),
  turns: z.number(),
  totalMs: z.number(),
  gameOver: z.boolean(),
  sessionDir: z.string(),
  continuedFrom: z.string().nullable(),
});
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;

export const HistorySchema = z.array(HistoryEntrySchema);
