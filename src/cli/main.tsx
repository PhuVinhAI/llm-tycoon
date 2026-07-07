#!/usr/bin/env bun

/**
 * main.tsx — the single CLI entry. One binary, three subcommands:
 *   build   → assemble the game docs (no AI)
 *   history → print session history (no AI)
 *   play    → run the play-test; React Ink on a TTY, plain console otherwise
 *
 * Signal handling lives here (NOT in the engine): SIGINT/SIGTERM abort a shared
 * AbortController, the engine flushes state in its `finally`, and the process
 * exit code is decided from the outcome.
 */

import { existsSync } from 'node:fs';
import { render } from 'ink';
import React from 'react';
import { runBuild } from '../build/build.ts';
import { loadConfig } from '../config/env.ts';
import { PATHS } from '../config/paths.ts';
import type { RunMode } from '../engine/events.ts';
import { runHistory, runPlain } from '../renderers/plain.ts';
import { App } from './App.tsx';
import { parseCli } from './flags.ts';

async function main(): Promise<void> {
  const parsed = parseCli();

  if (parsed.command === 'build') {
    runBuild({ keepComments: parsed.keepComments });
    return;
  }

  if (parsed.command === 'history') {
    await runHistory();
    return;
  }

  // ── play ──────────────────────────────────────────────────────────────────
  const config = loadConfig();

  // Resolve 'auto': resume if a saved state exists, else new.
  const mode: RunMode =
    parsed.mode === 'auto' ? (existsSync(PATHS.state) ? 'resume' : 'new') : parsed.mode;

  const useInk = process.stdout.isTTY && !parsed.plain && !process.env.CI;

  if (useInk) {
    const { waitUntilExit } = render(
      React.createElement(App, { config, initialMode: parsed.mode === 'auto' ? 'menu' : mode }),
    );
    await waitUntilExit();
    return;
  }

  // Headless: wire signals to an AbortController, run the plain renderer.
  const controller = new AbortController();
  const onSignal = (reason: string) => () => controller.abort(reason);
  const sigint = onSignal('SIGINT');
  const sigterm = onSignal('SIGTERM');
  process.on('SIGINT', sigint);
  process.on('SIGTERM', sigterm);
  try {
    const runOpts = {
      mode,
      config,
      signal: controller.signal,
      ...(parsed.sessionId ? { sessionId: parsed.sessionId } : {}),
    };
    const code = await runPlain(runOpts);
    process.exitCode = code;
  } finally {
    process.off('SIGINT', sigint);
    process.off('SIGTERM', sigterm);
  }
}

main().catch((err) => {
  console.error('❌ Lỗi nghiêm trọng:', err instanceof Error ? err.message : String(err));
  if (process.env.DEBUG && err instanceof Error) console.error(err.stack);
  process.exit(1);
});
