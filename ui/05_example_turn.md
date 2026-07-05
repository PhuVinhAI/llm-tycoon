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

Situation: April 2013, desktop profile. The player owns BOW, has E-Lv 1, Fame 0, and the "Product reviews" Dataset (reviews, 2/3). They start **"SpamGuard"** — BOW × CLS, 1 month, focus 4/3/1/2, then the month resolves.

Expected completion report (S6, desktop) in English:

```
🏁 SpamGuard — BOW × Classification on Product reviews

Reviews:
* 8.5/10 — F1-Score (IMDB/Reuters) ("Excellent precision. The 'reviews' dataset perfectly matched the target domain.")
* 4.5/10 — r/MachineLearning ("Classic BOW approach. Good for basic spam, but fails on complex sentences.")
* 4.0/10 — TechCrunch ("A bit outdated compared to the new embedding models.")
* 5.0/10 — ArXiv Peer Review ("Solid baseline, though it struggles with out-of-vocabulary tokens.")

Overall Quality: 55/100 (👍 Good)
⭐ Fame +300  ·  🔬 Research Points +550

Release?
1 🌐 Open-source | 2 💼 License ($6,120) | 4 🗄️ Shelve
*(3 📈 Product locked: needs Fame ≥ 1000 and Quality ≥ 55)*
```

Note how the exact formula is hidden, the License price is computed silently (51 × $60 × Demand 2 = $6,120), and the locked option states its unmet Requirement. The reviews are generated dynamically by the AI using Creative License. On the mobile profile the same numbers appear in the S6 vertical layout instead.

<!--
Tiếng Việt (tóm tắt):
Ví dụ minh họa (không phải dữ liệu game): tháng 4/2013, profile desktop,
người chơi có BOW, E-Lv 1, REP 0, dataset "Product reviews" (reviews 2/3),
làm model "SpamGuard" BOW × CLS trong 1 tháng, focus 4/3/1/2.

Kết quả mẫu: Chất lượng = 51 → Tàm tạm (+100 Danh tiếng, +510 Điểm Nghiên cứu); giá License $6,120
(được tính ngầm); lựa chọn Product bị khóa và ghi rõ điều kiện thiếu (Danh tiếng ≥ 1000,
Chất lượng ≥ 55). Điểm mấu chốt: giấu kín công thức, chỉ hiện kết quả, lựa chọn khóa
nêu lý do; trên mobile thì cùng số liệu nhưng render theo khung S6 dọc.
-->
