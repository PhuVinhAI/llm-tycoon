/**
 * state.ts — atomic game-state persistence.
 *
 * All writes go through `<path>.tmp` + rename, so the target file is either
 * fully present or fully absent — never a half-written JSON that can't resume.
 * Reads validate leniently through `StateSchema.safeParse`; a corrupt or
 * schema-drifted file yields null (the caller degrades to a new session)
 * rather than crashing a resume.
 */

import { existsSync } from 'node:fs';
import { readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { PATHS } from '../config/paths.ts';
import { type PersistedState, StateSchema } from './schema.ts';

/** Read + validate game_state.json. Returns null on missing/corrupt/invalid. */
export async function loadState(path: string = PATHS.state): Promise<PersistedState | null> {
  if (!existsSync(path)) return null;
  let raw: unknown;
  try {
    raw = JSON.parse(await readFile(path, 'utf8'));
  } catch (err) {
    console.warn(`⚠️  game_state.json present but unparseable: ${(err as Error).message}`);
    return null;
  }
  const parsed = StateSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn(
      `⚠️  game_state.json failed validation: ${parsed.error.issues[0]?.message ?? 'unknown'}`,
    );
    return null;
  }
  return parsed.data;
}

/** Atomic JSON write: serialise → temp file → rename. */
export async function saveAtomic(path: string, data: unknown): Promise<void> {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2));
  await rename(tmp, path);
}

/** Delete the state file (used when a game-over writes a terminal result). */
export async function deleteState(path: string = PATHS.state): Promise<void> {
  if (existsSync(path)) await unlink(path);
}
