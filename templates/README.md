# Templates

## Purpose

This directory defines the exact output formats the Game Engine must produce: the boot sequence, the per-turn report, the SAVE block, and a canonical worked example.

Fixed formats fight state drift — when the engine renders the same dashboard shape every turn, both the player and the engine itself always see the full, current Game State.

---

# Scope

* The boot script (first message of a new game).
* Per-turn output: event cards, ledger, dashboard, menu.
* The SAVE block format and loading behavior.
* A worked example anchoring the expected formatting.

Templates define presentation only. They never introduce mechanics or data.

## Tiếng Việt

Thư mục này định nghĩa định dạng đầu ra bắt buộc của Game Engine: màn khởi
động, báo cáo mỗi lượt, khối SAVE, và một ví dụ mẫu. Định dạng cố định giúp
chống "trôi trạng thái" — engine buộc phải dựng lại đầy đủ Game State mỗi
lượt. Templates chỉ định nghĩa cách trình bày, không tạo cơ chế hay dữ liệu.
