import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import type React from 'react';
import { formatDuration } from '../../renderers/format.ts';
import type { FinishSummary } from './Dashboard.tsx';

type Choice = 'menu' | 'exit';

/** End-of-game card + next-step menu. */
export function SummaryScreen(props: {
  summary: FinishSummary;
  onSelect: (choice: Choice) => void;
}): React.ReactElement {
  const s = props.summary;
  const title = s.gameOver ? '🏁 Ván đã kết thúc' : '⏸️  Đã dừng';
  const color = s.gameOver ? 'cyan' : 'yellow';

  return (
    <Box flexDirection="column" paddingX={1}>
      <Box borderStyle="round" borderColor={color} flexDirection="column" paddingX={1}>
        <Text bold color={color}>
          {title}
        </Text>
        <Text>
          Số lượt: <Text bold>{s.turns}</Text> · Thời gian:{' '}
          <Text bold>{formatDuration(s.totalMs)}</Text>
        </Text>
        <Text>
          SAVE: {s.saveWritten ? <Text color="green">đã ghi</Text> : <Text dimColor>không</Text>} ·
          Bài học: {s.lessonsPath ? <Text color="green">đã ghi</Text> : <Text dimColor>không</Text>}
        </Text>
        {s.resultPath ? <Text dimColor>Kết quả: {s.resultPath}</Text> : null}
        {s.errors.length > 0 ? <Text color="red">⚠ {s.errors[s.errors.length - 1]}</Text> : null}
      </Box>
      <Box marginTop={1}>
        <SelectInput
          items={[
            { label: '📋 Về menu chính', value: 'menu' as Choice },
            { label: '🚪 Thoát', value: 'exit' as Choice },
          ]}
          onSelect={(item) => props.onSelect(item.value)}
        />
      </Box>
    </Box>
  );
}
