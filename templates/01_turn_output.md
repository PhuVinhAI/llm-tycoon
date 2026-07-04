<!--
===============================================================================
FILE: 01_turn_output.md
MODULE: Templates / Turn Output

Mục đích:
Định dạng chuẩn của một lượt: thẻ sự kiện → sổ cái → dashboard → menu.

Tác dụng:
Bộ khung lặp lại mỗi lượt — người chơi luôn thấy trạng thái đầy đủ, engine
luôn phải tính lại từ Game State. Nhãn được dịch sang ngôn ngữ người chơi
nhưng giữ mỏ neo emoji và mã chuẩn (RP, REP, CU, ...).
===============================================================================
-->

# Turn Output

Labels are translated into the player's language; emoji anchors and canonical codes stay.

## Event card (when an event fires)

```
📰 ── [Month YYYY] ─────────────────
   [Event title]
   [1–3 lines of flavor]
   ▸ [mechanical effect, plainly stated]
```

## Ledger (one per resolved month)

```
📅 [Month YYYY] — [main action taken]
   [+/− cash, +RP, +REP — one line per change]
   💰 [cash after] | 🔬 RP [after]
```

## Dashboard (every turn, recomputed)

```
📊 [Company] — [Month YYYY] (Turn N)
💰 $[cash] | 🔬 RP [x] | ⭐ REP [x]/50 | 🧠 R-Lv [x] · E-Lv [x]
🖥️ [total] CU/mo — [hardware list or "no GPU yet"] (slots [used]/[total])
👥 [team or "solo"]
📚 Data: [name (domain Size/Quality)], …
🛠️ Tech: [owned IDs]
📦 Now: [idle / "Name" — month i/M / Contract Cxx — month i/M]
💵 Streams: [$x/mo, y months left | none] | Fixed costs: $[total]/mo
```

## Menu (every turn, after the dashboard)

```
What will you do this month?
1 💼 Freelance   2 🔬 Research   3 🏗️ New model   4 📦 Data
5 📜 Contracts   6 🛒 Shop       7 👥 Team        8 ⏩ Repeat ×N
9 💾 Save        0 ❓ Help
```

Options that are currently impossible (no contracts available, team full, nothing to clean) are still listed — choosing one explains why it is unavailable.

## Model completion report

```
🏁 [Model name] — [Architecture] × [Task] on [Dataset]
   Q = [Base] + [Match] + [2×DataQ] + 5 + [fit] + [compute] + [focus] + [2×E-Lv] + [bonuses] − [penalties] = [Q]
   [Reception emoji + tier] → REP [±x], RP +[x]
   Release? 🌐 Open-source | 💼 License ($[amount]) | 📈 Product ($[x]/mo × 8) | 🗄️ Shelve
```

<!--
Tiếng Việt (tóm tắt):
Bốn khối chuẩn mỗi lượt: Thẻ sự kiện (tiêu đề, 1–3 dòng màu sắc, hiệu ứng
cơ chế nói thẳng); Sổ cái tháng (hành động + từng dòng thay đổi + số dư);
Dashboard (công ty, tháng, tiền, RP, REP, kỹ năng, CU + phần cứng + slot,
đội ngũ, dataset, công nghệ, việc đang chạy, dòng thu, chi phí cố định);
Menu 10 lựa chọn cố định — lựa chọn chưa khả dụng vẫn liệt kê, chọn vào thì
giải thích vì sao chưa được.

Báo cáo hoàn thành model: hiện đủ phép cộng từng thành phần của Q, tiếp
nhận, thưởng REP/RP, và 4 lựa chọn phát hành kèm số tiền cụ thể.
-->
