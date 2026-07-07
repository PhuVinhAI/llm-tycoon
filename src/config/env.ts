/**
 * env.ts — .env parsing + Zod-validated application config.
 *
 * Two layers:
 *  1. `loadEnv(path)` — a tiny dotenv subset (KEY=value, quote-stripping,
 *     # comments). Behaviour is pinned by tests, so it stays hand-rolled.
 *  2. `EnvSchema` + `loadConfig()` — validate the merged env (process.env over
 *     the .env file, so `GAME_MAX_TURNS=2 bun run play` works) and map it to a
 *     typed `AppConfig`.
 *
 * API keys are OPTIONAL in the schema so non-AI paths (history, build) work
 * without a configured .env. The "throw only when an AI call needs the key"
 * rule lives in `requireKey`, called at client-construction time.
 */

import { existsSync, readFileSync } from 'node:fs';
import { z } from 'zod';
import { PATHS } from './paths.ts';

// ─── .env parser (behaviour pinned by tests) ────────────────────────────────
/**
 * Parse a `.env` file: `KEY=value`, optional surrounding quotes stripped,
 * blank lines and `# comments` skipped. Missing file → `{}`.
 */
export function loadEnv(envPath: string): Record<string, string> {
  if (!existsSync(envPath)) return {};
  const raw = readFileSync(envPath, 'utf8');
  const env: Record<string, string> = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

// ─── Zod coercion helpers ───────────────────────────────────────────────────
/** Strict boolean: only the literal string `"true"` is true (unlike z.coerce). */
const boolFromEnv = z.preprocess((v) => v === 'true' || v === true, z.boolean());

/** Int with `.env` semantics: empty/undefined → fallback; NaN → validation error. */
const intFromEnv = (fallback: number) =>
  z
    .preprocess((v) => (v === undefined || v === '' ? undefined : Number(v)), z.number().int())
    .default(fallback);

/** Reasoning effort levels accepted by the proxies we target. */
export const REASONING_LEVELS = [
  'none',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
  'max',
] as const;
const effort = z.enum(REASONING_LEVELS).optional();

// ─── Schema ─────────────────────────────────────────────────────────────────
export const EnvSchema = z.object({
  AI_RUNTIME_BASE_URL: z.string().default('https://api.openai.com/v1'),
  AI_RUNTIME_API_KEY: z.string().min(1).optional(),
  AI_RUNTIME_MODEL: z.string().default('gpt-4'),
  AI_RUNTIME_REASONING: effort,
  AI_RUNTIME_REASONING_FORCE: boolFromEnv.default(false),

  AI_PLAYER_BASE_URL: z.string().default('https://api.openai.com/v1'),
  AI_PLAYER_API_KEY: z.string().min(1).optional(),
  AI_PLAYER_MODEL: z.string().default('gpt-4'),
  AI_PLAYER_REASONING: effort,
  AI_PLAYER_REASONING_FORCE: boolFromEnv.default(false),

  REASONING_EFFORT: effort,

  GAME_MAX_TURNS: intFromEnv(100),
  GAME_AUTOSAVE_TURNS: intFromEnv(1),
  GAME_HISTORY_TAIL: intFromEnv(500),
  GAME_TOKEN_LIMIT: intFromEnv(180_000),
  GAME_MAX_TOKENS: intFromEnv(200_000),
  GAME_VERBOSE: boolFromEnv.default(false),
});

export type RawEnv = z.infer<typeof EnvSchema>;
export type ReasoningEffort = (typeof REASONING_LEVELS)[number];

// ─── Typed config ───────────────────────────────────────────────────────────
export interface ModelConfig {
  baseUrl: string;
  /** Absent until an AI call needs it — validated via `requireKey`. */
  apiKey: string | undefined;
  model: string;
  reasoningEffort: ReasoningEffort | null;
  reasoningForce: boolean;
}

export interface GameSettings {
  maxTurns: number;
  verbose: boolean;
  autoSaveEvery: number;
  historyTail: number;
  tokenLimitPerTurn: number;
  maxTokens: number;
}

export interface AppConfig {
  runtime: ModelConfig;
  player: ModelConfig;
  game: GameSettings;
}

/**
 * Load + validate config. `overrides` (default: process.env over the .env
 * file) lets tests inject a fixed environment.
 */
export function loadConfig(overrides?: Record<string, string | undefined>): AppConfig {
  const fileEnv = loadEnv(PATHS.env);
  const merged = overrides ?? { ...fileEnv, ...process.env };
  const env = EnvSchema.parse(merged);

  return {
    runtime: {
      baseUrl: env.AI_RUNTIME_BASE_URL,
      apiKey: env.AI_RUNTIME_API_KEY,
      model: env.AI_RUNTIME_MODEL,
      reasoningEffort: env.AI_RUNTIME_REASONING ?? env.REASONING_EFFORT ?? null,
      reasoningForce: env.AI_RUNTIME_REASONING_FORCE,
    },
    player: {
      baseUrl: env.AI_PLAYER_BASE_URL,
      apiKey: env.AI_PLAYER_API_KEY,
      model: env.AI_PLAYER_MODEL,
      reasoningEffort: env.AI_PLAYER_REASONING ?? env.REASONING_EFFORT ?? null,
      reasoningForce: env.AI_PLAYER_REASONING_FORCE,
    },
    game: {
      maxTurns: env.GAME_MAX_TURNS,
      verbose: env.GAME_VERBOSE,
      autoSaveEvery: env.GAME_AUTOSAVE_TURNS,
      historyTail: env.GAME_HISTORY_TAIL,
      tokenLimitPerTurn: env.GAME_TOKEN_LIMIT,
      maxTokens: env.GAME_MAX_TOKENS,
    },
  };
}

/**
 * Return `apiKey` or throw a helpful error. Called lazily so `history` / `build`
 * never require a key.
 */
export function requireKey(apiKey: string | undefined, which: string): string {
  if (!apiKey) {
    throw new Error(
      `Missing required API key for ${which}. Copy .env.example → .env and configure AI_*_API_KEY.`,
    );
  }
  return apiKey;
}
