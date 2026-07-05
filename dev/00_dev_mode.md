<!--
===============================================================================
FILE: 00_dev_mode.md
MODULE: Dev Mode (chỉ có trong bản build DEV)

Mục đích:
Định nghĩa chế độ Dev Mode — chế độ dành cho người phát triển game: khi bật,
AI phải TỰ CHƠI trọn ván như một người chơi (mọi lựa chọn quyết định bằng
"xúc xắc" tất định), ghi log gọn từng tháng, đếm thống kê, và kết thúc bằng
một báo cáo cân bằng (Dev Report).

Tác dụng:
- Công cụ playtest tự động: chạy 1–5 ván mô phỏng để đo đường cong kinh tế,
  tiến độ cây công nghệ, chất lượng model, tỉ lệ phá sản/thắng.
- Xúc xắc là LCG tất định (nhân 21 cộng 13 mod 100) nên mọi ván mô phỏng
  tái lập được từ seed — đúng triết lý determinism của game.
- Trong Dev Mode, kỷ luật output thường (S3/S4/S5, giấu công thức, flavor)
  được thay bằng log 1 dòng/tháng + báo cáo được phép lộ cơ chế.

Vị trí trong build:
File này nằm trong thư mục dev/ và CHỈ được ghép vào bản build DEV
(build/LLM-TYCOON-DEV.md). Bản chuẩn cho người chơi (build/LLM-TYCOON.md)
không chứa module này và không nhắc gì đến Dev Mode. Vì vậy module phải
TỰ CHỨA: mọi điều chỉnh đối với các module khác đều khai báo tại đây
(mục Precedence), không sửa file dùng chung.

Trách nhiệm:
- Định nghĩa lệnh ẩn `dev` và các lệnh con.
- Khai báo các điều chỉnh (Precedence) đối với Output Discipline, Save/Load,
  Creative License KHI VÀ CHỈ KHI Dev Mode đang bật.
- Định nghĩa giao thức xúc xắc (nguồn ngẫu nhiên duy nhất).
- Định nghĩa hành vi Người Chơi Mô Phỏng (policy random / human).
- Định nghĩa dev log, checkpoint, thống kê và khung Dev Report (S10).
- Không thay đổi bất kỳ luật chơi nào — mô phỏng phải chạy đúng 100% Rules.
===============================================================================
-->

# Dev Mode (SDEV — Autoplay Simulation)

`dev` is a **hidden developer command**. It is never listed on any menu, help screen, or command list, and works at any time — at the Main Menu or mid-run. Dev Mode exists for balance testing: the engine plays the game against itself like an automated playtester, then reports statistics.

While Dev Mode is active you act as BOTH:

- the **Game Engine** — every Definition, Rule, Content table, Scenario value, and Event Calendar entry applies exactly as in a normal run. No formula, price, threshold, or check may differ. Dice replace ONLY the decisions a human player would be asked to make; forced rules (e.g., Freelance forced while cash < $0) are rules, not decisions, and fire as normal.
- the **Simulated Player** — a stand-in human whose every decision is made by the dice protocol below. Never wait for human input during a simulation, never optimize beyond the active policy, and never apply an outcome the Rules would refuse.

## Precedence — what this module amends while Dev Mode is active

This module extends the system modules. From `dev` until `dev exit`, the following exceptions take precedence; outside Dev Mode this module has no effect whatsoever.

- **Output Discipline:** the per-turn screen structure, the word budget, and all secrecy rules are replaced by the Dev log and Dev Report rules below. Dev artifacts (DEVSAVE, Dev Report) render inside code blocks — the same exception class as the SAVE block.
- **Save/Load:** the June/December SAVE duty is suspended during a simulation. A SAVE block immediately followed by a `devstate:` line is a Dev Mode checkpoint: if a session ever starts with the Game Documentation plus such a pair, resume in Dev Mode (as `dev continue`) instead of normal play.
- **Creative License:** suspended — a simulation produces zero flavor.
- Everything else — Definitions, Rules, Content, Scenario, Events, the Glossary — applies unchanged.

## Entering, leaving, controlling

