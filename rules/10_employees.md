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

- **Generation:** When the Company reaches a Fame threshold (Content), the Engine generates a candidate for that Archetype during the Events step. 
- Using Creative License, invent a name, gender, and brief background that naturally fits the player's chosen language (e.g., Vietnamese names if playing in Vietnamese). 
- Pick an exact Salary and exact Effect values within the Archetype's bounds (Content). Once generated, these stats are permanent for this playthrough.
- Maximum **2** Employees at a time — the lab is one small room.
- Hiring is instant. Salary is paid from the month of hire (Economy rule).

## Firing

- Firing is instant, effective immediately; no penalty, no severance. The candidate remains available in the candidate pool for re-hire.

## Effects

- Each Employee's generated effects apply automatically while employed: research bonuses in the Research yield, quality bonuses in the Quality formula, compute reductions in requirement checks.

<!--
Tiếng Việt (tóm tắt):
Sinh & Tuyển: khi đạt ngưỡng Fame, Engine tự tạo tên, giới tính, bối cảnh
phù hợp ngôn ngữ người chơi và chốt cứng một mức lương/chỉ số nằm trong
giới hạn Archetype (Content). Tối đa 2 nhân viên. Thuê là tức thời;
trả lương từ tháng thuê.

Sa thải: tức thời, hiệu lực ngay, không phạt, không trợ cấp; ứng viên vẫn
có thể thuê lại sau.

Hiệu ứng: bonus của từng nhân viên (Content) tự động áp dụng khi còn làm
việc — bonus nghiên cứu vào sản lượng Research, bonus chất lượng vào công
thức Quality, giảm yêu cầu compute vào bước kiểm tra compute.
-->
