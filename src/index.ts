/**
 * index.ts — library surface. Re-exports the stable building blocks so tests
 * and any embedder can import from one place without reaching into subpaths.
 */

export { assemble, orderMarkdown } from './build/assemble.ts';
export { runBuild } from './build/build.ts';
export { MANIFEST } from './build/manifest.ts';
export { type AppConfig, loadConfig, loadEnv } from './config/env.ts';
export { PATHS } from './config/paths.ts';
export { type RunEngineOptions, runEngine } from './engine/engine.ts';
export type { EngineEvent, RunMode } from './engine/events.ts';
export { runHistory, runPlain } from './renderers/plain.ts';
