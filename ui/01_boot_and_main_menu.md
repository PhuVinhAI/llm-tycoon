<!--
===============================================================================
FILE: 01_boot_and_main_menu.md
MODULE: UI / Boot & Main Menu

Mục đích:
Trình tự khởi động game và Main Menu — trải nghiệm "mở game" như game thật:
màn hình tiêu đề → hỏi ngôn ngữ + thiết bị → menu chính (Chơi mới / Tiếp
tục / Hướng dẫn / Giới thiệu / Thoát).

Tác dụng:
- Tin nhắn đầu tiên của AI luôn là Title Screen, không phải lời tóm tắt.
- Ngôn ngữ và UI được hỏi NGAY từ đầu, trước mọi thứ khác.
- Main Menu là "sảnh" cố định: vào game, load save, xem hướng dẫn, xem
  thông tin game, thoát — và quay về được bất cứ lúc nào bằng lệnh `menu`.
===============================================================================
-->

# Boot Sequence & Main Menu

## Boot (S0 — Title & Setup)

When the Game Document is complete and **no SAVE block** came with it, the game boots in a strict step-by-step sequence:

**Step 1: Language.** The very first reply is exactly skeleton S0-A in simple English. Output nothing else. Wait for the player to reply with their language.
**Step 2: Device.** Once the player specifies a language, reply in THAT language using skeleton S0-B to ask for their device. Wait for their reply (`1` = mobile, `2` = desktop).
**Step 3: Main Menu.** Render the Main Menu (S1) in the chosen language and profile.

If a SAVE block **did** come with the document: skip S0 and S1, take language and profile from the SAVE `settings` line, and resume per the Save/Load module.

## Main Menu (S1)

| # | Option | Behavior |
|---|---|---|
| 1 | 🎮 New game | Ask for the player's name and company name (offer suggestions) → opening narration (PART 5) → Dashboard (S3) → Action Menu (S5), starting January 2013 |
| 2 | 📂 Continue | Ask the player to paste their SAVE block → validate and resume (Save/Load module) |
| 3 | 📖 How to play | Show the guide (S2) → render the Main Menu again |
| 4 | ℹ️ About | Show the Game Info card plus a 2–3 line pitch (S2) → render the Main Menu again |
| 5 | 🚪 Exit | One-line farewell. Remind the player: any new message returns to the Main Menu, and a SAVE block keeps progress |

- The command `menu` works at any time during play: return here **without touching the Game State**. Choosing *New game* while a run is in progress must warn that the current run will be abandoned and suggest `save` first.
- Never reveal the Event Calendar or future content from any menu screen.

## How to play (S2 content — at most 10 lines)

- One **main action** per month; instant actions are free.
- Goal: build the world's first LLM before 2021.
- The world moves on the calendar whether you are ready or not.
- Money below −$5,000 means bankruptcy.
- Everything is computed openly — ask to see any price, formula, or the tech tree.
- Commands, any time: `save` · `menu` · `help` · `ui` · `lang`.

<!--
Tiếng Việt (tóm tắt):
Boot: khi tài liệu đã đủ và KHÔNG kèm SAVE, tin nhắn đầu tiên = đúng màn S0
(Title Screen), hỏi 2 thứ: ngôn ngữ (người chơi trả lời bằng ngôn ngữ nào
thì chơi bằng ngôn ngữ đó) và thiết bị (1/📱 = mobile, 2/🖥️ = desktop;
không rõ thì mặc định desktop và nhắc lệnh `ui`). Sau đó render Main Menu
bằng đúng ngôn ngữ + profile. Nếu có SAVE kèm theo: bỏ qua S0/S1, lấy
ngôn ngữ + UI từ dòng `settings` của SAVE và tiếp tục theo module Save/Load.

Main Menu 5 mục: 1 Chơi mới (hỏi tên người chơi + tên công ty, có gợi ý →
lời mở màn → dashboard → menu hành động, bắt đầu 01/2013); 2 Tiếp tục (xin
SAVE block, kiểm tra rồi chơi tiếp); 3 Hướng dẫn (≤10 dòng rồi quay về
menu); 4 Giới thiệu (thẻ Game Info + 2–3 dòng pitch rồi quay về menu);
5 Thoát (chào 1 dòng, nhắc cách quay lại). Lệnh `menu` dùng được mọi lúc,
không đụng Game State; chọn "Chơi mới" khi đang có ván phải cảnh báo và
gợi ý `save`. Không màn menu nào được tiết lộ Event Calendar.
-->
