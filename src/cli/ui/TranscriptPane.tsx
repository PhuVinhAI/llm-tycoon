import { Box, Text } from 'ink';
import type React from 'react';
import { preview } from '../../renderers/format.ts';
import type { TranscriptLine } from '../state/engineReducer.ts';

const META: Record<'runtime' | 'player', { title: string; color: string; icon: string }> = {
  runtime: { title: 'Game Engine', color: 'magenta', icon: '🏭' },
  player: { title: 'Người chơi', color: 'cyan', icon: '🎮' },
};

/**
 * A scrolling pane showing the last few lines from one speaker. `width` bounds
 * each line so long model output never breaks the layout.
 */
export function TranscriptPane(props: {
  who: 'runtime' | 'player';
  lines: TranscriptLine[];
  rows?: number;
  width?: number;
}): React.ReactElement {
  const rows = props.rows ?? 6;
  const width = props.width ?? 40;
  const meta = META[props.who];
  const mine = props.lines.filter((l) => l.who === props.who).slice(-rows);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={meta.color}
      width={width}
      paddingX={1}
    >
      <Text bold color={meta.color}>
        {meta.icon} {meta.title}
      </Text>
      {mine.length === 0 ? (
        <Text dimColor>(đang chờ…)</Text>
      ) : (
        mine.map((l, i) => (
          <Text key={l.seq} dimColor={i < mine.length - 1}>
            <Text color={meta.color}>›</Text> {preview(l.text, width - 4)}
          </Text>
        ))
      )}
    </Box>
  );
}
