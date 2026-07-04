# Meta

## Purpose

This directory contains fragments that wrap the assembled build file — they are not game knowledge themselves.

- `header.md` — the banner placed at the very top of the build: how-to-play instructions for the human, and the boot directive for the AI.
- `footer.md` — the end-of-document marker that tells the AI the document is complete and it may boot.

These files are included by `scripts/build.js` (see the MANIFEST) and are excluded from the normal documentation hierarchy.

## Tiếng Việt

Thư mục này chứa các mảnh "bọc ngoài" file build — không phải kiến thức game.

- `header.md` — phần đầu file build: hướng dẫn chơi cho người, và chỉ thị khởi động cho AI.
- `footer.md` — dấu kết thúc tài liệu, báo cho AI biết đã nhận đủ nội dung và bắt đầu game.
