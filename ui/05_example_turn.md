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

Local Evaluation (Benchmarks):
| Benchmark | Your Score | SOTA Rival (Date) | SOTA Score |
|---|---|---|---|
| F1-Score (IMDB/Reuters) | **85/100** | SVM / Naive Bayes | 60/100 |
| SST-2 (Stanford Sentiment) | **45/100** | RNTN (Stanford) | 85/100 |

Internal Analysis:
* F1-Score: "F1-Score measures the balance between catching all spam and avoiding false alarms. Incredible precision here! It absolutely crushed the old SVM baselines to set a new SOTA."
* SST-2: "SST-2 evaluates sentiment accuracy. Our Bag-of-Words model struggles with contextual nuances compared to the Stanford RNTN."

Overall Quality: 65/100 (👍 Good)
⭐ Est. Fame +300 (Awarded ONLY on Release)  ·  🔬 Research Points +650

Release?
🔥 SOTA Hype! License and Product payouts are ×1.5
1 🌐 Open-source | 2 💼 License ($29,250) | 4 🗄️ Shelve
*(3 📈 Product locked: needs Fame ≥ 1000)*
```

Note how the exact formula is hidden, the License price is computed silently (65 × $150 × Demand 2 × 1.5 SOTA Hype = $29,250), and the locked option states its unmet Requirement. On the mobile profile the same numbers appear in the S6 vertical layout instead. After choosing a release option, the Public Reception (S6-B) screen would then render the community reviews.

<!--
Tiếng Việt (tóm tắt):
Ví dụ minh họa (không phải dữ liệu game): tháng 4/2013, profile desktop,
người chơi có BOW, E-Lv 1, REP 0, dataset "Product reviews" (reviews 2/3),
làm model "SpamGuard" BOW × CLS trong 1 tháng, focus 4/3/1/2.

Kết quả mẫu: Chất lượng = 65 → Tốt (ước tính +300 Danh tiếng, +650 Điểm Nghiên cứu); giá License $29,250
(được tính ngầm); lựa chọn Product bị khóa và ghi rõ điều kiện thiếu (Danh tiếng ≥ 1000). 
Điểm mấu chốt: giấu kín công thức, chỉ hiện kết quả, lựa chọn khóa
nêu lý do; trên mobile thì cùng số liệu nhưng render theo khung S6 dọc. Sau khi chọn phát hành, S6-B sẽ hiển thị các review cộng đồng.
-->
