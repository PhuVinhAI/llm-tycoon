<!--
===============================================================================
FILE: 09_hardware.md
MODULE: Definitions / Hardware

Mục đích:
Định nghĩa khái niệm Hardware (phần cứng tính toán) trong LLM Tycoon.

Tác dụng:
Thiết lập ý nghĩa thống nhất của Hardware và đơn vị CU trước khi Rules mô tả
việc mua bán, lắp đặt và tiêu thụ compute.

Trách nhiệm:
- Định nghĩa Hardware.
- Không định nghĩa luật.
- Không định nghĩa danh mục phần cứng cụ thể (nằm ở content/).
===============================================================================
-->

# Hardware

---

## Definition

Hardware is physical computing equipment owned by a Company, primarily GPUs.

Each piece of Hardware occupies one or more slots in the Company's facility and provides TeraFLOPS per month (TFLOPS/mo). The Company's total TFLOPS/mo is the sum over all installed Hardware, plus any rented cloud compute.

Training Models consumes compute measured in TFLOPS-months.

---

## Attributes

A piece of Hardware may be associated with information such as:

* Name
* Price
* TFLOPS provided per month
* Slots occupied
* Upkeep cost
* Availability date

The concrete values are defined in the Content.

---

## Relationships

* Hardware is owned by a Company and installed in its facility slots.
* Hardware provides the compute consumed by Projects.
* Hardware may be bought and sold as permitted by the Rules.
* Cloud compute is rented Hardware capacity that occupies no slot.

<!--
Tiếng Việt:
Hardware là thiết bị tính toán vật lý của Company, chủ yếu là GPU.

Mỗi Hardware chiếm một hoặc nhiều slot trong cơ sở của Company và cung cấp
TFLOPS mỗi tháng (TFLOPS/mo). Tổng TFLOPS/mo của Company = tổng của mọi Hardware đã lắp
+ cloud thuê thêm (nếu có).

Huấn luyện Model tiêu thụ compute tính bằng TFLOPS-month.

Thuộc tính: tên; giá; TFLOPS cung cấp mỗi tháng; số slot chiếm; chi phí vận
hành; ngày có bán. Giá trị cụ thể nằm ở Content.

Quan hệ: thuộc sở hữu Company, lắp vào slot; cung cấp compute cho Project;
được mua/bán theo Rules; cloud là công suất thuê, không chiếm slot.
-->
