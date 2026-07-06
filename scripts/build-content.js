/**
 * Build only PART 4 — CONTENT (game data) for external verification.
 * Output: build/CONTENT.md
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'build');
mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(join(ROOT, 'content'))
  .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
  .sort()
  .map((f) => join(ROOT, 'content', f));

let text = files
  .map((f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n'))
  .map((md) => md.replace(/<!--[\s\S]*?-->/g, '').replace(/\n{3,}/g, '\n\n').trim())
  .join('\n\n') + '\n';

const outPath = join(OUT_DIR, 'CONTENT.md');
writeFileSync(outPath, text, 'utf8');

const bytes = Buffer.byteLength(text, 'utf8');
console.log(`✅ build/CONTENT.md — ${files.length} files, ${(bytes / 1024).toFixed(1)} KB, ~${Math.round(bytes / 4).toLocaleString()} tokens`);
