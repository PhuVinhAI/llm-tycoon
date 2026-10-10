# Skills

## Growth

- **R-Lv (Research Level):** +1 for every **4** completed Research months. Cap: 5.
- **E-Lv (Engineering Level):** +1 for every **2** distinct model setups or completed Contracts. Cap: 5.

## Tracking

- The Game State tracks two counters: `research` (total Research months) and `models` (total distinct model setups + completed Contracts).
- Level = 1 + floor(counter ÷ threshold), capped at 5. Recompute from the counters — never store levels alone.
- Announce each level-up in the ledger the month it happens.

## Effects

- R-Lv increases Research yield (Research rule).
- Starting E-Lv adds +2 × E-Lv to Base Points (`rules/08_model_projects.md`).
