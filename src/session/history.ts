/**
 * history.ts — history.json + per-session file management.
 *
 * All operations are pure functions with no module-level game state. Every
 * JSON write is atomic (`.tmp` + rename). A corrupt history.json reads as `[]`
 * (via safeParse) but is never silently overwritten with `[]` — that would
 * erase months of sessions on a single bad read.
 *
 * `__setPathsForTests` redirects IO for tests; production never calls it.
 */

import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rename, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PATHS } from '../config/paths.ts';
import { type HistoryEntry, HistorySchema } from './schema.ts';

let _logsDir = PATHS.logs;
let _historyPath = PATHS.history;

/** Test-only: override IO paths. Pass a key with `undefined` to restore config. */
export function __setPathsForTests(
  overrides:
    | Partial<{ logsDir: string | undefined; historyPath: string | undefined }>
    | null
    | undefined,
): void {
  if (!overrides) return;
  if ('logsDir' in overrides) _logsDir = overrides.logsDir ?? PATHS.logs;
  if ('historyPath' in overrides) _historyPath = overrides.historyPath ?? PATHS.history;
}

// ─── Atomic IO helpers ──────────────────────────────────────────────────────
async function atomicWriteJson(path: string, data: unknown): Promise<void> {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2));
  await rename(tmp, path);
}

async function atomicWriteText(path: string, content: string): Promise<void> {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, content);
  await rename(tmp, path);
}

