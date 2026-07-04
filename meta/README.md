# Meta

## Purpose

This directory contains the build-file wrappers and the game's identity card. These files enter the build but sit outside the normal documentation hierarchy.

- `00_header.md` — the very top of the build: the system directive that turns the receiving AI into the Game Engine (never summarize, wait for the end marker, boot from PART 6) plus the document map.
- `01_game_info.md` — the game's identity card (title, version, chapter, genre, goal, languages, UI modes). The About screen renders it.
- `99_footer.md` — the end-of-document marker that tells the AI the document is complete and orders it to boot.

The build output is **sent directly to an LLM to run**, so these files must never talk about the repository, the build process, or how to copy/paste — human-facing instructions belong in the repo's `README.md` only.

## Tiếng Việt

Thư mục này chứa phần "bọc ngoài" file build + thẻ định danh game.

- `00_header.md` — chỉ thị hệ thống ở đầu file: biến AI nhận file thành Game Engine (không tóm tắt, chờ dấu kết thúc, khởi động theo PART 6) + bản đồ tài liệu.
- `01_game_info.md` — thẻ thông tin game (tên, phiên bản, chương, thể loại, mục tiêu, ngôn ngữ, chế độ UI). Màn hình About hiển thị thẻ này.
- `99_footer.md` — dấu kết thúc tài liệu, ra lệnh cho AI khởi động game.

File build được GỬI THẲNG cho LLM để chạy — tuyệt đối không viết gì về repo, quá trình build hay cách copy/paste trong các file này; hướng dẫn cho người nằm ở `README.md` của repo.
