/**
 * engineReducer.ts — folds the engine's event stream into a flat view model
 * the Ink dashboard renders. PURE function (no React, no IO) so it can be
 * unit-tested by replaying a recorded event array. Unknown event types are
 * ignored (forward-compatible).
 */

import type { EngineEvent, EnginePhase, Speaker, TokenSnapshot } from '../../engine/events.ts';

export interface TranscriptLine {
  seq: number;
  who: Speaker;
  text: string;
  turn: number;
}

export interface ActivityState {
  who: Speaker | null;
  kind: 'idle' | 'thinking' | 'retrying';
  retry?: { attempt: number; ceil: number; elapsedMs: number; totalMs: number };
}

export interface EngineViewState {
  phase: EnginePhase;
  turn: number;
  maxTurns: number;
  sessionId: string;
  runtimeModel: string;
  playerModel: string;
  transcript: TranscriptLine[];
  /** Monotonic id for transcript lines — gives React a stable key. */
  lineSeq: number;
  tokens: TokenSnapshot;
  activity: ActivityState;
  trims: number;
  autosaves: number;
  errors: string[];
  gameOver: boolean;
  saveWritten: boolean;
  lessonsPath: string | null;
  finished: boolean;
  result: { turns: number; totalMs: number; resultPath: string | null } | null;
}

/** Keep the transcript bounded so a long game doesn't grow memory unboundedly. */
const TRANSCRIPT_CAP = 200;

export const initialViewState: EngineViewState = {
  phase: 'init',
  turn: 0,
  maxTurns: 0,
  sessionId: '',
  runtimeModel: '',
  playerModel: '',
  transcript: [],
  lineSeq: 0,
  tokens: {
    runtimePrompt: 0,
    runtimeCompletion: 0,
    playerPrompt: 0,
    playerCompletion: 0,
    limit: 0,
  },
  activity: { who: null, kind: 'idle' },
  trims: 0,
  autosaves: 0,
  errors: [],
  gameOver: false,
  saveWritten: false,
  lessonsPath: null,
  finished: false,
  result: null,
};

/**
 * Append a transcript line with a stable `seq` id, returning the partial state
 * patch (bounded transcript + advanced counter).
 */
function addLine(
  state: EngineViewState,
  line: Omit<TranscriptLine, 'seq'>,
): Pick<EngineViewState, 'transcript' | 'lineSeq'> {
  const seq = state.lineSeq + 1;
  const next = [...state.transcript, { ...line, seq }];
  return {
    transcript: next.length > TRANSCRIPT_CAP ? next.slice(next.length - TRANSCRIPT_CAP) : next,
    lineSeq: seq,
  };
}

export function engineReducer(state: EngineViewState, ev: EngineEvent): EngineViewState {
  switch (ev.type) {
    case 'run_start':
      return {
        ...state,
        maxTurns: ev.maxTurns,
        sessionId: ev.sessionId,
        runtimeModel: ev.runtimeModel,
        playerModel: ev.playerModel,
      };
    case 'phase':
      return { ...state, phase: ev.phase };
    case 'runtime_init':
      return {
        ...state,
        ...addLine(state, { who: 'runtime', text: ev.content, turn: 0 }),
        activity: { who: null, kind: 'idle' },
      };
    case 'resumed':
      return {
        ...state,
        turn: ev.turn,
        ...addLine(state, { who: 'runtime', text: ev.lastResponse, turn: ev.turn }),
      };
    case 'turn_start':
      return { ...state, turn: ev.turn, activity: { who: 'player', kind: 'thinking' } };
    case 'player_action':
      return {
        ...state,
        ...addLine(state, { who: 'player', text: ev.content, turn: ev.turn }),
        activity: { who: 'runtime', kind: 'thinking' },
      };
    case 'engine_result':
      return {
        ...state,
        ...addLine(state, { who: 'runtime', text: ev.content, turn: ev.turn }),
        activity: { who: null, kind: 'idle' },
      };
    case 'tokens':
      return { ...state, tokens: ev.snapshot };
    case 'trim':
      return { ...state, trims: state.trims + 1 };
    case 'retry':
      return {
        ...state,
        activity: {
          who: ev.who,
          kind: 'retrying',
          retry: { attempt: ev.attempt, ceil: ev.ceil, elapsedMs: 0, totalMs: ev.waitMs },
        },
      };
    case 'retry_progress':
      return state.activity.kind === 'retrying' && state.activity.retry
        ? {
            ...state,
            activity: {
              ...state.activity,
              retry: { ...state.activity.retry, elapsedMs: ev.elapsedMs, totalMs: ev.totalMs },
            },
          }
        : state;
    case 'autosave':
      return { ...state, autosaves: state.autosaves + 1 };
    case 'game_over':
      return { ...state, gameOver: true };
    case 'save':
      return { ...state, saveWritten: ev.block !== null || ev.raw.length > 0 };
    case 'lessons':
      return { ...state, lessonsPath: ev.path };
    case 'interrupt':
      return { ...state, errors: [...state.errors, `Đã dừng: ${ev.reason}`] };
    case 'error':
      return { ...state, errors: [...state.errors, ev.message] };
    case 'run_end':
      return {
        ...state,
        finished: true,
        gameOver: ev.gameOver,
        activity: { who: null, kind: 'idle' },
        result: { turns: ev.turns, totalMs: ev.totalMs, resultPath: ev.resultPath },
      };
    default:
      return state;
  }
}
