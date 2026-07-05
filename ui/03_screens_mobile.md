<!--
===============================================================================
FILE: 03_screens_mobile.md
MODULE: UI / Mobile Screens

Mục đích:
Khung markdown cố định của từng màn hình ở profile MOBILE (UI dọc cho điện
thoại): mỗi dòng một mục, dòng ngắn ≤ ~40 ký tự, không dùng bảng rộng.

Tác dụng:
Trên màn hình dọc, bảng rộng và dòng gộp cột bị vỡ hoặc phải cuộn ngang —
profile này xếp mọi thứ theo chiều dọc để đọc mượt trên điện thoại.
===============================================================================
-->

# Screens — Mobile Profile (📱 portrait)

Hard shape rules: one item per line · ≤ ~40 characters per line · never a table wider than two columns. All labels and stats translated entirely; emoji anchors stay. AI technology names remain untranslated.

## S0 — Title & Setup

*(Mobile uses the exact same S0-A and S0-B steps as Desktop, since the profile is not yet chosen when booting).*

## S1 — Main Menu

🏭 **LLM TYCOON**
1 🎮 New game
2 📂 Continue
3 📖 How to play
4 ℹ️ About
5 🚪 Exit

👉 Pick a number.

## S2 — Info (How to play / About)

Same content as desktop, one short line each. End with:

0 🏠 Main Menu

## S3 — Dashboard

📊 **[Company]**
📅 [Month YYYY] · Turn [N]
💰 $[cash]
🔬 Research Points [x] · ⭐ Fame [x]/5000
🧠 Research Lv [x] · Engineering Lv [x]
🖥️ [total] TFLOPS · slots [u]/[t]
[hardware, short list]
👥 [team or "solo"]
📚 [datasets, short]
🛠️ Tech: [owned tech names]
📦 [idle / project (🧩 Art) / contract / paper]
💵 [streams or "no streams"]
📉 Fixed $[x]/mo

## S4 — Turn Report

Same order as desktop: event cards → ledger → Dashboard (S3) → Action Menu (S5). Narrow cards:

*(For each Event or Historical News triggered this month):*
📰 **[Headline / Event Title]**
*[FLAVOR: 2–3 lines. Explain the AI history/tech clearly.]*
*(If mechanical effect):* ▸ [effect]

📅 **[action taken]**
*[FLAVOR: 1–2 lines. Explain unlocked Techs if any.]*
[one change per line, including 🧩 +x Artifacts]
💰 $[after] · 🔬 Research Points [after]

## S5 — Action Menu

*(If IDLE):*
**This month?**
1 💼 Freelance
2 🔬 Research
3 🏗️ New model
4 📦 Data
5 📜 Contracts
6 🛒 Shop
7 👥 Team
8 🌳 Tech Tree
9 📁 Portfolio
10 💾 Save
11 🎓 Publish Paper
0 🏠 Main Menu

*(If PROJECT/CONTRACT/PAPER active):*
**Active: [Name] ([X]/[M])**
1 ⏩ Continue
2 🛑 Cancel
6 🛒 Shop
7 👥 Team
8 🌳 Tech Tree
9 📁 Portfolio
10 💾 Save
0 🏠 Main Menu

💡 **Tip:** *[1 short context-aware tip based on their state. Remind them of features like natural language commands, but NEVER spoil formulas/matches.]*

**Progressive Disclosure:** Hide `Contracts`, `Team`, and `Shop` until they are unlocked (Fame ≥ 800 or GPUT/Neural Tech owned). Hide `Publish Paper` until an eligible Model exists (Q ≥ 60, unpublished).

## S6 — Model Completion Report

🏁 **[Model]**
[Architecture] × [Task]
on [Dataset]
*(⚠️ [Art] artifacts)*

**Local Benchmarks:**
**[Benchmark 1]**
You: [Score]/100 | [Rival]: [SOTA]/100
*"[Explain metric + internal reaction]"*
**[Benchmark 2]**
You: [Score]/100 | [Rival]: [SOTA]/100
*"[Explain metric + internal reaction]"*
*(List ALL applicable Benchmarks. No fillers).*

**Quality: [Q]/100** ([tier])
⭐ Est. Fame [±x] · 🔬 RP +[x]

**Release?**
*(If SOTA: "🔥 SOTA Hype: Payouts ×1.5")*
*(If Art > 0: "⚠️ Art: Product income halved")*
1 🌐 Open-source
2 💼 License $[x]
3 📈 Product $[x]/mo ×8
4 🗄️ Shelve (0 Fame)
*[locked: why]*

## S6-B — Public Reception

🌍 **Reception: [Model]**
**[Reviewer 1]**
*"[1 sentence reaction]"*
**[Reviewer 2]**
*"[1 sentence reaction]"*
**[Reviewer 3]**
*"[1 sentence reaction]"*
**[Reviewer 4]**
*"[1 sentence reaction]"*

**Payout:**
⭐ Fame [±x]
💰 [Cash/Stream info]

## S7 — Market List

🛒 **[List title]**
📅 [Month YYYY]
1 [name]
  [key numbers] · $[price]
2 [name]
  [key numbers] · $[price]
…
💰 $[cash]
0 ↩ Back

## S10 — Dilemma (Freelance, Research, Projects & Contracts)

