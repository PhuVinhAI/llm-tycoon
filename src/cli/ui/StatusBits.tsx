import { Box, Text } from 'ink';
import type React from 'react';
import type { EnginePhase } from '../../engine/events.ts';

const PHASE_LABEL: Record<EnginePhase, { text: string; color: string }> = {
  init: { text: 'KHỞI TẠO', color: 'gray' },
  playing: { text: 'ĐANG CHƠI', color: 'green' },
  finalising: { text: 'TỔNG KẾT', color: 'yellow' },
  done: { text: 'HOÀN TẤT', color: 'cyan' },
};

/** Small coloured chip showing the current engine phase. */
export function PhaseBadge(props: { phase: EnginePhase }): React.ReactElement {
  const p = PHASE_LABEL[props.phase];
  return (
    <Box>
      <Text backgroundColor={p.color} color="black">
        {` ${p.text} `}
      </Text>
    </Box>
  );
}

/** `Lượt 12 / 100` counter. */
export function TurnCounter(props: { turn: number; maxTurns: number }): React.ReactElement {
  return (
    <Text>
      Lượt{' '}
      <Text bold color="cyan">
        {props.turn}
      </Text>
      <Text dimColor> / {props.maxTurns}</Text>
    </Text>
  );
}
