/**
 * build.ts — the `build` subcommand: assemble the game docs and write them to
 * build/, printing size/token stats and leak warnings to the console.
 *
 * IO is wired here (fs); all assembly logic lives in the pure assemble.ts.
 */

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PATHS } from '../config/paths.ts';
import { type AssembleIO, assemble, orderMarkdown } from './assemble.ts';
import { MANIFEST, TARGETS } from './manifest.ts';

const OUT_DIR = join(PATHS.root, 'build');

const io: AssembleIO = {
  read: (relPath) => readFileSync(join(PATHS.root, relPath), 'utf8').replace(/\r\n/g, '\n'),
  listDir: (relDir) => orderMarkdown(readdirSync(join(PATHS.root, relDir)), relDir),
};

export interface BuildOptions {
  keepComments: boolean;
}

/** Run the full build (both targets), writing to build/ and logging stats. */
export function runBuild(opts: BuildOptions): void {
  const version = JSON.parse(io.read('package.json')).version as string;
  mkdirSync(OUT_DIR, { recursive: true });

  const mode = opts.keepComments
    ? 'GIỮ comment (chỉ để review — đừng gửi bản này cho LLM)'
    : 'sạch comment (bản chuẩn để gửi cho LLM)';
  console.log(`✅ Build xong (nguồn v${version}) — chế độ: ${mode}`);

  for (const target of TARGETS) {
    const { output, fileCount } = assemble(MANIFEST, io, {
      includeDev: target.includeDev,
      keepComments: opts.keepComments,
    });
    writeFileSync(join(OUT_DIR, target.file), output, 'utf8');

    const bytes = Buffer.byteLength(output, 'utf8');
    const words = output.split(/\s+/).length;
    console.log(`   build/${target.file} — ${target.label}`);
    console.log(
      `     ${fileCount} module | ${(bytes / 1024).toFixed(1)} KB | ~${words.toLocaleString()} từ | ~${Math.round(bytes / 4).toLocaleString()} token (ước lượng)`,
    );
    if (!opts.keepComments && output.includes('<!--')) {
      console.warn(
        `   ⚠ Cảnh báo: build/${target.file} vẫn còn chuỗi "<!--" — kiểm tra lại nguồn.`,
      );
    }
    if (!target.includeDev && /dev mode|devstate|DEV REPORT/i.test(output)) {
      console.warn(
        `   ⚠ Cảnh báo: build/${target.file} (bản chuẩn) vẫn nhắc đến Dev Mode — kiểm tra lại nguồn.`,
      );
    }
  }
}
