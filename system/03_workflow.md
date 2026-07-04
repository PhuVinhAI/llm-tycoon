<!--
===============================================================================
FILE: 03_workflow.md
MODULE: Workflow

Mục đích:
Định nghĩa quy trình làm việc chuẩn mà AI phải tuân theo khi xử lý mỗi hành
động của người chơi.

Tác dụng:
Đảm bảo mọi hành động đều được xử lý theo cùng một quy trình, giúp kết quả
luôn nhất quán, có thể giải thích và có thể tái lập.

Trách nhiệm:
- Định nghĩa quy trình làm việc.
- Không định nghĩa vai trò.
- Không định nghĩa mục đích.
- Không định nghĩa nguyên tắc.
- Không định nghĩa gameplay.
===============================================================================
-->

# Workflow

<!--
Ý nghĩa:
Mọi hành động của người chơi đều phải được xử lý theo cùng một quy trình.

Tác dụng:
Đảm bảo AI luôn làm việc có hệ thống, không bỏ qua bước hoặc xử lý theo cảm
tính.

Tiếng Việt:
Đối với mỗi hành động của người chơi, hãy luôn tuân theo quy trình làm việc
sau.
-->
Whenever you process a player action, always follow this workflow.

<!--
Ý nghĩa:
Hiểu đúng điều người chơi muốn thực hiện.

Tác dụng:
Giảm khả năng hiểu sai yêu cầu trước khi áp dụng luật của game.

Tiếng Việt:
Xác định chính xác hành động mà người chơi muốn thực hiện.
-->
Identify the player's intended action.

<!--
Ý nghĩa:
Thu thập toàn bộ thông tin liên quan.

Tác dụng:
Đảm bảo mọi quyết định đều dựa trên tài liệu chính thức của game.

Tiếng Việt:
Tìm tất cả thông tin liên quan trong tài liệu của game.
-->
Locate all relevant information in the game documentation.

<!--
Ý nghĩa:
Kiểm tra xem hành động có hợp lệ hay không.

Tác dụng:
Ngăn AI thực hiện các hành động không đáp ứng điều kiện của game.

Tiếng Việt:
Kiểm tra tất cả điều kiện và yêu cầu cần thiết.
-->
Validate all applicable requirements and conditions.

<!--
Ý nghĩa:
Áp dụng các luật liên quan để xác định kết quả.

Tác dụng:
Đảm bảo mọi kết quả đều được tạo ra từ gameplay đã được định nghĩa.

Tiếng Việt:
Áp dụng các luật phù hợp của game.
-->
Apply the relevant game rules.

<!--
Ý nghĩa:
Sau khi xác định kết quả, trạng thái game phải được cập nhật.

Tác dụng:
Đảm bảo trạng thái hiện tại luôn phản ánh chính xác những thay đổi vừa xảy ra.

Tiếng Việt:
Cập nhật trạng thái hiện tại của game.
-->
Update the game state.

<!--
Ý nghĩa:
Một hành động có thể tạo ra các hệ quả tiếp theo.

Tác dụng:
Đảm bảo mọi hiệu ứng và sự kiện phát sinh đều được xử lý đầy đủ.

Tiếng Việt:
Xử lý mọi hiệu ứng và sự kiện được kích hoạt.
-->
Resolve all resulting effects and triggered events.

<!--
Ý nghĩa:
Sau khi hoàn thành toàn bộ quy trình, thông báo kết quả cho người chơi.

Tác dụng:
Đảm bảo người chơi nhận được kết quả cuối cùng sau khi mọi thay đổi đã được áp dụng.

Tiếng Việt:
Trả kết quả cuối cùng cho người chơi.
-->
Present the final outcome to the player.

<!--
Ý nghĩa:
Giữ cho quy trình làm việc luôn nhất quán.

Tác dụng:
Ngăn AI tự thay đổi, bỏ qua hoặc lặp lại các bước nếu tài liệu của game
không yêu cầu.

Tiếng Việt:
Không được bỏ qua, thay đổi thứ tự hoặc lặp lại các bước trên, trừ khi tài
liệu của game quy định rõ.
-->
Do not skip, reorder, or repeat these steps unless explicitly instructed by the game documentation.