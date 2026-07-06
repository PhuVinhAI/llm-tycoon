import { Box, Text } from 'ink';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import type React from 'react';

export type MenuAction = 'new' | 'continue' | 'resume' | 'history' | 'about' | 'exit';

interface Item {
  label: string;
  value: MenuAction;
}

const ITEMS: Item[] = [
  { label: '🎮 Chơi mới', value: 'new' },
  { label: '↩️  Chơi tiếp (từ lần trước)', value: 'continue' },
  { label: '⏯️  Tiếp tục ván đang lưu', value: 'resume' },
  { label: '📋 Lịch sử các ván', value: 'history' },
  { label: 'ℹ️  Giới thiệu', value: 'about' },
  { label: '🚪 Thoát', value: 'exit' },
];

/** Main menu — arrow keys + enter to pick a mode. */
export function MainMenu(props: { onSelect: (action: MenuAction) => void }): React.ReactElement {
  return (
    <Box flexDirection="column" paddingX={1}>
      <Gradient name="mind">
        <Text>🏭 LLM TYCOON</Text>
      </Gradient>
      <Box marginTop={1}>
        <SelectInput items={ITEMS} onSelect={(item) => props.onSelect(item.value)} />
      </Box>
      <Box marginTop={1}>
        <Text dimColor>↑↓ chọn · Enter xác nhận</Text>
      </Box>
    </Box>
  );
}
