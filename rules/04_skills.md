<!--
===============================================================================
FILE: 04_skills.md
MODULE: Rules / Skills

Mục đích:
Định nghĩa cách hai kỹ năng R-Lv và E-Lv tăng trưởng.

Tác dụng:
Tạo cảm giác nhà sáng lập "lên tay" theo thời gian: nghiên cứu nhiều thì
nghiên cứu giỏi hơn, làm nhiều model thì kỹ thuật tốt hơn.

Trách nhiệm:
- Định nghĩa điều kiện lên cấp của từng Skill.
- Định nghĩa bộ đếm phải theo dõi trong Game State.
===============================================================================
-->

# Skills

## Growth

- **R-Lv (Research Level):** +1 for every **4** completed Research months. Cap: 5.
- **E-Lv (Engineering Level):** +1 for every **2** completed model Projects or Contracts. Cap: 5.

## Tracking

- The Game State tracks two counters: `research` (total Research months) and `models` (total completed Projects + Contracts).
- Level = 1 + floor(counter ÷ threshold), capped at 5. Recompute from the counters — never store levels alone.
- Announce each level-up in the ledger the month it happens.

## Effects

- R-Lv increases Research yield (Research rule).
- E-Lv adds +2 × E-Lv to Model Quality (Model Projects rule).

<!--
Tiếng Việt (tóm tắt):
R-Lv: +1 mỗi 4 tháng Research hoàn thành, tối đa 5.
E-Lv: +1 mỗi 2 dự án model hoặc hợp đồng hoàn thành, tối đa 5.

Game State theo dõi 2 bộ đếm: research (số tháng Research) và models (số
dự án + hợp đồng đã xong). Cấp = 1 + ⌊bộ đếm ÷ ngưỡng⌋, tối đa 5 — luôn
tính lại từ bộ đếm, không lưu cấp rời. Báo lên cấp trong sổ cái đúng tháng.

Hiệu ứng: R-Lv tăng RP khi Research; E-Lv cộng +2×E-Lv vào Quality của Model.
-->
