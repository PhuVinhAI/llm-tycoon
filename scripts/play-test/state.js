/**
 * state.js — atomic game-state persistence.
 *
 * Why atomic write: the previous version wrote `game_state.json` directly on
 * SIGINT. A simultaneous power loss / OOM crash between write-open and
 * write-close could leave the user with a half-written JSON they can't
 * resume from. We now always write to `<path>.tmp` then `rename`, so the
 * actual path is either fully present or fully absent.
 */

import { readFile, writeFile, unlink, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { STATE_PATH } from './config.js';

/**
 * Read + parse `game_state.json`, returning null on missing OR corrupt file.
 * The previous version silently fell back to null on parse errors — we keep
 * the same behaviour here for ergonomic resume, but log a hint so the user
 * notices.
 *
 * @returns {Promise<object|null>}
 */
export async function loadState() {
  if (!existsSync(STATE_PATH)) return null;
  try {
    return JSON.parse(await readFile(STATE_PATH, 'utf8'));
  } catch (err) {
    console.warn(`⚠️  game_state.json present but unparseable: ${err.message}`);
    return null;
  }
}

/**
 * Atomic JSON write: serialise → temp file → rename. Caller passes the full
 * data object; we own the format.
 *
 * @param {string} path absolute path
 * @param {unknown} data anything JSON-serialisable
 */
export async function saveAtomic(path, data) {
  const tmp = `${path}.tmp`;
  await writeFile(tmp, JSON.stringify(data, null, 2));
  await rename(tmp, path);
}

/**
 * Convenience: delete the state file (used when a game-over writes a
 * terminal result and we don't want a stale resume session).
 */
export async function deleteState() {
  if (existsSync(STATE_PATH)) {
    await unlink(STATE_PATH);
  }
}
