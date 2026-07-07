import { useApp } from 'ink';
import type React from 'react';
import { useCallback, useState } from 'react';
import type { AppConfig } from '../config/env.ts';
import type { RunMode } from '../engine/events.ts';
import { AboutScreen } from './screens/AboutScreen.tsx';
import { BootScreen } from './screens/BootScreen.tsx';
import { Dashboard, type FinishSummary } from './screens/Dashboard.tsx';
import { HistoryScreen } from './screens/HistoryScreen.tsx';
import { MainMenu, type MenuAction } from './screens/MainMenu.tsx';
import { SummaryScreen } from './screens/SummaryScreen.tsx';

type Screen = 'boot' | 'menu' | 'dashboard' | 'history' | 'about' | 'summary';

/**
 * Top-level screen router. Holds `{screen, mode, summary}` and a fresh
 * AbortController per run. `initialMode` (from the CLI) skips the menu and boots
 * straight into a run when the user passed --new/--resume/--continue.
 */
export function App(props: {
  config: AppConfig;
  initialMode?: RunMode | 'menu';
}): React.ReactElement {
  const { exit } = useApp();
  const startAtRun = props.initialMode && props.initialMode !== 'menu';

  const [screen, setScreen] = useState<Screen>(startAtRun ? 'dashboard' : 'boot');
  const [mode, setMode] = useState<RunMode>(startAtRun ? (props.initialMode as RunMode) : 'new');
  const [summary, setSummary] = useState<FinishSummary | null>(null);
  const [controller, setController] = useState(() => new AbortController());

  const startRun = useCallback((m: RunMode) => {
    setMode(m);
    setController(new AbortController());
    setScreen('dashboard');
  }, []);

  const onMenu = useCallback(
    (action: MenuAction) => {
      switch (action) {
        case 'new':
        case 'continue':
        case 'resume':
          startRun(action);
          break;
        case 'history':
          setScreen('history');
          break;
        case 'about':
          setScreen('about');
          break;
        case 'exit':
          exit();
          break;
      }
    },
    [startRun, exit],
  );

  const onFinish = useCallback((s: FinishSummary) => {
    setSummary(s);
    setScreen('summary');
  }, []);

  switch (screen) {
    case 'boot':
      return <BootScreen onReady={() => setScreen('menu')} />;
    case 'menu':
      return <MainMenu onSelect={onMenu} />;
    case 'dashboard':
      return (
        <Dashboard mode={mode} config={props.config} controller={controller} onFinish={onFinish} />
      );
    case 'history':
      return <HistoryScreen onBack={() => setScreen('menu')} />;
    case 'about':
      return <AboutScreen config={props.config} onBack={() => setScreen('menu')} />;
    case 'summary':
      return (
        <SummaryScreen
          summary={summary as FinishSummary}
          onSelect={(choice) => (choice === 'exit' ? exit() : setScreen('menu'))}
        />
      );
  }
}
