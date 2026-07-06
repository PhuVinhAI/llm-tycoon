/**
 * session.js — history + per-session file management.
 *
 * Key changes from previous logger.js:
 *  - All operations are pure (stateless) functions, no module-level globals.
 *    Test-friendly, re-entrancy-safe.
 *  - Every JSON write goes through `atomicWriteJson` (`.tmp` + rename). The
 *    previous version silently overwrote a corrupt `history.json` with `[]`,
 *    erasing months of session history on a single bad write.
 *  - `findSessionById` / `findPreviousSession` treat a missing filesystem
 *    `sessionDir` as "session does not exist".
 */

import {
  mkdir, writeFile, readFile, readdir, rename,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import {
  LOGS_DIR as CFG_LOGS_DIR,
  HISTORY_PATH as CFG_HISTORY_PATH,
} from './config.js';

// Mutable indirection allows tests to redirect IO without exposing the
// underlying config module. Production code never sets these.
let _LOGS_DIR = CFG_LOGS_DIR;
let _HISTORY_PATH = CFG_HISTORY_PATH;

/**
 * Test-only hook. Override the IO paths used by this module. Pass `undefined`
 * explicitly (or just the key with no value) to restore the configured value.
 *
 * Example:
 *   __setPathsForTests({ logsDir: '/tmp/x/logs', historyPath: '/tmp/x/history.json' });
 *   __setPathsForTests({ logsDir: undefined, historyPath: undefined });
 *
 * DO NOT call this from production code.
 *
 * @param {Partial<{ logsDir: string, historyPath: string }> | null | undefined} overrides
 */
export function __setPathsForTests(overrides) {
  if (!overrides) return;
  if ('logsDir' in overrides) _LOGS_DIR = overrides.logsDir;
  if ('historyPath' in overrides) _HISTORY_PATH = overrides.historyPath;
}

// ─── Atomic IO helpers ────────────────────────────────────────────────────
async function atomicWriteJson(path, data) {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2));
  await rename(tmp, path);
}

async function atomicWriteText(path, content) {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, content);
  await rename(tmp, path);
}

async function readJsonOrNull(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return null;
  }
}

// ─── History ─────────────────────────────────────────────────────────────
/**
 * Read history.json. Returns [] on missing file. On parse error we return
 * null so callers can decide whether to treat that as fatal (we deliberately
 * DO NOT silently write [] — that would erase history on any transient
 * corruption).
 *
 * @returns {Promise<Array<object>|null>}
 */
export async function loadHistory() {
  const data = await readJsonOrNull(_HISTORY_PATH);
  if (data === null) return [];
  return Array.isArray(data) ? data : [];
}

async function saveHistory(list) {
  await atomicWriteJson(_HISTORY_PATH, list);
}

/**
 * Format: `YYYY-MM-DD_HH-MM-SS_<8char-suffix>`. The suffix is a random UUID
 * slice — keeps the id unique even when two processes call `initSession`
 * within the same wall-clock second (which the previous second-precision
 * version occasionally collided on, with one writer's history entry getting
 * silently clobbered by atomic rename).
 */
function isoSessionId(date = new Date()) {
  const d = date.toISOString().slice(0, 10);
  const t = date.toISOString().slice(11, 19).replace(/:/g, '-');
  const suffix = randomUUID().replace(/-/g, '').slice(0, 8);
  return `${d}_${t}_${suffix}`;
}

/**
 * Allocate a new session: create its directory, append to history.json.
 *
 * @param {{ runtime:{model:string}, player:{model:string}, maxTurns:number }} opts
 * @returns {Promise<{ id:string, dir:string }>}
 */
export async function initSession({ runtime, player, maxTurns }) {
  const id = isoSessionId();
  const dir = join(_LOGS_DIR, id.slice(0, 10), id);
  await mkdir(dir, { recursive: true });

  const list = await loadHistory();
  list.push({
    id,
    date: id.slice(0, 10),
    startedAt: new Date().toISOString(),
    endedAt: null,
    runtime: runtime.model,
    player: player.model,
    maxTurns,
    turns: 0,
    totalMs: 0,
    gameOver: false,
    sessionDir: dir,
    continuedFrom: null,
  });
  await saveHistory(list);
  return { id, dir };
}

/**
 * Look up a session by id. Returns null if not found OR if its directory
 * has been deleted externally.
 */
