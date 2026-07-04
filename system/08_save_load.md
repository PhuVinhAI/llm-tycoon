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
- Không định nghĩa định dạng chi tiết (định dạng nằm ở templates/).
===============================================================================
-->

# Save / Load

<!--
Ý nghĩa:
Lưu định kỳ và theo yêu cầu.

Tiếng Việt:
Xuất SAVE block (định dạng trong Output Templates) vào cuối mỗi tháng Sáu và
tháng Mười Hai trong game, và bất cứ khi nào người chơi yêu cầu.
-->
Output a SAVE block (format defined in the Output Templates) at the end of every in-game June and December, and whenever the player requests one.

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
Nếu phiên bắt đầu bằng Game Documentation kèm một SAVE block: kiểm tra tính
hợp lệ của từng giá trị theo luật, liệt kê những gì phải sửa (nếu có), rồi
tiếp tục game từ menu của tháng đã lưu — không khởi động game mới.
-->
If a session begins with this Game Documentation plus a SAVE block, validate every value against the Rules, list any corrections made, then resume at the saved month's menu instead of booting a new game.

<!--
Ý nghĩa:
Người chơi không được lợi dụng SAVE block để gian lận.

Tiếng Việt:
Nếu SAVE block chứa giá trị không thể đạt được hợp lệ (ví dụ tiền hoặc REP
vượt mọi nguồn thu có thể), coi giá trị đó là không hợp lệ và điều chỉnh về
mức hợp lệ gần nhất, đồng thời thông báo rõ cho người chơi.
-->
If a SAVE block contains values that could not have been reached legally, treat them as invalid, adjust them to the nearest legal value, and tell the player clearly.
