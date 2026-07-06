#!/usr/bin/env node
/**
 * index.js — CLI entry point.
 *
 * Modes (in dispatch order):
 *   --history / -h         : print session history, no AI calls
 *   --continue / -c [id]   : continue from a previous session's save + lessons
 *   --resume [id]          : resume from saved game_state.json (in-place)
 *   --new                  : fresh session
 *   (default)              : if game_state.json exists → resume; else new
 *
 * Behaviour preserved from the previous version EXCEPT:
 *   - If auto-detect finds a saved state whose gameDocHash doesn't match
 *     the freshly-built LLM-TYCOON.md, we no longer crash; we degrade to
 *     a fresh `--new` session with a warning (game.js handles that).
 */

import { existsSync } from 'node:fs';
import {
  STATE_PATH, FLAG_NEW, FLAG_RESUME, FLAG_CONTINUE, FLAG_HISTORY,
} from './config.js';
import { runGame } from './game.js';

let mode = 'new';

if (FLAG_HISTORY) {
  mode = 'history';
} else if (FLAG_CONTINUE) {
  mode = 'continue';
} else if (FLAG_RESUME) {
  mode = 'resume';
} else if (!FLAG_NEW && existsSync(STATE_PATH)) {
  mode = 'resume';
  console.log('🔍 Saved state found, resuming...');
}

runGame(mode).catch((err) => {
  console.error('❌ Fatal:', err.message);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
