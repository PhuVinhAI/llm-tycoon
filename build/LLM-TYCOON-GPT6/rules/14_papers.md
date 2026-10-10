# Academic Papers

## Availability
- The **Publish Paper** menu (S17) is accessible from the Action Menu (S5).
- A Model is eligible for a Paper if it has **Q ≥ 60.0** and has not yet been published (`pub=no`).

## Starting a Paper
- Choosing a Model in S17 prepares the selection, but **starting the Paper is a main action**. It immediately advances month 1 of the commitment; it is not an instant action.
- **Commitment:** Writing a Paper begins with exactly **2 committed months** (`M = 2`).
- **Immediate Consequences:** Publishing proprietary tech has immediate effects based on the Model's original Release status:
  - **Product:** If its Income Stream is still active, that Model's stream is immediately **cancelled**, forfeiting all remaining payouts and its future User Logs. Furthermore, giving away proprietary commercial IP angers investors: **Fame −300**.
  - **License:** Triggers a **Breach of Contract Lawsuit**. The client sues for leaking trade secrets. The Company immediately loses **Cash = Q × $200** and **Fame −500**. (The Paper still proceeds).
  - **Open-source / Shelved:** Safe to publish. No immediate penalties.

## Mid-Paper Dilemmas
- When a Paper reaches `months elapsed == 1`, mark `dilemma_done=yes`, pause, and present a **Paper Dilemma** (Content). This happens exactly once; a later change to `M` never triggers another Paper Dilemma.
- Render the Dilemma (S10) and wait for the Player's choice.
- The outcome may modify the total months (`M`), the final RP multiplier/bonus, or grant immediate Cash/Fame. Track any RP modifiers in the Game State.
- At completion, calculate base RP = `Q × 40`, apply the dilemma multiplier first, then add any flat Final RP bonus, and round half up to a whole RP.

## Completion
- On the final month, the Paper is published.
- **Yield:** The Company receives the final RP calculated above and **Fame +300**.
- The Model is permanently marked as `published` and cannot be used for a Paper again.
- Cancelling mid-paper: Fame −100, no RP (Actions rule).
