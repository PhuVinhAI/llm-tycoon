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
v0.2 · Chapter 1: Home Lab

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
| **Skills** | 🧠 Research Level [x]  ·  Engineering Level [x] |
| **Assets** | 🖥️ [total] TFLOPS ([slots used]/[total])  ·  👥 [team or "solo"] |
| **Knowledge** | 📚 Data: [count]  ·  🛠️ Tech: [owned IDs] |
| **Status** | 📦 [idle / project / contract]  ·  📉 Fixed: $[x]/mo |

*(Expand Data/Hardware details only when the player asks to see them, keeping the dashboard clean).*

## S4 — Turn Report

Structure of every resolved turn, in this order: event cards (if any) → month ledger → Dashboard (S3) → Action Menu (S5).

📰 **[Month YYYY]**
[Event title]
[1–3 flavor lines]
▸ [mechanical effect, plainly stated]

📅 **[Month YYYY] — [main action taken]**
[one line per change: +/− cash, RP, Fame, …]
💰 [cash after] | 🔬 Research Points [after]

## S5 — Action Menu

| What will you do this month? | |
|---|---|
| 1 💼 Freelance | 2 🔬 Research |
| 3 🏗️ New model | 4 📦 Data |
| 5 📜 Contracts | 6 🛒 Shop |
| 7 👥 Team | 8 ⏩ Repeat ×N |
| 9 💾 Save | 0 🏠 Main Menu |

**Progressive Disclosure:** To prevent overwhelming the player, ONLY show actions that are currently relevant or unlocked.
- Hide `Contracts` and `Team` entirely until Fame ≥ 800.
- Hide `Shop` entirely until the player owns a Neural Architecture (GPUT or EMB).
- Always show Freelance, Research, New model, Data, Save, and Main Menu.

## S6 — Model Completion Report

🏁 **[Model]** — [Architecture] × [Task] on [Dataset]
**Quality: [Q]/100**
[reception emoji + tier] → Fame [±x], Research Points +[x]

**Release?**
1 🌐 Open-source | 2 💼 License ($[x]) | 3 📈 Product ($[x]/mo × 8) | 4 🗄️ Shelve
*[locked options: state the unmet Requirement]*

## S7 — Market List (shop, datasets, contracts, candidates)

🛒 **[List title] — [Month YYYY]**
1 [name] — [key numbers] — $[price]
2 [name] — [key numbers] — $[price]
…
💰 $[cash] · 0 ↩ Back

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
Khung desktop cho 10 màn hình: S0 tiêu đề + hỏi ngôn ngữ/thiết bị (màn duy
nhất bằng tiếng Anh); S1 main menu 5 mục xếp 2 cột; S2 màn thông tin, kết
thúc bằng "0 quay về menu"; S3 dashboard 5 dòng gộp cột; S4 cấu trúc lượt
(thẻ sự kiện → sổ cái → dashboard → menu hành động); S5 menu hành động 10
mục 2 hàng — mục chưa khả dụng vẫn liệt kê, chọn thì giải thích; S6 báo cáo
hoàn thành model (chỉ hiện kết quả Q, 4 lựa chọn phát hành đánh số, lựa
chọn khóa phải nêu điều kiện thiếu); S7 danh sách chợ/shop đánh số + giá;
S8 SAVE dùng định dạng cố định; S9 màn kết (tổng điểm + danh hiệu + chơi
lại/recap).
-->
