<!--
===============================================================================
FILE: 10_model.md
MODULE: Definitions / Model

Mục đích:
Định nghĩa khái niệm Model trong LLM Tycoon.

Tác dụng:
Thiết lập ý nghĩa thống nhất của Model — sản phẩm trung tâm của cả trò chơi
— trước khi Rules mô tả cách xây dựng, đánh giá và phát hành.

Trách nhiệm:
- Định nghĩa Model.
- Không định nghĩa luật.
- Không định nghĩa gameplay.
===============================================================================
-->

# Model

---

## Definition

A Model is a trained artificial intelligence system produced by completing a Project.

A Model is built at one Scale from one Architecture, targets one Task, and was trained on a Dataset mixture (1 to 3 Datasets) with a recorded focus allocation. Its overall capability is expressed as Quality (Q, 0.0–100.0).

A completed Model is released at most once: open-sourced, licensed, or launched as a product.

---

## Attributes

A Model may be associated with information such as:

* Name
* Architecture
* Scale
* Task
* Dataset name(s) and Domain(s) used
* Focus allocation (Data / Model / Training / Eval)
* Quality (Q)
* Remaining Artifacts
* Reception
* Release type
* Completion date

---

## Relationships

* A Model is owned by a Company.
* A Model is produced by a Project.
* A Model may generate Cash, Fame, or an Income Stream upon release.
* A Model may be submitted to a Competition.
* A Model exists as part of the Game State.

<!--
Tiếng Việt:
Model là một hệ thống trí tuệ nhân tạo đã huấn luyện xong, tạo ra khi hoàn
thành một Project.

Model được xây ở một Scale từ đúng một Architecture, nhắm một Task, huấn
luyện trên hỗn hợp 1–3 Dataset và lưu lại phân bổ Focus. Năng lực tổng thể
thể hiện bằng Quality (Q, 0–100).

Model hoàn thành chỉ được phát hành tối đa một lần: mã nguồn mở, bán bản
quyền, hoặc ra mắt thành sản phẩm.

Thuộc tính: tên; Architecture; Scale; Task; tên/domain của Dataset; Focus;
Quality; Artifacts còn lại; đánh giá tiếp nhận; kiểu phát hành; ngày hoàn thành.

Quan hệ: thuộc Company; do Project tạo ra; khi phát hành có thể sinh Cash,
Fame hoặc Income Stream; có thể nộp thi Competition; là một phần Game State.
-->
