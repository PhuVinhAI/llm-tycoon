/**
 * assemble.ts — PURE assembly logic (no direct fs). The caller injects a
 * file-reader and directory-lister so this module is fully unit-testable and
 * the build output can be asserted byte-for-byte against a golden fixture.
 *
 * Semantics are identical to the original build.js:
 *  - read: normalise CRLF → LF.
 *  - listDir: *.md except README.md, default lexicographic sort.
 *  - clean: strip HTML comments (unless keepComments), collapse 3+ blank lines,
 *    trim ends.
 *  - assemble: `---\n\n# TITLE` banners, pieces joined by '\n\n', trailing '\n'.
 */

import type { ManifestEntry } from './manifest.ts';

export interface AssembleIO {
  /** Read a repo-relative file as UTF-8. */
  read(relPath: string): string;
  /** List *.md in a repo-relative dir (README excluded), sorted, as relPaths. */
  listDir(relDir: string): string[];
}

export interface AssembleResult {
  output: string;
  fileCount: number;
}

/** Clean one module's markdown before joining. */
export function clean(markdown: string, keepComments: boolean): string {
  let text = markdown;
  if (!keepComments) text = text.replace(/<!--[\s\S]*?-->/g, '');
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

/** Filter + sort a raw directory listing the way the build expects. */
export function orderMarkdown(files: string[], relDir: string): string[] {
  return files
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort()
    .map((f) => `${relDir}/${f}`);
}

/** Assemble one build variant from the manifest using injected IO. */
export function assemble(
  manifest: readonly ManifestEntry[],
  io: AssembleIO,
  opts: { includeDev: boolean; keepComments: boolean },
): AssembleResult {
  const pieces: string[] = [];
  let fileCount = 0;
  for (const entry of manifest) {
    if (entry.devOnly && !opts.includeDev) continue;
    const files = entry.dir ? io.listDir(entry.dir) : entry.file ? [entry.file] : [];
    if (files.length === 0) continue;
    if (entry.title) pieces.push(`---\n\n# ${entry.title}`);
    for (const f of files) {
      pieces.push(clean(io.read(f), opts.keepComments));
      fileCount++;
    }
  }
  return { output: `${pieces.join('\n\n')}\n`, fileCount };
}
