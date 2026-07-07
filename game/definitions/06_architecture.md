<!--
===============================================================================
FILE: 06_architecture.md
MODULE: Definitions / Architecture

Mục đích:
Định nghĩa khái niệm Architecture (kiến trúc mô hình) trong LLM Tycoon.

Tác dụng:
Phân biệt rõ Architecture (bản thiết kế có thể huấn luyện) với Technology
(kiến thức mở khóa nó) và Model (sản phẩm cụ thể đã huấn luyện xong).

Trách nhiệm:
- Định nghĩa Architecture.
- Không định nghĩa luật.
- Không định nghĩa dữ liệu cụ thể (bảng thông số nằm ở content/).
===============================================================================
-->

# Architecture

---

## Definition

An Architecture is a family of model designs that a Company knows how to train.

An Architecture is granted by owning its corresponding Technology. It defines the baseline capability, the computing requirements, and the data requirements of Models built from it.

An Architecture is knowledge; a Model is a concrete product built from an Architecture.

---

## Attributes

An Architecture may be associated with information such as:

* Identifier (ID)
* Name
* Base Quality
* Compute requirement (CU-months)
* Minimum training months
* Minimum Dataset Size
* Ideal focus allocation

The concrete values are defined in the Content.

---

## Relationships

* An Architecture is granted by a Technology.
* An Architecture is combined with a Task and a Dataset to form a Project.
* Models are built from Architectures.

<!--
Tiếng Việt:
Architecture là một "họ thiết kế" mô hình mà Company biết cách huấn luyện.

Architecture được mở khóa bằng cách sở hữu Technology tương ứng. Nó xác định
năng lực nền, yêu cầu tính toán và yêu cầu dữ liệu của các Model xây từ nó.

Architecture là kiến thức; Model là sản phẩm cụ thể được huấn luyện từ một
Architecture.

Thuộc tính: ID; tên; Base Quality; yêu cầu CU-month; số tháng huấn luyện tối
thiểu; Size tối thiểu của Dataset; phân bổ trọng tâm lý tưởng. Giá trị cụ
thể nằm trong Content.

Quan hệ: được Technology mở khóa; kết hợp với Task và Dataset để tạo thành
Project; Model được xây từ Architecture.
-->