⚠️ **[Event Title]**
*[FLAVOR: 2–3 lines of story]*

**1 [Standard Choice]**
▸ [Exact calculated yield]
**2 [Trade-off Choice]**
▸ [Exact calculated yield]

👉 Your choice?

## S11 — Sub-Menu (Data & Team)

[Icon] **[Menu Name]**
1 [Action 1]
  ▸ [Cost/Time]
2 [Action 2]
  ▸ [Cost/Time]
0 ↩ Back

## S13 — Data Menu

📦 **Data**

**Owned:**
- [Name] ([Domain] · S[Size] Q[Q])
- [Name] ([Domain] · S[Size] Q[Q])
*(or "None")*

**Actions:**
1 📦 Collect (1 mo)
2 🧹 Clean (1 mo)
3 🔗 Combine (free)
4 🛒 Market (free)
0 ↩ Back

## S14 — Tech Tree

🌳 **Tech Tree**
🔬 **RP:** [x]

**Owned:** [IDs]

**Available:**
**[ID]** [Name]
▸ [Cost] RP (Req: [Req])
▸ [Effect]

👉 *Reply ID to unlock, or 0 back.*

## S12 — Project Wizard

🏗️ **New Model**
Compute: [total] TFLOPS/mo
Configuration:
- **Arch:** [Owned + Base Req]
- **Scale:** Small / Base / Large
- **Inherit:** [Model Name / None]
- **Task:** [Available + short desc] *(show known match ONLY if previously analyzed)*
- **Data:** [Select 1 to 3 Owned] *(show known fit ONLY if analyzed)*
- **Months:** (min [X]). *(Engine: State exactly how many months to reach Base/Large compute reqs at current TFLOPS/mo)*
- **Focus:** 10 pts total *(no hints!)*
  - **Data (D):** Prep & clean
  - **Model (M):** Design & params
  - **Train (T):** Optimization
  - **Eval (E):** Benchmarks
- **Name:** [Player's choice]

👉 *Reply choices, or 0 to cancel.*
*(CRITICAL: If providing a format example, use placeholders like `Focus: A/B/C/D`. NEVER leak optimal numbers!)*

## S15 — Portfolio & Streams

📁 **Portfolio & Income**

**Streams:**
- [Model]: +$[x]/mo ([y] left)
*(or "No active streams")*

**Models:**
**M1** [Name]
▸ [Arch]×[Task] · Q[Q] · [Status] · Anz:[Y/N] · Pub:[Y/N]
*(or "No models")*

👉 *Reply 'Analyze', 'Release', 'Paper' + ID, or 0 back.*

## S16 — Team & Interviews

*(Team Menu):*
👥 **Team ([count]/2)**
- [Name] ([Arch])
  $[x]/mo · [Effects]
*(or "No employees")*

**Recruit (Headhunter):**
1 🔍 Data Spec ($1,000)
  Req: Fame 800
2 🔍 HW Optimizer ($2,000)
  Req: Fame 1500
3 🔍 Scientist ($3,000)
  Req: Fame 2200

👉 *Reply ID to pay fee, or 0 back.*

*(Interview):*
👥 **Interviews: [Archetype]**
*Fee paid. Choose 1 (or 0 to reject).*

**1 [Name]**
$[x]/mo · [Effects]
*[1-line background]*
**2 [Name]**
$[x]/mo · [Effects]
*[1-line background]*
**3 [Name]**
$[x]/mo · [Effects]
*[1-line background]*

👉 *Reply 1, 2, 3 to hire, or 0 to pass.*

## S17 — Academic Publishing

🎓 **Publish a Paper (2 mos)**
⚠️ Prod: Stream cut. Lic: Lawsuit!

**Eligible (Q ≥ 60, Unpub):**
**M1** [Name]
▸ [Arch]×[Task] · Q[Q]
▸ [Release] → [Safe/Cut/Lawsuit!]
*(or "No eligible models")*

👉 *Reply ID to write paper, or 0 back.*

## S8 — SAVE

Profile-independent — exact format in the Save Format module. (This is the ONLY screen that MUST use a markdown code block).

## S9 — Ending

🏆 **[ENDING NAME]**
[3–5 short lines]

**Final Score: [total]**
🎖️ [score title]

1 🔁 New game
2 📖 Run recap

<!--
Tiếng Việt (tóm tắt):
Khung mobile: quy tắc cứng — mỗi dòng một mục, ≤ ~40 ký tự, không bảng
rộng. Cùng bộ màn hình với desktop nhưng xếp dọc: S0 tiêu đề hẹp; S1 menu
5 dòng; S3 dashboard mỗi chỉ số một dòng; S4 thẻ sự kiện/sổ cái bản hẹp;
S5 menu hành động 10 dòng; S6 báo cáo model chỉ hiện số Q cuối cùng, 4 lựa
chọn phát hành xếp dọc; S7 danh sách 2 dòng mỗi món (tên / số liệu + giá);
S10 Dilemma dọc; S11 Menu phụ dọc; S12 Wizard tạo dự án dọc;
S13 Quản lý dữ liệu dọc; S14 Cây công nghệ dọc; S9 màn kết chỉ hiện tổng điểm. SAVE giữ nguyên
định dạng cố định, không phụ
thuộc profile.
-->
