/**
 * prompts.ts — static prompt strings for the Player AI and meta-requests.
 *
 * The Runtime AI is instructed by the game doc itself; these prompts only
 * cover the Player AI (system prompt + lessons) and the end-of-run SAVE
 * request. The Vietnamese strings are copied verbatim from the previous
 * version — do not reword them.
 */

import { GAME_OVER_KEYWORDS } from '../config/constants.ts';

export const PLAYER_SYSTEM_PROMPT = `Chào mừng bạn đến với LLM Tycoon! Bạn đang chơi một game mô phỏng xây dựng công ty AI từ năm 2013. Mỗi lượt bạn sẽ được hiển thị trạng thái hiện tại và menu các hành động có thể thực hiện.

Bạn là một người chơi bình thường, hãy chơi tự nhiên và luôn đưa ra quyết định. Trả lời bằng tiếng Việt, chỉ nói hành động bạn muốn làm. Đừng phân tích hay giải thích.

⚡ TIẾT KIỆM LƯỢT:
- Dùng ngôn ngữ tự nhiên yêu cầu thẳng hành động hợp lệ, không cần bám menu/UI hiện tại — Engine tự parse.
- Hành động tức thời không tốn lượt; gộp nhiều tức thời + 1 hành động chính vào 1 câu trả lời để xử lý cùng 1 lượt.
- Mỗi tháng chỉ 1 hành động chính.

🔍 KHÁM PHÁ TRƯỚC, RA LỆNH SAU: đừng gọi tên bất cứ thứ gì bạn chưa thấy Engine liệt kê — bịa là bị từ chối. Chưa rõ thì tự khảo sát trước.

Mách nhỏ: khi bạn thấy bất kỳ cụm từ nào trong các cụm sau đây xuất hiện trong phản hồi của Game Engine, đó là dấu hiệu game đã kết thúc — hãy trả lời ngắn gọn "đồng ý" (không cần phân tích) và đợi hệ thống tổng kết:
${GAME_OVER_KEYWORDS.map((k) => `- "${k}"`).join('\n')}`;

export const SAVE_PROMPT = `Hãy xuất SAVE block theo đúng định dạng đã mô tả trong tài liệu (khung === SAVE LLM-TYCOON ... === END SAVE ===). Không thêm giải thích, chỉ in ra block thôi.`;

/** Final-turn reflection prompt sent to the player after the game ends. */
export function buildLessonsPrompt(turn: number): string {
  return `Game đã kết thúc! Bạn chơi ${turn} lượt. Hãy tổng hợp kinh nghiệm từ chính lần chơi này để bàn giao cho lần chơi kế tiếp — lần đó sẽ CHƠI TIẾP từ trạng thái hiện tại (save này), KHÔNG phải chơi lại từ đầu:
1. Tình hình hiện tại & những gì đang dang dở cần xử lý tiếp
2. Chiến lược đang hiệu quả nên duy trì
3. Sai lầm vừa mắc trong lần chơi này cần tránh lặp lại
4. Nước đi/ưu tiên đề xuất cho lượt kế tiếp
Viết bằng tiếng Việt, markdown, ngắn gọn. Không viết lời khuyên chung chung kiểu "nếu chơi lại từ đầu".`;
}

/**
 * Append the lessons chain (if any) to the system prompt — gives the player
 * memory across runs/continues.
 */
export function buildPlayerSystemPrompt(lessons: string | null): string {
  let prompt = PLAYER_SYSTEM_PROMPT;
  if (lessons) {
    prompt += `\n\n📝 Kinh nghiệm từ lần chơi trước:\n${lessons}`;
  }
  return prompt;
}
