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

A Project is declared with a fixed plan: an Architecture, a Task, a Dataset, a number of months, and a focus allocation. Once started, the committed months fill the Company's main activity until the Project completes or is cancelled.

The special endgame effort to train the first Large Language Model is also a Project, with additional requirements defined by the Rules.

---

## Attributes

A Project may be associated with information such as:

* Model name
* Architecture
* Task
* Dataset
* Committed months and months elapsed
* Focus allocation (Data / Model / Training / Eval)
* Compute accumulated (CU-months)

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

Project được khai báo với kế hoạch cố định: Architecture, Task, Dataset, số
tháng, và phân bổ trọng tâm. Khi đã bắt đầu, các tháng cam kết chiếm hoạt
động chính của Company cho đến khi hoàn thành hoặc hủy.

Nỗ lực cuối game — huấn luyện Large Language Model đầu tiên — cũng là một
Project, với các yêu cầu bổ sung do Rules định nghĩa.

Thuộc tính: tên Model; Architecture; Task; Dataset; số tháng cam kết/đã qua;
phân bổ trọng tâm (Data/Model/Training/Eval); compute tích lũy (CU-month).

Quan hệ: do Company thực hiện; tiêu thụ tháng và compute; hoàn thành tạo
đúng một Model; hủy thì không tạo gì; Project đang chạy nằm trong SAVE Block.
-->
