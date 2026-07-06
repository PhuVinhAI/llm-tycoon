/**
 * session.test.ts — session lifecycle against a temp directory via
 * __setPathsForTests, so the real repo's logs/ is never touched.
 */
import { afterEach, expect, test } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  __setPathsForTests,
  closeSession,
  findPreviousSession,
  findSessionById,
  initSession,
  listHistoryFormatted,
  loadLessonsChain,
  setContinuedFrom,
  writeLessons,
  writeSave,
} from '../src/session/history.ts';

interface Ctx {
  dir: string;
  logsDir: string;
  historyPath: string;
}

let active: Ctx | null = null;

function setup(): Ctx {
  const dir = mkdtempSync(join(tmpdir(), 'llmt-sess-test-'));
  const logsDir = join(dir, 'logs');
  const historyPath = join(logsDir, 'history.json');
  mkdirSync(logsDir, { recursive: true });
  __setPathsForTests({ logsDir, historyPath });
  active = { dir, logsDir, historyPath };
  return active;
}

afterEach(() => {
  __setPathsForTests({ logsDir: undefined, historyPath: undefined });
  if (active) rmSync(active.dir, { recursive: true, force: true });
  active = null;
});

const CFG = () => ({
  runtime: { model: 'gpt-4' },
  player: { model: 'gpt-4' },
  maxTurns: 5,
});

test('initSession creates dir and history entry', async () => {
  setup();
  const sess = await initSession(CFG());
  expect(sess.id).toMatch(/^\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}_[a-f0-9]{8}$/);
  expect(existsSync(sess.dir)).toBe(true);
  const found = await findSessionById(sess.id);
  expect(found).toBeTruthy();
  expect(found?.runtime).toBe('gpt-4');
  expect(found?.player).toBe('gpt-4');
  expect(found?.maxTurns).toBe(5);
  expect(found?.endedAt).toBe(null);
});

test('closeSession writes endedAt + turns + totalMs', async () => {
  setup();
  const sess = await initSession(CFG());
  await closeSession(sess.id, { turns: 3, gameOver: true, totalMs: 42000 });
  const found = await findSessionById(sess.id);
  expect(found?.endedAt).toBeTruthy();
  expect(found?.turns).toBe(3);
  expect(found?.gameOver).toBe(true);
  expect(found?.totalMs).toBe(42000);
});

test('atomic write leaves no .tmp residue', async () => {
  setup();
  const sess = await initSession(CFG());
  const files = readdirSync(sess.dir);
  expect(files.some((f) => f.endsWith('.tmp'))).toBe(false);
});

test('writeLessons auto-increments without overwriting', async () => {
  setup();
  const sess = await initSession(CFG());
  await writeLessons(sess.dir, 'first lesson');
  await writeLessons(sess.dir, 'second lesson');
  await writeLessons(sess.dir, 'third lesson');

  const files = readdirSync(sess.dir)
    .filter((f) => /^lessons_\d+\.md$/.test(f))
    .sort();
  expect(files).toEqual(['lessons_1.md', 'lessons_2.md', 'lessons_3.md']);
  expect(readFileSync(join(sess.dir, 'lessons_1.md'), 'utf8')).toBe('first lesson');
  expect(readFileSync(join(sess.dir, 'lessons_2.md'), 'utf8')).toBe('second lesson');
  expect(readFileSync(join(sess.dir, 'lessons_3.md'), 'utf8')).toBe('third lesson');
});

test('writeSave persists content', async () => {
  setup();
  const sess = await initSession(CFG());
  await writeSave(sess.dir, 'save block content');
  expect(readFileSync(join(sess.dir, 'save.txt'), 'utf8')).toBe('save block content');
});

test('loadLessonsChain walks continuedFrom in chronological order', async () => {
  setup();
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
  expect(chain).toBeTruthy();
  const idxA = chain?.indexOf('A lesson') ?? -1;
  const idxB = chain?.indexOf('B lesson') ?? -1;
  const idxC = chain?.indexOf('C lesson') ?? -1;
  expect(idxA >= 0 && idxB >= 0 && idxC >= 0).toBe(true);
  expect(idxA).toBeLessThan(idxB);
  expect(idxB).toBeLessThan(idxC);
});

test('loadLessonsChain returns null when no lessons exist', async () => {
  setup();
  const a = await initSession(CFG());
  expect(await loadLessonsChain(a.id)).toBe(null);
});

test('loadLessonsChain tolerates cycles', async () => {
  const ctx = setup();
  const a = await initSession(CFG());
  await writeLessons(a.dir, 'A lesson');
  const data = JSON.parse(readFileSync(ctx.historyPath, 'utf8'));
  const entryA = data.find((h: { id: string }) => h.id === a.id);
  entryA.continuedFrom = a.id;
  await writeFile(ctx.historyPath, JSON.stringify(data));

  const chain = await loadLessonsChain(a.id);
  expect(chain).toBeTruthy();
  expect(chain?.includes('A lesson')).toBe(true);
});

test('findPreviousSession returns most-recent closed session, excluding self', async () => {
  setup();
  const a = await initSession(CFG());
  await closeSession(a.id, { turns: 1, gameOver: true, totalMs: 1000 });

  await new Promise((r) => setTimeout(r, 15));

  const b = await initSession(CFG());
  const prev = await findPreviousSession(b.id);
  expect(prev?.id).toBe(a.id);

  expect(await findPreviousSession(a.id)).toBe(null);
});

test('listHistoryFormatted reports empty repo gracefully', async () => {
  setup();
  const out = await listHistoryFormatted();
  expect(out.includes('no sessions')).toBe(true);
});
