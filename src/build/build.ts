/** Build the 1.0 folder and ZIP with README.md at the archive root. */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
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
}

export function runBuild(opts: BuildOptions = {}): void {
  const version = (JSON.parse(io.read('package.json')) as { version: string }).version;
  const files = assemblePackage(MANIFEST, io, version, opts.keepComments ?? false);
  const root = join(PATHS.root, 'build', PACKAGE_NAME);
  for (const file of files) {
    const destination = join(root, file.path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, file.content, 'utf8');
  }
  // Mutable runtime data is never read into release archives or erased by a build.
  mkdirSync(join(root, 'runtime', 'state'), { recursive: true });
  mkdirSync(join(root, 'runtime', 'exports'), { recursive: true });
  const zipPath = join(PATHS.root, 'build', `${PACKAGE_NAME}.zip`);
  const zip = zipPackage(files);
  writeFileSync(zipPath, zip);
  console.log(
    `LLM Tycoon v${version}: ${files.length} files, ${(zip.length / 1024).toFixed(1)} KB ZIP`,
  );
  console.log(`build/${PACKAGE_NAME}/README.md — map toàn bộ file`);
  console.log(`build/${PACKAGE_NAME}.zip — README.md nằm ngay ở gốc ZIP`);
}
