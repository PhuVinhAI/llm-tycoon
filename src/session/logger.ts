/**
 * logger.ts — two loggers used by the engine:
 *
 *  - SessionLog: append-only JSONL (`<sessionDir>/game.jsonl`). Each write is an
 *    O(1) appendFile (the previous whole-array rewrite was O(N²) per session).
 *    An optional in-memory tail keeps the last N entries for live views.
 *
 *  - DebugLog: one JSON file per event under `<sessionDir>/debug/`. Lazy init
 *    sets `idx` past existing files so a resume doesn't overwrite snapshots.
 */

import { appendFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { DebugSink } from '../ai/call.ts';

export interface LogEntry {
  type: string;
  [key: string]: unknown;
}

export class SessionLog {
  readonly path: string;
  private readonly tailCapacity: number;
  readonly entries: Array<LogEntry & { ts: string }> = [];

  constructor(path: string, opts: { tail?: number } = {}) {
    this.path = path;
    this.tailCapacity = opts.tail ?? 0;
  }

  async init(): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true });
  }

  /** Append one record (timestamp prepended). Returns the persisted record. */
  async write(entry: LogEntry): Promise<LogEntry & { ts: string }> {
    const rec = { ts: new Date().toISOString(), ...entry };
    await appendFile(this.path, `${JSON.stringify(rec)}\n`);
    if (this.tailCapacity > 0) {
      this.entries.push(rec);
      if (this.entries.length > this.tailCapacity) this.entries.shift();
    }
    return rec;
  }
}

export class DebugLog implements DebugSink {
  readonly dir: string;
  private idx = 0;
  private ready = false;

  constructor(dir: string) {
    this.dir = dir;
  }

  async init(): Promise<void> {
    await mkdir(this.dir, { recursive: true });
    try {
      const files = await readdir(this.dir);
      this.idx = files.filter((f) => f.endsWith('.json')).length;
    } catch {
      this.idx = 0;
    }
    this.ready = true;
  }

  /** Write one debug record. Errors are swallowed so debug never masks a real error. */
  async write(label: string, data: object): Promise<void> {
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