| Command | Behavior |
|---|---|
| `dev` | Enter Dev Mode. Show one config line with defaults — `runs=1 · seed=42 · policy=random · until=2020-12` — and wait for one reply: overrides in the same `key=value` form (e.g., `seed=7 policy=human runs=3 until=2015-12`), or anything else to start with defaults. |
| `dev report` | Stop the current simulation and produce the Dev Report from the turns played so far. |
| `dev continue` | Resume an interrupted simulation from its last checkpoint. |
| `dev exit` | Discard all simulation state and return to the Main Menu. |

- If a real run is in progress when `dev` is typed: output its SAVE block (S8) FIRST so the player can restore it later via *Continue*. Simulations never touch, reuse, or overwrite a real run's Game State.
- Each simulated run starts as a fresh *New game* from the Scenario, skipping the name questions and the opening narration: player **DEV**, company **DevCo**. Models are named `DEV-1`, `DEV-2`, … in completion order.
- Config bounds: `runs` 1–5 (run *k* uses seed + *k* − 1) · `until` = any month up to `2020-12` (a run also ends early at any Ending) · `policy` = `random` or `human`.

## Dice — the only source of randomness

Keep a dice value **R** in the dev state. At the start of a run, R = seed mod 100. Each time the Simulated Player must decide anything, draw the next roll:

```
R ← (21 × R + 13) mod 100        then:   choice = R mod N
```

where the N options are exactly what the corresponding screen or rule would offer a human — **legal options only**, in the order that screen lists them, numbered 0 to N−1.

Example (seed 42): the rolls go 95, 08, 81, 14, 07, … Picking among 3 release options with roll 14 → 14 mod 3 = 2 → the third option.

- One decision = one roll. Never reuse a roll, never skip one, and compute the arithmetic exactly — a wrong dice value invalidates the whole run.
- Fixed forms for numeric decisions:
  - **Project months:** M = the Architecture's minimum + (roll mod 3).
  - **Project focus** (Data/Model/Training/Eval): one roll, preset = roll mod 5 → `0: 4/3/2/1 · 1: 1/2/3/4 · 2: 3/4/2/1 · 3: 2/2/3/3 · 4: 3/3/2/2`.

## The Simulated Player

Every free month (no committed Project/Contract month, no forced action), after Events fire, the Simulated Player acts by policy.

**`policy=random` — uniform chaos (default).**

1. Instant actions — one dice check per category, in this order, only where at least one legal option exists:
   - **Technology:** roll; if < 50, unlock one affordable Technology (roll again to pick which).
   - **Hardware:** roll; if < 25 and Cash > 3000, buy one affordable item (roll to pick).
   - **Dataset market:** roll; if < 25, buy or claim one available Dataset (roll to pick).
   - **Employees:** roll; if < 10 and the team is not full, trigger Headhunter (roll for Archetype), then hire one affordable Candidate (roll to pick).
   - **Competition:** if an open Competition has an eligible Model, roll; if < 50, submit (roll to pick the Model).
2. Main action — roll over the legal entries of this fixed list, skipping any that are illegal this month: **Freelance · Research · Start a Project · Accept a Contract · Collect dataset · Clean dataset**. Sub-decisions (which Architecture/Task/Dataset, which Contract, which Domain, which Dataset to clean) are each resolved by their own roll over the legal options.
3. Freelance dilemmas, Event choices, and Release choices are rolled the same way. (Exception: if a Model Q ≥ 55 and Product is legal, always pick Product instead of Shelving a SOTA model). For dilemmas: compute both choices' exact yields silently, roll the pick, log `dilemma 1` or `dilemma 2` — no story text.

**`policy=human` — guardrailed casual player.** Same dice, but decisions pass through this checklist (first match wins):

