import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(__dirname, '..', '..');

// ─── CLI Args ──────────────────────────────────────────────────────────────
const ARGS = process.argv.slice(2);
export const FLAG_NEW = ARGS.includes('--new');
export const FLAG_RESUME = ARGS.includes('--resume');
export const FLAG_CONTINUE = ARGS.includes('--continue') || ARGS.includes('-c');
export const FLAG_HISTORY = ARGS.includes('--history') || ARGS.includes('-h');
export const FLAG_VERBOSE = ARGS.includes('--verbose') || ARGS.includes('-v');

// Optional session ID after --resume or --continue
export const FLAG_SESSION_ID = (() => {
  const resumeIdx = ARGS.indexOf('--resume');
  const continueIdx = ARGS.indexOf('--continue');
  const idx = Math.max(resumeIdx, continueIdx);
  if (idx === -1) return null;
  const next = ARGS[idx + 1];
  if (next && !next.startsWith('-')) return next;
  return null;
})();

if ([FLAG_NEW, FLAG_RESUME, FLAG_CONTINUE].filter(Boolean).length > 1) {
  console.error('❌ Use only one of: --new, --resume, --continue');
  process.exit(1);
}

// ─── Env ───────────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = join(ROOT, '.env');
  if (!existsSync(envPath)) {
    console.error('❌ No .env file found. Copy .env.sample to .env and configure it.');
    process.exit(1);
  }
  const lines = readFileSync(envPath, 'utf8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
  return env;
}

export const env = loadEnv();

// ─── Configs ───────────────────────────────────────────────────────────────
export const RUNTIME = {
  baseUrl: env.AI_RUNTIME_BASE_URL || 'https://api.openai.com/v1',
  apiKey: env.AI_RUNTIME_API_KEY,
  model: env.AI_RUNTIME_MODEL || 'gpt-4',
};

export const PLAYER = {
  baseUrl: env.AI_PLAYER_BASE_URL || 'https://api.openai.com/v1',
  apiKey: env.AI_PLAYER_API_KEY,
  model: env.AI_PLAYER_MODEL || 'gpt-4',
};

export const GAME_CONFIG = {
  maxTurns: parseInt(env.GAME_MAX_TURNS || '100'),
  verbose: FLAG_VERBOSE || env.GAME_VERBOSE === 'true',
};

// ─── Paths ─────────────────────────────────────────────────────────────────
export const STATE_PATH = join(ROOT, 'game_state.json');
export const RESULT_PATH = join(ROOT, 'game_result.json');
export const LOGS_DIR = join(ROOT, 'logs');
export const HISTORY_PATH = join(LOGS_DIR, 'history.json');
