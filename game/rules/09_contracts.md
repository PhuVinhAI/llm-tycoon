<!--
===============================================================================
FILE: 09_contracts.md
MODULE: Rules / Contracts

Mục đích:
Định nghĩa cách nhận và hoàn thành Contract.

Tác dụng:
Contract là nguồn tiền ổn định giữa các dự án model — đổi thời gian lấy
tiền chắc chắn, phù hợp giai đoạn cần vốn mua GPU.

Trách nhiệm:
- Định nghĩa vòng đời hợp đồng: mở → nhận → làm → nhận tiền.
- Không liệt kê hợp đồng cụ thể (nằm ở content/).
===============================================================================
-->

# Contracts

## Availability

- Contracts unlock when the Company's Fame reaches their threshold AND the current in-game date is ≥ their Date requirement (Content). The engine announces newly available Contracts in the Events step.
- Each Contract may be completed **once**. At most one Contract, Project, or Paper is active at a time (Actions rule).

## Accepting and working

- Browsing and selecting a Contract for validation is instant. Confirming a valid Contract **accepts it as this month's main action and immediately advances month 1**; requirements (Technologies, Datasets) are checked before confirmation and must all hold.
- The listed months become committed Contract months. After month 1, the Player must manually execute the "Continue Contract" main action for each remaining month.

## Mid-Contract Dilemmas

When a Contract first reaches `months elapsed == floor(M ÷ 2)` (for M ≥ 2), the engine marks `dilemma_done=yes`, pauses, and presents a **Contract Dilemma** (Content). Each Contract evaluates this midpoint exactly once; changing `M` never triggers it again.
- Render the Dilemma (S10) and wait for the Player's choice. 
- The outcome may modify the total months (`M`), the final payment (`Pay`), or grant immediate Cash/Fame. Track any `Pay` modifier (`pay_mod`) in the Game State.
- Every `Pay ±x%` modifier is `±x%` of the Contract's listed base pay. At completion calculate `listed base pay × 1.2` when the bonus Technology is owned, then add the signed dilemma percentage of the unmodified listed base pay, then round to the nearest dollar.

## Completion & Payout

- **No partial payments:** The Company receives $0 during the intermediate months of a Contract.
- **On the final month:** When the final committed month is completed, the client pays the final amount defined above. No other multiplier or retroactive payment applies.
- Fame +100. The Contract counts toward E-Lv (Skills rule).
- Cancelling mid-contract: Fame −200, no pay (Actions rule).

<!--
Tiếng Việt (tóm tắt):
Mở khóa: hợp đồng xuất hiện khi thỏa mãn CẢ ngưỡng Fame và Ngày tháng (Content);
engine thông báo ở bước Sự kiện. Mỗi hợp đồng chỉ làm một lần; tối đa 1 hợp đồng,
dự án hoặc bài báo chạy cùng lúc.

Nhận & làm: duyệt/chọn là tức thời; xác nhận nhận hợp đồng là hành động chính
và chạy ngay tháng 1. Điều kiện (công nghệ, dataset) phải thỏa trước khi xác
nhận; các tháng sau người chơi tự chọn Continue. Dilemma ở ⌊M/2⌋ chỉ xảy ra
một lần và được lưu bằng `dilemma_done`.

Hoàn thành: áp dụng công nghệ bonus ×1.2 lên tiền gốc trước, rồi cộng/trừ phần
trăm Dilemma tính trên tiền gốc chưa sửa; làm tròn đến dollar gần nhất. Fame
+100; tính vào E-Lv. Hủy giữa chừng: Fame −200, không được trả đồng nào.
-->
