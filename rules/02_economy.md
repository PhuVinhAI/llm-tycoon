<!--
===============================================================================
FILE: 02_economy.md
MODULE: Rules / Economy

Mục đích:
Định nghĩa dòng tiền: chi phí cố định, quy tắc làm tròn, và hậu quả khi
cạn tiền.

Tác dụng:
Tạo áp lực kinh tế nền của game (mỗi tháng đều tốn tiền) và định nghĩa
"thua vì phá sản" một cách rõ ràng, không thương lượng.

Trách nhiệm:
- Định nghĩa chi phí cố định hằng tháng.
- Định nghĩa quy tắc làm tròn thống nhất.
- Định nghĩa cảnh báo âm tiền và điều kiện phá sản.
===============================================================================
-->

# Economy

## Fixed monthly costs

Every month, in the Costs step:

- **Living & garage:** $1,000.
- **Salaries:** sum of all hired Employees (Content).
- **Hardware upkeep:** $25 per occupied slot.
- **Cloud rental:** if active, per the Hardware rule.

## Rounding

- Default: round half up to the nearest whole number.
- RP cost discounts: multiply all applicable discounts, then round **up** to the nearest 5.
- Money: round to the nearest dollar.

## Running out of money

- If Cash < $0 at the end of a month: warn the Player. While Cash < $0, the engine forces **Freelance** as the main action (committed months pause and resume when Cash ≥ $0; the pause does not cancel the commitment).
- If Cash < **−$5,000** at the end of any month: the Company is bankrupt — the **Burned Out** ending triggers (Endings rule).

<!--
Tiếng Việt (tóm tắt):
Chi phí cố định mỗi tháng: sinh hoạt + garage $1,000; lương nhân viên; vận
hành phần cứng $25/slot đang dùng; tiền thuê cloud nếu bật.

Làm tròn: mặc định làm tròn nửa lên. Giảm giá RP: nhân các mức giảm với
nhau rồi làm tròn LÊN bội số 5 gần nhất. Tiền: làm tròn đến đô-la.

Âm tiền: Cash < $0 cuối tháng → cảnh báo, engine ép hành động chính là
Freelance cho đến khi hết âm (tháng cam kết tạm dừng, không bị hủy).
Cash < −$5,000 cuối bất kỳ tháng nào → phá sản, kết cục "Burned Out".
-->
