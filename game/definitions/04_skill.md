<!--
===============================================================================
FILE: 04_skill.md
MODULE: Definitions / Skill

Mục đích:
Định nghĩa khái niệm Skill (kỹ năng của nhà sáng lập) trong LLM Tycoon.

Tác dụng:
Thiết lập ý nghĩa thống nhất của hai chỉ số kỹ năng R-Lv và E-Lv trước khi
Rules mô tả cách chúng tăng trưởng và tạo bonus.

Trách nhiệm:
- Định nghĩa Skill.
- Không định nghĩa luật (tăng trưởng và bonus nằm ở rules/).
- Không định nghĩa gameplay.
===============================================================================
-->

# Skill

---

## Definition

A Skill is a measure of the founder's personal ability. It grows through practice and improves related activities.

LLM Tycoon uses two Skills, each an integer level from 1 to 5:

* **R-Lv (Research Level)** — scientific depth. Improves research output.
* **E-Lv (Engineering Level)** — practical engineering craft. Improves the Quality of built Models.

---

## Attributes

* Level (1–5)
* Progress counter toward the next level

---

## Relationships

* Skills belong to the founder (the Company the Player controls).
* Skills grow through repeated Player Actions as defined by the Rules.
* Skills modify Outcomes (research yield, Model Quality) as defined by the Rules.
* Skills are part of the Game State.

<!--
Tiếng Việt:
Skill là thước đo năng lực cá nhân của nhà sáng lập, tăng qua thực hành.

Có hai Skill, mỗi loại là cấp độ nguyên từ 1 đến 5:
* R-Lv (Research Level) — chiều sâu nghiên cứu, tăng sản lượng nghiên cứu.
* E-Lv (Engineering Level) — tay nghề kỹ thuật, tăng Quality của Model.

Thuộc tính: cấp độ (1–5) và bộ đếm tiến độ lên cấp.

Skill thuộc về nhà sáng lập; tăng qua các Player Action lặp lại theo Rules;
tác động vào Outcome (sản lượng nghiên cứu, Quality của Model) theo Rules;
là một phần của Game State.
-->
