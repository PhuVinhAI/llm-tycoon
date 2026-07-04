<!--
===============================================================================
FILE: 00_player.md
MODULE: Definitions / Player

Mục đích:
Định nghĩa khái niệm Player trong LLM Tycoon.

Tác dụng:
Thiết lập ý nghĩa thống nhất của Player để các tài liệu khác có thể tham
chiếu mà không cần định nghĩa lại.

Trách nhiệm:
- Định nghĩa Player.
- Không định nghĩa luật.
- Không định nghĩa hành vi của Game Engine.
- Không định nghĩa gameplay.
===============================================================================
-->

# Player

---

## Definition

A Player is the participant who interacts with the Game Engine to play the game.

The Player provides Player Actions that allow the game to progress.

The Player exists outside the game world and is not considered part of the simulation.

---

## Attributes

A Player may be associated with information such as:

* Identity
* Controlled entities
* Current progress
* Available Player Actions

The Game Documentation determines which information is relevant to the game.

---

## Relationships

A Player may:

* control one or more Companies
* perform Player Actions
* receive Outcomes from the Game Engine
* influence the Game State through valid Player Actions

A Player does not directly modify the Game Documentation.

<!--
Tiếng Việt:
Player là người tham gia tương tác với Game Engine để chơi trò chơi.
Player đưa ra các Player Action, từ đó làm cho trò chơi tiếp tục diễn ra.
Player tồn tại bên ngoài thế giới của game và không được xem là một thực thể
trong mô phỏng.

Player có thể được gắn với các thông tin như: danh tính; các Company mà
Player điều khiển; tiến trình hiện tại; các Player Action có thể thực hiện.

Player có thể: điều khiển một hoặc nhiều Company; thực hiện Player Action;
nhận Outcome từ Game Engine; tác động đến Game State thông qua các Player
Action hợp lệ.

Player không trực tiếp sửa đổi Game Documentation.
-->
