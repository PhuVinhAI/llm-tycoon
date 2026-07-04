<!--
===============================================================================
FILE: 02_save_format.md
MODULE: Templates / Save Format

Mục đích:
Định dạng SAVE block — "file save" di động của game.

Tác dụng:
Chứa TOÀN BỘ Game State trong một khối văn bản gọn; người chơi dán nó cùng
Game Documentation vào hội thoại mới để chơi tiếp (system/08_save_load.md).
===============================================================================
-->

# SAVE Block Format

```
=== SAVE LLM-TYCOON v0.1 ===
player: [name] | company: [name]
date: YYYY-MM | cash: [x] | rp: [x] | rep: [x]
skills: R[x] E[x] | counters: research=[x], models=[x]
tech: [comma-separated IDs]
hw: [item xN, …] | slots_used: [x]/[4|8] | rewired: [yes/no]
team: [names or none]
data: [Name(domain,Size,Quality)]; …
models: [Name(Arch,Task,Q[x],release)]; …
streams: [Name $x/mo ×y left]; … | none
contracts_done: [IDs | none] | active: [Cxx month i/M | none]
project: [Name Arch×Task on Dataset, month i/M, focus a/b/c/d, cu_acc=x | none]
competitions: [Ex:won | Ex:open(until YYYY-MM)] | none
flags: [fired events with lasting effects, discounts in force, hype windows]
=== END SAVE ===
```

- Every field is mandatory (use `none` where empty). The block must be self-sufficient: no information outside it is needed to resume.
- Output it at the end of every in-game June and December and on request (Save/Load module).
- On load: validate against the Rules, list corrections, resume at the saved month's menu.

<!--
Tiếng Việt (tóm tắt):
SAVE block gồm đủ: người chơi/công ty, tháng, tiền, RP, REP, kỹ năng + bộ
đếm, công nghệ đã mở, phần cứng + slot + đã đi lại điện chưa, đội ngũ,
dataset (domain/Size/Quality), model (kiến trúc/task/Q/kiểu phát hành),
dòng thu, hợp đồng đã xong + đang chạy, dự án đang chạy (tiến độ, focus,
compute tích lũy), cuộc thi, và cờ sự kiện/hiệu lực kéo dài.

Mọi trường bắt buộc (trống thì ghi "none"); khối phải tự đủ — không cần
thông tin nào ngoài nó để chơi tiếp. Xuất cuối mỗi tháng 6 và 12 trong game
và khi được yêu cầu. Khi nạp: kiểm tra theo Rules, liệt kê chỗ chỉnh sửa,
tiếp tục từ menu của tháng đã lưu.
-->
