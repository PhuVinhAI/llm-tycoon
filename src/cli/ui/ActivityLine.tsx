import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import type React from 'react';
import type { ActivityState } from '../state/engineReducer.ts';

const WHO_LABEL = { runtime: 'Game Engine', player: 'Người chơi' } as const;

/** Live activity line: spinner while thinking, dotted bar while retrying. */
export function ActivityLine(props: { activity: ActivityState }): React.ReactElement {
  const { activity } = props;

  if (activity.kind === 'idle') {
    return <Text dimColor>· nghỉ</Text>;
  }

  if (activity.kind === 'retrying' && activity.retry) {
    const { attempt, ceil, elapsedMs, totalMs } = activity.retry;
    const dots = '·'.repeat(Math.min(20, Math.floor(elapsedMs / 300)));
    return (
      <Text color="yellow">
        ⏳ thử lại {attempt}/{ceil} {dots}
        <Text dimColor>
          {' '}
          ({Math.round(elapsedMs / 1000)}s/{Math.round(totalMs / 1000)}s)
        </Text>
      </Text>
    );
  }

  const who = activity.who ? WHO_LABEL[activity.who] : '';
  return (
    <Text color="green">
      <Spinner type="dots" /> {who} đang suy nghĩ…
    </Text>
  );
}

/** Bottom status bar: elapsed placeholder, trims, autosaves, last error. */
export function StatusBar(props: {
  trims: number;
  autosaves: number;
  lastError?: string | undefined;
}): React.ReactElement {
  return (
    <Box justifyContent="space-between">
      <Box>
        <Text dimColor>✂️ cắt ngữ cảnh: </Text>
        <Text>{props.trims}</Text>
        <Text dimColor> 💾 tự lưu: </Text>
        <Text>{props.autosaves}</Text>
      </Box>
      {props.lastError ? <Text color="red">⚠ {props.lastError}</Text> : <Text dimColor>ok</Text>}
    </Box>
  );
}
