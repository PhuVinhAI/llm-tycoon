<!--
===============================================================================
FILE: 03_resource.md
MODULE: Definitions / Resource

Mục đích:
Định nghĩa các tài nguyên (Resource) mà Company sở hữu trong LLM Tycoon:
Cash, RP, REP và Income Stream.

Tác dụng:
Thiết lập ý nghĩa thống nhất của từng loại tài nguyên trước khi Rules mô tả
cách chúng tăng giảm.

Trách nhiệm:
- Định nghĩa các loại Resource.
- Không định nghĩa luật (công thức tăng giảm nằm ở rules/).
- Không định nghĩa gameplay.
===============================================================================
-->

# Resource

---

## Definition

A Resource is a quantifiable asset owned by a Company. LLM Tycoon uses four kinds of Resources:

* **Cash** — money, measured in US dollars. Used for purchases, salaries, and fixed costs.
* **RP (Research Points)** — accumulated research insight. Spent to unlock Technologies. RP is a single pool and can be banked without limit.
* **Fame (Danh tiếng)** — the Company's public standing, an integer from 0 to 5000. Fame is never spent; it gates opportunities.
* **Income Stream** — recurring monthly Cash income with a fixed monthly amount, remaining months, and the original Model's Task and Q (used to generate User Logs upon expiry).

---

## Attributes

* Cash: current balance (may be negative within the limits defined by the Rules).
* RP: current balance (never negative).
* Fame: current value (0–5000).
* Income Stream: source name, amount per month, months remaining, original Task, original Q, and reserved Inference TFLOPS.

---

## Relationships

* Resources belong to exactly one Company.
* Player Actions, Events, and Income Streams change Resources only as permitted by the Rules.
* Resources are part of the Game State and appear in every SAVE Block.

<!--
Tiếng Việt:
Resource là tài sản định lượng được của Company. LLM Tycoon có bốn loại:

* Cash — tiền mặt (USD), dùng để mua sắm, trả lương và chi phí cố định.
* RP (Research Points) — điểm nghiên cứu tích lũy, dùng để mở khóa
  Technology. RP là một quỹ chung, tích trữ không giới hạn.
* Fame (Danh tiếng) — danh tiếng của Company, số nguyên từ 0 đến 5000. Fame
  không bị tiêu — nó mở khóa cơ hội.
* Income Stream — dòng thu nhập định kỳ: số tiền cố định mỗi tháng và số
  tháng còn lại.

Resource thuộc về đúng một Company; chỉ thay đổi thông qua Player Action,
Event và Income Stream theo đúng Rules; luôn xuất hiện trong SAVE Block.
-->