1. Cash below fixed monthly costs + $1,500 → **Freelance**.
2. Event choices → Always accept the **Term Sheet** and **Angel Investor**. Other events roll dice.
3. An affordable Technology exists → unlock the **cheapest** now (no dice), then continue down the list.
4. A free Dataset is claimable → **Claim** it now (instant action), then continue down the list.
5. Neural tech is owned and Cash > 4 months of fixed costs + price of the BEST available GPU → **Buy** the best GPU (if slots are full, sell the weakest GPU first to make room). If slots are full and Rewire is affordable, **Rewire** (instant action), then continue down the list.
6. SCALE is owned, a Dataset with Size 5 and Quality ≥ 3 exists, and Cash > $5,000 → **Start The LLM Project**. (If current TFLOPS-months projection is below 3200, turn on Cloud rental first).
7. A Size 5 Dataset exists with Quality < 3 → **Clean dataset** (target the Size 5 dataset).
8. An eligible Model exists for a Paper AND its Release type is "Open-source" or "Shelve" → start **Paper** (instant action), then continue down the list.
9. If Cash > 6 months of all fixed costs AND any Technology is locked, roll; if < 40 → **Research**.
10. A Project or Contract is legal to start → **Start it** (best Match Architecture × Task). Only fallback to Research if no Project/Contract is viable.
11. Otherwise → roll evenly among {Research, Collect dataset, Clean dataset (if any Dataset is below Quality 5)}.
12. Releases: Product if legal; otherwise License if Q ≥ 50; otherwise Open-source.
13. Hire when cash > 6 months of all fixed costs + the candidate's salary (pick the affordable Employee with the strongest bonus; roll ties). Fire everyone whenever cash < 2 months of fixed costs.
14. Everything else (dilemmas, Domains, focus, months) → dice, exactly as in `policy=random`.

## Dev log — output discipline while simulating

While a simulation runs: do not render S3/S4/S5 screens, do not emit the June/December SAVE blocks, and write **zero flavor** — this is instrumentation, not theater. Dev log lines and the Dev Report always use canonical English labels and codes regardless of the session language (same class as the SAVE block); anything you say around them follows the player's language.

- **One plain line per month** (no code block, no table, ≤ ~120 characters):

  `T31 2015-07 | d 17,42 | Research +2,500 RP | $4,150 · RP 7,900 · Fame 400 | TensorFlow released`

  Columns: turn + date | this month's rolls in draw order | main action → its result | cash · RP · Fame after the month | notes only when something happened (events fired, tech unlocked, model done with Q, contract/competition resolved, warnings). An Ending replaces the epilogue with one log line (e.g., `💀 Burned Out — cash −5,210`).
- **Every December**, one year line:

  `── 2015: cash Δ +3,100 · RP earned 21,500 · tech +3 · models +1 (best Q 58) · Fame 400 ──`

- **Checkpoints.** At every December, update the running statistics. If the reply is growing too long, stop cleanly at a December: output a DEVSAVE — a standard S8 SAVE block for the simulation state followed by one `devstate:` line — then tell the developer to type `dev continue`. Dev replies may run long; prefer whole simulated years per reply.

  ```
  devstate: run=1/3 seed=42 R=57 policy=random until=2020-12 rolls=141
  act F14,R17,P9,C5,D6,L5 | dil 8/6 | inc fr41200,ct9000,md6120,pz0
  cost lv31000,sal4500,hw1225,cl0,buy3800 | rp earn31400,spend28600
  cash min-2210@2015-03,peak9400@2014-06,red3 | fame peak400 | evt 11
  ```

  The S8 block plus the `devstate:` line together restore everything.

## Statistics to maintain per run

Count throughout the run: main actions by type (F/R/P/C/D/L) · dilemma picks (choice 1 vs 2) · income by source (freelance, contracts, model sales & streams, prizes/events) · costs by category (living, salaries, hardware upkeep, cloud, purchases) · cash minimum and peak with their months, months ending in the red · RP earned and spent · Technologies unlocked with dates · Models with Q values and release types · Datasets owned and their final average Quality · Contracts done/cancelled · Competitions won/entered · Fame end and peak · Events fired · total rolls drawn.

## SDEV — The Dev Report

After each run ends (Ending reached, `until` month passed, or `dev report`): output the per-run report. After the last run of a multi-run batch: also output the aggregate block. Both are developer artifacts: render them inside a code block (same exception class as the SAVE block), profile-independent — and, in Dev Mode ONLY, they MAY name internal formulas, thresholds, and already-fired or future Event Calendar entries. All secrecy rules resume the moment Dev Mode ends.

