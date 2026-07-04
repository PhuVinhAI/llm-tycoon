<!--
===============================================================================
FILE: 10_freelance_clients.md
MODULE: Content / Freelance Events Matrix

Mục đích:
Ma trận 4x4 tạo ra 16 tình huống Freelance kết hợp giữa Flavor (Khách hàng)
và Mechanics (Biến cố). AI dùng Creative License để kể câu chuyện nối 2 trục này.
===============================================================================
-->

# Freelance Events Matrix

When the Player chooses Freelance, do NOT just give them cash. The engine must generate a Dilemma based on the current in-game `Turn` number.
Calculate `Base Pay = $2,000 + $100 × floor(Fame ÷ 500)`.

**Axis 1: Client Archetype (Flavor only)**
Determined by `X = Turn % 4`
| X | Archetype | Flavor direction |
|---|---|---|
| 0 | **Startup** | Chaotic, urgent, messy codebase, big dreams. |
| 1 | **Academic** | Broke students/professors, complex math, theoretical. |
| 2 | **Corporate** | Bureaucratic, legacy systems, boring but stable. |
| 3 | **Shady** | Grey-market, aggressive web scraping, spam bots. |

**Axis 2: The Complication (Mechanics)**
Determined by `Y = floor(Turn ÷ 4) % 4`
| Y | Complication | Choice 1 (Standard) | Choice 2 (The Trade-off) |
|---|---|---|---|
| 0 | **Perfectionism** | Do the bare minimum.<br>Yield: `Base Pay` | Refactor/Polish it perfectly.<br>Yield: `Base Pay × 0.8`, `Fame +80` |
| 1 | **The Shortcut** | Build it properly.<br>Yield: `Base Pay` | Use a dirty, unstable hack.<br>Yield: `Base Pay × 1.3`, `Fame −80` |
| 2 | **Rabbit Hole** | Stick to the spec.<br>Yield: `Base Pay` | Deep dive into the underlying math.<br>Yield: `Base Pay × 0.6`, `RP +400` |
| 3 | **Scope Creep** | Refuse extra work.<br>Yield: `Base Pay` | Accept the heavy extra workload.<br>Yield: `Base Pay × 1.2`, `E-Lv counter +1` |

**Execution:**
The Game Engine MUST use its Creative License to invent a short story (`*[FLAVOR]*`) that logically combines Archetype X and Complication Y. Pause the game, present the story and the two choices (with exact numbers calculated). Wait for the Player's choice.
