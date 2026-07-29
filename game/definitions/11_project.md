<!--
===============================================================================
FILE: 11_project.md
MODULE: Definitions / Project

Mục đích:
Định nghĩa khái niệm Project trong LLM Tycoon.

Tác dụng:
Thiết lập ý nghĩa thống nhất của Project — cam kết nhiều tháng để tạo ra một
Model — trước khi Rules mô tả quy trình khai báo và tính Quality.

Trách nhiệm:
- Định nghĩa Project.
- Không định nghĩa luật.
- Không định nghĩa gameplay.
===============================================================================
-->

# Project

---

## Definition

A Project is a multi-month commitment by a Company to build a Model.

A Project is declared with a fixed plan: an Architecture, a Scale, an optional inherited Model, a Task, a Dataset mixture of 1 to 3 Datasets, a number of months, and a focus allocation. Once started, the committed months fill the Company's main activity until the Project completes or is cancelled.

The special endgame effort to train the first Large Language Model is also a Project, with additional requirements defined by the Rules.

---

## Attributes

A Project may be associated with information such as:

* Model name
* Architecture
* Scale
* Optional inherited Model
* Task
* Dataset mixture (1 to 3 Datasets)
* Committed months and months elapsed
* Focus allocation (Data / Model / Training / Eval)
* Compute accumulated (TFLOPS-months)
* Whether the one-time midpoint Dilemma evaluation is done

---

## Relationships

* A Project is conducted by a Company.
* A Project consumes months and compute.
* A completed Project produces exactly one Model.
* A cancelled Project produces nothing.
* An active Project is part of the Game State and appears in the SAVE Block.

<!--
Tiếng Việt:
Project là cam kết kéo dài nhiều tháng của Company để xây một Model.

Project được khai báo với kế hoạch cố định: Architecture, Scale, Model kế
thừa tùy chọn, Task, hỗn hợp 1–3 Dataset, số tháng và phân bổ trọng tâm. Khi
đã bắt đầu, các tháng cam kết chiếm hoạt động chính của Company cho đến khi
hoàn thành hoặc hủy.

Nỗ lực cuối game — huấn luyện Large Language Model đầu tiên — cũng là một
Project, với các yêu cầu bổ sung do Rules định nghĩa.

Thuộc tính: tên Model; Architecture; Scale; Model kế thừa; Task; 1–3 Dataset;
số tháng cam kết/đã qua; phân bổ trọng tâm (Data/Model/Training/Eval);
compute tích lũy (TFLOPS-month); cờ đã đánh giá Dilemma giữa dự án.

Quan hệ: do Company thực hiện; tiêu thụ tháng và compute; hoàn thành tạo
đúng một Model; hủy thì không tạo gì; Project đang chạy nằm trong SAVE Block.
-->
