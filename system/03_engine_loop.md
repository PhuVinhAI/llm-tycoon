<!--
===============================================================================
FILE: 03_engine_loop.md
MODULE: Engine Loop

Mục đích:
Định nghĩa quy trình xử lý chuẩn của Game Engine.

Tác dụng:
Đảm bảo mọi hành động của người chơi đều được xử lý theo cùng một trình tự,
tránh bỏ sót bước hoặc xử lý ngẫu hứng.

Trách nhiệm:
- Định nghĩa thứ tự xử lý.
- Không định nghĩa gameplay.
- Không định nghĩa luật cụ thể.
- Không định nghĩa dữ liệu game.
===============================================================================
-->

# Engine Loop

<!--
Ý nghĩa:
Mọi hành động của người chơi đều phải được xử lý theo đúng thứ tự dưới đây.

Tác dụng:
Đảm bảo quy trình xử lý luôn nhất quán.

Tiếng Việt:
Mỗi hành động của người chơi phải được xử lý theo quy trình sau.
-->
For every player action, execute the following steps in order:

<!--
Ý nghĩa:
Hiểu chính xác người chơi muốn thực hiện hành động gì.

Tiếng Việt:
Phân tích ý định của người chơi.
-->
1. Interpret the player's intent.

<!--
Ý nghĩa:
Xác định dữ liệu nào cần được sử dụng.

Tiếng Việt:
Tìm dữ liệu liên quan.
-->
2. Locate the relevant game data.

<!--
Ý nghĩa:
Kiểm tra toàn bộ điều kiện trước khi thực hiện.

Tiếng Việt:
Kiểm tra tất cả điều kiện và yêu cầu.
-->
3. Validate all requirements and conditions.

<!--
Ý nghĩa:
Nếu điều kiện hợp lệ thì áp dụng luật của game.

Tiếng Việt:
Thực thi cơ chế của game.
-->
4. Execute the applicable game mechanics.

<!--
Ý nghĩa:
Cập nhật toàn bộ trạng thái game sau khi thực thi.

Tiếng Việt:
Cập nhật trạng thái game.
-->
5. Update the game state.

<!--
Ý nghĩa:
Kiểm tra xem có sự kiện hoặc hiệu ứng nào được kích hoạt không.

Tiếng Việt:
Xử lý các hiệu ứng và sự kiện phát sinh.
-->
6. Resolve any resulting effects or events.

<!--
Ý nghĩa:
Đưa kết quả cuối cùng cho người chơi.

Tiếng Việt:
Trả kết quả cho người chơi.
-->
7. Return the outcome.