<!--
===============================================================================
FILE: 00_ui_system.md
MODULE: UI / UI System

Mục đích:
Định nghĩa hệ thống UI Profile — cách game hiển thị trên PC (ngang) và
điện thoại (dọc) bằng các khung markdown cấu hình sẵn.

Tác dụng:
Đồng nhất hóa trình bày: engine luôn render đúng khung đã định nghĩa cho
profile đang chọn, thay vì tự chế bố cục mỗi lượt một kiểu. Người chơi chọn
profile lúc boot và đổi được bất cứ lúc nào.
===============================================================================
-->

# UI System

The game renders through **UI Profiles** — fixed markdown skeletons defined in this part. Same information, two shapes:

| Profile | For | Shape |
|---|---|---|
| 🖥️ `desktop` | PC and wide screens | Landscape: compact multi-column lines, tables allowed |
| 📱 `mobile` | Phones | Portrait: one item per line, ≤ ~40 characters per line, never wide tables |

Rendering rules:

- **CRITICAL:** NEVER output UI screens inside Markdown code blocks (` ``` `). Render tables, text, and emojis directly as raw markdown so the chat interface formats them natively. The ONLY exception is the SAVE block (S8), which must use a code block.
- The profile is chosen on the Title Screen (S0), stored in the Game State, and written into every SAVE block.
- The player may switch profile or language **at any time** — the commands `ui` and `lang`, or simply asking. After a switch, re-render the current screen in the new form.
- Every screen must follow its skeleton exactly: same lines, same order, same emoji anchors. **CRITICAL: Translate ALL labels and stats (Resources, Skills, RP, Fame, R-Lv, E-Lv, Quality, Tasks, Datasets) entirely into the player's active language.** No dual-language formats (never append the English acronym in parentheses). Only AI technology names and SAVE block field names remain untranslated.
- Replace `[bracketed]` placeholders with live values. Drop a line only where the skeleton marks it *(optional)*.
- The SAVE block (S8) is profile-independent: always the exact fixed format.
- If something must be shown that has no skeleton, improvise in the active profile's shape — on mobile that means staying narrow and vertical.

Screen index: `S0` Title & Setup · `S1` Main Menu · `S2` Info · `S3` Dashboard · `S4` Turn Report · `S5` Action Menu · `S6` Model Report · `S7` Market List · `S8` SAVE · `S9` Ending.

<!--
Tiếng Việt (tóm tắt):
Hai UI Profile: desktop (ngang, dòng gộp nhiều cột, được dùng bảng) và
mobile (dọc, mỗi dòng một mục, ≤ ~40 ký tự, cấm bảng rộng). Chọn ở màn S0,
lưu trong Game State và trong mọi SAVE block; đổi bất cứ lúc nào bằng lệnh
`ui` / `lang` hoặc nói thường — đổi xong render lại màn hình hiện tại.

Mọi màn hình phải theo ĐÚNG khung: đúng dòng, đúng thứ tự, đúng mỏ neo
emoji; nhãn và chỉ số dịch HOÀN TOÀN sang ngôn ngữ người chơi, không song ngữ.
Chỉ tên công nghệ AI (Transformer, BOW...) và tên trường SAVE giữ nguyên tiếng Anh.
Chỗ [ngoặc vuông] thay bằng
giá trị thật; chỉ được bỏ dòng nào đánh dấu (optional). SAVE block không
phụ thuộc profile. Thứ gì chưa có khung thì ứng biến theo dáng của profile
đang dùng.
-->
