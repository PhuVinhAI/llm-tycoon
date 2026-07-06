<!--
===============================================================================
FILE: glossary.md
MODULE: Shared Glossary

Mục đích:
Định nghĩa các thuật ngữ được sử dụng thống nhất trong toàn bộ tài liệu của
LLM Tycoon.

Tác dụng:
Giúp mọi module sử dụng cùng một thuật ngữ với cùng một ý nghĩa, tránh cách
hiểu khác nhau giữa các tài liệu.

Trách nhiệm:
- Định nghĩa thuật ngữ.
- Không định nghĩa luật.
- Không định nghĩa hành vi của AI.
- Không định nghĩa gameplay.
===============================================================================
-->

# Glossary

---

## Game Documentation

The complete collection of official documentation that defines the game.

This includes system instructions, definitions, rules, content, scenarios, and any other official documents.

<!--
Tiếng Việt:
Toàn bộ tài liệu chính thức định nghĩa game, bao gồm hướng dẫn hệ thống,
định nghĩa, luật chơi, nội dung, kịch bản và các tài liệu chính thức khác.
-->

---

## Game State

The complete state of the current game session at a specific point in time.

<!--
Tiếng Việt:
Toàn bộ trạng thái của phiên chơi tại một thời điểm xác định.
-->

---

## Player Action

Any action requested or performed by the player.

<!--
Tiếng Việt:
Bất kỳ hành động nào do người chơi thực hiện hoặc yêu cầu thực hiện.
-->

---

## Outcome

The final result produced after resolving a player action.

<!--
Tiếng Việt:
Kết quả cuối cùng sau khi Game Engine xử lý một hành động của người chơi.
-->

---

## Requirement

A condition that must be satisfied before an action can be executed.

<!--
Tiếng Việt:
Điều kiện phải được đáp ứng trước khi một hành động có thể được thực hiện.
-->

---

## Event

A predefined occurrence that is triggered when its conditions are satisfied.

<!--
Tiếng Việt:
Một sự kiện được định nghĩa trước và sẽ được kích hoạt khi đáp ứng đủ điều kiện.
-->

---

## Game Data

Any official information defined within the game documentation.

<!--
Tiếng Việt:
Bất kỳ dữ liệu chính thức nào được định nghĩa trong tài liệu của game.
-->

---

## Turn

One step of the game. In LLM Tycoon, one Turn equals one in-game month.

<!--
Tiếng Việt:
Một bước của trò chơi. Trong LLM Tycoon, một Turn tương ứng một tháng trong game.
-->

---

## RP (Research Points)

The resource earned through research and spent to unlock Technologies.

<!--
Tiếng Việt:
Điểm nghiên cứu — tài nguyên kiếm được khi nghiên cứu, dùng để mở khóa Technology.
-->

---

## Fame (Danh tiếng)

The Company's public standing, ranging from 0 to 5000. Fame gates contracts, hires, and investor interest. (Formerly REP).

<!--
Tiếng Việt:
Danh tiếng của Company, từ 0 đến 5000. Fame mở khóa hợp đồng, ứng viên tuyển dụng
và sự chú ý của nhà đầu tư.
-->

---

## TFLOPS (TeraFLOPS)

The measure of computing power. Hardware provides TFLOPS per month; training consumes TFLOPS-months.

<!--
Tiếng Việt:
Đơn vị sức mạnh tính toán (hàng nghìn tỷ phép tính mỗi giây). Phần cứng cung cấp TFLOPS mỗi tháng; việc huấn luyện tiêu thụ TFLOPS-month.
-->

---

## Quality (Q)

The overall score of a completed Model, from 0.0 to 100.0, computed by the Rules.

<!--
Tiếng Việt:
Điểm chất lượng của một Model đã hoàn thành, từ 0 đến 100, tính theo Rules.
-->

---

## Domain

The subject area of a Dataset (news, social, dialogue, reviews, code, encyclopedic, parallel, QA, web-mixed, medical, legal, math, books, logic).

<!--
Tiếng Việt:
Lĩnh vực nội dung của một Dataset (tin tức, mạng xã hội, hội thoại, đánh giá
sản phẩm, mã nguồn, bách khoa, song ngữ, hỏi–đáp, web tổng hợp).
-->

---

## Demand

The market multiplier of a Task in a given era. Demand scales the money earned from selling models.

<!--
Tiếng Việt:
Hệ số thị trường của một Task trong một thời kỳ. Demand nhân vào số tiền thu
được khi bán model.
-->

---

## Income Stream

Recurring monthly income owned by the Company, with a fixed amount and an expiry.

<!--
Tiếng Việt:
Dòng thu nhập định kỳ hằng tháng của Company, có số tiền cố định và thời hạn.
-->

---

## Competition

A time-limited challenge opened by an Event. Qualifying models win fixed prizes.

<!--
Tiếng Việt:
Cuộc thi có thời hạn do một Event mở ra. Model đạt chuẩn sẽ nhận giải thưởng
cố định.
-->

---

## SAVE Block

A structured text block containing the complete Game State, used to continue the game in a new conversation.

<!--
Tiếng Việt:
Khối văn bản có cấu trúc chứa toàn bộ Game State, dùng để tiếp tục ván chơi
trong một hội thoại mới.
-->

---

## UI Profile

The presentation layout the Game Engine renders with — `desktop` (landscape) or `mobile` (portrait). Chosen at boot, stored in the Game State, switchable at any time.

<!--
Tiếng Việt:
Bố cục hiển thị mà Game Engine dùng để render — desktop (ngang) hoặc mobile
(dọc). Chọn lúc khởi động, lưu trong Game State, đổi được bất cứ lúc nào.
-->

---

## Flavor

Narrative content with zero mechanical effect. Flavor may be freely invented within the Creative License; it can never change the Game State.

<!--
Tiếng Việt:
Nội dung thuần kể chuyện, không có hiệu ứng cơ chế. Flavor được tự do sáng
tạo trong khuôn khổ Creative License và không bao giờ được thay đổi Game
State.
-->
