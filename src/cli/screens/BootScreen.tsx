import { existsSync } from 'node:fs';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import Spinner from 'ink-spinner';
import type React from 'react';
import { useEffect, useState } from 'react';
import { PATHS } from '../../config/paths.ts';

/**
 * Title screen: gradient wordmark, a short readiness check (game doc present?),
 * then auto-advances to the main menu. If the build is missing, it shows a hint
 * instead of proceeding.
 */
export function BootScreen(props: { onReady: () => void }): React.ReactElement {
  const [docMissing, setDocMissing] = useState(false);

  useEffect(() => {
    const ok = existsSync(PATHS.gameDoc);
    if (!ok) {
      setDocMissing(true);
      return;
    }
    const t = setTimeout(props.onReady, 900);
    return () => clearTimeout(t);
  }, [props.onReady]);

  return (
    <Box flexDirection="column" alignItems="center" paddingY={1}>
      <Gradient name="mind">
        <BigText text="LLM TYCOON" font="tiny" />
      </Gradient>
      <Text dimColor>Xây công ty AI từ năm 2013 — do chính LLM vận hành</Text>
      <Box marginTop={1}>
        {docMissing ? (
          <Text color="red">
            ⚠ Chưa có build/LLM-TYCOON.md — chạy <Text bold>bun run build</Text> trước.
          </Text>
        ) : (
          <Text color="green">
            <Spinner type="dots" /> Đang chuẩn bị…
          </Text>
        )}
      </Box>
    </Box>
  );
}
