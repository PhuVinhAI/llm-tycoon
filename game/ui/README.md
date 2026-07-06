# UI

## Purpose

This directory defines everything the player *sees*: the boot sequence, the main menu, and the exact markdown skeleton of every screen the Game Engine renders.

It exists so that presentation is standardized — the engine never improvises layout. Two **UI Profiles** cover the two ways people play in a chat app:

- 🖥️ `desktop` — landscape: compact multi-column lines, tables allowed.
- 📱 `mobile` — portrait: one item per line, ~40 characters wide, no wide tables.

## Files

| File | One idea |
|---|---|
| `00_ui_system.md` | What UI Profiles are, how they are chosen and switched, rendering rules |
| `01_boot_and_main_menu.md` | Boot Sequence (title → language + device → main menu) and what each menu option does |
| `02_screens_desktop.md` | The fixed skeleton of every screen, desktop profile |
| `03_screens_mobile.md` | The fixed skeleton of every screen, mobile profile |
| `04_save_format.md` | The SAVE block — profile-independent, exact format |
| `05_example_turn.md` | A worked example anchoring formats and formulas (illustrative only) |

## Screen index

`S0` Title & Setup · `S1` Main Menu · `S2` Info (How to play / About) · `S3` Dashboard · `S4` Turn Report · `S5` Action Menu · `S6` Model Report · `S7` Market List · `S8` SAVE · `S9` Ending

## Tiếng Việt

Thư mục này định nghĩa mọi thứ người chơi NHÌN THẤY: trình tự khởi động, main menu, và khung markdown cố định của từng màn hình — engine không được tự chế bố cục.

Hai UI Profile: `desktop` (ngang — dòng gộp nhiều cột, được dùng bảng) và `mobile` (dọc — mỗi dòng một mục, ~40 ký tự, không dùng bảng rộng). Người chơi chọn ở màn hình mở đầu và đổi được bất cứ lúc nào.
