<!--
===============================================================================
FILE: 05_example_turn.md
MODULE: UI / Worked Example

Mục đích:
Một ví dụ mẫu neo định dạng và cách áp dụng công thức.

Tác dụng:
LLM bắt chước ví dụ tốt hơn mô tả — đây là "few-shot" của Game Engine.
Theo shared/conventions.md: ví dụ CHỈ minh họa, không phải Game Data.
===============================================================================
-->

# Worked Example — *illustrative only, not Game Data*

Situation: April 2013, desktop profile. The player owns BOW, has E-Lv 1, REP 0, and the "Product reviews" Dataset (reviews, 2/3). They start **"SpamGuard"** — BOW × CLS, 1 month, focus 4/3/1/2, then the month resolves.

Expected completion report (S6, desktop):

```
🏁 SpamGuard — BOW × CLS on Product reviews
   Quality: 51/100
   😐 Mediocre → REP +1, RP +5
   Release?  1 🌐 Open-source | 2 💼 License ($6,120) | 4 🗄️ Shelve
   (3 📈 Product locked: needs REP ≥ 10 and Q ≥ 55)
```

Note how the exact formula is hidden, the License price is computed silently (51 × $60 × Demand 2 = $6,120), and the locked option states its unmet Requirement. On the mobile profile the same numbers appear in the S6 vertical layout instead.

<!--
Tiếng Việt (tóm tắt):
Ví dụ minh họa (không phải dữ liệu game): tháng 4/2013, profile desktop,
người chơi có BOW, E-Lv 1, REP 0, dataset "Product reviews" (reviews 2/3),
làm model "SpamGuard" BOW × CLS trong 1 tháng, focus 4/3/1/2.

Kết quả mẫu: Quality = 51 → Tàm tạm (+1 REP, +5 RP); giá License $6,120
(được tính ngầm); lựa chọn Product bị khóa và ghi rõ điều kiện thiếu (REP ≥ 10,
Q ≥ 55). Điểm mấu chốt: giấu kín công thức, chỉ hiện kết quả, lựa chọn khóa
nêu lý do; trên mobile thì cùng số liệu nhưng render theo khung S6 dọc.
-->
