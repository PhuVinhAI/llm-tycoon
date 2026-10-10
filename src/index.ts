/**
 * index.ts — library surface. Re-exports the stable building blocks so tests
 * and any embedder can import from one place without reaching into subpaths.
 */

export { assemblePackage } from './build/assemble.ts';
export { runBuild } from './build/build.ts';
export { MANIFEST } from './build/manifest.ts';
export { zipPackage } from './build/zip.ts';
export { PATHS } from './config/paths.ts';