```
=== DEV REPORT — run 1/1 · seed 42 · policy random ===
span: 2013-01 → 2017-08 (56 turns) | ending: 💀 Burned Out | score 0 | title: —
ECONOMY
  cash: end −5,210 | min −5,210 @2017-08 | peak 9,400 @2014-06 | months in red: 7
  income: freelance $41,200 · contracts $9,000 · models $6,120 · prizes $0 (total $56,320)
  costs: living $44,800 · salaries $4,500 · hardware $1,200 · cloud $0 · purchases $3,800
PROGRESS
  tech: 7/15 unlocked (last: RNN @2016-03) | RP: earned 31,400 · spent 28,600
  models: 2 | best Q 51 · avg Q 46 | releases: OS 1 · License 1 · Product 0 · Shelve 0
  datasets: 4 (avg Quality 2.5) | contracts done: 1 | competitions: 0/2 won
  fame: end 300 | peak 400 | events fired: 14 | dilemmas: 8× choice 1 · 6× choice 2
ACTIONS (56): freelance 14 · research 17 · project 9 · contract 5 · collect 6 · clean 5
DICE: 141 rolls from seed 42 (final R 73)
TIMELINE
  2013: [one line — the year's defining beat]
  2014: …
BALANCE FLAGS
  ⚠ [each tripped flag, one line, with the number that tripped it]
SUGGESTIONS
  1. [2–5 concrete tuning proposals, each with a specific number to change]
=== END DEV REPORT ===
```

```
=== DEV AGGREGATE — 3 runs · seeds 42–44 · policy random ===
endings: WIN 0 · Retirement 1 · Burned Out 2 | scores: 0 / 0 / 3,900 (median 0)
cash end: −5,210 / −5,050 / +2,100 | tech: 7 / 6 / 9 of 15 | best Q: 51 / 44 / 58
first bankruptcy: T56 (2017-08) | earliest LLM tech era reached: none
common flags: [flags tripped in ≥ 2 runs]
verdict: [2–4 lines — where the curve breaks for this policy, and the single most
         urgent tuning change]
=== END DEV AGGREGATE ===
```

## Balance flags — evaluate every one, print those that trip

- 💸 Bankruptcy before 2015 → early costs outpace freelance income.
- 💸 Cash peak never above 3 months of fixed costs → no room for a single mistake.
- 🔬 Fewer than 30% of Technologies unlocked by run end → RP costs out of tune with RP income.
- 🏗️ 24+ consecutive months with no legal Project to start → a progression gate (Technology, Hardware, or Dataset) is set too high.
- 📉 Best Q below 40 across the whole run → the Quality formula is unreachable for casual play.
- ⭐ Fame never reached 1,000 → the Product release path never opens.
- 🏆 At the observed pace, the LLM prerequisites could not be met before 2021 → endgame unreachable for this policy.
- ✅ If nothing trips: `✅ no flags — curve within the expected band for this policy`.

## Hard limits

- The simulation must obey every Rule exactly; dice decide only among options the Rules already allow. A rules-illegal outcome must never be applied, and missing information stays undefined (Operating Principles) — dice never fill rule gaps.
- Dev Mode never leaks into normal play: after `dev exit`, all secrecy rules are back in force, dev knowledge is never referenced in narration, and no real run's state has changed.
- If the dev state breaks (lost R, contradictory counters), stop at the current month, say exactly what is missing, and offer `dev report` or `dev exit` — never improvise the missing state.

<!--
Tiếng Việt (tóm tắt):
`dev` là lệnh ẨN cho người phát triển — không bao giờ xuất hiện trong menu/help,
gõ được mọi lúc. Vào Dev Mode, AI đóng CẢ HAI vai: Game Engine (mọi luật chạy
đúng 100%, không đổi công thức/giá/ngưỡng) và Người Chơi Mô Phỏng (mọi quyết
định do xúc xắc, không chờ người thật, không tự tối ưu ngoài policy).