export async function findSessionById(sessionId) {
  const list = await loadHistory();
  const entry = list.find((h) => h.id === sessionId);
  if (!entry) return null;
  if (!existsSync(entry.sessionDir)) return null;
  return entry;
}

/**
 * Most-recent closed session that is NOT `currentSessionId`.
 *
 * @param {string|null} [currentSessionId] exclude this id from the lookup
 */
export async function findPreviousSession(currentSessionId = null) {
  const all = (await loadHistory()).sort((a, b) =>
    b.startedAt.localeCompare(a.startedAt)
  );
  return (
    all.find((h) => h.id !== currentSessionId && h.endedAt) || null
  );
}

/**
 * Mark a session closed in history.json.
 *
 * @param {string} sessionId
 * @param {{ turns:number, gameOver:boolean, totalMs:number }} summary
 */
export async function closeSession(sessionId, { turns, gameOver, totalMs }) {
  if (!sessionId) return;
  const list = await loadHistory();
  const s = list.find((h) => h.id === sessionId);
  if (!s) return;
  s.endedAt = new Date().toISOString();
  s.turns = turns;
  s.gameOver = gameOver;
  s.totalMs = totalMs;
  await saveHistory(list);
}

/**
 * Link a session to its parent (continue-from).
 */
export async function setContinuedFrom(sessionId, parentSessionId) {
  if (!sessionId || !parentSessionId) return;
  const list = await loadHistory();
  const s = list.find((h) => h.id === sessionId);
  if (!s) return;
  s.continuedFrom = parentSessionId;
  await saveHistory(list);
}

// ─── Per-session files (save.txt + lessons) ─────────────────────────────
export async function writeSave(sessionDir, content) {
  if (!sessionDir) return;
  const data = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  await atomicWriteText(join(sessionDir, 'save.txt'), data);
}

/**
 * Auto-increment lesson number; never overwrites. Stops at 999 to abort
 * runaway loops.
 */
export async function writeLessons(sessionDir, content) {
  if (!sessionDir) return;
  for (let n = 1; n < 1000; n++) {
    const path = join(sessionDir, `lessons_${n}.md`);
    if (!existsSync(path)) {
      await atomicWriteText(path, content);
      return path;
    }
  }
  throw new Error('Too many lessons_N.md files (>999) in session directory');
}

async function readLessons(sessionDir) {
  if (!existsSync(sessionDir)) return null;
  const entries = await readdir(sessionDir).catch(() => []);
  const matches = entries
    .filter((f) => /^lessons_\d+\.md$/.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (matches.length === 0) return null;
  const contents = await Promise.all(
    matches.map((f) => readFile(join(sessionDir, f), 'utf8'))
  );
  return contents.join('\n\n---\n\n');
}

/**
 * Walk a session's `continuedFrom` chain and concatenate lessons in
 * chronological order (Oldest first). Guarded against cycles.
 */
export async function loadLessonsChain(sessionId) {
  if (!sessionId) return null;
  const all = await loadHistory();
  /** @type {string[]} */
  const collected = [];
  let currentId = sessionId;
  /** @type {Set<string>} */
  const guard = new Set();
  while (currentId && !guard.has(currentId)) {
    guard.add(currentId);
    const session = all.find((h) => h.id === currentId);
    if (!session) break;
    const lessons = await readLessons(session.sessionDir);
    if (lessons) collected.unshift(lessons);
    currentId = session.continuedFrom || null;
  }
  return collected.length > 0 ? collected.join('\n\n---\n\n') : null;
}

// ─── Pretty history view ────────────────────────────────────────────────
export async function listHistoryFormatted() {
  const all = (await loadHistory()).sort((a, b) =>
    b.startedAt.localeCompare(a.startedAt)
  );
  if (all.length === 0) return '  (no sessions)\n';
  const lines = ['\n  📋 Session History\n'];
  for (const s of all) {
    const dur = s.totalMs ? `${(s.totalMs / 1000).toFixed(0)}s` : 'running';
    const status = s.gameOver ? '✅' : s.endedAt ? '⏹️' : '▶️';
    const pad = (n, w) => String(n).padStart(w);
    lines.push(
      `  ${status} ${s.id}  |  T${pad(s.turns, 3)}  |  ${pad(dur, 6)}  |  ${s.runtime}`
    );
  }
  lines.push(`\n  Total: ${all.length} session(s)\n`);
  return lines.join('\n');
}
