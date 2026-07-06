import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, RUNTIME, PLAYER, GAME_CONFIG, STATE_PATH, LOG_PATH, RESULT_PATH } from './config.js';
import { runtimeClient, playerClient, callAI } from './api.js';
import { log, logTurn } from './logger.js';

const PLAYER_SYSTEM_PROMPT = `Úi trò này gì vậy? LLM Tycoon? Game xây dựng công ty AI?? Nghe hay quá! Mình chẳng biết gì hết nhưng muốn thử quá đi. Chọn đại cái gì thấy hay hay vậy. Trả lời bằng tiếng Việt. Chỉ nói hành động thôi, đừng phân tích hay giải thích gì hết.`;

function buildGameDoc() {
  const buildPath = join(ROOT, 'build', 'LLM-TYCOON.md');
  if (!existsSync(buildPath)) {
    console.error('❌ Game document not found. Run `npm run build` first.');
    process.exit(1);
  }
  return readFileSync(buildPath, 'utf8');
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash.toString(36);
}

function saveState(state) {
  writeFileSync(STATE_PATH, JSON.stringify({
    turn: state.turn,
    gameDocHash: state.gameDocHash,
    runtimeMessages: state.runtimeMessages,
    playerMessages: state.playerMessages,
    runtimeLastResponse: state.runtimeLastResponse,
    gameOver: state.gameOver,
  }, null, 2));
}

function loadState() {
  if (!existsSync(STATE_PATH)) return null;
  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return null;
  }
}