// ─── History ────────────────────────────────────────────────────────────────
/** Read history.json. Missing/corrupt → `[]` (never rewritten as a side effect). */
export async function loadHistory(): Promise<HistoryEntry[]> {
  if (!existsSync(_historyPath)) return [];
  try {
    const raw = JSON.parse(await readFile(_historyPath, 'utf8'));
    const parsed = HistorySchema.safeParse(raw);
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

async function saveHistory(list: HistoryEntry[]): Promise<void> {
  await atomicWriteJson(_historyPath, list);
}

/**
 * `YYYY-MM-DD_HH-MM-SS_<8hex>`. The random suffix keeps ids unique even when
 * two processes call initSession within the same wall-clock second.
 */
function isoSessionId(date = new Date()): string {
  const d = date.toISOString().slice(0, 10);
  const t = date.toISOString().slice(11, 19).replace(/:/g, '-');
  const suffix = randomUUID().replace(/-/g, '').slice(0, 8);
  return `${d}_${t}_${suffix}`;
}

/** Allocate a new session: create its dir, append to history.json. */
export async function initSession(opts: {
  runtime: { model: string };
  player: { model: string };
  maxTurns: number;
}): Promise<{ id: string; dir: string }> {
  const id = isoSessionId();
  const dir = join(_logsDir, id.slice(0, 10), id);
  await mkdir(dir, { recursive: true });

  const list = await loadHistory();
  list.push({
    id,
    date: id.slice(0, 10),
    startedAt: new Date().toISOString(),
    endedAt: null,
    runtime: opts.runtime.model,
    player: opts.player.model,
    maxTurns: opts.maxTurns,
    turns: 0,
    totalMs: 0,
    gameOver: false,
    sessionDir: dir,
    continuedFrom: null,
  });
  await saveHistory(list);
  return { id, dir };
}

/** Look up a session by id. Null if not found OR its directory was deleted. */
export async function findSessionById(sessionId: string): Promise<HistoryEntry | null> {
  const list = await loadHistory();
  const entry = list.find((h) => h.id === sessionId);
  if (!entry) return null;
  if (!existsSync(entry.sessionDir)) return null;
  return entry;
}

/** Most-recent closed session that is NOT `currentSessionId`. */
export async function findPreviousSession(
  currentSessionId: string | null = null,
): Promise<HistoryEntry | null> {
  const all = (await loadHistory()).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  return all.find((h) => h.id !== currentSessionId && h.endedAt) ?? null;
}

/** Mark a session closed in history.json. */
export async function closeSession(
  sessionId: string,
  summary: { turns: number; gameOver: boolean; totalMs: number },
): Promise<void> {
  if (!sessionId) return;
  const list = await loadHistory();
  const s = list.find((h) => h.id === sessionId);
  if (!s) return;
  s.endedAt = new Date().toISOString();
  s.turns = summary.turns;
  s.gameOver = summary.gameOver;
  s.totalMs = summary.totalMs;
  await saveHistory(list);
}

/** Link a session to its parent (continue-from). */
export async function setContinuedFrom(sessionId: string, parentSessionId: string): Promise<void> {
  if (!sessionId || !parentSessionId) return;
  const list = await loadHistory();
  const s = list.find((h) => h.id === sessionId);
  if (!s) return;
  s.continuedFrom = parentSessionId;
  await saveHistory(list);
}

// ─── Per-session files (save.txt + lessons) ─────────────────────────────────
export async function writeSave(sessionDir: string, content: string): Promise<void> {
  if (!sessionDir) return;
  await atomicWriteText(join(sessionDir, 'save.txt'), content);
}

/** Auto-increment lesson number; never overwrites. Aborts a runaway at 999. */
export async function writeLessons(sessionDir: string, content: string): Promise<string | null> {
  if (!sessionDir) return null;
  for (let n = 1; n < 1000; n++) {
    const path = join(sessionDir, `lessons_${n}.md`);
    if (!existsSync(path)) {
      await atomicWriteText(path, content);
      return path;
    }
  }
  throw new Error('Too many lessons_N.md files (>999) in session directory');
}

async function readLessons(sessionDir: string): Promise<string | null> {
  if (!existsSync(sessionDir)) return null;
  const entries = await readdir(sessionDir).catch(() => [] as string[]);
  const matches = entries
    .filter((f) => /^lessons_\d+\.md$/.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (matches.length === 0) return null;
  const contents = await Promise.all(matches.map((f) => readFile(join(sessionDir, f), 'utf8')));
  return contents.join('\n\n---\n\n');
}

/**
 * Walk a session's `continuedFrom` chain and concatenate lessons oldest-first.
 * Cycle-guarded.
 */
export async function loadLessonsChain(sessionId: string): Promise<string | null> {
  if (!sessionId) return null;
  const all = await loadHistory();
  const collected: string[] = [];
  let currentId: string | null = sessionId;
  const guard = new Set<string>();
  while (currentId && !guard.has(currentId)) {
    guard.add(currentId);
    const session = all.find((h) => h.id === currentId);
    if (!session) break;
    const lessons = await readLessons(session.sessionDir);
    if (lessons) collected.unshift(lessons);
    currentId = session.continuedFrom;
  }
  return collected.length > 0 ? collected.join('\n\n---\n\n') : null;
}

// ─── Views ──────────────────────────────────────────────────────────────────
/** Structured, newest-first history for the Ink table / pickers. */
export async function listHistory(): Promise<HistoryEntry[]> {
  return (await loadHistory()).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

/** Plain-text history view for the headless renderer. */
export async function listHistoryFormatted(): Promise<string> {
  const all = await listHistory();
  if (all.length === 0) return '  (no sessions)\n';
  const pad = (n: string | number, w: number) => String(n).padStart(w);
  const lines = ['\n  📋 Session History\n'];
  for (const s of all) {
    const dur = s.totalMs ? `${(s.totalMs / 1000).toFixed(0)}s` : 'running';
    const status = s.gameOver ? '✅' : s.endedAt ? '⏹️' : '▶️';
    lines.push(`  ${status} ${s.id}  |  T${pad(s.turns, 3)}  |  ${pad(dur, 6)}  |  ${s.runtime}`);
  }
  lines.push(`\n  Total: ${all.length} session(s)\n`);
  return lines.join('\n');
}
