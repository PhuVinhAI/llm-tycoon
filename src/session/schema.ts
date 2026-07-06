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
  // Frozen-prefix length for runtime trimming: 2 for a new/resumed game
  // ([doc, boot]); 4 for a continue that injected a SAVE block
  // ([doc, boot, load-request, resume]) so trimContext never evicts the save.
  runtimeFreeze: z.number().int().default(2),
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
  // Legacy: previous continue design linked child→parent sessions. Kept lenient
  // so old history.json still parses; no longer written.
  continuedFrom: z.string().nullable().default(null),
  // How many times this game has been continued (reuse-dir design). 0 = never.
  continues: z.number().int().default(0),
});
export type HistoryEntry = z.infer<typeof HistoryEntrySchema>;

export const HistorySchema = z.array(HistoryEntrySchema);
