import { appendFileSync } from 'node:fs';
import { LOG_PATH, GAME_CONFIG } from './config.js';

export function log(entry) {
  const line = JSON.stringify({ ts: new Date().toISOString(), ...entry });
  appendFileSync(LOG_PATH, line + '\n');
  if (GAME_CONFIG.verbose) {
    const preview = typeof entry.data === 'string' ? entry.data : JSON.stringify(entry.data || '');
    console.log(`  [${entry.type}] ${preview.slice(0, 200)}`);
  }
}

export function logTurn(turnNum, data) {
  log({ type: 'turn', turn: turnNum, ...data });
}
