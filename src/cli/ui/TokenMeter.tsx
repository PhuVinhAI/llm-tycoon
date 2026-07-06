import { Box, Text } from 'ink';
import type React from 'react';
import { formatTokens } from '../../renderers/format.ts';

/** A labelled token gauge: green → yellow → red as prompt nears the limit. */
export function TokenMeter(props: {
  label: string;
  prompt: number;
  limit: number;
  width?: number;
}): React.ReactElement {
  const width = props.width ?? 18;
  const frac = props.limit > 0 ? Math.min(1, props.prompt / props.limit) : 0;
  const filled = Math.round(frac * width);
  const color = frac > 0.9 ? 'red' : frac > 0.7 ? 'yellow' : 'green';
  return (
    <Box>
      <Box width={9}>
        <Text dimColor>{props.label}</Text>
      </Box>
      <Text color={color}>{'█'.repeat(filled)}</Text>
      <Text dimColor>{'░'.repeat(width - filled)}</Text>
      <Text> {formatTokens(props.prompt)}</Text>
      <Text dimColor>/{formatTokens(props.limit)}</Text>
    </Box>
  );
}
