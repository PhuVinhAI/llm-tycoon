<!--
===============================================================================
FILE: 02_screens_desktop.md
MODULE: UI / Desktop Screens

Mục đích:
Khung markdown cố định của từng màn hình ở profile DESKTOP (UI ngang cho
PC): dòng gộp nhiều cột, tận dụng chiều rộng, được dùng bảng.

Tác dụng:
Engine chỉ việc điền giá trị vào khung — mọi lượt trông giống hệt nhau,
người chơi luôn biết nhìn vào đâu. Nhãn và chỉ số dịch hoàn toàn sang ngôn ngữ người chơi; tên công nghệ AI và mã SAVE giữ nguyên (ui/00_ui_system.md).
===============================================================================
-->

# Screens — Desktop Profile (🖥️ landscape)

Labels are translated into the player's language; emoji anchors and canonical codes stay. Skeletons below are exact.

## S0 — Title & Setup

**S0-A (Language Ask):** Rendered strictly in simple English.
🏭 **LLM TYCOON**
Build the world's first LLM (2013-2020)
v0.3 · Chapter 1: Home Lab

🌐 **What language do you want to play in?** (Example: English, Tiếng Việt, Español...)

**S0-B (Device Ask):** Rendered in the player's chosen language.
📱🖥️ **[Phone or PC?]**
1 = 📱 [Mobile UI]
2 = 🖥️ [Desktop UI]
👉 [Pick a number]

## S1 — Main Menu

| 🏭 LLM TYCOON — Main Menu | |
|---|---|
| 1 🎮 New game | 2 📂 Continue |
| 3 📖 How to play | 4 ℹ️ About |
| 5 🚪 Exit | |

👉 Pick a number.

## S2 — Info (How to play / About)

Free-form but short: the guide (≤ 10 lines) or the Game Info card + pitch. Always end with:

0 🏠 Main Menu

## S3 — Dashboard

| 📊 [Company] | 📅 [Month YYYY] (Turn [N]) |
|---|---|
| **Resources** | 💰 $[cash]  ·  🔬 Research Points [x]  ·  ⭐ Fame [x]/5000 |
| **Skills** | 🧠 Research Lv [x]  ·  Engineering Lv [x] |
| **Assets** | 🖥️ [total] TFLOPS ([slots used]/[total])  ·  👥 [team or "solo"] |
| **Knowledge** | 📚 Data: [count]  ·  🛠️ Tech: [owned tech names] |
| **Status** | 📦 [idle / project (🧩 Art) / contract]  ·  💵 Streams: +$[x]/mo  ·  📉 Fixed: -$[x]/mo |

*(Expand Data/Hardware details only when the player asks to see them, keeping the dashboard clean).*

## S4 — Turn Report

Structure of every resolved turn, in this order: event cards (if any) → month ledger → Dashboard (S3) → Action Menu (S5).

*(For each Event Calendar entry OR Historical News triggered this month, render a card):*
📰 **[Month YYYY] — [Headline / Event Title]**
*[FLAVOR: 2–3 lines. Act as a tech journalist. Explain the AI model, benchmark, or paper clearly so the player learns real AI history.]*
*(If it has a mechanical effect):* ▸ [mechanical effect, plainly stated]

📅 **[Month YYYY] — [main action taken]**
*[FLAVOR: 1–2 lines describing the action. If a Technology was unlocked this turn, explain how it works here.]*
[one line per change: +/− cash, RP, Fame, 🧩 +x Artifacts…]
💰 [cash after] | 🔬 Research Points [after]

## S5 — Action Menu

*(If the Company is IDLE):*
| What will you do this month? | |
|---|---|
| 1 💼 Freelance | 2 🔬 Research |
| 3 🏗️ New model | 4 📦 Data |
| 5 📜 Contracts | 6 🛒 Shop |
| 7 👥 Team | 8 🌳 Tech Tree |
| 9 📁 Portfolio | 10 💾 Save |
| 11 🎓 Publish Paper | 0 🏠 Main Menu |

*(If a PROJECT, CONTRACT, or PAPER is active):*
| Active: [Project Name, Contract ID, or Paper on Model] | Month [X] of [M] |
|---|---|
| **1 ⏩ Continue [Project/Contract/Paper]** | **2 🛑 Cancel** |
| 6 🛒 Shop | 7 👥 Team |
| 8 🌳 Tech Tree | 9 📁 Portfolio |
| 10 💾 Save | 0 🏠 Main Menu |