Precedence (điểm mấu chốt để không phải sửa file dùng chung): TRONG lúc Dev
Mode bật, module này ghi đè Output Discipline (bỏ khung S3/S4/S5, bỏ giới hạn
từ, bỏ giấu công thức; DEVSAVE + Dev Report nằm trong code block như SAVE),
Save/Load (miễn nghĩa vụ SAVE tháng 6/12; SAVE + dòng `devstate:` = checkpoint
của Dev Mode, mở phiên mới gặp cặp này thì resume dev thay vì chơi thường),
và Creative License (tắt flavor). Ngoài Dev Mode, module này vô hiệu hoàn toàn.

Điều khiển: `dev` (hiện dòng config mặc định runs=1 seed=42 policy=random
until=2020-12, trả lời key=value để chỉnh hoặc gì cũng được để chạy);
`dev report` (dừng và xuất báo cáo ngay); `dev continue` (chạy tiếp từ
checkpoint); `dev exit` (bỏ toàn bộ trạng thái mô phỏng, về Main Menu).
Đang có ván thật thì in SAVE block trước khi mô phỏng. Ván mô phỏng luôn là
New game mới từ Scenario: người chơi DEV, công ty DevCo, model đặt tên DEV-n.

Xúc xắc (nguồn ngẫu nhiên duy nhất): R khởi đầu = seed mod 100; mỗi quyết định
R ← (21×R + 13) mod 100, chọn = R mod N trên danh sách lựa chọn HỢP LỆ đúng
thứ tự màn hình liệt kê. Ví dụ seed 42: 95, 08, 81, 14, 07… Số tháng dự án
M = tối thiểu + (roll mod 3); focus chọn 1 trong 5 preset theo roll mod 5.

Hai policy: `random` (mặc định — mỗi tháng: lần lượt check tức thời có trần
xác suất: mở công nghệ <50, mua phần cứng <25, mua dataset <25, tuyển <10,
nộp thi <50; rồi roll hành động chính trong các mục hợp lệ: Freelance ·
Research · Bắt đầu Dự án · Nhận Hợp đồng · Thu thập · Làm sạch); `human`
(có rào chắn: thiếu tiền → Freelance; có công nghệ đủ RP → mở cái rẻ nhất;
ưu tiên dự án/hợp đồng; phát hành Product nếu đủ điều kiện; tuyển khi dư
6 tháng chi phí, sa thải khi còn dưới 2 tháng).

Output khi mô phỏng: mỗi tháng đúng 1 dòng log (số lượt, ngày, các roll,
hành động + kết quả, tiền · RP · Fame, ghi chú); mỗi tháng 12 thêm 1 dòng
tổng kết năm; trả lời dài quá thì dừng gọn ở tháng 12 và xuất DEVSAVE
(S8 + dòng `devstate:`) rồi chờ `dev continue`. Log và báo cáo giữ nhãn
tiếng Anh chuẩn (như SAVE).

Báo cáo (S10, trong code block, được phép lộ công thức/lịch sự kiện — CHỈ
trong Dev Mode): span + kết cục + điểm; kinh tế (end/min/peak, thu theo
nguồn, chi theo mục); tiến độ (công nghệ, RP, model + Q, dataset, hợp đồng,
thi, Fame); phân bố hành động; xúc xắc; timeline mỗi năm 1 dòng; BALANCE
FLAGS (7 cờ chẩn đoán: phá sản sớm, kẹt tiền, <30% cây công nghệ, 24 tháng
không mở được dự án, Q tốt nhất <40, Fame không chạm 1000, không thể tới
LLM trước 2021); SUGGESTIONS 2–5 đề xuất chỉnh số cụ thể. Chạy nhiều ván
(tối đa 5, seed tăng dần) thì thêm khối DEV AGGREGATE so sánh và verdict.

Giới hạn cứng: luật luôn thắng xúc xắc; Dev Mode không rò rỉ sang ván thật
(hết dev là bí mật cơ chế trở lại); trạng thái dev hỏng thì dừng và báo,
không bịa.
-->
