# Contracts

## Availability

- Contracts unlock when the Company's Fame reaches their threshold AND the current in-game date is ≥ their Date requirement (Content). The engine announces newly available Contracts in the Events step.
- Each Contract may be completed **once**. At most one Contract, Project, or Paper is active at a time (Actions rule).

## Accepting and working

- Browsing and selecting a Contract for validation is instant. Confirming a valid Contract **accepts it as this month's main action and immediately advances month 1**; requirements (Technologies, Datasets) are checked before confirmation and must all hold.
- The listed months become committed Contract months. After month 1, the Player must manually execute the "Continue Contract" main action for each remaining month.

## Mid-Contract Dilemmas

When a Contract first reaches `months elapsed == floor(M ÷ 2)` (for M ≥ 2), the engine marks `dilemma_done=yes`, pauses, and presents a **Contract Dilemma** (Content). Each Contract evaluates this midpoint exactly once; changing `M` never triggers it again.
- Render the Dilemma (S10) and wait for the Player's choice. 
- The outcome may modify the total months (`M`), the final payment (`Pay`), or grant immediate Cash/Fame. Track any `Pay` modifier (`pay_mod`) in the Game State.
- Every `Pay ±x%` modifier is `±x%` of the Contract's listed base pay. At completion calculate `listed base pay × 1.2` when the bonus Technology is owned, then add the signed dilemma percentage of the unmodified listed base pay, then round to the nearest dollar.

## Completion & Payout

- **No partial payments:** The Company receives $0 during the intermediate months of a Contract.
- **On the final month:** When the final committed month is completed, the client pays the final amount defined above. No other multiplier or retroactive payment applies.
- Fame +100. The Contract counts toward E-Lv (Skills rule).
- Cancelling mid-contract: Fame −200, no pay (Actions rule).
