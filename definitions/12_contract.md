<!--
===============================================================================
FILE: 12_contract.md
MODULE: Definitions / Contract

Mục đích:
Định nghĩa khái niệm Contract trong LLM Tycoon.

Tác dụng:
Thiết lập ý nghĩa thống nhất của Contract — công việc làm thuê cho khách
hàng — trước khi Rules mô tả việc nhận và hoàn thành hợp đồng.

Trách nhiệm:
- Định nghĩa Contract.
- Không định nghĩa luật.
- Không định nghĩa danh sách hợp đồng cụ thể (nằm ở content/).
===============================================================================
-->

# Contract

---

## Definition

A Contract is a one-time client job: the client specifies requirements, the Company commits months of work, and the client pays a fixed amount on completion.

Contracts trade time for reliable money and modest reputation. They become available as the Company's Fame grows and time progresses.

---

## Attributes

A Contract may be associated with information such as:

* Identifier (ID)
* Client and job description
* REP threshold
* Requirements (Technologies, Datasets)
* Committed months
* Payment
* Bonus condition

The concrete values are defined in the Content.

---

## Relationships

* A Contract is offered to a Company when its REP threshold is reached.
* An accepted Contract consumes committed months as the main activity.
* A completed Contract yields Cash and REP.
* Each Contract may be completed at most once.

<!--
Tiếng Việt:
Contract là công việc làm thuê một lần: khách hàng nêu yêu cầu, Company cam
kết số tháng làm việc, khách trả số tiền cố định khi hoàn thành.

Contract đổi thời gian lấy tiền ổn định và chút danh tiếng. Hợp đồng xuất
hiện dần khi Fame của Company tăng và thời gian trôi qua.

Thuộc tính: ID; khách hàng và mô tả; ngưỡng Fame và Ngày tháng; yêu cầu 
(Technology, Dataset); số tháng cam kết; tiền công; điều kiện thưởng. Giá trị cụ thể nằm
ở Content.

Quan hệ: được mở khi REP đạt ngưỡng; khi nhận sẽ chiếm các tháng cam kết;
hoàn thành nhận Cash và REP; mỗi Contract chỉ làm được một lần.
-->
