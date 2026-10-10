/** Build the 1.0 folder and ZIP with README.md at the archive root. */
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { PATHS } from '../config/paths.ts';
import { assemblePackage, type PackageIO } from './assemble.ts';
import { MANIFEST, PACKAGE_NAME } from './manifest.ts';
import { zipPackage } from './zip.ts';

const io: PackageIO = {
  read: (path) => readFileSync(join(PATHS.root, path), 'utf8'),
  list: (path) =>
    readdirSync(join(PATHS.root, path), { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name),
};

export interface BuildOptions {
  keepComments?: boolean;
  outputRoot?: string;
}

export function runBuild(opts: BuildOptions = {}): void {
  const version = (JSON.parse(io.read('package.json')) as { version: string }).version;
  const files = assemblePackage(MANIFEST, io, version, opts.keepComments ?? false);
  const root = resolve(opts.outputRoot ?? join(PATHS.root, 'build', PACKAGE_NAME));
  const indexPath = join(root, 'package-index.json');
  if (existsSync(indexPath)) {
    const previous = JSON.parse(readFileSync(indexPath, 'utf8')) as {
      files: Array<{ path: string }>;
    };
    const current = new Set(files.map((file) => file.path));
    for (const file of previous.files) {
      if (current.has(file.path)) continue;
      if (
        !file.path ||
        file.path.includes('\\') ||
        file.path.includes(':') ||
        file.path.startsWith('/') ||
        file.path.split('/').some((part) => !part || part === '.' || part === '..') ||
        !/\.(md|json|py)$/.test(file.path) ||
        file.path.startsWith('session/')
      ) {
        throw new Error(`Unsafe previous package path: ${file.path}`);
      }
      // Only retire files recorded in the previous release inventory, never session data.
      rmSync(join(root, file.path), { force: true });
    }
    // Remove empty directories only; unknown files and player progress remain intact.
    const removeEmpty = (directory: string): void => {
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.isDirectory() && entry.name !== 'session')
          removeEmpty(join(directory, entry.name));
      }
      if (directory !== root && readdirSync(directory).length === 0) rmdirSync(directory);
    };
    removeEmpty(root);
  }
  for (const file of files) {
    const destination = join(root, file.path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, file.content, 'utf8');
  }
  // Session files are created only during play and never read into release archives.
  const zipPath = join(dirname(root), `${basename(root)}.zip`);
  const zip = zipPackage(files);
  writeFileSync(zipPath, zip);
  console.log(
    `LLM Tycoon v${version}: ${files.length} files, ${(zip.length / 1024).toFixed(1)} KB ZIP`,
  );
  console.log(`build/${PACKAGE_NAME}/README.md — map toàn bộ file`);
  console.log(`build/${PACKAGE_NAME}.zip — README.md nằm ngay ở gốc ZIP`);
}