💡 **Tip:** *[Generate 1 short, context-aware tip based on the player's current Cash, RP, active events, or available actions. e.g., Remind them they can use natural language commands, combine datasets, or check the tech tree if RP is high. NEVER spoil exact formulas, ideal focus, or matches.]*

**Progressive Disclosure:** To prevent overwhelming the player, ONLY show actions that are currently relevant or unlocked.
- Hide `Contracts` and `Team` entirely until Fame ≥ 800.
- Hide `Shop` entirely until the player owns a Neural Architecture (GPUT or EMB).
- Hide `Publish Paper` entirely until the player has at least one eligible Model (Q ≥ 60, unpublished).
- Always show Freelance, Research, New model, Data, Save, and Main Menu.

## S6 — Model Completion Report

🏁 **[Model]** — [Architecture] × [Task] on [Dataset]
*(If released with Artifacts > 0: "⚠️ Base model released with [Art] unresolved artifacts")*

**Local Evaluation (Benchmarks):**
| Benchmark | Your Score | SOTA Rival (Date) | SOTA Score |
|---|---|---|---|
| [Benchmark 1] | **[Score]/100** | [Rival Model] | [SOTA]/100 |
| [Benchmark 2] | **[Score]/100** | [Rival Model] | [SOTA]/100 |
*(List ALL applicable Benchmarks. Do NOT pad with fillers).*

**Internal Analysis:**
* [Benchmark 1]: *"[1-2 sentences: Explain what this benchmark measures + technical reaction to Player vs SOTA]"*
* [Benchmark 2]: *"[1-2 sentences: Explain what this benchmark measures + technical reaction to Player vs SOTA]"*

**Overall Quality: [Q]/100** ([reception emoji + tier])
⭐ Est. Fame [±x] (Awarded ONLY on Release)  ·  🔬 Research Points +[x]

**Release?**
*(If SOTA Hype: "🔥 SOTA Hype! License and Product payouts are ×1.5")*
*(If Artifacts > 0: "⚠️ Artifacts: Product payout will be halved. Open-source grants bonus Fame.")*
1 🌐 Open-source | 2 💼 License ($[x]) | 3 📈 Product ($[x]/mo × 8) | 4 🗄️ Shelve (0 Fame)
*[locked options: state the unmet Requirement]*

## S6-B — Public Reception (Triggered on Release)

🌍 **Public Reception: [Model Name]**
*(Rendered immediately after choosing Open-source, License, or Product)*

**Community Reviews:**
* **[Reviewer 1]:** *"[1 sentence reacting to Q, SOTA, or Artifacts]"*
* **[Reviewer 2]:** *"[1 sentence reacting to Q, SOTA, or Artifacts]"*
* **[Reviewer 3]:** *"[1 sentence reacting to Q, SOTA, or Artifacts]"*
* **[Reviewer 4]:** *"[1 sentence reacting to Q, SOTA, or Artifacts]"*

**Final Payout:**
⭐ Fame [±x] added!
💰 [Cash amount / Income Stream details / "No direct cash (Open-source)"]

## S7 — Market List (shop, datasets, contracts, candidates)

🛒 **[List title] — [Month YYYY]**
1 [name] — [key numbers] — $[price]
2 [name] — [key numbers] — $[price]
…
💰 $[cash] · 0 ↩ Back

## S10 — Dilemma (Freelance, Research, Projects & Contracts)

⚠️ **[Event Title]**
*[FLAVOR: 2–3 lines of story combining the matrix coordinates]*

| Option | Yield / Effect |
|---|---|
| 1 [Standard Choice] | [Exact calculated yield] |
| 2 [Trade-off Choice] | [Exact calculated yield] |

👉 What is your choice?

## S11 — Sub-Menu (Data & Team)

[Icon] **[Menu Name]**
1 [Action 1] ([Cost/Time])
2 [Action 2] ([Cost/Time])
…
0 ↩ Back

## S13 — Data Menu

📦 **Data Management**

**Owned Datasets:**
| ID | Name | Domain | Size | Quality |
|---|---|---|---|---|
| D1 | [Name] | [Domain] | [Size] | [Q] |
*(If none: "No datasets owned.")*

**Actions:**
| 1 📦 Collect dataset (1 month) | 2 🧹 Clean dataset (1 month) |
| 3 🔗 Combine datasets (instant) | 4 🛒 Data Market (instant) |
| 0 ↩ Back | |

## S14 — Tech Tree

🌳 **Technology Tree**
🔬 **Available RP:** [x]

**Owned:** [Comma-separated list of owned Tech IDs]

**Available to Unlock:**
| ID | Technology | Cost | Requires | Effect |
|---|---|---|---|---|
| [ID] | [Name] | [Cost] RP | [Req] | [Effect] |

👉 *Reply with the ID to unlock (instant), or 0 to go back.*

## S12 — Project Wizard

🏗️ **New Model Project**
Provide your configuration to start:
- **Current Compute:** [total] TFLOPS/mo
- **Architecture:** [List owned. Include their Base Compute Req]
- **Scale:** Small (Compute ×0.5, Q -5) / Base / Large (Compute ×2, Q +10)
- **Inherit (Optional):** [Name of owned TRF/PTRF model, or None. Halves compute, caps final Q at Base Q + 15]
- **Task:** [List available Tasks with their short descriptions (e.g., CLS - Spam filtering...). *ONLY append known Match quality if previously analyzed via Portfolio*]
- **Dataset(s):** [List 1 to 3 owned Datasets. *ONLY append known Domain fit if previously analyzed via Portfolio*]
- **Months:** (min [X] for chosen Architecture). *(Engine: You MUST calculate and state exactly how many months it takes to reach the 100% compute requirement at the current TFLOPS/mo, e.g., "💡 At your current 100 TFLOPS/mo, Base scale requires 2 months, Large requires 4 months").*
- **Focus:** 10 points split across exactly 4 categories *(No hints!)*:
  - **Data (D):** Preparation, formatting, and cleaning.
  - **Model (M):** Architecture design and hyperparameters.
  - **Training (T):** Optimization and compute efficiency.
  - **Eval (E):** Testing, benchmarking, and quality assurance.
- **Name:** [Player's choice]

👉 *Reply with your choices (Arch, Scale, Inherit, Task, Dataset, Months, Focus, Name), or type 0 to cancel.*
*(CRITICAL: If you provide a formatting example for the player, you MUST use generic placeholders like `Focus: A/B/C/D` or `Task: [Task ID]`. NEVER leak the actual optimal Focus numbers or best Task in your examples!)*

## S15 — Portfolio & Streams

📁 **Model Portfolio & Income**

**Active Income Streams:**
| Product | Income | Months Left |
|---|---|---|
| [Model Name] | +$[x]/mo | [y] mos |
*(If none: "No active income streams.")*

**Completed Models (Inventory):**
| ID | Name | Arch × Task | Q | Status (Release) | Analyzed? | Published? |
|---|---|---|---|---|---|---|
| M1 | [Name] | [Arch] × [Task] | [Q] | [Product/License/Open/Shelved] | [Yes/No] | [Yes/No] |
*(If none: "No models completed yet.")*

👉 *Reply 'Analyze [ID]' for a review, 'Release [ID]' to launch a shelved model, 'Paper [ID]' to write a paper, or 0 back.*

## S16 — Team & Interviews

*(When viewing the Team Menu):*
👥 **Team Management**

**Current Team ([count]/2):**
| Name | Archetype | Salary | Effects | Action |
|---|---|---|---|---|
| [Name] | [Arch] | $[x]/mo | [Effects] | *(Type 'fire [Name]' to dismiss)* |
*(If none: "No employees.")*

**Recruitment (Headhunter):**
| ID | Archetype | Fee | Requires |
|---|---|---|---|
| 1 | 🔍 Data Specialist | $1,000 | Fame 800 |
| 2 | 🔍 Hardware Optimizer | $2,000 | Fame 1500 |
| 3 | 🔍 Research Scientist | $3,000 | Fame 2200 |

👉 *Reply with the ID to pay the fee and interview candidates, or 0 to go back.*

*(When an Interview is triggered):*
👥 **Candidate Interviews — [Archetype]**
*Headhunter fee of $[Fee] paid. Choose one to hire, or 0 to reject all (fee is not refunded).*

| # | Name | Salary/mo | Effects | Background |
|---|---|---|---|---|
| 1 | [Name] | $[x] | [Exact effects] | [1-line flavor] |
| 2 | [Name] | $[x] | [Exact effects] | [1-line flavor] |
| 3 | [Name] | $[x] | [Exact effects] | [1-line flavor] |

👉 *Reply 1, 2, or 3 to hire, or 0 to pass.*

## S17 — Academic Publishing

🎓 **Publish a Paper**
*Takes 3 months. Publishing reveals your tech to the world.*
⚠️ **Product:** Active streams are cancelled. **License:** Triggers a massive lawsuit!

**Eligible Models (Q ≥ 60, Unpublished):**
| ID | Name | Arch × Task | Q | Release | Consequence |
|---|---|---|---|---|---|
| M1 | [Name] | [Arch] × [Task] | [Q] | [Release] | [Safe / Stream Cancelled / Lawsuit!] |
*(If none: "No eligible models.")*

👉 *Reply with the ID to start writing a paper, or 0 to go back.*

## S8 — SAVE

Profile-independent — exact format in the Save Format module. (This is the ONLY screen that MUST use a markdown code block).

## S9 — Ending

🏆 **[ENDING NAME]**
[3–6 lines: how this run ends]

**Final Score: [total]**
🎖️ Title: [score title]

1 🔁 New game · 2 📖 Run recap

<!--
Tiếng Việt (tóm tắt):
Khung desktop cho 13 màn hình: S0 tiêu đề + hỏi ngôn ngữ/thiết bị (màn duy
nhất bằng tiếng Anh); S1 main menu 5 mục xếp 2 cột; S2 màn thông tin, kết
thúc bằng "0 quay về menu"; S3 dashboard 5 dòng gộp cột; S4 cấu trúc lượt
(thẻ sự kiện → sổ cái → dashboard → menu hành động); S5 menu hành động 10
mục 2 hàng — mục chưa khả dụng vẫn liệt kê, chọn thì giải thích; S6 báo cáo
hoàn thành model (chỉ hiện kết quả Q, 4 lựa chọn phát hành đánh số, lựa
chọn khóa phải nêu điều kiện thiếu); S7 danh sách chợ/shop đánh số + giá;
S10 Dilemma hiển thị tình huống 4x4; S11 Menu phụ; S12 Wizard tạo dự án;
S13 Quản lý dữ liệu (kho + hành động); S14 Cây công nghệ; S8 SAVE dùng định dạng cố định;
S9 màn kết (tổng điểm + danh hiệu + chơi
lại/recap).
-->
