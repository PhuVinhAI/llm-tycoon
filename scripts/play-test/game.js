import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, RUNTIME, PLAYER, GAME_CONFIG, STATE_PATH, RESULT_PATH, FLAG_NEW, FLAG_RESUME, FLAG_CONTINUE, FLAG_HISTORY, FLAG_SESSION_ID } from './config.js';
import { runtimeClient, playerClient, callAI } from './api.js';
import { initSession, resumeSession, closeSession, listHistory, log, logTurn, writeSave, writeLessons, loadLessonsChain, setContinuedFrom, findPreviousSession, findSessionById, initDebugDir } from './logger.js';

const TOKEN_LIMIT = 180_000;
const MAX_TOKENS = 200_000;

const PLAYER_SYSTEM_PROMPT = `Chào mừng bạn đến với LLM Tycoon! Bạn đang chơi một game mô phỏng xây dựng công ty AI từ năm 2013. Mỗi lượt bạn sẽ được hiển thị trạng thái hiện tại và menu các hành động có thể thực hiện.

Bạn là một người chơi bình thường, hãy chơi tự nhiên và luôn đưa ra quyết định. Trả lời bằng tiếng Việt, chỉ nói hành động bạn muốn làm. Đừng phân tích hay giải thích.`;

const SAVE_PROMPT = `Hãy xuất SAVE block.`;

