<!--
===============================================================================
FILE: 10_employees.md
MODULE: Rules / Employees

Mục đích:
Định nghĩa cơ chế tuyển dụng trong chương Home Lab.

Tác dụng:
Home lab chỉ chứa được một đội nhỏ — tối đa 2 người — mỗi người một thế
mạnh rõ rệt, buộc người chơi chọn hướng build.

Trách nhiệm:
- Định nghĩa giới hạn, thuê, sa thải, lương.
- Không liệt kê ứng viên cụ thể (nằm ở content/).
===============================================================================
-->

# Employees

## Generation & Hiring

- **Headhunter Search:** Hiring is an instant action initiated from the Team menu. The Player pays the Archetype's Headhunter Fee (Content). The game pauses and generates exactly **3 candidates** for that Archetype.
- **Generation:** Using Creative License, invent a name, gender, and brief background for each candidate that naturally fits the player's chosen language. To remain deterministic, select exact Salary and Effect values within the bounds (Content) based on the current in-game Turn, ensuring a fixed trade-off: Candidate 1 (Low Salary/Stats), Candidate 2 (Mid Salary/Stats), Candidate 3 (High Salary/Stats).
- **The Interview:** Render the Interview screen (S16). The Player must choose 1 candidate to hire, or 0 to reject all. The Headhunter Fee is **never refunded**, even if no one is hired.
- Maximum **2** Employees at a time — the lab is one small room. The Engine must block searches if the lab is full.
- Salary is paid starting from the month of hire (Economy rule).

## Firing

- Firing is instant, effective immediately; no penalty, no severance. Fired employees disappear permanently.

## Effects

- Each Employee's generated effects apply automatically while employed: research bonuses in the Research yield, quality bonuses in the Quality formula, compute reductions in requirement checks.

<!--
Tiếng Việt (tóm tắt):
Sinh & Tuyển: Người chơi trả tiền Headhunter (hành động tức thời). Engine 
sinh ra 3 ứng viên có sự đánh đổi (ví dụ: rẻ/yếu vs đắt/mạnh). Người chơi 
chọn 1 hoặc từ chối tất cả (tiền Headhunter không hoàn lại). Tối đa 2 nhân viên.
Không cho phép tìm kiếm nếu lab đã đầy người.

Sa thải: tức thời, hiệu lực ngay, không phạt, không trợ cấp. Nhân viên bị sa
thải sẽ biến mất vĩnh viễn.

Hiệu ứng: bonus của từng nhân viên (Content) tự động áp dụng khi còn làm
việc — bonus nghiên cứu vào sản lượng Research, bonus chất lượng vào công
thức Quality, giảm yêu cầu compute vào bước kiểm tra compute.
-->
