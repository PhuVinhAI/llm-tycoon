/**
 * useEngine.ts — subscribes to runEngine()'s event stream and folds it into the
 * view model via useReducer. Returns the current view state; the Dashboard
 * renders it. An AbortController (wired to Ctrl-C by App) lets the caller stop
 * the run cleanly.
 */

import { useEffect, useReducer } from 'react';
import type { AppConfig } from '../../config/env.ts';
import { runEngine } from '../../engine/engine.ts';
import type { RunMode } from '../../engine/events.ts';
import { type EngineViewState, engineReducer, initialViewState } from '../state/engineReducer.ts';

export interface UseEngineOptions {
  mode: RunMode;
  config: AppConfig;
  sessionId?: string;
  /** Shared controller so App can abort on Ctrl-C. */
  controller: AbortController;
}

export function useEngine(opts: UseEngineOptions): EngineViewState {
  const [state, dispatch] = useReducer(engineReducer, initialViewState);

  // biome-ignore lint/correctness/useExhaustiveDependencies: engine run starts once per mounted Dashboard; opts captured intentionally.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const runOpts = {
          mode: opts.mode,
          config: opts.config,
          signal: opts.controller.signal,
          ...(opts.sessionId ? { sessionId: opts.sessionId } : {}),
        };
        for await (const ev of runEngine(runOpts)) {
          if (cancelled) break;
          dispatch(ev);
        }
      } catch {
        // Fatal engine failures surface as `error`/`run_end` events; a thrown
        // error here is a last-resort guard so the UI doesn't crash.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
