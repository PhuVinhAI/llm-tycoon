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

## Compute & Capacity

- Total **TFLOPS/mo** = sum of installed Hardware TFLOPS + active cloud units.
- Total **VRAM** = sum of installed Hardware VRAM + active cloud units.
- **Inference VRAM** = sum of reserved VRAM from active Product streams.
- **Available VRAM** = Total VRAM − Inference VRAM.
- During a Project, compute accumulates monthly: **TFLOPS-months += current Total TFLOPS/mo**.
- Neural Architectures (compute requirement > 0 in the Content) cannot start with Total TFLOPS/mo < 100, and require the GPUT technology.

## Buying and selling

- Buying (instant): any shop item whose availability date has passed (Content). Upkeep starts the month of purchase (Economy rule).
- Selling (instant): returns 50% of the purchase price. Not allowed during an active Project.

## Cloud rental (available per the Event Calendar)

- $1,000 per month per **+1000 TFLOPS** unit (+120 GB VRAM); maximum 2 units.
- May only be active during Project months; deactivates automatically when the Project ends.

<!--
Tiếng Việt (tóm tắt):
Slot: home lab có 4 slot; nâng cấp "Đi lại dây điện" $2,000 (một lần, mua
lúc nào cũng được) → 8 slot. Mỗi phần cứng chiếm số slot ghi trong Content.

Compute & VRAM: tổng TFLOPS/tháng và tổng VRAM = tổng phần cứng + cloud đang bật. 
VRAM khả dụng = Tổng VRAM - VRAM đang bị chiếm bởi Product.
Trong dự án, mỗi tháng cộng dồn: TFLOPS-month += TFLOPS/tháng hiện tại. Kiến trúc neural 
không thể khởi động khi TFLOPS < 100 và cần công nghệ GPUT.

Mua/bán: mua tức thời các món đã đến ngày bán; phí vận hành tính từ tháng
mua. Bán lại thu 50% giá gốc; không được bán khi đang chạy dự án.

Cloud (mở theo Event Calendar): $1,000/tháng cho mỗi đơn vị +1000 TFLOPS, tối đa
2 đơn vị; chỉ bật được trong các tháng có dự án; tự tắt khi dự án kết thúc.
-->
