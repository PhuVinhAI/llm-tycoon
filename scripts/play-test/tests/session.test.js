/**
 * tests/session.test.js — exercises the session lifecycle against a temp
 * directory. Uses `__setPathsForTests` to redirect IO away from the real
 * repo's history.json, so these tests are safe to run on a developer
 * machine that has live sessions.
 *
 * Verifies a handful of bug fixes:
 *  - Atomic writes (.tmp + rename) leave no .tmp residue on success.
 *  - `writeLessons` auto-increments — never overwrites an existing file.
 *  - `loadLessonsChain` walks `continuedFrom` in chronological order.
 *  - On resume, listings exclude the current session.
 */
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  mkdtempSync, rmSync, mkdirSync, readFileSync, readdirSync, existsSync,
} from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  initSession, closeSession, findSessionById,
  writeLessons, setContinuedFrom, loadLessonsChain,
  writeSave, findPreviousSession, listHistoryFormatted,
  __setPathsForTests,
} from '../session.js';

function setup() {
  const dir = mkdtempSync(join(tmpdir(), 'llmt-sess-test-'));
  const logsDir = join(dir, 'logs');
  const historyPath = join(logsDir, 'history.json');
  mkdirSync(logsDir, { recursive: true });
  __setPathsForTests({ logsDir, historyPath });
  return {
    dir, logsDir, historyPath,
    cleanup: () => {
      __setPathsForTests({ logsDir: undefined, historyPath: undefined });
      rmSync(dir, { recursive: true, force: true });
    },
  };
}

const CFG = (id) => ({
  runtime: { model: 'gpt-4' },
  player: { model: 'gpt-4' },
  maxTurns: 5,
});

test('initSession creates dir and history entry', async () => {
  const ctx = setup();
  try {
    const sess = await initSession(CFG());
    assert.match(sess.id, /^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_[a-f0-9]{8}$/);
    assert.ok(existsSync(sess.dir));
    const found = await findSessionById(sess.id);
    assert.ok(found);
    assert.equal(found.runtime, 'gpt-4');
    assert.equal(found.player, 'gpt-4');
    assert.equal(found.maxTurns, 5);
    assert.equal(found.endedAt, null);
  } finally {
    ctx.cleanup();
  }
});

test('closeSession writes endedAt + turns + totalMs', async () => {
  const ctx = setup();
  try {
    const sess = await initSession(CFG());
    await closeSession(sess.id, { turns: 3, gameOver: true, totalMs: 42000 });
    const found = await findSessionById(sess.id);
    assert.ok(found.endedAt);
    assert.equal(found.turns, 3);
    assert.equal(found.gameOver, true);
    assert.equal(found.totalMs, 42000);
  } finally {
    ctx.cleanup();
  }
});

test('atomic write leaves no .tmp residue', async () => {
  const ctx = setup();
  try {
    const sess = await initSession(CFG());
    const dir = sess.dir;
    const files = readdirSync(dir);
    assert.ok(!files.some((f) => f.endsWith('.tmp')), '.tmp must not linger');
  } finally {
    ctx.cleanup();
  }
});

test('writeLessons auto-increments without overwriting (bug-fix: previous version could clobber)', async () => {
  const ctx = setup();
  try {
    const sess = await initSession(CFG());
    await writeLessons(sess.dir, 'first lesson');
    await writeLessons(sess.dir, 'second lesson');
    await writeLessons(sess.dir, 'third lesson');

    const files = readdirSync(sess.dir)
      .filter((f) => /^lessons_\d+\.md$/.test(f))
      .sort();
    assert.deepEqual(files, ['lessons_1.md', 'lessons_2.md', 'lessons_3.md']);

    assert.equal(readFileSync(join(sess.dir, 'lessons_1.md'), 'utf8'), 'first lesson');
    assert.equal(readFileSync(join(sess.dir, 'lessons_2.md'), 'utf8'), 'second lesson');
    assert.equal(readFileSync(join(sess.dir, 'lessons_3.md'), 'utf8'), 'third lesson');
  } finally {
    ctx.cleanup();
  }
});

test('writeSave persists content', async () => {
  const ctx = setup();
  try {
    const sess = await initSession(CFG());
    await writeSave(sess.dir, 'save block content');
    assert.equal(readFileSync(join(sess.dir, 'save.txt'), 'utf8'), 'save block content');
  } finally {
    ctx.cleanup();
  }
});

test('loadLessonsChain walks continuedFrom in chronological order', async () => {
  const ctx = setup();
  try {
    // A → B → C (C continues from B continues from A)
    const a = await initSession(CFG());
    await writeLessons(a.dir, 'A lesson');
    await closeSession(a.id, { turns: 1, gameOver: true, totalMs: 1000 });

    const b = await initSession(CFG());
    await setContinuedFrom(b.id, a.id);
    await writeLessons(b.dir, 'B lesson');
    await closeSession(b.id, { turns: 2, gameOver: true, totalMs: 2000 });

    const c = await initSession(CFG());
    await setContinuedFrom(c.id, b.id);
    await writeLessons(c.dir, 'C lesson');

    const chain = await loadLessonsChain(c.id);
    assert.ok(chain);
    const idxA = chain.indexOf('A lesson');
    const idxB = chain.indexOf('B lesson');
    const idxC = chain.indexOf('C lesson');
    assert.ok(idxA >= 0 && idxB >= 0 && idxC >= 0);
    assert.ok(idxA < idxB, 'A appears before B');
    assert.ok(idxB < idxC, 'B appears before C');
  } finally {
    ctx.cleanup();
  }
});

test('loadLessonsChain returns null when no lessons exist', async () => {
  const ctx = setup();
  try {
    const a = await initSession(CFG());
    assert.equal(await loadLessonsChain(a.id), null);
  } finally {
    ctx.cleanup();
  }
});

test('loadLessonsChain tolerates cycles (e.g. corrupt continuedFrom loop)', async () => {
  const ctx = setup();
  try {
    const a = await initSession(CFG());
    await writeLessons(a.dir, 'A lesson');
    // Manually create a cycle in history.json
    const { writeFile } = await import('node:fs/promises');
    const data = JSON.parse(readFileSync(ctx.historyPath, 'utf8'));
    const entryA = data.find((h) => h.id === a.id);
    entryA.continuedFrom = a.id; // cycle
    await writeFile(ctx.historyPath, JSON.stringify(data));

    const chain = await loadLessonsChain(a.id);
    assert.ok(chain);
    assert.ok(chain.includes('A lesson'));
    // Should not infinite-loop
  } finally {
    ctx.cleanup();
  }
});

test('findPreviousSession returns most-recent closed session, excluding self', async () => {
  const ctx = setup();
  try {
    const a = await initSession(CFG());
    await closeSession(a.id, { turns: 1, gameOver: true, totalMs: 1000 });

    await new Promise((r) => setTimeout(r, 15)); // ensure ts ordering

    const b = await initSession(CFG());
    const prev = await findPreviousSession(b.id);
    assert.ok(prev);
    assert.equal(prev.id, a.id);

    // Excluding b → next-most-recent
    const all = await findPreviousSession(a.id);
    assert.equal(all, null, 'no prior session exists');
  } finally {
    ctx.cleanup();
  }
});

test('listHistoryFormatted reports empty repo gracefully', async () => {
  const ctx = setup();
  try {
    const out = await listHistoryFormatted();
    assert.ok(out.includes('no sessions'));
  } finally {
    ctx.cleanup();
  }
});
