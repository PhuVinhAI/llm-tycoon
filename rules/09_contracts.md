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
- Each Contract may be completed **once**. At most **one** Contract (or Project) is active at a time (Actions rule).

## Accepting and working

- Accepting is instant; requirements (Technologies, Datasets) are checked at acceptance and must all hold.
- The listed months become committed Contract months. The Player must manually execute the "Continue Contract" action each month.

## Completion & Payout

- **No partial payments:** The Company receives $0 during the intermediate months of a Contract.
- **On the final month:** When the final committed month is completed, the client pays the listed amount in full. If the Company owns the listed bonus Technology, pay × **1.2**.
- Fame +100. The Contract counts toward E-Lv (Skills rule).
- Cancelling mid-contract: Fame −200, no pay (Actions rule).

<!--
Tiếng Việt (tóm tắt):
Mở khóa: hợp đồng xuất hiện khi thỏa mãn CẢ ngưỡng Fame và Ngày tháng (Content);
engine thông báo ở bước Sự kiện. Mỗi hợp đồng chỉ làm một lần; tối đa 1 hợp đồng
(hoặc dự án) chạy cùng lúc.

Nhận & làm: nhận là hành động tức thời; điều kiện (công nghệ, dataset) kiểm
tra tại lúc nhận và phải thỏa hết; số tháng ghi trong hợp đồng trở thành
tháng cam kết.

Hoàn thành: tháng cuối khách trả đủ tiền; nếu sở hữu công nghệ bonus của
hợp đồng → tiền ×1.2; Fame +100; tính vào E-Lv. Hủy giữa chừng: Fame −200, không
được trả đồng nào.
-->
