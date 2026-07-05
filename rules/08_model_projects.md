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
6. **Name** — the Model's name.

**Discovery Mechanic:** Do not warn the player about bad synergies or incorrect focus before they start. Let them fail. In the Project Wizard, if the player has previously completed a Model with a specific Architecture × Task pairing, reveal the Match quality (Perfect/Good/Weak/Poor) for that pairing. If they have used a Domain for a Task before, reveal the Domain fit. Otherwise, keep it strictly hidden.

Validate every requirement before starting; if any fails, refuse with the reason and do not start.

## Artifacts & Fine-Tuning

During every Project month, the raw training process generates output anomalies called **Artifacts**.
- **Generated per month:** `Art_gen = max(1, 5 + floor(Architecture Base Q ÷ 10) - E-Lv)`. Add this to the Project's total `Artifacts`.
- The UI displays current `Artifacts` in the Dashboard and `+Art` in the monthly ledger.

When `months elapsed == M`, if `Artifacts > 0`, the Project enters the **Fine-Tuning Phase**. The engine pauses and presents a Dilemma (S10):
- **Option 1: Release Base Model.** The project completes immediately. `Q` suffers a penalty of `-floor(Artifacts ÷ 2)` due to raw, unaligned outputs.
- **Option 2: Fine-Tune (1 month).** Extends `M` by 1. The next month's action is dedicated to fine-tuning, which reduces `Artifacts` by `8 + (3 × E-Lv)`. At the end of that month, if `Artifacts > 0`, this Dilemma repeats; if `Artifacts ≤ 0`, the Project completes automatically.

## Project Dilemmas (Mid-Project)

When a Project reaches `months elapsed == floor(M ÷ 2)` (for M ≥ 2), the engine calculates its **Synergy Score**:
`Synergy = Match(Arch × Task) + Domain fit + Focus score`

- If **Synergy ≥ 16**, trigger a **Breakthrough** dilemma (Content / Project Dilemmas).
- If **Synergy ≤ 8**, trigger a **Complication** dilemma (Content).
- If 9–15, the project proceeds smoothly with no interruption.

When triggered, pause the game, render the Dilemma (S10), and wait for the Player's choice. The resulting `q_mod` is added to the Project's state and applied at completion. `M +1` increases the total committed months.

## The Bottom-Up Quality Calculation

Compute scores silently at completion. Never reveal the formula or exact breakdown to the player.

**Step 1: Calculate Base Points**
```
Base Points = Base(Architecture)                … Content: architectures table
            + (2 × Dataset Quality)
            + 5                                 … dataset Size meets the minimum
            + Compute score                     … see below
            + Focus score                       … see below
            + (2 × E-Lv)
            + Technology & staff bonuses        … BPE +5 (S2S/S2SA/TRF/PTRF); FINE +5 (PTRF); staff
            + q_mod                             … from Project Dilemmas
            − floor(Artifacts ÷ 2)              … Penalty if released with remaining Artifacts
            − 15 if repeat                      … same Arch + Task + Dataset as previous Model
```

*Compute score:* ≥ 2× req (+8); ≥ req (+5); ≥ req÷2 (−5); < req÷2 (−15). Req 0 always scores +5.
*Focus score:* `10 − Σ |allocated − ideal|` across the four aspects (floor 0).

**Step 2: Calculate Individual Review Scores**
Identify ALL applicable Reviewers (Benchmarks matching Task & Year). If < 4, pad with AI Communities (Content). For EACH Reviewer, calculate its specific score (0-100):
```
Review Score = Base Points
             + Match(Architecture × Task)       … Content: match matrix
             + Domain Fit                       … see below
```
*Domain Fit logic for each Reviewer:*
- If Dataset Domain is in the Benchmark's `Target Domains`: **+20**
- If Dataset Domain is `web-mixed` (General knowledge): **+5**
- If Reviewer is a Filler (AI Community/Media): **+5** (They judge general utility)
- Any other mismatch: **−15**

*Clamp each Review Score between 0 and 100.*

**Step 3: Final Quality (Q) & UI Display**
- **Q** = Average of all `Review Scores` (floor 0, cap 100).
- When rendering the UI (S6), display each Reviewer's score on a 100-point scale (e.g., 85/100).
- For each Benchmark, identify the current State-of-the-Art (SOTA) rival from the **Historical SOTA** table (Content). Display a comparison between the Player's Score and the SOTA Score.
- The Engine uses Creative License to write a 1-sentence flavor quote. **Crucially**, this quote MUST react to the comparison: if the Player beats the SOTA, the quote should hype the new world record; if they lose, it should point out the gap.

## Reception

The overall `Q` tier determines the Fame reward:

| Q | Reception | Fame |
|---|---|---|
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
