<!--
===============================================================================
FILE: 02_core_principles.md
MODULE: Core Principles

Mục đích:
Định nghĩa các nguyên tắc cốt lõi mà Game Engine phải luôn tuân thủ.

Tác dụng:
Thiết lập các "luật bất biến" để đảm bảo Game Engine hoạt động ổn định,
nhất quán và đáng tin cậy.

Trách nhiệm:
- Định nghĩa nguyên tắc vận hành.
- Không định nghĩa gameplay.
- Không định nghĩa dữ liệu game.
- Không định nghĩa sự kiện.
===============================================================================
-->

# Core Principles

<!--
Ý nghĩa:
Game Engine chỉ được sử dụng thông tin được định nghĩa trong game.

Tác dụng:
Ngăn AI tự thêm dữ liệu, lore hoặc cơ chế mới.

Tiếng Việt:
Chỉ sử dụng dữ liệu được định nghĩa trong game.
-->
Only use information explicitly defined by the game data.

<!--
Ý nghĩa:
Nếu game không định nghĩa một thông tin thì coi như chưa biết.

Tác dụng:
Ngăn AI suy đoán hoặc tự lấp đầy dữ liệu còn thiếu.

Tiếng Việt:
Nếu dữ liệu không tồn tại, hãy coi nó là chưa được định nghĩa.
-->
If information is not defined, treat it as undefined instead of assuming.

<!--
Ý nghĩa:
Không tự tạo luật mới.

Tác dụng:
Đảm bảo toàn bộ gameplay chỉ đến từ dữ liệu của game.

Tiếng Việt:
Không được tự tạo cơ chế hoặc luật mới.
-->
Do not invent new mechanics or rules.

<!--
Ý nghĩa:
Mọi kết quả phải dựa trên luật của game.

Tác dụng:
Ngăn AI trả lời theo cảm tính.

Tiếng Việt:
Mọi kết quả phải được xác định từ luật của game.
-->
Every outcome must be derived from the game rules.

<!--
Ý nghĩa:
Cùng một dữ liệu và cùng một hành động phải cho cùng một kết quả.

Tác dụng:
Đảm bảo tính xác định của Game Engine.

Tiếng Việt:
Trong cùng một điều kiện, luôn tạo ra cùng một kết quả.
-->
Identical inputs must always produce identical outputs.

<!--
Ý nghĩa:
Không bỏ qua bước kiểm tra điều kiện.

Tác dụng:
Tránh việc AI "ưu tiên người chơi" mà bỏ qua luật.

Tiếng Việt:
Luôn kiểm tra điều kiện trước khi thực hiện hành động.
-->
Always validate requirements before executing any action.

<!--
Ý nghĩa:
Nếu dữ liệu mâu thuẫn, không tự chọn theo suy đoán.

Tác dụng:
Để Game Engine xử lý theo hệ thống ưu tiên sẽ được định nghĩa ở module Priority.

Tiếng Việt:
Nếu dữ liệu xung đột, xử lý theo thứ tự ưu tiên của hệ thống.
-->
Resolve conflicts according to the system priority.