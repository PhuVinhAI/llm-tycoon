# Employees

## Generation & Hiring

- **Headhunter Search:** Hiring is an instant action initiated from the Team menu. The Player pays the Archetype's Headhunter Fee (Content). The game pauses and generates exactly **3 candidates** for that Archetype.
- **Generation:** Using Creative License, invent a name and brief background for each candidate that naturally fits the player's chosen language; those flavor details have no mechanical effect. Mechanical values are deterministic: Candidate 1 uses every minimum Salary/stat bound, Candidate 2 uses the midpoint of every bound (round half up to a whole number), and Candidate 3 uses every maximum bound. A fixed effect with no range is identical for all three. Always present them in that order: Low Salary/Stats, Mid Salary/Stats, High Salary/Stats.
- **The Interview:** Render the Interview screen (S16). The Player must choose 1 candidate to hire, or 0 to reject all. The Headhunter Fee is **never refunded**, even if no one is hired.
- Maximum **2** Employees at a time — the lab is one small room. The Engine must block searches if the lab is full.
- Salary is paid starting from the month of hire (Economy rule).

## Firing

- Firing is instant, effective immediately; no penalty, no severance. Fired employees disappear permanently.

## Effects

- Each Employee's generated effects apply automatically while employed: research bonuses in the Research yield, quality bonuses in the Quality formula, compute reductions in requirement checks.
- When multiple Employees apply, add all flat RP, Q, or Dataset Quality bonuses. Multiply all compute-requirement multipliers, then round the final requirement up to the nearest whole TFLOPS-month. Dataset Quality remains capped at 5.
