# Employees

## Generation & Hiring

- **Headhunter Search:** Hiring is an instant action initiated from the Team menu. The Player pays the Archetype's Headhunter Fee (Content). The game pauses and generates exactly **3 candidates** for that Archetype.
- **Generation:** Using Creative License, invent a name and brief background for each candidate that naturally fits the player's chosen language; those flavor details have no mechanical effect. Mechanical values follow Content's low/mid/high bounds; flat stats use minimum/midpoint/maximum with half-up rounding. Optimizer effectiveness specifically improves as its multiplier decreases: 0.85/0.75/0.65. A fixed effect with no range is identical for all three. Always present them in that order: Low Salary/Stats, Mid Salary/Stats, High Salary/Stats.
- **The Interview:** Render the Interview screen (S16). The Player must choose 1 candidate to hire, or 0 to reject all. The Headhunter Fee is **never refunded**, even if no one is hired.
- At most one Employee per Archetype. Maximum **2** Employees at a time — the lab is one small room. Block searches if the lab is full or that Archetype is already employed.
- Salary is paid starting from the month of hire (Economy rule).

## Firing

- Firing is instant, effective immediately; no penalty, no severance. Fired employees disappear permanently.

## Effects

- Each Employee's generated effects apply automatically while employed: research bonuses in the Research yield, quality bonuses in the Quality formula, compute reductions in requirement checks.
- Flat RP and Dataset Quality bonuses add; Dataset Quality caps at 5. Training quality bonuses are averaged over months worked. Optimizers change monthly effective training compute, not the fixed project requirement. Use Model Projects for the exact calculation.
