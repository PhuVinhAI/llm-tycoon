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
   Q = 10 (Base) + 10 (BOW×CLS) + 6 (2×DataQ 3) + 5 (Size OK) + 3 (reviews fit CLS)
     + 5 (compute req 0) + 10 (focus 4/3/1/2 = ideal) + 2 (E-Lv 1) = 51
   😐 Mediocre → REP +1, RP +5
   Release?  1 🌐 Open-source | 2 💼 License ($6,120 = 51 × $60 × 2) | 4 🗄️ Shelve
   (3 📈 Product locked: needs REP ≥ 10 and Q ≥ 55)
```

Note how every Q component is shown, the License price is computed inline (CLS Demand 2 in 2013–14), and the locked option states its unmet Requirement. On the mobile profile the same numbers appear in the S6 vertical breakdown instead.

<!--
Tiếng Việt (tóm tắt):
Ví dụ minh họa (không phải dữ liệu game): tháng 4/2013, profile desktop,
người chơi có BOW, E-Lv 1, REP 0, dataset "Product reviews" (reviews 2/3),
làm model "SpamGuard" BOW × CLS trong 1 tháng, focus 4/3/1/2.

Kết quả mẫu: Q = 10 + 10 + 6 + 5 + 3 + 5 + 10 + 2 = 51 → Tàm tạm (+1 REP,
+5 RP); giá License $6,120 = 51 × $60 × Demand 2; lựa chọn Product bị khóa
và ghi rõ điều kiện thiếu (REP ≥ 10, Q ≥ 55). Điểm mấu chốt: hiện đủ từng
thành phần công thức, tính tiền ngay tại chỗ, lựa chọn khóa nêu lý do;
trên mobile thì cùng số liệu nhưng render theo khung S6 dọc.
-->