export async function runGame(mode) {
  const startTime = Date.now();

  console.log('🏭 LLM Tycoon — Play Test');
  console.log(`   Mode:    ${mode}`);
  console.log(`   Runtime: ${RUNTIME.model} @ ${RUNTIME.baseUrl}`);
  console.log(`   Player:  ${PLAYER.model} @ ${PLAYER.baseUrl}`);
  console.log(`   Max turns: ${GAME_CONFIG.maxTurns}`);
  console.log('');

  const gameDoc = buildGameDoc();
  const gameDocHash = hashString(gameDoc);
  console.log(`📄 Game document loaded (${(Buffer.byteLength(gameDoc) / 1024).toFixed(0)} KB)`);

  let state;

  if (mode === 'resume') {
    const saved = loadState();
    if (!saved) {
      console.error('❌ No saved state found. Start a new game with --new.');
      process.exit(1);
    }
    if (saved.gameDocHash !== gameDocHash) {
      console.error('❌ Game doc changed since last run. Start new with --new.');
      process.exit(1);
    }
    state = { ...saved, stats: { startMs: Date.now() } };
    console.log(`✅ Resumed from turn ${state.turn}`);
    log({ type: 'resume', turn: state.turn });
  } else {
    if (existsSync(STATE_PATH)) unlinkSync(STATE_PATH);
    writeFileSync(LOG_PATH, '');
    state = {
      turn: 0,
      runtimeMessages: [],
      playerMessages: [{ role: 'system', content: PLAYER_SYSTEM_PROMPT }],
      runtimeLastResponse: '',
      gameOver: false,
      gameDocHash,
      stats: { startMs: Date.now() },
    };
    log({ type: 'config', runtime: RUNTIME.model, player: PLAYER.model, mode });
  }

  // ── Ctrl+C handler: save state before exit ──
  let shuttingDown = false;
  const onShutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log('\n\n⏸️  Interrupted — saving state...');
    saveState(state);
    console.log(`   Saved at turn ${state.turn}. Resume with: npm run play -- --resume`);
    process.exit(0);
  };
  process.on('SIGINT', onShutdown);
  process.on('SIGTERM', onShutdown);

  // ── Init Runtime (game doc → AI reads it, boots the game) ──
  if (state.runtimeMessages.length === 0) {
    console.log('🔧 Initializing Runtime AI...');

    state.runtimeMessages = [{ role: 'user', content: gameDoc }];

    let res;
    try {
      res = await callAI(runtimeClient, RUNTIME, state.runtimeMessages);
    } catch (err) {
      console.error(`❌ Runtime AI init failed: ${err.message}`);
      process.exit(1);
    }

    state.runtimeLastResponse = res.content;
    state.runtimeMessages.push({ role: 'assistant', content: res.content });

    log({ type: 'runtime_init', content: res.content.slice(0, 2000) });
    console.log('✅ Runtime AI initialized\n');
    console.log('═══ GAME START ═══');
    console.log(res.content.slice(0, 500) + (res.content.length > 500 ? '...' : ''));
    console.log('');
  } else {
    console.log(`\n═══ RESUMED from turn ${state.turn} ═══`);
    console.log(state.runtimeLastResponse.slice(0, 500) + (state.runtimeLastResponse.length > 500 ? '...' : ''));
    console.log('');
  }

  // ── Main loop: Runtime ↔ Player ──
  while (state.turn < GAME_CONFIG.maxTurns && !state.gameOver) {
    state.turn++;
    const turnStart = Date.now();
    console.log(`── Turn ${state.turn} ──`);

    // Player decides
    state.playerMessages.push({ role: 'user', content: state.runtimeLastResponse });

    let playerRes;
    try {
      playerRes = await callAI(playerClient, PLAYER, state.playerMessages);
    } catch (err) {
      console.error(`❌ Player AI failed: ${err.message}`);
      saveState(state);
      process.exit(1);
    }

    const playerAction = playerRes.content;
    state.playerMessages.push({ role: 'assistant', content: playerAction });
    console.log(`  Player: ${playerAction.slice(0, 150)}${playerAction.length > 150 ? '...' : ''}`);

    // Runtime processes action
    state.runtimeMessages.push({ role: 'user', content: playerAction });

    let runtimeRes;
    try {
      runtimeRes = await callAI(runtimeClient, RUNTIME, state.runtimeMessages);
    } catch (err) {
      console.error(`❌ Runtime AI failed: ${err.message}`);
      saveState(state);
      process.exit(1);
    }

    const runtimeResult = runtimeRes.content;
    state.runtimeMessages.push({ role: 'assistant', content: runtimeResult });
    state.runtimeLastResponse = runtimeResult;

    const turnMs = Date.now() - turnStart;
    console.log(`  Engine: ${runtimeResult.slice(0, 200)}${runtimeResult.length > 200 ? '...' : ''} (${(turnMs / 1000).toFixed(1)}s)\n`);

    logTurn(state.turn, {
      player_action: playerAction.slice(0, 2000),
      runtime_result: runtimeResult.slice(0, 2000),
      turn_ms: turnMs,
      usage: { runtime: runtimeRes.usage, player: playerRes.usage },
    });

    // Game over check
    const lower = runtimeResult.toLowerCase();
    if (
      lower.includes('game over') || lower.includes('burned out') ||
      lower.includes('bankrupt') || lower.includes('heading to headquarters') ||
      lower.includes('game ended') || lower.includes('term sheet')
    ) {
      state.gameOver = true;
      console.log('═══ GAME ENDED ═══');
    }
  }

  // ── Finalize ──
  process.removeListener('SIGINT', onShutdown);
  process.removeListener('SIGTERM', onShutdown);

  const totalMs = Date.now() - startTime;
  console.log(`\n═══ TEST COMPLETE ═══`);
  console.log(`   Turns: ${state.turn} | Time: ${(totalMs / 1000).toFixed(1)}s | Log: ${GAME_CONFIG.logFile}`);

  log({ type: 'summary', turns: state.turn, gameOver: state.gameOver, totalMs,
    config: { runtime: RUNTIME.model, player: PLAYER.model } });

  writeFileSync(RESULT_PATH, JSON.stringify({
    turns: state.turn, gameOver: state.gameOver, totalMs,
    lastResponse: state.runtimeLastResponse.slice(-3000),
    config: { runtime: RUNTIME.model, player: PLAYER.model },
  }, null, 2));
  console.log(`   Result: game_result.json`);

  // Clean up state file
  if (state.gameOver && existsSync(STATE_PATH)) unlinkSync(STATE_PATH);
  else console.log(`   Resume: npm run play -- --resume`);
}
