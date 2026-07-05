<!--
===============================================================================
FILE: 14_papers.md
MODULE: Rules / Papers

Mục đích:
Định nghĩa quy trình xuất bản báo cáo khoa học (Publish Paper).

Tác dụng:
Cung cấp giải pháp đổi Model lấy RP ở giai đoạn mid-game, với cái giá phải
trả là mất độc quyền thương mại (hủy Income Stream).
===============================================================================
-->

# Academic Papers

## Availability
- The **Publish Paper** menu (S17) is accessible from the Action Menu (S5).
- A Model is eligible for a Paper if it has **Q ≥ 60** and has not yet been published (`pub=no`).

## Starting a Paper
- Starting a Paper is an instant action from S17.
- **Commitment:** Writing a Paper takes exactly **3 committed months** (`M = 3`).
- **Trade-off (Immediate):** Starting a Paper immediately **cancels any active Income Stream** for that specific Model (because the proprietary architecture and methods are now public knowledge).

## Mid-Paper Dilemmas
- When a Paper reaches `months elapsed == floor(M ÷ 2)` (month 1), the engine pauses and presents a **Paper Dilemma** (Content).
- Render the Dilemma (S10) and wait for the Player's choice.
- The outcome may modify the total months (`M`), the final RP multiplier/bonus, or grant immediate Cash/Fame. Track any RP modifiers in the Game State.

## Completion
- On the final month, the Paper is published.
- **Yield:** The Company receives **RP = Q × 30** and **Fame +300**. (Apply any modifiers from the Dilemma).
- The Model is permanently marked as `published` and cannot be used for a Paper again.
- Cancelling mid-paper: Fame −100, no RP (Actions rule).
