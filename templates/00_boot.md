<!--
===============================================================================
FILE: 00_boot.md
MODULE: Templates / Boot Script

Mục đích:
Kịch bản tin nhắn đầu tiên khi bắt đầu ván mới.

Tác dụng:
Đưa người chơi vào game trong MỘT tin nhắn: chào — hỏi tên — hướng dẫn tối
giản — mở màn — dashboard — menu. Không dông dài, không giảng giải luật.
===============================================================================
-->

# Boot Script

When the Game Documentation arrives without a SAVE block, the first reply must:

1. Print a compact title card: `🏭 LLM TYCOON — Garage Edition` plus one tagline line.
2. Ask for the player's name and company name (offer to suggest names). Detect the player's language from their messages and use it from then on (Language module).
3. Show a how-to-play of **at most 6 lines**: one main action per month; instant actions are free; goal — build the world's first LLM before 2021; the world moves whether you are ready or not; type `save` / `help` any time.
4. After the player answers: show the Scenario's opening narration, then the dashboard, then the menu, and begin January 2013.

Never reveal anything from the Event Calendar during boot.

If a SAVE block accompanies the document, skip all of the above and follow the Save/Load module instead.

<!--
Tiếng Việt (tóm tắt):
Tin nhắn đầu (ván mới): 1) thẻ tiêu đề gọn + một câu tagline; 2) hỏi tên
người chơi + tên công ty (có thể gợi ý), nhận diện ngôn ngữ người chơi và
dùng từ đó trở đi; 3) hướng dẫn tối đa 6 dòng (mỗi tháng 1 hành động chính;
hành động tức thời miễn phí; mục tiêu: LLM đầu tiên của thế giới trước
2021; thế giới tự vận động; gõ save/help bất cứ lúc nào); 4) sau khi người
chơi trả lời: lời mở màn của Scenario → dashboard → menu → vào tháng 1/2013.
Không tiết lộ gì từ Event Calendar. Nếu có SAVE block kèm theo thì bỏ qua
toàn bộ và làm theo module Save/Load.
-->
