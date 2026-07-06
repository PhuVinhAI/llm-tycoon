import { Box, Text, useInput } from 'ink';
import type React from 'react';
import type { AppConfig } from '../../config/env.ts';

/** Static info card. Esc returns to the menu. */
export function AboutScreen(props: { config: AppConfig; onBack: () => void }): React.ReactElement {
  useInput((input, key) => {
    if (key.escape || input === 'q') props.onBack();
  });

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text bold color="cyan">
        ℹ️ Giới thiệu — LLM Tycoon
      </Text>
      <Box marginTop={1} flexDirection="column">
        <Text>
          Game tycoon xây dựng công ty AI từ năm 2013, do chính LLM vận hành. Công cụ play-test này
          để hai AI tự chơi với nhau: một AI làm <Text color="magenta">Game Engine</Text>, một AI
          làm <Text color="cyan">Người chơi</Text>.
        </Text>
        <Box marginTop={1} flexDirection="column">
          <Text dimColor>Cấu hình hiện tại:</Text>
          <Text>
            · Engine: <Text color="magenta">{props.config.runtime.model}</Text>{' '}
            <Text dimColor>@ {props.config.runtime.baseUrl}</Text>
          </Text>
          <Text>
            · Player: <Text color="cyan">{props.config.player.model}</Text>{' '}
            <Text dimColor>@ {props.config.player.baseUrl}</Text>
          </Text>
          <Text>
            · Số lượt tối đa: <Text bold>{props.config.game.maxTurns}</Text>
          </Text>
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text dimColor>Esc để quay lại</Text>
      </Box>
    </Box>
  );
}
