<!--
===============================================================================
FILE: 04_save_format.md
MODULE: UI / Save Format (S8)

Mục đích:
Định dạng SAVE block — "file save" di động của game.

Tác dụng:
Chứa TOÀN BỘ Game State (kể cả ngôn ngữ + UI Profile đang dùng) trong một
khối văn bản gọn; người chơi dán nó cùng Game Document vào hội thoại mới
để chơi tiếp (system/08_save_load.md). Không phụ thuộc UI Profile.
===============================================================================
-->

# S8 — SAVE Block Format

```
=== SAVE LLM-TYCOON v0.4 ===
player: [name] | company: [name]
settings: lang=[language] | ui=[desktop|mobile]
date: YYYY-MM | cash: [x] | rp: [x] | fame: [x]
counters: research=[x], models=[x]
tech: [comma-separated IDs]
hw: [item xN, …] | cloud: [0-2] | vram: [av]/[tot] | slots_used: [x]/[4|8] | rewired: [yes/no]
team: [Name($Salary, Effects) | none]
candidates: [Name($Salary, Effects) | none]
data: [Name(domain,Size,Quality)]; … | data_sources_used: [market/free item names | none]
models: [Name(arch=ID,scale=Tier,task=ID,data=Name{domain}+…,focus=a/b/c/d,Q=x,release=type|Shelved,completed=YYYY-MM,anz=yes/no,pub=yes/no,sota=yes/no,art=x)]; …
streams: [Name $x/mo ×y left (Task, Q, vram=z)]; … | none
contracts_done: [IDs | none] | active: [Cxx month i/M, pay_mod=x%, dilemma_done=yes/no | Paper on M1 month i/M, rp_mult=x, rp_bonus=x, dilemma_done=yes/no | none]
project: [Name Arch×Task on Datasets, Scale, Inherit:x, month i/M, focus a/b/c/d, tflops_acc=x, q_mod=y, art=z, dilemma_done=yes/no | none]
competitions: [Ex:won | Ex:open(until YYYY-MM,submitted=Model IDs|none,threshold=hidden|x)] | none
flags: [fired events with lasting effects, discounts in force, hype windows, llm_unlocked]
=== END SAVE ===
```

- Every field is mandatory (use `none` where empty). The block must be self-sufficient: nothing outside it is needed to resume.
- Preserve `models` in completion order; that order defines stable Model IDs (`M1`, `M2`, …) and the completion ordinal used by deterministic reviewer selection.
- Always rendered exactly like this, in a code block, regardless of UI Profile or language — field names are canonical codes.
- Output it at the end of every in-game June and December and on request (Save/Load module).
- On load: apply `settings` first (language + UI Profile), validate everything against the Rules, list corrections, resume at the saved month's Action Menu.

<!--
Tiếng Việt (tóm tắt):
SAVE block v0.4. Gồm đủ: người chơi/công ty, cài đặt, tháng, tiền, RP, Fame,
kỹ năng + bộ đếm, công nghệ, phần cứng + slot + rewired, đội ngũ, ứng viên,
dataset + lịch sử nguồn đã lấy, model (kể cả Scale/Focus/domain), dòng thu,
hợp đồng/bài báo/dự án đang chạy, lịch sử nộp cuộc thi và cờ sự kiện.

Mọi trường bắt buộc (trống ghi "none"); khối phải tự đủ; luôn render đúng
nguyên dạng trong code block bất kể profile/ngôn ngữ (tên trường là mã
chuẩn). Xuất cuối tháng 6 và 12 trong game + khi được yêu cầu. Khi nạp:
áp `settings` trước, kiểm tra theo Rules, liệt kê chỗ sửa, tiếp tục từ
menu hành động của tháng đã lưu.
-->
