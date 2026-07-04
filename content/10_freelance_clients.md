<!--
===============================================================================
FILE: 10_freelance_clients.md
MODULE: Content / Freelance Clients

Mục đích:
Danh sách khách hàng xoay vòng cho hành động Freelance.
===============================================================================
-->

# Freelance Clients (Rotation)

When the Player chooses Freelance, the engine looks up the client at the current `freelance_idx` (0 to 3, looping back to 0). The engine calculates the `Base Pay = $2,000 + $100 × floor(Fame ÷ 500)`, then pauses to present the client's flavor and the two choices.

| Index | Client Profile | Choice A | Choice B |
|---|---|---|---|
| 0 | **The Scrappy Startup**<br>Messy codebase, urgent need. | **Quick Patch:** Do exactly what they asked.<br>Yield: `Base Pay` | **Proper Fix:** Refactor their mess.<br>Yield: `Base Pay - $500`, `Fame +50` |
| 1 | **The Desperate Student**<br>Needs help with an NLP assignment. | **Do it for them:** Write the code.<br>Yield: `Base Pay - $500` | **Tutor them:** Explain the math.<br>Yield: `Base Pay - $1000`, `RP +300` |
| 2 | **The Shady Marketer**<br>Wants a tool to scrape and spam. | **Take the dirty money:** Build it.<br>Yield: `Base Pay + $1000`, `Fame -100` | **Refuse the shady part:** Build a standard filter instead.<br>Yield: `Base Pay` |
| 3 | **The Corporate Manager**<br>Unrealistic deadline, high pressure. | **Crunch time:** Work overnight.<br>Yield: `Base Pay + $500`. *Penalty:* Next month's Research action yields −50% RP. | **Standard pace:** Push back on the deadline.<br>Yield: `Base Pay` |

*(After the Player chooses, apply the outcome and increment `freelance_idx`. If it reaches 4, reset to 0).*
