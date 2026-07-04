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

Hard shape rules: one item per line · ≤ ~40 characters per line · never a table wider than two columns. Labels translated; emoji anchors and codes stay.

## S0 — Title & Setup

Rendered in English (the only screen before a language is known):

```
🏭 LLM TYCOON
──────────────────
Build the world's
first LLM · 2013 →
v0.2 · Ch.1: Home Lab
──────────────────
🌐 Reply in the language
   you want to play in.
📱🖥️ Phone or PC?
   1 = 📱 mobile UI
   2 = 🖥️ desktop UI
```

## S1 — Main Menu

```
🏭 LLM TYCOON
──────────────────
1 🎮 New game
2 📂 Continue
3 📖 How to play
4 ℹ️ About
5 🚪 Exit
──────────────────
👉 Pick a number.
```

## S2 — Info (How to play / About)

Same content as desktop, one short line each. End with:

```
↩ 0 — main menu
```

## S3 — Dashboard

```
📊 [Company]
📅 [Month YYYY] · Turn [N]
💰 $[cash]
🔬 RP [x] · ⭐ REP [x]/50
🧠 R-Lv [x] · E-Lv [x]
🖥️ [total] CU/mo · slots [u]/[t]
   [hardware, short list]
👥 [team or "solo"]
📚 [datasets, short]
🛠️ [owned tech IDs]
📦 [idle / project / contract]
💵 [streams or "no streams"]
📉 Fixed $[x]/mo
```

## S4 — Turn Report

Same order as desktop: event cards → ledger → Dashboard (S3) → Action Menu (S5). Narrow cards:

```
📰 [Month YYYY]
[Event title]
[1–2 flavor lines]
▸ [mechanical effect]

📅 [action taken]
[one change per line]
💰 $[after] · 🔬 RP [after]
```

## S5 — Action Menu

```
This month?
1 💼 Freelance
2 🔬 Research
3 🏗️ New model
4 📦 Data
5 📜 Contracts
6 🛒 Shop
7 👥 Team
8 ⏩ Repeat ×N
9 💾 Save
0 ❓ Help
```

Options that are currently impossible are still listed — choosing one explains why.

## S6 — Model Completion Report

```
🏁 [Model]
[Architecture] × [Task]
on [Dataset]
──────────────────
Q breakdown:
+ [x] base
+ [x] match
+ [x] data quality ×2
+ [x] data size
+ [x] domain fit
+ [x] compute
+ [x] focus
+ [x] E-Lv ×2
± [x] bonuses/penalties
= Q [total]
──────────────────
[reception emoji + tier]
⭐ REP [±x] · 🔬 RP +[x]
Release?
1 🌐 Open-source
2 💼 License $[x]
3 📈 Product $[x]/mo ×8
4 🗄️ Shelve
[locked: why]
```

## S7 — Market List

```
🛒 [List title]
📅 [Month YYYY]
1 [name]
  [key numbers] · $[price]
2 [name]
  [key numbers] · $[price]
…
💰 $[cash]
↩ 0 — back
```

## S8 — SAVE

Profile-independent — exact format in the Save Format module.

## S9 — Ending

```
🏆 [ENDING NAME]
──────────────────
[3–5 short lines]
──────────────────
Score:
+ [x] 3×REP
+ [x] best Q
+ [x] 5×models
+ [x] cash/1000
+ [x] win bonus
+ [x] extras
= [total]
🎖️ [score title]
──────────────────
1 🔁 New game
2 📖 Run recap
```

<!--
Tiếng Việt (tóm tắt):
Khung mobile: quy tắc cứng — mỗi dòng một mục, ≤ ~40 ký tự, không bảng
rộng. Cùng bộ màn hình với desktop nhưng xếp dọc: S0 tiêu đề hẹp; S1 menu
5 dòng; S3 dashboard mỗi chỉ số một dòng; S4 thẻ sự kiện/sổ cái bản hẹp;
S5 menu hành động 10 dòng; S6 báo cáo model tách từng thành phần Q thành
dòng riêng (dễ dò trên điện thoại), 4 lựa chọn phát hành xếp dọc; S7 danh
sách 2 dòng mỗi món (tên / số liệu + giá); S9 màn kết cộng điểm theo cột
dọc. SAVE giữ nguyên định dạng cố định, không phụ thuộc profile.
-->
