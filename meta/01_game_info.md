<!--
===============================================================================
FILE: meta/01_game_info.md
MODULE: Meta / Game Info

Mục đích:
Thẻ thông tin định danh của game: tên, phiên bản, thể loại, chương, mục
tiêu, ngôn ngữ, chế độ UI.

Tác dụng:
- Là "hộp game" chính thức — nơi DUY NHẤT ghi phiên bản và thể loại.
- Màn hình About (PART 6) render trực tiếp thẻ này cho người chơi xem.

Lưu ý cho người phát triển:
Tăng phiên bản game ở đây VÀ trong package.json khi thay đổi luật/dữ liệu.
Định dạng SAVE block cũng mang số phiên bản (ui/04_save_format.md).
===============================================================================
-->

# Game Info

| Field | Value |
|---|---|
| Title | 🏭 LLM TYCOON |
| Version | 0.3 |
| Chapter | 1 of 3 — *Home Lab* |
| Genre | Text-based business simulation (tycoon) |
| Setting | Real AI history, 2013 onwards |
| Goal | Train the world's first LLM |
| Players | 1 |
| Playtime | Multiple sessions; progress carried by SAVE blocks |
| Languages | Any — the Game Engine speaks the player's language |
| UI | 🖥️ Desktop (landscape) or 📱 Mobile (portrait), chosen at boot |
| Randomness | None — every outcome is computed; only narration varies |

The **About** screen shows this card, followed by a 2–3 line pitch written in the player's language.

<!--
Tiếng Việt (tóm tắt):
Thẻ game: LLM TYCOON v0.3, chương 1/3 "Home Lab"; thể loại mô phỏng kinh
doanh dạng văn bản; bối cảnh lịch sử AI thật 2013–2020; mục tiêu huấn luyện
LLM đầu tiên của thế giới trước 2021; 1 người chơi; chơi nhiều phiên nhờ
SAVE block; mọi ngôn ngữ; 2 chế độ UI (desktop ngang / mobile dọc); không
có yếu tố ngẫu nhiên về số liệu — chỉ phần kể chuyện là biến hóa.
Màn hình About hiển thị đúng thẻ này + 2–3 dòng giới thiệu theo ngôn ngữ
người chơi.
-->
