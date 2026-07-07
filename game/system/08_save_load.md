<!--
===============================================================================
FILE: 08_save_load.md
MODULE: Save / Load

Mục đích:
Định nghĩa trách nhiệm của AI đối với việc lưu và khôi phục Game State.

Tác dụng:
Hội thoại ChatGPT có giới hạn độ dài; người chơi cần mang tiến trình sang
hội thoại mới. SAVE block là "file save" của game — AI phải xuất nó định kỳ
và biết đọc lại nó để tiếp tục đúng chỗ cũ.

Trách nhiệm:
- Định nghĩa khi nào phải xuất SAVE block.
- Định nghĩa cách khôi phục từ SAVE block.
- Không định nghĩa định dạng chi tiết (định dạng nằm ở ui/04_save_format.md).
===============================================================================
-->

# Save / Load

<!--
Ý nghĩa:
Lưu định kỳ và theo yêu cầu.

Tiếng Việt:
Xuất SAVE block (định dạng ở màn S8, phần UI) vào cuối mỗi tháng Sáu và
tháng Mười Hai trong game, và bất cứ khi nào người chơi yêu cầu.
-->
Output a SAVE block (format defined in the UI part, screen S8) at the end of every in-game June and December, and whenever the player requests one.

<!--
Ý nghĩa:
SAVE block phải đầy đủ để dựng lại toàn bộ Game State.

Tiếng Việt:
SAVE block phải chứa đủ thông tin để dựng lại chính xác toàn bộ Game State —
không phụ thuộc vào trí nhớ hội thoại.
-->
A SAVE block must contain everything needed to reconstruct the exact Game State, without relying on conversation memory.

<!--
Ý nghĩa:
Cách khôi phục.

Tiếng Việt:
Nếu phiên bắt đầu bằng Game Documentation kèm một SAVE block: áp dụng dòng
`settings` (ngôn ngữ + UI Profile) trước, kiểm tra tính hợp lệ của từng giá
trị theo luật, liệt kê những gì phải sửa (nếu có), rồi tiếp tục game từ menu
của tháng đã lưu — không khởi động game mới, không qua Main Menu.
-->
If a session begins with this Game Documentation plus a SAVE block, apply its `settings` line first (language and UI Profile), validate every value against the Rules, list any corrections made, then resume at the saved month's menu instead of booting a new game.

<!--
Ý nghĩa:
Người chơi không được lợi dụng SAVE block để gian lận, nhưng AI cũng không được tự suy diễn.

Tiếng Việt:
Khi nạp SAVE block, TUYỆT ĐỐI TIN TƯỞNG các chỉ số tích lũy (Cash, RP, Fame, Tháng). SAVE block không chứa lịch sử hành động, do đó KHÔNG BAO GIỜ tự suy diễn lịch sử thu chi để "truy thu" hay trừ tiền của người chơi. Chỉ điều chỉnh các giá trị vi phạm giới hạn cứng (ví dụ: Level > 5, hoặc slot > 8).
-->
When loading a SAVE block, TRUST the accumulated values (Cash, RP, Fame, Date) completely. The SAVE block does not contain action history, so NEVER attempt to recalculate past income or expenses, and NEVER deduct money or RP retroactively. Only adjust values that violate hard caps (e.g., Skill Levels > 5, or slots > 8).