function formatTokens(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

// ─── Trim logic: use actual completion_tokens ────────────────────────────
function trimContext(state) {
  let trimmed = false;

  while (state.runtimeTokens > TOKEN_LIMIT && state.runtimeMsgPairs.length > 1) {
    const pair = state.runtimeMsgPairs.shift();
    state.runtimeMessages.splice(1, 2);
    state.runtimeTokens -= pair.completionTokens;
    trimmed = true;
  }

  while (state.playerTokens > TOKEN_LIMIT && state.playerMsgPairs.length > 1) {
    const pair = state.playerMsgPairs.shift();
    state.playerMessages.splice(1, 2);
    state.playerTokens -= pair.completionTokens;
    trimmed = true;
  }

  if (trimmed) {
    console.log(`  ✂️  Trimmed → Runtime: ${formatTokens(state.runtimeTokens)} | Player: ${formatTokens(state.playerTokens)}`);
  }
}

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
    sessionId: state.sessionId,
    sessionDir: state.sessionDir,
    runtimeMessages: state.runtimeMessages,
    runtimeMsgPairs: state.runtimeMsgPairs,
    runtimeTokens: state.runtimeTokens,
    playerMessages: state.playerMessages,
    playerMsgPairs: state.playerMsgPairs,
    playerTokens: state.playerTokens,
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

function buildPlayerSystemPrompt(lessons) {
  let prompt = PLAYER_SYSTEM_PROMPT;
  if (lessons) {
    prompt += `\n\n📝 Kinh nghiệm từ lần chơi trước:\n${lessons}`;
  }
  return prompt;
}

function extractSaveBlock(text) {
  // Try code block first
  const codeMatch = text.match(/```[\s\S]*?(=== SAVE LLM-TYCOON[\s\S]*?=== END SAVE ===[\s\S]*?)```/);
  if (codeMatch) return codeMatch[1].trim();
  // Try raw
  const start = text.indexOf('=== SAVE LLM-TYCOON');
  const end = text.indexOf('=== END SAVE ===');
  if (start === -1 || end === -1) return null;
  return text.slice(start, end + '=== END SAVE ==='.length);
}

export async function runGame(mode) {
  if (FLAG_HISTORY) {
    listHistory();
    return;
  }

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

  // ── Load save + lessons for continue/resume-from-save ──
  let continueSave = null;
  let lessons = null;
  let targetSession = null;

  if (mode === 'continue') {
    targetSession = FLAG_SESSION_ID ? findSessionById(FLAG_SESSION_ID) : findPreviousSession();
    if (targetSession) {
      const savePath = join(targetSession.sessionDir, 'save.txt');
      if (existsSync(savePath)) {
        continueSave = readFileSync(savePath, 'utf8');
        console.log(`💾 Loaded save from session ${targetSession.id}`);
      }
      lessons = loadLessonsChain(targetSession.id);
      if (lessons) {
        console.log(`📝 Loaded lessons from session ${targetSession.id} (+ ancestors)`);
      }
    }
    if (!continueSave) console.log('⚠️  No save found, starting fresh.');
    if (!lessons) console.log('⚠️  No lessons found.');
  }

  let state;

  if (mode === 'resume') {
    const saved = loadState();
    if (!saved) {
      console.error('❌ No saved state found. Use --new or --continue.');
      process.exit(1);
    }
    if (saved.gameDocHash !== gameDocHash) {
      console.error('❌ Game doc changed since last run. Start with --new.');
      process.exit(1);
    }
    state = { ...saved, stats: { startMs: Date.now() } };
    if (!state.runtimeTokens) state.runtimeTokens = 0;
    if (!state.playerTokens) state.playerTokens = 0;
    if (!state.runtimeMsgPairs) state.runtimeMsgPairs = [];
    if (!state.playerMsgPairs) state.playerMsgPairs = [];

    let sess;
    if (saved.sessionId && saved.sessionDir) {
      sess = resumeSession(saved.sessionId, saved.sessionDir);
    } else {
      sess = initSession(RUNTIME, PLAYER, GAME_CONFIG.maxTurns);
      state.sessionId = sess.id;
      state.sessionDir = sess.dir;
    }
    initDebugDir(sess.dir);
    console.log(`✅ Resumed from turn ${state.turn} (session: ${sess.id})`);
    log({ type: 'resume', turn: state.turn });
  } else {
    if (existsSync(STATE_PATH)) unlinkSync(STATE_PATH);

    const sess = initSession(RUNTIME, PLAYER, GAME_CONFIG.maxTurns);
    if (targetSession) setContinuedFrom(targetSession.id);
    initDebugDir(sess.dir);
    console.log(`📝 Session: ${sess.id}`);

    state = {
      turn: 0,
      sessionId: sess.id,
      sessionDir: sess.dir,
      runtimeMessages: [],
      runtimeMsgPairs: [],
      runtimeTokens: 0,
      playerMessages: [{ role: 'system', content: buildPlayerSystemPrompt(lessons) }],
      playerMsgPairs: [],
      playerTokens: 0,
      runtimeLastResponse: '',
      gameOver: false,
      gameDocHash,
      continueSave,
      stats: { startMs: Date.now() },
    };
    log({ type: 'config', runtime: RUNTIME.model, player: PLAYER.model, mode, lessons: !!lessons, continue: !!continueSave, continuedFrom: targetSession?.id || null });
  }

  // ── Ctrl+C handler ──
  let shuttingDown = false;
  const onShutdown = () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log('\n\n⏸️  Interrupted — saving state...');
    saveState(state);
    closeSession(state.turn, state.gameOver, Date.now() - startTime);
    console.log(`   Saved at turn ${state.turn}. Resume with: npm run play -- --resume`);
    process.exit(0);
  };
  process.on('SIGINT', onShutdown);
  process.on('SIGTERM', onShutdown);

  // ── Init Runtime ──
  if (state.runtimeMessages.length === 0) {
    console.log('🔧 Initializing Runtime AI...');

    // Continue mode: send game doc + save block
    // New mode: send game doc only
    let initContent = gameDoc;
    if (state.continueSave) {
      initContent = gameDoc + '\n\n---\n\n' + state.continueSave;
    }

    state.runtimeMessages = [{ role: 'user', content: initContent }];

    let res;
    try {
      res = await callAI(runtimeClient, RUNTIME, state.runtimeMessages);
    } catch (err) {
      console.error(`❌ Runtime AI init failed: ${err.message}`);
      process.exit(1);
    }

    state.runtimeLastResponse = res.content;
    state.runtimeMessages.push({ role: 'assistant', content: res.content });
    state.runtimeTokens = res.usage.total_tokens;
    state.runtimeMsgPairs.push({ completionTokens: res.usage.completion_tokens });

    log({ type: 'runtime_init', content: res.content.slice(0, 2000) });
    console.log('✅ Runtime AI initialized');
    console.log(`  📊 Tokens — Runtime: ${formatTokens(state.runtimeTokens)}/${formatTokens(MAX_TOKENS)} | Player: ${formatTokens(state.playerTokens)}/${formatTokens(MAX_TOKENS)}\n`);
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
    state.playerTokens = playerRes.usage.total_tokens;
    state.playerMsgPairs.push({ completionTokens: playerRes.usage.completion_tokens });
    console.log(`  Player: ${playerAction.slice(0, 150)}${playerAction.length > 150 ? '...' : ''}`);

    trimContext(state);

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
    state.runtimeTokens = runtimeRes.usage.total_tokens;
    state.runtimeMsgPairs.push({ completionTokens: runtimeRes.usage.completion_tokens });

    const turnMs = Date.now() - turnStart;
    console.log(`  Engine: ${runtimeResult.slice(0, 200)}${runtimeResult.length > 200 ? '...' : ''} (${(turnMs / 1000).toFixed(1)}s)`);
    console.log(`  📊 Tokens — Runtime: ${formatTokens(state.runtimeTokens)}/${formatTokens(MAX_TOKENS)} | Player: ${formatTokens(state.playerTokens)}/${formatTokens(MAX_TOKENS)}\n`);

    trimContext(state);

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

  // ── End of game: SAVE block + lessons ──
  process.removeListener('SIGINT', onShutdown);
  process.removeListener('SIGTERM', onShutdown);

  const totalMs = Date.now() - startTime;
  console.log('\n═══ GENERATING SAVE & LESSONS ═══');

  // SAVE block from runtime
  state.runtimeMessages.push({ role: 'user', content: SAVE_PROMPT });
  try {
    const saveRes = await callAI(runtimeClient, RUNTIME, state.runtimeMessages);
    const saveBlock = extractSaveBlock(saveRes.content);
    if (saveBlock) {
      writeSave(saveBlock);
      console.log('  💾 SAVE block written');
    } else {
      writeSave(saveRes.content);
      console.log('  ⚠️  SAVE block (raw output)');
    }
    state.runtimeMessages.push({ role: 'assistant', content: saveRes.content });
  } catch (err) {
    console.log('  ⚠️  SAVE block failed');
  }

  // Lessons from player
  const lessonsPrompt = `Game đã kết thúc! Bạn chơi ${state.turn} lượt. Hãy tổng hợp kinh nghiệm:\n1. Chiến lược hiệu quả\n2. Sai lầm cần tránh\n3. Lời khuyên cho lần sau\nViết bằng tiếng Việt, markdown, ngắn gọn.`;

  state.playerMessages.push({ role: 'user', content: lessonsPrompt });
  try {
    const lessonsRes = await callAI(playerClient, PLAYER, state.playerMessages);
    writeLessons(lessonsRes.content);
    console.log('  📝 Lessons file written');
  } catch (err) {
    console.log('  ⚠️  Lessons skipped');
  }

  console.log(`\n═══ TEST COMPLETE ═══`);
  console.log(`   Turns: ${state.turn} | Time: ${(totalMs / 1000).toFixed(1)}s`);

  log({ type: 'summary', turns: state.turn, gameOver: state.gameOver, totalMs,
    config: { runtime: RUNTIME.model, player: PLAYER.model } });

  closeSession(state.turn, state.gameOver, totalMs);

  writeFileSync(RESULT_PATH, JSON.stringify({
    turns: state.turn, gameOver: state.gameOver, totalMs,
    lastResponse: state.runtimeLastResponse.slice(-3000),
    config: { runtime: RUNTIME.model, player: PLAYER.model },
  }, null, 2));
  console.log(`   Result: game_result.json`);

  if (state.gameOver && existsSync(STATE_PATH)) unlinkSync(STATE_PATH);
  else console.log(`   Resume: npm run play -- --resume`);
}
