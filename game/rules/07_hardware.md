<!--
===============================================================================
FILE: 07_hardware.md
MODULE: Rules / Hardware

Mục đích:
Định nghĩa slot của home lab, tổng TFLOPS, mua bán phần cứng, thuê cloud và
cách Project tiêu thụ compute.

Tác dụng:
Compute là nút thắt vật lý của game: kiến trúc càng mạnh càng đói GPU,
buộc người chơi đầu tư phần cứng theo nhịp thị trường (Content).

Trách nhiệm:
- Định nghĩa slot và nâng cấp.
- Định nghĩa tổng TFLOPS và tích lũy TFLOPS-month.
- Định nghĩa mua/bán/thuê.
===============================================================================
-->

# Hardware

## Slots

- The home lab has **4 slots**. A one-time upgrade — *Rewire the lab*, $4,000, available any time — raises it to **8 slots**.
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
- Selling (instant): returns 50% of the purchase price. Not allowed during an active Project, and never allowed if the sale would make installed Hardware VRAM lower than the Inference VRAM reserved by active Product streams.

## Cloud rental (available per the Event Calendar)

- $1,000 per month per **+1000 TFLOPS** unit (+120 GB VRAM); maximum 2 units.
- Cloud rental may be activated while a Project is active, or in the same instant-action chain immediately before starting a Project. If that Project fails validation or is not started in the same reply, cancel the activation with no charge.
- Cloud rental supplies compute and VRAM only during months whose main action starts or continues that Project. It is inactive and costs nothing during forced Freelance pauses.
- It deactivates before release choices when the Project ends. Cloud VRAM can never satisfy the persistent Inference VRAM reservation of a Product.

<!--
Tiếng Việt (tóm tắt):
Slot: home lab có 4 slot; nâng cấp "Đi lại dây điện" $4,000 (một lần, mua
lúc nào cũng được) → 8 slot. Mỗi phần cứng chiếm số slot ghi trong Content.

Compute & VRAM: tổng TFLOPS/tháng và tổng VRAM = tổng phần cứng + cloud đang bật. 
VRAM khả dụng = Tổng VRAM - VRAM đang bị chiếm bởi Product.
Trong dự án, mỗi tháng cộng dồn: TFLOPS-month += TFLOPS/tháng hiện tại. Kiến trúc neural 
không thể khởi động khi TFLOPS < 100 và cần công nghệ GPUT.

Mua/bán: mua tức thời các món đã đến ngày bán; phí vận hành tính từ tháng
mua. Bán lại thu 50% giá gốc; không được bán khi đang chạy dự án hoặc nếu
việc bán làm VRAM phần cứng thấp hơn VRAM suy luận đang dành cho Product.

Cloud (mở theo Event Calendar): $1,000/tháng cho mỗi đơn vị +1000 TFLOPS và
+120 GB VRAM, tối đa 2 đơn vị. Có thể bật ngay trước khi bắt đầu Project trong
cùng chuỗi lệnh; chỉ có hiệu lực và tính phí trong tháng Project, tự tắt trước
lựa chọn phát hành khi Project kết thúc, và không cấp VRAM suy luận lâu dài.
-->
