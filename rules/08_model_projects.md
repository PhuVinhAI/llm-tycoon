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

1. **Architecture** — must be granted by an owned Technology. Neural Architectures also require GPUT and Available TFLOPS/mo ≥ 100 (Hardware rule).
2. **Scale** — Small (Compute req ×0.5), Base (Compute req ×1), or Large (Compute req ×2).
3. **Inherit (Optional)** — Name of a previously completed Model (must be TRF or PTRF architecture). If used: Compute req is further multiplied by 0.5, and minimum months is reduced by 1 (minimum 1).
4. **Task** — one of the Tasks in the Content.
5. **Dataset(s)** — 1 to 3 owned Datasets. **Combined Size** = Max(Sizes) + (Count - 1), capped at 5. **Combined Quality** = floor(Average(Qualities)). Compute Requirement is multiplied by 1.0 (1 dataset), 1.5 (2 datasets), or 2.0 (3 datasets).
6. **Months (M)** — at least the adjusted minimum months.
7. **Focus** — exactly 10 points split across **Data / Model / Training / Eval**.
8. **Name** — the Model's name.

**Discovery Mechanic:** Do not warn the player about bad synergies or incorrect focus before they start. Let them fail. In the Project Wizard, if the player has previously **analyzed** a Model (via the Portfolio action) with a specific Architecture × Task pairing, reveal the Match quality (Perfect/Good/Weak/Poor) for that pairing. If they have **analyzed** a Model using a specific Domain for a Task, reveal the Domain fit. Otherwise, keep it strictly hidden.

Validate every requirement before starting; if any fails, refuse with the reason and do not start.

## Artifacts & Fine-Tuning

During every Project month, the raw training process generates output anomalies called **Artifacts**.
- **Generated per month:** `Art_gen = max(1, 4 + floor(Architecture Base Q ÷ 10) - E-Lv)`. Add this to the Project's total `Artifacts`.
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
            + Scale Modifier                    … Small: −5 | Base: 0 | Large: +10
            + (2 × Combined Dataset Quality)
            + 5                                 … Combined Size meets the minimum
            + Compute score                     … see below
            + Focus score                       … see below
            + (2 × E-Lv)
            + Technology & staff bonuses        … BPE +5 (S2S/S2SA/TRF/PTRF); FINE +5 (PTRF); staff
            + q_mod                             … from Project Dilemmas
            − floor(Artifacts ÷ 2)              … Penalty if released with remaining Artifacts
            − 15 if Catastrophic Forgetting     … Dataset Count > 1 AND Architecture is below TRF
            − 15 if repeat                      … same Arch + Task + Dataset(s) as previous Model
```

*Compute score:* ≥ 2× req (+8); ≥ req (+5); ≥ req÷2 (−5); < req÷2 (−15). Req 0 always scores +5.
*Focus score:* `10 − Σ |allocated − ideal|` across the four aspects (floor 0).

**Step 2: Calculate Individual Benchmark Scores**
Identify ALL applicable Benchmarks (matching Task & Date ≤ current Month/Year). For EACH Benchmark, calculate its specific score (0-100):
```
Benchmark Score = Base Points
                + Match(Architecture × Task)       … Content: match matrix
                + Domain Fit                       … see below
```
*Domain Fit logic for each Benchmark:*
- If ANY Dataset's Domain is `user-logs` AND its Name contains the current Project's Task ID: **+20** (Perfect closed-loop data)
- If ANY of the Datasets' Domains are in the Benchmark's `Target Domains`: **+20**
- If ANY of the Datasets' Domains are `web-mixed` (General knowledge): **+5**
- Any other mismatch: **−15**

*Clamp each Benchmark Score between 0 and 100.*

**Step 3: Final Quality (Q) & UI Display**
- **Q** = Average of all `Benchmark Scores` (floor 0, cap 100).
- *Inherit Cap:* If the Project inherited from a previous Model, **Q** cannot exceed `(Inherited Model's Q + 15)`.
- When rendering the UI (S6), display each Benchmark's score.
- Identify the current State-of-the-Art (SOTA) rival from the **Historical SOTA** table (Content). The Game Engine must select the most recent rival whose `Date` is ≤ the current in-game Month and Year. Display a comparison.
- The Engine uses Creative License to write a 1–2 sentence **Internal Analysis** quote. **Crucially**, this quote MUST: 1) Briefly explain what the benchmark actually measures in simple layman's terms, and 2) Provide a technical analysis comparing the Player's local test results against the public SOTA.

