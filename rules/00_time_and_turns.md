<!--
===============================================================================
FILE: 00_time_and_turns.md
MODULE: Rules / Time and Turns

Mục đích:
Định nghĩa dòng thời gian của game và trình tự xử lý chuẩn của một tháng.

Tác dụng:
Đây là "vòng lặp engine" — mọi tháng đều chạy đúng 7 bước theo đúng thứ tự,
nhờ đó kết quả luôn nhất quán và có thể tái lập. Đồng thời quy định cách xử
lý cam kết nhiều tháng (dự án, hợp đồng) để nhịp chơi nhanh gọn.

Trách nhiệm:
- Định nghĩa mốc thời gian bắt đầu/kết thúc.
- Định nghĩa Turn và trình tự xử lý mỗi tháng.
- Định nghĩa cách xử lý gộp nhiều tháng.
===============================================================================
-->

# Time and Turns

## Timeline

- The game begins in **January 2013** and ends no later than **December 2020**.
- One Turn equals one in-game month.
- Each month, the Player chooses exactly **one main action**, plus any number of **instant actions** (see Actions).

## Order of operations — every month, in this exact order

1. **Events** — check the Event Calendar (Content) for entries matching the current month, plus any threshold events whose condition became true (REP thresholds, releases). Fire them and apply their effects.
2. **Action** — apply this month's main action (or the next committed month of an active Project/Contract).
3. **Streams** — pay out all active Income Streams.
4. **Costs** — subtract fixed monthly costs: living, salaries, hardware upkeep, active cloud rental.
5. **Completions** — resolve whatever finished this month: Project quality computation, Contract payment, Skill level-ups, expired Income Streams.
6. **Checks** — bankruptcy, win and lose conditions.
7. **Report** — output per the active UI Profile's screens (UI part): event cards → month ledger → dashboard → menu.

## Committed Months (Step-by-Step)

- When a Project, Contract, or Paper is active, it does **not** auto-advance. The Player must manually choose the "Continue" main action each month.
- Mid-way through a Project, Contract, or Paper (when `months elapsed == floor(M ÷ 2)`), the game pauses for a Dilemma.
- This returns the Player to the Dashboard every month, allowing them to perform instant actions (buy hardware, hire staff, check the market, etc.) while the commitment is ongoing.
- The Action Menu (S5) dynamically updates to lock out other main actions until the commitment completes or is cancelled.

<!--
Tiếng Việt (tóm tắt):
Game chạy từ 01/2013 đến muộn nhất 12/2020; 1 Turn = 1 tháng; mỗi tháng chọn
đúng 1 hành động chính + các hành động tức thời tùy ý.

Trình tự mỗi tháng (bắt buộc đúng thứ tự): 1 Sự kiện → 2 Hành động → 3 Dòng
thu nhập → 4 Chi phí cố định → 5 Hoàn tất (tính Quality, trả tiền hợp đồng,
lên cấp) → 6 Kiểm tra thắng/thua/phá sản → 7 Báo cáo theo khung UI.

Các tháng đã cam kết (dự án/hợp đồng) tự chạy từng tháng, chỉ dừng
khi: sự kiện cần lựa chọn, dự án/hợp đồng xong, có cảnh báo, hoặc hết chuỗi.
-->
