/**
 * events.ts — the engine ↔ renderer contract.
 *
 * `runEngine()` yields these typed events; both the Ink renderer and the plain
 * console renderer consume the identical stream. Events are OBSERVATIONAL — the
 * engine still owns state and disk IO; dropping an event never corrupts a game.
 */

import type { Fallback } from '../ai/call.ts';
import type { Usage } from './tokens.ts';

export type Speaker = 'runtime' | 'player';
export type RunMode = 'new' | 'continue' | 'resume';
export type EnginePhase = 'init' | 'playing' | 'finalising' | 'done';

export interface TokenSnapshot {
  runtimePrompt: number;
  runtimeCompletion: number;
  playerPrompt: number;
  playerCompletion: number;
  limit: number;
}

export type EngineEvent =
  | {
      type: 'run_start';
      mode: RunMode;
      runtimeModel: string;
      playerModel: string;
      maxTurns: number;
      sessionId: string;
      gameDocKB: number;
    }
  | { type: 'runtime_init'; content: string; usage: Usage | null; fallback: Fallback }
  | { type: 'resumed'; turn: number; lastResponse: string }
  | { type: 'turn_start'; turn: number }
  | {
      type: 'player_action';
      turn: number;
      content: string;
      usage: Usage | null;
      fallback: Fallback;
    }
  | {
      type: 'engine_result';
      turn: number;
      content: string;
      usage: Usage | null;
      fallback: Fallback;
      turnMs: number;
    }
  | { type: 'tokens'; turn: number; snapshot: TokenSnapshot }
  | { type: 'trim'; who: Speaker; turn: number; newPrompt: number }
  | { type: 'retry'; who: Speaker; attempt: number; ceil: number; waitMs: number; reason: string }
  | { type: 'retry_progress'; who: Speaker; elapsedMs: number; totalMs: number }
  | { type: 'autosave'; turn: number }
  | { type: 'interrupt'; reason: string; turn: number }
  | { type: 'save'; block: string | null; raw: string }
  | { type: 'lessons'; content: string; path: string | null }
  | { type: 'phase'; phase: EnginePhase }
  | { type: 'game_over'; turn: number }
  | { type: 'error'; who: Speaker | 'system'; turn: number; message: string; fatal: boolean }
  | {
      type: 'run_end';
      turns: number;
      gameOver: boolean;
      totalMs: number;
      resultPath: string | null;
    };

export type EngineEventType = EngineEvent['type'];
