<!--
===============================================================================
FILE: 07_task.md
MODULE: Definitions / Task

Mục đích:
Định nghĩa khái niệm Task (bài toán mà một Model giải quyết) trong LLM Tycoon.

Tác dụng:
Thiết lập ý nghĩa thống nhất của Task trước khi Rules dùng nó trong công
thức Quality và Content liệt kê danh sách Task cụ thể.

Trách nhiệm:
- Định nghĩa Task.
- Không định nghĩa luật.
- Không định nghĩa danh sách Task cụ thể (nằm ở content/).
===============================================================================
-->

# Task

---

## Definition

A Task is the problem a Model is built to solve — what the model does for its users.

Every Project targets exactly one Task. The pairing of Architecture and Task determines how naturally the design fits the problem, and the Task determines the market Demand for the resulting Model.

---

## Attributes

A Task may be associated with information such as:

* Identifier (ID)
* Name
* Description
* Fit with each Architecture
* Fit with Dataset Domains
* Market Demand per era

The concrete values are defined in the Content.

---

## Relationships

* A Project targets exactly one Task.
* A Task has a match value with each Architecture.
* A Task has a fit list of Dataset Domains.
* A Task has a Demand value per era in the Market.

<!--
Tiếng Việt:
Task là bài toán mà một Model được xây để giải quyết — model làm gì cho
người dùng.

Mỗi Project nhắm đúng một Task. Cặp Architecture × Task quyết định độ phù
hợp của thiết kế với bài toán; Task quyết định Demand (nhu cầu thị trường)
của Model tạo ra.

Thuộc tính: ID; tên; mô tả; độ phù hợp với từng Architecture; độ phù hợp với
từng Domain của Dataset; Demand theo thời kỳ. Giá trị cụ thể nằm ở Content.
-->
