<!--
===============================================================================
FILE: 07_hardware.md
MODULE: Rules / Hardware

Mục đích:
Định nghĩa slot của home lab, tổng CU, mua bán phần cứng, thuê cloud và
cách Project tiêu thụ compute.

Tác dụng:
Compute là nút thắt vật lý của game: kiến trúc càng mạnh càng đói GPU,
buộc người chơi đầu tư phần cứng theo nhịp thị trường (Content).

Trách nhiệm:
- Định nghĩa slot và nâng cấp.
- Định nghĩa tổng CU và tích lũy CU-month.
- Định nghĩa mua/bán/thuê.
===============================================================================
-->

# Hardware

## Slots

- The home lab has **4 slots**. A one-time upgrade — *Rewire the lab*, $2,000, available any time — raises it to **8 slots**.
- Each piece of Hardware occupies the slots listed in the Content.

## Compute

- Total **TFLOPS/mo** = sum of installed Hardware TFLOPS + active cloud units.
- During a Project, compute accumulates monthly: **TFLOPS-months += current TFLOPS/mo**.
- Neural Architectures (compute requirement > 0 in the Content) cannot start with total TFLOPS/mo = 0, and require the GPUT technology.

## Buying and selling

- Buying (instant): any shop item whose availability date has passed (Content). Upkeep starts the month of purchase (Economy rule).
- Selling (instant): returns 50% of the purchase price. Not allowed during an active Project.

## Cloud rental (available per the Event Calendar)

- $1,000 per month per **+1000 TFLOPS** unit; maximum 2 units.
- May only be active during Project months; deactivates automatically when the Project ends.

<!--
Tiếng Việt (tóm tắt):
Slot: home lab có 4 slot; nâng cấp "Đi lại dây điện" $2,000 (một lần, mua
lúc nào cũng được) → 8 slot. Mỗi phần cứng chiếm số slot ghi trong Content.

Compute: tổng TFLOPS/tháng = tổng TFLOPS phần cứng + cloud đang bật. Trong dự án,
mỗi tháng cộng dồn: TFLOPS-month += TFLOPS/tháng hiện tại. Kiến trúc neural (yêu cầu
compute > 0) không thể khởi động khi TFLOPS = 0 và cần công nghệ GPUT.

Mua/bán: mua tức thời các món đã đến ngày bán; phí vận hành tính từ tháng
mua. Bán lại thu 50% giá gốc; không được bán khi đang chạy dự án.

Cloud (mở theo Event Calendar): $1,000/tháng cho mỗi đơn vị +1000 TFLOPS, tối đa
2 đơn vị; chỉ bật được trong các tháng có dự án; tự tắt khi dự án kết thúc.
-->
