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
- A Model is eligible for a Paper if it has **Q ≥ 60.0** and has not yet been published (`pub=no`).

## Starting a Paper
- Starting a Paper is an instant action from S17.
- **Commitment:** Writing a Paper takes exactly **2 committed months** (`M = 2`).
- **Immediate Consequences:** Publishing proprietary tech has immediate effects based on the Model's original Release status:
  - **Product:** The active Income Stream is immediately **cancelled**. Furthermore, giving away proprietary commercial IP angers investors: **Fame −300**.
  - **License:** Triggers a **Breach of Contract Lawsuit**. The client sues for leaking trade secrets. The Company immediately loses **Cash = Q × $200** and **Fame −500**. (The Paper still proceeds).
  - **Open-source / Shelved:** Safe to publish. No immediate penalties.

## Mid-Paper Dilemmas
- When a Paper reaches `months elapsed == 1` (which is `floor(M ÷ 2)`), the engine pauses and presents a **Paper Dilemma** (Content).
- Render the Dilemma (S10) and wait for the Player's choice.
- The outcome may modify the total months (`M`), the final RP multiplier/bonus, or grant immediate Cash/Fame. Track any RP modifiers in the Game State.

## Completion
- On the final month, the Paper is published.
- **Yield:** The Company receives **RP = Q × 40** and **Fame +300**. (Apply any modifiers from the Dilemma).
- The Model is permanently marked as `published` and cannot be used for a Paper again.
- Cancelling mid-paper: Fame −100, no RP (Actions rule).
