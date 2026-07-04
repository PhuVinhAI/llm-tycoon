<!--
===============================================================================
FILE: 08_model_projects.md
MODULE: Rules / Model Projects

Mục đích:
Định nghĩa trái tim của game: quy trình xây một Model — khai báo, kiểm tra
điều kiện, công thức Quality, đánh giá tiếp nhận, và các lựa chọn phát hành.

Tác dụng:
Tương đương màn "phát triển game" của Game Dev Tycoon: người chơi ghép
Architecture × Task × Dataset × compute × phân bổ trọng tâm, engine tính
điểm công khai từng thành phần.

Trách nhiệm:
- Định nghĩa wizard khai báo dự án.
- Định nghĩa công thức Quality (duy nhất tại đây).
- Định nghĩa tiếp nhận, RP thưởng, và phát hành.
===============================================================================
-->

# Model Projects

## Declaring a Project (the start wizard)

The Player declares, in one instant action:

1. **Architecture** — must be granted by an owned Technology. Neural Architectures also require GPUT and total TFLOPS/mo ≥ 100 (Hardware rule).
2. **Task** — one of the Tasks in the Content.
3. **Dataset** — owned, with Size ≥ the Architecture's minimum Size.
4. **Months (M)** — at least the Architecture's minimum months.
5. **Focus** — exactly 10 points split across **Data / Model / Training / Eval**.
6. **Name** — the Model's name (offer a suggestion if asked).

Validate every requirement before starting; if any fails, refuse with the reason and do not start.

## Quality formula

Compute Q silently at completion. Floor 0, cap 100. Never reveal the formula or exact breakdown to the player.

```
Q = Base(Architecture)                          … Content: architectures table
  + Match(Architecture × Task)                  … Content: match matrix
  + 2 × Dataset Quality
  + 5                                           … dataset Size meets the minimum (always true if started)
  + Domain fit (+3 / 0 / −3)                    … Datasets rule
  + Compute score                               … see below
  + Focus score                                 … see below
  + 2 × E-Lv
  + Technology & staff bonuses                  … BPE +5 (S2S, S2SA, TRF, PTRF only); FINE +5 (PTRF only); staff per Content
  − 15 if repeat                                … same Architecture + Task + Dataset as any previous Model
```

**Compute score** — compare accumulated CU-months against the Architecture's requirement (req):

| Accumulated | Score |
|---|---|
| ≥ 2 × req | +8 |
| ≥ req | +5 |
| ≥ req ÷ 2 | −5 |
| < req ÷ 2 | −15 |

A requirement of 0 always scores +5.

**Focus score** = 10 − Σ |allocated − ideal| across the four aspects (floor 0). Ideal allocations per Architecture are in the Content.

## Reception

| Q | Reception | Fame |
|---|---|---|---|
| ≥ 85 | 🌟 Breakthrough | +800 |
| 70–84 | 🔥 Great | +500 |
| 55–69 | 👍 Good | +300 |
| 40–54 | 😐 Mediocre | +100 |
| < 40 | 💔 Failure | −200 |

Every completed Model also grants **RP + (floor(Q) × 10)** and counts toward E-Lv.

## Release (the Player picks exactly one; a Failure model may only be open-sourced or shelved)

| Release | Effect |
|---|---|
| 🌐 **Open-source** | Fame = reception Fame × 2 (replaces normal reception Fame); RP +500 extra. No cash. |
| 💼 **License** (one-time sale) | Cash = Q × $60 × Demand (Content, current era + active event modifiers). Q < 40 → $0, no buyer. |
| 📈 **Product** | Requires Fame ≥ 1000 and Q ≥ 55. Creates an Income Stream: Q × Demand × $6 per month for 8 months. (Flavor: Engine announces ~[Q × Demand × 10,000] active users). Reception Fame applies normally. |
| 🗄️ **Shelve** | Nothing. The Model stays in the portfolio (still eligible for Competitions). |

<!--
Tiếng Việt (tóm tắt):
Khai báo dự án (tức thời): chọn Architecture (đã mở khóa; neural cần GPUT và
TFLOPS ≥ 100) + Task + Dataset (Size đủ) + số tháng M (≥ tối thiểu) + phân bổ đúng
10 điểm Focus cho Data/Model/Training/Eval + đặt tên. Engine kiểm tra đủ
điều kiện mới cho chạy.

Công thức Quality (tính khi hoàn thành, hiện từng dòng, sàn 0 trần 100):
Q = Base + Match + 2×Quality_dataset + 5 (đủ Size) + Domain fit (±3/0)
  + Điểm compute (≥2×yêu cầu:+8; ≥yêu cầu:+5; ≥nửa:−5; dưới nửa:−15; yêu
    cầu 0 luôn +5)
  + Điểm focus (10 − tổng |chênh với lý tưởng|, sàn 0)
  + 2×E-Lv + bonus công nghệ/nhân sự (BPE +5 cho S2S trở lên; FINE +5 cho
    PTRF; nhân sự theo Content)
  − 15 nếu lặp lại đúng bộ ba Architecture+Task+Dataset đã từng làm.

Tiếp nhận: ≥85 Đột phá +800 Fame; 70–84 Tuyệt +500; 55–69 Tốt +300; 40–54 Tàm tạm
+100; <40 Thất bại −200. Mỗi model xong: +(Q×10) RP, tính vào E-Lv.

Phát hành (chọn đúng 1; model Thất bại chỉ được mã nguồn mở hoặc cất kho):
Mã nguồn mở (Fame tiếp nhận ×2, +500 RP, không tiền); Bán bản quyền (Q × $60 ×
Demand; Q<40 không ai mua); Sản phẩm (cần Fame ≥1000 và Q ≥55 — dòng thu
Q×Demand×$6/tháng trong 8 tháng); Cất kho (không gì cả, vẫn được đem thi).
-->
