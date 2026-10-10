# Economy

## Fixed monthly costs

Every month, in the Costs step:

- **Living & rent:** $800.
- **Salaries:** sum of all hired Employees (Content).
- **Hardware upkeep:** $100 per occupied slot.
- **Cloud rental:** if active, per the Hardware rule.

## Rounding

- Default: round half up to the nearest whole number.
- RP cost discounts: multiply all applicable discounts, then round **up** to the nearest 5.
- Money: round to the nearest dollar.

## Running out of money

- If Cash < $0 at the end of a month: warn the Player. While Cash < $0, the engine forces **Freelance** as the main action (committed months pause and resume when Cash ≥ $0; the pause does not cancel the commitment).
- If Cash < **−$5,000** at the end of any month: the Company is bankrupt — the **Burned Out** ending triggers (Endings rule).
