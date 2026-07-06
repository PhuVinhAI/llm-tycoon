import { Box, Text, useInput } from 'ink';
import type React from 'react';
import { useEffect, useState } from 'react';
import { formatDuration } from '../../renderers/format.ts';
import { listHistory } from '../../session/history.ts';
import type { HistoryEntry } from '../../session/schema.ts';

/** Read-only session history table. Esc returns to the menu. */
export function HistoryScreen(props: { onBack: () => void }): React.ReactElement {
  const [rows, setRows] = useState<HistoryEntry[] | null>(null);

  useEffect(() => {
    listHistory()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  useInput((input, key) => {
    if (key.escape || input === 'q') props.onBack();
  });

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text bold color="cyan">
        📋 Lịch sử các ván
      </Text>
      <Box marginTop={1} flexDirection="column">
        {rows === null ? (
          <Text dimColor>Đang tải…</Text>
        ) : rows.length === 0 ? (
          <Text dimColor>(chưa có ván nào)</Text>
        ) : (
          rows.slice(0, 15).map((s) => {
            const status = s.gameOver ? '✅' : s.endedAt ? '⏹️ ' : '▶️ ';
            const dur = s.totalMs ? formatDuration(s.totalMs) : 'đang chạy';
            return (
              <Text key={s.id}>
                {status} <Text dimColor>{s.id}</Text> · lượt{' '}
                <Text color="cyan">{String(s.turns).padStart(3)}</Text> · {dur} ·{' '}
                <Text dimColor>{s.runtime}</Text>
              </Text>
            );
          })
        )}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Tổng: {rows?.length ?? 0} ván · Esc để quay lại</Text>
      </Box>
    </Box>
  );
}
