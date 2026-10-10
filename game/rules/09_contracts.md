# Contracts

## Availability

- Contracts unlock when the Company's Fame reaches their threshold AND the current in-game date is ≥ their Date requirement (Content). The engine announces newly available Contracts in the Events step.
- Each Contract may be completed **once**. At most one Contract, Project, or Paper is active at a time (Actions rule).

## Accepting and working

- Browsing and selecting a Contract for validation is instant. Confirming a valid Contract **accepts it as this month's main action and immediately advances month 1**; requirements (Technologies, Datasets) are checked before confirmation and must all hold.
- The listed months become committed Contract months. After month 1, the Player must manually execute the "Continue Contract" main action for each remaining month.

## Mid-Contract Dilemmas

Snapshot initialMonths at acceptance. At monthsElapsed == floor(initialMonths / 2) for initialMonths ≥2, mark dilemmaDone, draw once with draw_dilemma(state, 'contract') and present Content choice. Changing monthsTotal never repeats or moves midpoint.
- Render the Dilemma (S10) and wait for the Player's choice. 
- The outcome may modify the total months (`M`), the final payment (`Pay`), or grant immediate Cash/penalties and pending completionFameBonus. Track any `Pay` modifier (`pay_mod`) in the Game State.
- Every `Pay ±x%` modifier is `±x%` of the Contract's listed base pay. At completion calculate `listed base pay × 1.2` when the bonus Technology is owned, then add the signed dilemma percentage of the unmodified listed base pay, then round to the nearest dollar.

## Completion & Payout

Use complete_contract(state) for the final payment, pending Fame and Client Logs; it rejects duplicate payouts.

- **No partial payments:** The Company receives $0 during the intermediate months of a Contract.
- **On the final month:** When the final committed month is completed, the client pays the final amount defined above. No other multiplier or retroactive payment applies.
- Fame +(100 + completionFameBonus) on completion; no positive dilemma Fame before completion.
- Generate a Client Logs dataset: Size 2, Quality 3, Task/Domain from the Contract table, sourceId = Contract ID. These guaranteed client datasets make Contracts a business/data path. The Contract counts toward E-Lv (Skills rule).
- Cancelling mid-contract: Fame −200, no pay (Actions rule).