## Reception & Fame

The overall `Q` tier determines the **Estimated Reception Fame**:

| Q | Reception | Est. Fame |
|---|---|---|
| ≥ 85 | 🌟 Breakthrough | +800 |
| 70–84 | 🔥 Great | +500 |
| 55–69 | 👍 Good | +300 |
| 40–54 | 😐 Mediocre | +100 |
| < 40 | 💔 Failure | −100 |

**CRITICAL RULE:** This Fame is NOT awarded immediately. It is only awarded if and when the Player chooses to Release the model (Open-source, License, or Product). If the Player chooses **Shelve**, they receive **0 Fame**. 
Every completed Model immediately grants **RP + (floor(Q) × 15)** (knowledge gained from building it) and counts toward E-Lv.

## Release (from Completion or Portfolio)

A Model may be released immediately upon completion (S6) or later from the Portfolio (S15) if it is currently `Shelved`. Releasing a shelved model is an instant action. A Failure model (Q < 40) may only be open-sourced or shelved.

*Public Reception (S6-B):* Whenever a Model is released (Open-source, License, or Product), the Engine must immediately render the **Public Reception (S6-B)** screen before returning to the Action Menu. The Engine selects exactly 4 Public Reviewers (Content) and uses Creative License to write 1-sentence reviews reacting to the Model's final Q, SOTA status, and any remaining Artifacts.

*SOTA Hype:* If the Model's score strictly exceeded the SOTA Rival's score on *at least one* Benchmark at the time of completion, it retains the **SOTA Hype** status for its eventual release.
*Market Timing:* Financial payouts use the Demand and Event Modifiers of the **current month of release**, allowing players to hoard models for market booms.
*Paper Limitation:* If a `Shelved` model has been published via an Academic Paper (`pub=yes`), it may **only** be released as Open-source (proprietary tech is already leaked).

| Release | Effect |
|---|---|
| 🌐 **Open-source** | Fame = reception Fame × 2 (replaces normal reception Fame); RP +500 extra. If released with Artifacts > 0, the community loves tinkering with the raw base model: **+300 extra Fame**. No cash. |
| 💼 **License** (one-time sale) | Cash = Q × $150 × Demand (Content, current era + active event modifiers). If SOTA Hype: **Cash × 1.5**. Q < 40 → $0, no buyer. |
| 📈 **Product** | Requires Fame ≥ 1000 and Q ≥ 55. Creates an Income Stream: Q × Demand × $25 per month for 8 months. Reserves **Inference TFLOPS** = Architecture Compute Req ÷ 10 (minimum 0). (Track Task, Q, and Inference in the stream to generate User Logs upon expiry). If SOTA Hype: **Income × 1.5**. If released with Artifacts > 0: **Income × 0.5**. Reception Fame applies normally. |
| 🗄️ **Shelve** | Nothing. The Model stays in the portfolio, waiting for a future release, a Competition, or a Paper. |

## Post-Mortem Analysis (Portfolio)

The Player can view their Portfolio (S15) and ask to **Analyze** any completed Model.
- This is an instant, free action. Each Model can only be analyzed once.
- **Mechanical Effect:** Mark the model as **Analyzed** in the Game State (and SAVE block). This permanently unlocks the Match (Architecture × Task) and Fit (Task × Domain) UI hints in the Project Wizard (S12) for these specific combinations.
- The Engine acts as a senior AI researcher reviewing the project.
- **Format:** Output a 3-4 paragraph analysis.
- **Content:** Discuss the *Synergy* (how well the Architecture fit the Task, and if the Dataset Domain was appropriate) and the *Focus allocation* (what they did right or wrong).
- **Constraint:** NEVER reveal the exact numerical formulas, ideal focus numbers, or exact match scores. Use qualitative, educational feedback (e.g., "Transformers are massive overkill and data-starved for simple spam filtering," or "You spent too much time on Model design when N-grams just need pure Data cleaning").
- After the analysis, re-render the Portfolio (S15).

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
