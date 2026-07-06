import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { LOGS_DIR, HISTORY_PATH } from './config.js';

let _sessionId = null;
let _sessionDir = null;
let _sessionFile = null;
let _logEntries = [];
let _history = null;

// ─── History ──────────────────────────────────────────────────────────────
function loadHistory() {
  if (!existsSync(HISTORY_PATH)) return [];
  try { return JSON.parse(readFileSync(HISTORY_PATH, 'utf8')); }
  catch { return []; }
}

function saveHistory(list) {
  writeFileSync(HISTORY_PATH, JSON.stringify(list, null, 2));
}

function sortByDateDesc(list) {
  return list.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

// ─── Session ──────────────────────────────────────────────────────────────
export function initSession(runtime, player, maxTurns) {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toISOString().slice(11, 19).replace(/:/g, '-');
  const id = `${date}_${time}`;

  const dir = join(LOGS_DIR, date, id);
  mkdirSync(dir, { recursive: true });

  _sessionId = id;
  _sessionDir = dir;
  _sessionFile = join(dir, 'game.json');
  _logEntries = [];
  _history = loadHistory();

  _history.push({
    id,
    date,
    startedAt: now.toISOString(),
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
  saveHistory(_history);

  return { id, dir, file: _sessionFile };
}

export function closeSession(turns, gameOver, totalMs) {
  if (!_sessionId) return;

  // Write final log file
  if (_sessionFile && _logEntries.length > 0) {
    writeFileSync(_sessionFile, JSON.stringify(_logEntries, null, 2));
  }

  _history = loadHistory();
  const s = _history.find(h => h.id === _sessionId);
  if (s) {
    s.endedAt = new Date().toISOString();
    s.turns = turns;
    s.gameOver = gameOver;
    s.totalMs = totalMs;
  }
  saveHistory(_history);
  _sessionId = null;
}

// ─── Session Files ────────────────────────────────────────────────────────
export function setContinuedFrom(parentSessionId) {
  if (!_sessionId) return;
  _history = loadHistory();
  const s = _history.find(h => h.id === _sessionId);
  if (s) {
    s.continuedFrom = parentSessionId;
    saveHistory(_history);
  }
}

export function writeSave(content) {
  if (!_sessionDir) return;
  const data = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  writeFileSync(join(_sessionDir, 'save.txt'), data);
}

export function writeLessons(content) {
  if (!_sessionDir) return;
  // Find next lesson number
  let n = 1;
  while (existsSync(join(_sessionDir, `lessons_${n}.md`))) n++;
  writeFileSync(join(_sessionDir, `lessons_${n}.md`), content);
}

export function loadAllLessons(sessionDir) {
  const lessons = [];
  let n = 1;
  while (existsSync(join(sessionDir, `lessons_${n}.md`))) {
    lessons.push(readFileSync(join(sessionDir, `lessons_${n}.md`), 'utf8'));
    n++;
  }
  return lessons.length > 0 ? lessons.join('\n\n---\n\n') : null;
}

export function loadLessonsChain(sessionId) {
  const all = loadHistory();
  const collected = [];
  let currentId = sessionId;

  while (currentId) {
    const session = all.find(h => h.id === currentId);
    if (!session) break;
    const lessons = loadAllLessons(session.sessionDir);
    if (lessons) collected.unshift(lessons);
    currentId = session.continuedFrom || null;
  }

  return collected.length > 0 ? collected.join('\n\n---\n\n') : null;
}

export function getSessionDir() {
  return _sessionDir;
}

// ─── Find Sessions ────────────────────────────────────────────────────────
export function findSessionById(sessionId) {
  const all = loadHistory();
  return all.find(h => h.id === sessionId) || null;
}

export function findPreviousSession() {
  const all = sortByDateDesc(loadHistory());
  if (all.length < 2) return null;
  const prev = all.find(h => h.id !== _sessionId && h.endedAt);
  if (!prev) return null;
  return prev;
}

// ─── Logging ──────────────────────────────────────────────────────────────
export function log(entry) {
  _logEntries.push({ ts: new Date().toISOString(), ...entry });
  if (_sessionFile) {
    writeFileSync(_sessionFile, JSON.stringify(_logEntries, null, 2));
  }
}

export function logTurn(turnNum, data) {
  log({ type: 'turn', turn: turnNum, ...data });
}

// ─── History List ─────────────────────────────────────────────────────────
export function listHistory() {
  const all = sortByDateDesc(loadHistory());
  if (all.length === 0) {
    console.log('No sessions found.');
    return;
  }
  console.log('\n  📋 Session History\n');
  for (const s of all) {
    const dur = s.totalMs ? `${(s.totalMs / 1000).toFixed(0)}s` : 'running';
    const status = s.gameOver ? '✅' : s.endedAt ? '⏹️' : '▶️';
    const pad = (n, w) => String(n).padStart(w);
    console.log(`  ${status} ${s.id}  |  T${pad(s.turns, 3)}  |  ${pad(dur, 6)}  |  ${s.runtime}`);
  }
  console.log(`\n  Total: ${all.length} session(s)\n`);
}
