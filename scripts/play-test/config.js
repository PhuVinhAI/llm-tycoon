/**
 * config.js — source of truth for env vars, CLI flags, paths, and runtime
 *              defaults used by every other module in scripts/play-test/.
 *
 * Key changes from the previous version:
 *  - `.env` quote-stripping: `"gpt-4"` is now `gpt-4`.
 *  - `parseInt` uses explicit radix-10 and finite-check.
 *  - `RUNTIME` and `PLAYER` are exposed via getters so callers can read
 *    `RUNTIME.baseUrl` without triggering `requireKey('AI_RUNTIME_API_KEY')`.
 *    This is what makes `npm run history` work even without an `.env` — the
 *    API-key validation only fires when an AI call actually needs the key.
 *  - `loadEnv()` returns `{}` (instead of `process.exit(1)`) when the file
 *    is missing, so non-AI paths (history listing) still work.
 *
 * Other behaviour preserved: same CLI flags, same on-disk file locations.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..', '..');

// ─── CLI args ──────────────────────────────────────────────────────────────
const ARGS = process.argv.slice(2);
const hasFlag = (flag) => ARGS.includes(flag);

export const FLAG_NEW = hasFlag('--new');
export const FLAG_RESUME = hasFlag('--resume');
export const FLAG_CONTINUE = hasFlag('--continue') || hasFlag('-c');
export const FLAG_HISTORY = hasFlag('--history') || hasFlag('-h');
export const FLAG_VERBOSE = hasFlag('--verbose') || hasFlag('-v');

/**
 * The value (if any) that follows `--resume` or `--continue` is treated as a
 * session id. We scan the arg list because flag-value pairs can come in any
 * order, and `--continue` has a short alias `-c`.
 */
export const FLAG_SESSION_ID = (() => {
  for (let i = 0; i < ARGS.length; i++) {
    if (ARGS[i] === '--resume' || ARGS[i] === '--continue' || ARGS[i] === '-c') {
      const next = ARGS[i + 1];
      if (next && !next.startsWith('-')) return next;
    }
  }
  return null;
})();

const exclusiveFlags = [FLAG_NEW, FLAG_RESUME, FLAG_CONTINUE].filter(Boolean).length;
if (exclusiveFlags > 1) {
  console.error('❌ Use only one of: --new, --resume, --continue');
  process.exit(1);
}

// ─── .env loader ────────────────────────────────────────────────────────────
/**
 * Parses a `.env` file (very small subset of dotenv syntax):
 *   - `KEY=value`
 *   - `KEY="quoted value"` / `KEY='quoted value'` — quotes are stripped
 *   - Empty lines and full-line `# comments` are skipped
 *
 * If `envPath` doesn't exist, returns `{}` and lets the caller decide.
 *
 * @param {string} envPath absolute path
 * @returns {Record<string, string>}
 */
export function loadEnv(envPath) {
  if (!existsSync(envPath)) return {};
  const raw = readFileSync(envPath, 'utf8');
  /** @type {Record<string, string>} */
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    // Strip surrounding single or double quotes.
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

const ENV_PATH = join(ROOT, '.env');
export const env = loadEnv(ENV_PATH);

// ─── Key / Int helpers ──────────────────────────────────────────────────────
/**
 * Throws if `key` is missing or empty. Used as a getter body so callers only
 * trigger the throw when they actually need the key (so `--history` works
 * even without a configured `.env`).
 */
export function requireKey(key) {
  const v = env[key];
  if (!v) {
    throw new Error(
      `Missing required env var: ${key}. ` +
        `Copy .env.sample → .env and configure AI_*_API_KEY.`
    );
  }
  return v;
}

function parseIntEnv(key, fallback) {
  const v = env[key];
  if (v == null || v === '') return fallback;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

// ─── Lazy config objects ───────────────────────────────────────────────────
/**
 * `RUNTIME` and `PLAYER` use getters so that reading `RUNTIME.baseUrl` is
 * safe but reading `RUNTIME.apiKey` only triggers the env check at the
 * moment an AI call needs the key. This is the fix for the
 * `--history needs .env` bug — the history path never reads `.apiKey`.
 */
export const RUNTIME = Object.freeze({
  get baseUrl() {
    return env.AI_RUNTIME_BASE_URL || 'https://api.openai.com/v1';
  },
  get apiKey() {
    return requireKey('AI_RUNTIME_API_KEY');
  },
  get model() {
    return env.AI_RUNTIME_MODEL || 'gpt-4';
  },
  get reasoningEffort() {
    return env.AI_RUNTIME_REASONING || env.REASONING_EFFORT || null;
  },
  get reasoningForce() {
    return env.AI_RUNTIME_REASONING_FORCE === 'true';
  },
});

export const PLAYER = Object.freeze({
  get baseUrl() {
    return env.AI_PLAYER_BASE_URL || 'https://api.openai.com/v1';
  },
  get apiKey() {
    return requireKey('AI_PLAYER_API_KEY');
  },
  get model() {
    return env.AI_PLAYER_MODEL || 'gpt-4';
  },
  get reasoningEffort() {
    return env.AI_PLAYER_REASONING || env.REASONING_EFFORT || null;
  },
  get reasoningForce() {
    return env.AI_PLAYER_REASONING_FORCE === 'true';
  },
});

export const GAME_CONFIG = Object.freeze({
  maxTurns: parseIntEnv('GAME_MAX_TURNS', 100),
  verbose: FLAG_VERBOSE || env.GAME_VERBOSE === 'true',
  reasoningEffort: env.REASONING_EFFORT || null,
  /** Auto-save every N turns (0 = only on signal/exit). Default: 1. */
  autoSaveEvery: parseIntEnv('GAME_AUTOSAVE_TURNS', 1),
  /** Tail in memory for the live in-game log view. Default: 500. */
  historyTail: parseIntEnv('GAME_HISTORY_TAIL', 500),
  /** Trigger context trimming when prompt exceeds this. 180k safe for GPT-class models. */
  tokenLimitPerTurn: parseIntEnv('GAME_TOKEN_LIMIT', 180_000),
  /** Final token ceiling for the SDK. */
  maxTokens: parseIntEnv('GAME_MAX_TOKENS', 200_000),
});

export const GAME_OVER_KEYWORDS = Object.freeze([
  'game over',
  'burned out',
  'bankrupt',
  'heading to headquarters',
  'game ended',
  'term sheet',
]);

// ─── Paths ──────────────────────────────────────────────────────────────────
export const PATHS = Object.freeze({
  ROOT,
  STATE: join(ROOT, 'game_state.json'),
  RESULT: join(ROOT, 'game_result.json'),
  LOGS: join(ROOT, 'logs'),
  HISTORY: join(ROOT, 'logs', 'history.json'),
  GAME_DOC: join(ROOT, 'build', 'LLM-TYCOON.md'),
});

// Backwards-compatible aliases — the previous version exported these flat
// names, so downstream grep / docs still work.
export const STATE_PATH = PATHS.STATE;
export const RESULT_PATH = PATHS.RESULT;
export const LOGS_DIR = PATHS.LOGS;
export const HISTORY_PATH = PATHS.HISTORY;
export const GAME_DOC_PATH = PATHS.GAME_DOC;
