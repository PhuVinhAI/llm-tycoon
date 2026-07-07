import { expect, test } from 'bun:test';
import { render } from 'ink-testing-library';
import React from 'react';
import { MainMenu } from '../src/cli/screens/MainMenu.tsx';

test('MainMenu renders Vietnamese items', () => {
  const { lastFrame } = render(React.createElement(MainMenu, { onSelect: () => {} }));
  const frame = lastFrame() ?? '';
  expect(frame).toContain('Chơi mới');
  expect(frame).toContain('Lịch sử');
  expect(frame).toContain('Thoát');
});
