/**
 * prompts.js — all the static prompt strings live here so the game loop
 *              (game.js) is just orchestration, not prompt engineering.
 *
 * The runtime AI is instructed by the game doc itself; these prompts only
 * cover the Player AI and meta-requests (save block, lessons summary).
 */

import { GAME_OVER_KEYWORDS } from './config.js';

export const PLAYER_SYSTEM_PROMPT = `Chào mừng bạn đến với LLM Tycoon! Bạn đang chơi một game mô phỏng xây dựng công ty AI từ năm 2013. Mỗi lượt bạn sẽ được hiển thị trạng thái hiện tại và menu các hành động có thể thực hiện.

Bạn là một người chơi bình thường, hãy chơi tự nhiên và luôn đưa ra quyết định. Trả lời bằng tiếng Việt, chỉ nói hành động bạn muốn làm. Đừng phân tích hay giải thích.

Mách nhỏ: khi bạn thấy bất kỳ cụm từ nào trong các cụm sau đây xuất hiện trong phản hồi của Game Engine, đó là dấu hiệu game đã kết thúc — hãy trả lời ngắn gọn "đồng ý" (không cần phân tích) và đợi hệ thống tổng kết:
${GAME_OVER_KEYWORDS.map((k) => `- "${k}"`).join('\n')}`;

export const SAVE_PROMPT = `Hãy xuất SAVE block theo đúng định dạng đã mô tả trong tài liệu (khung === SAVE LLM-TYCOON ... === END SAVE ===). Không thêm giải thích, chỉ in ra block thôi.`;

/**
 * Final-turn reflection prompt sent to the player after the game ends.
 */
export function buildLessonsPrompt(turn) {
  return `Game đã kết thúc! Bạn chơi ${turn} lượt. Hãy tổng hợp kinh nghiệm:
1. Chiến lược hiệu quả
2. Sai lầm cần tránh
3. Lời khuyên cho lần sau
Viết bằng tiếng Việt, markdown, ngắn gọn.`;
}

/**
 * Appends the lessons chain (if any) to the system prompt — gives the player
 * memory across runs/continues.
 */
export function buildPlayerSystemPrompt(lessons) {
  let prompt = PLAYER_SYSTEM_PROMPT;
  if (lessons) {
    prompt += `\n\n📝 Kinh nghiệm từ lần chơi trước:\n${lessons}`;
  }
  return prompt;
}
