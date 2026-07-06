/**
 * plain.ts — headless renderer. Consumes the SAME event stream the Ink UI does
 * and prints to the console, preserving the emoji/log style of the original
 * play-test. Used for `--plain`, non-TTY stdout, and CI.
 *
 * Retry progress uses a `\r` line on a TTY stderr (as the original did) and a
 * plain sleep otherwise — this renderer OWNS terminal writes; the engine emits
 * only events.
 */

import type { AppConfig } from '../config/env.ts';
import { runEngine } from '../engine/engine.ts';
import type { EngineEvent, RunMode } from '../engine/events.ts';
import { formatDuration, formatTokens, preview } from './format.ts';

function tok(n: number): string {
  return formatTokens(n);
}

/** Render one event to the console. Returns nothing; pure side effect. */
export function renderPlainEvent(ev: EngineEvent): void {
  switch (ev.type) {
    case 'run_start':
      console.log('🏭 LLM Tycoon — Play Test');
      console.log(`   Mode:      ${ev.mode}`);
      console.log(`   Runtime:   ${ev.runtimeModel}`);
      console.log(`   Player:    ${ev.playerModel}`);
      console.log(`   Max turns: ${ev.maxTurns}`);
      console.log(`   Session:   ${ev.sessionId}`);
      console.log(`📄 Game document loaded (${ev.gameDocKB} KB)\n`);
      break;
    case 'phase':
      if (ev.phase === 'finalising') console.log('\n═══ GENERATING SAVE & LESSONS ═══');
      break;
    case 'runtime_init':
      console.log('✅ Runtime AI initialized');
      console.log('═══ GAME START ═══');
      console.log(preview(ev.content, 500));
      console.log('');
      break;
    case 'resumed':
      console.log(`\n═══ RESUMED from turn ${ev.turn} ═══`);
      console.log(preview(ev.lastResponse, 500));
      console.log('');
      break;
    case 'turn_start':
      console.log(`── Turn ${ev.turn} ──`);
      break;
    case 'player_action':
      console.log(`  🎮 Player: ${preview(ev.content, 150)}`);
      break;
    case 'engine_result':
      console.log(`  🏭 Engine: ${preview(ev.content, 200)} (${(ev.turnMs / 1000).toFixed(1)}s)`);
      break;
    case 'tokens':
      console.log(
        `  📊 Runtime ${tok(ev.snapshot.runtimePrompt)} | Player ${tok(ev.snapshot.playerPrompt)}`,
      );
      break;
    case 'trim':
      console.log(`  ✂️  Trimmed ${ev.who} context → ${tok(ev.newPrompt)}`);
      break;
    case 'retry':
      writeRetryLine(
        `⏳ retry ${ev.attempt}/${ev.ceil} (${ev.who}) — waiting ${ev.waitMs}ms (last: ${ev.reason})`,
      );
      break;
    case 'retry_progress':
      // Cosmetic; only paint on a TTY to avoid corrupting piped logs.
      if (process.stderr.isTTY) {
        const dots = '·'.repeat(Math.min(30, Math.floor(ev.elapsedMs / 500)));
        process.stderr.write(`\r   ⏳ waiting ${dots}   `);
      }
      break;
    case 'autosave':
      // Quiet by default — matches the original's terse autosave.
      break;
    case 'interrupt':
      console.log(`\n⏸️  ${ev.reason} — saved at turn ${ev.turn}.`);
      break;
    case 'save':
      console.log(
        ev.block ? '  💾 SAVE block written' : '  ⚠️  No SAVE markers found — saved raw output',
      );
      break;
    case 'lessons':
      console.log('  📝 Lessons file written');
      break;
    case 'game_over':
      console.log('═══ GAME ENDED ═══');
      break;
    case 'error':
      console.error(`${ev.fatal ? '❌' : '⚠️ '} ${ev.who}: ${ev.message}`);
      break;
    case 'run_end':
      console.log('\n═══ TEST COMPLETE ═══');
      console.log(
        `   Turns: ${ev.turns} | Time: ${formatDuration(ev.totalMs)} | gameOver: ${ev.gameOver}`,
      );
      if (ev.resultPath) console.log(`   Result: ${ev.resultPath}`);
      if (!ev.gameOver) console.log('   Resume: bun run play:resume');
      break;
    default:
      break;
  }
}

let retryLineOpen = false;
function writeRetryLine(msg: string): void {
  if (process.stderr.isTTY) {
    process.stderr.write(`\r${msg}`);
    retryLineOpen = true;
  } else {
    console.warn(msg);
  }
}

/**
 * Drive the engine to completion with the plain renderer. Returns the process
 * exit code (0 = ok, 1 = a fatal error was emitted).
 */
export async function runPlain(opts: {
  mode: RunMode;
  config: AppConfig;
  signal: AbortSignal;
  sessionId?: string;
}): Promise<number> {
  let exitCode = 0;
  for await (const ev of runEngine(opts)) {
    if (retryLineOpen && ev.type !== 'retry' && ev.type !== 'retry_progress') {
      process.stderr.write('\n');
      retryLineOpen = false;
    }
    if (ev.type === 'error' && ev.fatal) exitCode = 1;
    renderPlainEvent(ev);
  }
  return exitCode;
}

/** Print the plain-text session history (the `history` subcommand, headless). */
export async function runHistory(): Promise<void> {
  const { listHistoryFormatted } = await import('../session/history.ts');
  console.log(await listHistoryFormatted());
}
