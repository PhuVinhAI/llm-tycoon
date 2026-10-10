# Time and Turns

## Timeline

- The game begins in **January 2013** and continues indefinitely (sandbox).
- One Turn equals one in-game month.
- Each month, the Player chooses exactly **one main action**, plus any number of **instant actions** (see Actions).

## Order of operations — every month, in this exact order

1. **Events** — call begin_month(state, action), then due_events(state); persist, resolve and display every source card before moving to Action. Use acknowledge_news only after emitting cards. Apply dated and newly satisfied threshold effects once.
2. **Action** — apply this month's main action (including the next committed month of an active Project, Contract, or Paper).
3. **Streams** — pay out all active Income Streams.
4. **Costs** — subtract fixed monthly costs: living, salaries, hardware upkeep, active cloud rental.
5. **Completions** — resolve whatever finished this month: Project quality computation, Contract payment, Paper publication, and Skill level-ups. Expired Income Streams generate a new Dataset: Name = `User Logs - [Task ID]`, Domain = the largest source dataset domain (tie original order), taskId = Task ID, sourceId = Model ID, Size & Quality = 3 (if original Q ≥ 75.0) or 2 (if Q < 75.0). Announce this data collection in the ledger.
6. **Checks** — call due_events again for newly satisfied milestones, resolve/emit/acknowledge; bankruptcy, win and lose conditions.
7. **Report** — use finish_month(state, report) only after all choices, effects and cards are resolved; render the adaptive view contracts (UI): event cards → month ledger → dashboard → menu.

## Committed Months (Step-by-Step)

- When a Project, Contract, or Paper is active, it does **not** auto-advance. The Player must manually choose the "Continue Project/Contract/Paper" main action each month.
- Project midpoint uses training months elapsed == floor(initial training months / 2) for initial M ≥2. Contract midpoint uses monthsElapsed == floor(initial months / 2) for initial M ≥2. Store initial months before any extension. Paper evaluates once at month 1. Changing total months never repeats a dilemma.
- This returns the Player to the Dashboard every month, allowing them to perform instant actions (buy hardware, hire staff, check the market, etc.) while the commitment is ongoing.
- The Action Menu (S5) dynamically updates to lock out other main actions until the commitment completes or is cancelled.
