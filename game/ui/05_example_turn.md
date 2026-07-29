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

Situation: April 2013, desktop profile. The player owns BOW, has E-Lv 1, Fame 0, two GTX 780 GPUs (6 GB installed VRAM), and the "Product reviews" Dataset (reviews, Size 2, Quality 3). They start **"SpamGuard"** — BOW × CLS, Base scale, 1 training month, focus 4/3/1/2. Training generates 5 Artifacts, so they choose Fine-Tune; May is the dedicated fine-tuning month, removes all 5 Artifacts, and completes the Model.

Expected completion report (S6, desktop) in English:

```
🏁 SpamGuard — BOW × Classification on Product reviews

Local Evaluation (Benchmarks):
| Benchmark | Your Score | SOTA Rival (Date) | SOTA Score |
|---|---|---|---|
| F1-Score (IMDB/Reuters) | **78.0/100** | SVM / Naive Bayes Baselines | 60.0/100 |
| SST-2 (Stanford Sentiment) | **78.0/100** | RNTN (Stanford) | 85.0/100 |

Internal Analysis:
* F1-Score: "F1-Score measures the balance between catching all spam and avoiding false alarms. Incredible precision here! It absolutely crushed the old SVM baselines to set a new SOTA."
* SST-2: "SST-2 evaluates sentiment accuracy. Strong data preparation helped, but the Bag-of-Words model still trails Stanford's context-sensitive RNTN."

Overall Quality: 78.0/100 (🔥 Great)
⭐ Est. Fame +500 (Awarded ONLY on Release)  ·  🔬 Research Points +1,170

Release?
🔥 SOTA Hype ×1.5 · Saturated market ×0.5
1 🌐 Open-source | 2 💼 License ($17,550) | 4 🗄️ Shelve
*(3 📈 Product locked: needs Fame ≥ 1000)*
```

Note how the exact Quality formula is hidden. The License price is computed silently as `78 × $150 × Demand 2 × Saturated 0.5 × SOTA Hype 1.5 = $17,550`, and the locked option states its unmet Requirement. On the mobile profile the same numbers appear in the S6 vertical layout instead. After choosing a release option, the Public Reception (S6-B) screen would then render the community reviews.

<!--
Tiếng Việt (tóm tắt):
Ví dụ minh họa (không phải dữ liệu game): tháng 4/2013, profile desktop,
người chơi có BOW, E-Lv 1, Fame 0, hai GTX 780 và dataset "Product reviews"
(reviews, Size 2, Quality 3). Model "SpamGuard" BOW × CLS huấn luyện 1 tháng,
sau đó Fine-Tune 1 tháng để xóa 5 Artifacts, focus 4/3/1/2.

Kết quả mẫu: Chất lượng = 78 → Tuyệt (ước tính +500 Danh tiếng, +1.170 Điểm Nghiên cứu); giá License $17,550
(được tính ngầm); lựa chọn Product bị khóa và ghi rõ điều kiện thiếu (Danh tiếng ≥ 1000). 
Điểm mấu chốt: giấu kín công thức, chỉ hiện kết quả, lựa chọn khóa
nêu lý do; trên mobile thì cùng số liệu nhưng render theo khung S6 dọc. Sau khi chọn phát hành, S6-B sẽ hiển thị các review cộng đồng.
-->
