#!/usr/bin/env node
/**
 * LLM Tycoon — Play Test
 *
 * npm run play              # auto-detect: resume if state exists, else new
 * npm run play -- --new     # force new
 * npm run play -- --resume  # force resume
 */

import { existsSync } from 'node:fs';
import { STATE_PATH, FLAG_NEW, FLAG_RESUME } from './config.js';
import { runGame } from './game.js';

let mode = 'new';

if (FLAG_RESUME) {
  mode = 'resume';
} else if (!FLAG_NEW && existsSync(STATE_PATH)) {
  mode = 'resume';
  console.log('🔍 Saved state found, resuming...');
}

runGame(mode).catch((err) => {
  console.error('❌ Fatal:', err.message);
  process.exit(1);
});
