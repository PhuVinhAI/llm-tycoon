# Time and Turns

## Timeline

- The game begins in **January 2013** and continues indefinitely (sandbox).
- One Turn equals one in-game month.
- Each month, the Player chooses exactly **one main action**, plus any number of **instant actions** (see Actions).

## Order of operations — every month, in this exact order

1. **Events** — check the Event Calendar (Content) for entries matching the current month, plus any threshold events whose condition became true (Fame thresholds, releases). Fire them and apply their effects.
2. **Action** — apply this month's main action (including the next committed month of an active Project, Contract, or Paper).
3. **Streams** — pay out all active Income Streams.
4. **Costs** — subtract fixed monthly costs: living, salaries, hardware upkeep, active cloud rental.
5. **Completions** — resolve whatever finished this month: Project quality computation, Contract payment, Paper publication, and Skill level-ups. Expired Income Streams generate a new Dataset: Name = `User Logs - [Task ID]`, Domain = `user-logs`, Size & Quality = 3 (if original Q ≥ 75.0) or 2 (if Q < 75.0). Announce this data collection in the ledger.
6. **Checks** — bankruptcy, win and lose conditions.
7. **Report** — render the adaptive view contracts (UI): event cards → month ledger → dashboard → menu.

## Committed Months (Step-by-Step)

- When a Project, Contract, or Paper is active, it does **not** auto-advance. The Player must manually choose the "Continue Project/Contract/Paper" main action each month.
- For a Project or Contract with `M ≥ 2`, evaluate its midpoint once when `months elapsed == floor(M ÷ 2)`. A Paper evaluates its Dilemma once at month 1. Every commitment tracks `dilemma_done`; changing `M` never triggers a second evaluation.
- This returns the Player to the Dashboard every month, allowing them to perform instant actions (buy hardware, hire staff, check the market, etc.) while the commitment is ongoing.
- The Action Menu (S5) dynamically updates to lock out other main actions until the commitment completes or is cancelled.
