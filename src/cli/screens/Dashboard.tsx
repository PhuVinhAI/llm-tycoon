import { Box, Text, useInput } from 'ink';
import type React from 'react';
import { useEffect } from 'react';
import type { AppConfig } from '../../config/env.ts';
import type { RunMode } from '../../engine/events.ts';
import { useEngine } from '../hooks/useEngine.ts';
import { ActivityLine, StatusBar } from '../ui/ActivityLine.tsx';
import { PhaseBadge, TurnCounter } from '../ui/StatusBits.tsx';
import { TokenMeter } from '../ui/TokenMeter.tsx';
import { TranscriptPane } from '../ui/TranscriptPane.tsx';

/**
 * The live play dashboard: header (session/models/phase/turn), the dual
 * transcript, token meters, activity line, and status bar. When the run ends
 * it calls `onFinish` so App can route to the summary screen.
 */
export function Dashboard(props: {
  mode: RunMode;
  config: AppConfig;
  sessionId?: string;
  controller: AbortController;
  onFinish: (summary: FinishSummary) => void;
}): React.ReactElement {
  const view = useEngine({
    mode: props.mode,
    config: props.config,
    controller: props.controller,
    ...(props.sessionId ? { sessionId: props.sessionId } : {}),
  });

  // Ctrl-C (or q) aborts the engine; it flushes state, then run_end fires.
  useInput((input, key) => {
    if (key.escape || input === 'q' || (key.ctrl && input === 'c')) {
      props.controller.abort('người dùng dừng');
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: fire once on the finished transition; latest view fields read intentionally.
  useEffect(() => {
    if (view.finished) {
      props.onFinish({
        turns: view.result?.turns ?? view.turn,
        totalMs: view.result?.totalMs ?? 0,
        gameOver: view.gameOver,
        saveWritten: view.saveWritten,
        lessonsPath: view.lessonsPath,
        resultPath: view.result?.resultPath ?? null,
        errors: view.errors,
      });
    }
  }, [view.finished]);

  const lastError = view.errors[view.errors.length - 1];

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* Header */}
      <Box justifyContent="space-between">
        <Box>
          <PhaseBadge phase={view.phase} />
          <Text> </Text>
          <TurnCounter turn={view.turn} maxTurns={view.maxTurns} />
        </Box>
        <Text dimColor>
          {view.runtimeModel} ⇄ {view.playerModel}
        </Text>
      </Box>
      <Text dimColor>phiên: {view.sessionId || '…'}</Text>

      {/* Dual transcript */}
      <Box marginTop={1}>
        <TranscriptPane who="runtime" lines={view.transcript} />
        <Text> </Text>
        <TranscriptPane who="player" lines={view.transcript} />
      </Box>

      {/* Token meters */}
      <Box flexDirection="column" marginTop={1}>
        <TokenMeter label="Engine" prompt={view.tokens.runtimePrompt} limit={view.tokens.limit} />
        <TokenMeter label="Player" prompt={view.tokens.playerPrompt} limit={view.tokens.limit} />
      </Box>

      {/* Activity + status */}
      <Box marginTop={1}>
        <ActivityLine activity={view.activity} />
      </Box>
      <Box marginTop={1}>
        <StatusBar trims={view.trims} autosaves={view.autosaves} lastError={lastError} />
      </Box>

      <Box marginTop={1}>
        <Text dimColor>Nhấn q / Esc để dừng và lưu · Ctrl-C thoát</Text>
      </Box>
    </Box>
  );
}

export interface FinishSummary {
  turns: number;
  totalMs: number;
  gameOver: boolean;
  saveWritten: boolean;
  lessonsPath: string | null;
  resultPath: string | null;
  errors: string[];
}
