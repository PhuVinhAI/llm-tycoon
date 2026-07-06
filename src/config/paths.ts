/**
 * paths.ts — single source of truth for on-disk locations.
 *
 * Root is resolved relative to this file (src/config/ → repo root is two up),
 * so no other module hard-codes `../..` depth. Build output, logs, and the
 * root-level state files keep their historical locations for tooling parity.
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(HERE, '..', '..');

export interface Paths {
  root: string;
  env: string;
  state: string;
  result: string;
  logs: string;
  history: string;
  gameDoc: string;
}

export const PATHS: Readonly<Paths> = Object.freeze({
  root: ROOT,
  env: join(ROOT, '.env'),
  state: join(ROOT, 'game_state.json'),
  result: join(ROOT, 'game_result.json'),
  logs: join(ROOT, 'logs'),
  history: join(ROOT, 'logs', 'history.json'),
  gameDoc: join(ROOT, 'build', 'LLM-TYCOON.md'),
});
