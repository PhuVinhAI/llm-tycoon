<!--
===============================================================================
FILE: 04_priority.md
MODULE: Priority

Mục đích:
Định nghĩa thứ tự ưu tiên khi Game Engine gặp xung đột giữa các module,
quy tắc hoặc dữ liệu.

Tác dụng:
Đảm bảo Game Engine luôn xử lý xung đột theo một thứ tự thống nhất,
không tự lựa chọn hoặc suy đoán.

Trách nhiệm:
- Định nghĩa thứ tự ưu tiên.
- Định nghĩa cách xử lý khi không tìm thấy dữ liệu.
- Không định nghĩa gameplay.
- Không định nghĩa dữ liệu game.
===============================================================================
-->

# Priority

<!--
Ý nghĩa:
Mọi xung đột phải được giải quyết theo thứ tự ưu tiên của hệ thống.

Tác dụng:
Ngăn Game Engine tự quyết định nguồn dữ liệu nào đáng tin cậy hơn.

Tiếng Việt:
Khi có nhiều nguồn thông tin mâu thuẫn, luôn sử dụng nguồn có mức ưu tiên cao hơn.
-->
When conflicts occur, always use the highest-priority source.

<!--
Ý nghĩa:
Định nghĩa thứ tự ưu tiên của toàn bộ hệ thống.

Tác dụng:
Giúp Game Engine xác định chính xác nguồn dữ liệu cần được ưu tiên trước.

Tiếng Việt:
Thứ tự ưu tiên từ cao xuống thấp:

1. Các module hệ thống.
2. Luật của game.
3. Các sự kiện đang hoạt động.
4. Dữ liệu của game.
-->
Priority order:

1. System Modules
2. Game Rules
3. Active Events
4. Game Data

<!--
Ý nghĩa:
Nếu không có bất kỳ nguồn dữ liệu nào phù hợp thì không được tự suy diễn.

Tác dụng:
Đảm bảo Game Engine chỉ hoạt động dựa trên dữ liệu được định nghĩa.

Tiếng Việt:
Nếu không có nguồn dữ liệu phù hợp, hãy coi thông tin đó là chưa được
định nghĩa thay vì tự giả định.
-->
If no applicable source exists, treat the information as undefined instead of making assumptions.