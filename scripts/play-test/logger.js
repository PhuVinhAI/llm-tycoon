/**
 * logger.js — two loggers used by game.js:
 *
 *  - SessionLog: append-only JSONL file (`<sessionDir>/game.jsonl`).
 *      Each `write()` is `appendFile()` — O(1) per call. The previous
 *      version rewrote the whole JSON array on every turn, growing O(N²)
 *      over a long session. JSONL is the standard fix for this exact shape.
 *      Optional in-memory tail keeps the last N entries available for
 *      debugging live UI without re-reading the file.
 *
 *  - DebugLog: one JSON file per recorded event under
 *      `<sessionDir>/debug/NNN_<timestamp>_<label>.json`. Lazy initialisation
 *      sets `idx` to the count of existing files so a resume doesn't
 *      overwrite earlier debug snapshots.
 */

import {
  mkdir, appendFile, writeFile, readdir,
} from 'node:fs/promises';
import { join, dirname } from 'node:path';

export class SessionLog {
  /**
   * @param {string} path absolute path to game.jsonl
   * @param {{ tail?: number }} [opts]
   */
  constructor(path, { tail = 0 } = {}) {
    this.path = path;
    this.tailCapacity = tail;
    /** @type {Array<object>} */
    this.entries = [];
  }

  async init() {
    await mkdir(dirname(this.path), { recursive: true });
  }

  /**
   * Append one record. Returns the record that was persisted.
   * @param {object} entry
   */
  async write(entry) {
    const rec = { ts: new Date().toISOString(), ...entry };
    await appendFile(this.path, JSON.stringify(rec) + '\n');
    if (this.tailCapacity > 0) {
      this.entries.push(rec);
      if (this.entries.length > this.tailCapacity) this.entries.shift();
    }
    return rec;
  }
}

export class DebugLog {
  /**
   * @param {string} dir absolute path to the debug directory
   */
  constructor(dir) {
    this.dir = dir;
    this.idx = 0;
    this.ready = false;
  }

  async init() {
    await mkdir(this.dir, { recursive: true });
    // Resume: start counter after existing files so we don't clobber.
    try {
      const files = await readdir(this.dir);
      this.idx = files.filter((f) => f.endsWith('.json')).length;
    } catch {
      this.idx = 0;
    }
    this.ready = true;
  }

  /**
   * Write one debug record. Errors are swallowed so debug logging never
   * masks a real API error.
   * @param {string} label short tag like 'request' / 'response' / 'error'
   * @param {object} data
   */
  async write(label, data) {
    if (!this.ready) return;
    this.idx++;
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const file = join(this.dir, `${String(this.idx).padStart(3, '0')}_${ts}_${label}.json`);
    try {
      await writeFile(file, JSON.stringify(data, null, 2));
    } catch {
      /* never mask the real error */
    }
  }
}
