# Model Projects

## Declaring a Project (the start wizard)

Filling or revising the wizard takes no month. Confirming a valid declaration starts this month's main action and advances month 1. Declare:

1. Architecture granted by owned technology. Neural architectures require GPUT and at least 100 TFLOPS/mo.
2. Scale from the table below. NGRAM/BOW only support Tiny or Base and run on the starting CPU without GPU VRAM; their scale modifier is 0 / +3 instead of the neural modifier. CPU Product inference also reserves 0 GB. All neural projects need the listed Available VRAM throughout training and fine-tuning.
3. Optional inheritance for TRF/PTRF from a completed TRF/PTRF. Compute requirement ×0.6; minimum training months −1, floor 1. The LLM overrides minimum reductions.
4. Task. LLM (general) requires completing the special LLM Project first.
5. One to three distinct owned datasets. Duplicate IDs or identical (domain, size, quality, taskId) entries in one mixture are invalid. Snapshot datasets at start. Combined Size = max(size) + count −1, cap 5; Combined Quality = floor(average quality). Mixture compute multipliers: 1 / 1.25 / 1.5.
6. Training months M, at least the architecture minimum after FINE/inheritance reductions.
7. Exactly ten integer Focus points: Data / Model / Training / Eval.
8. Player-chosen name.

| Neural scale | Training VRAM | Compute multiplier | Ideal data size | Quality modifier | Market segment multiplier |
|---|---|---|---|---|---|
| Tiny | 2 GB | 0.5 | 1 | −10 | 0.8 |
| Base | 4 GB | 1 | 2 | 0 | 1 |
| Large | 12 GB | 4 | 3 | +8 | 1.2 |
| Massive | 40 GB | 15 | 4 | +16 | 1.5 |
| Frontier | 320 GB | 20 | 5 | +25 | 2 |

Frontier requires world.llmUnlocked, except the special LLM Project. CPU Tiny/Base segment multipliers remain 0.8/1.

At start, store all currently available task benchmark IDs as targetBenchmarkIds; these form the project's frozen evaluation target. If none exist, use Internal QA Metric. New benchmarks appear as expanded tests at completion but do not change Q. The special LLM targets all available general benchmarks at completion.

Snapshot technology quality bonuses, minimum-month reductions, E-Lv, and architecture requirement at start. Staff effects apply per actual training month: average quality bonuses across training months; optimizer multipliers affect each month's effective compute. Hiring at the last moment cannot reduce previously required work. Fine-tuning does not add training compute or training-month bonuses.

Compute per training month = installed + active cloud TFLOPS, multiplied by (0.8 + 0.05 × Training focus), then divided by the product of that month's optimizer multipliers. Accumulate without monthly rounding. The fixed requirement excludes employees. Declare projected months for that effective compute; future staffing/hardware changes alter the projection.

Show upfront cost, monthly fixed/project cost, present streams and projected minimum runway before confirmation. Check all hard requirements before charging or advancing. Data size targets and focus recipes remain hidden; earned Analyze hints are qualitative. Data/Model allocation affects architecture fit; Training allocation affects speed; Eval allocation reduces anomalies.

## Artifacts & Fine-Tuning

Each training month generates max(1, 4 + floor(architecture Base Q / 10) − starting E-Lv − floor(Eval focus / 2)) Artifacts. Show changes in the ledger.

After M training months, pause if Artifacts remain:

- Complete raw: penalty −floor(Artifacts / 2) to Base Points.
- Fine-tune one month: no new Artifacts, no training compute; remove 8 + 3 × starting E-Lv + Eval focus, floor 0. Extend total months by one. Repeat if Artifacts remain.

Track training months separately from total months; a fine-tuning extension never re-evaluates midpoint or changes the frozen target.

## Project Dilemmas (Mid-Project)

Evaluate once at elapsed training month floor(initial training months / 2) for M ≥2. Synergy = architecture/task Match + Project Domain Fit + Focus score.

Project Domain Fit: +3 if at least half the selected datasets directly fit one current target benchmark, 0 if no official target or at least one dataset is web-mixed or same-task user logs, otherwise −3. User logs use saved taskId and actual domain; their name has no mechanical effect.

Synergy ≥16 triggers Breakthrough; ≤8 triggers Complication; 9–15 proceeds normally. Mark dilemmaDone even when there is no choice. Apply q_mod and extensions under Content. RP rewards are **completion rewards**, recorded in completionResearchBonus; never paid at midpoint. Cancellation forfeits them. Additional training from a dilemma produces normal compute/artifacts, without changing midpoint.

## The Bottom-Up Quality Calculation

Use create_project to validate/snapshot, advance_project for each actual Action month, project_midpoint for the once-only check, extend_project for extensions and complete_project for final rewards. project_quality(project, models, completion_date) can inspect the calculation. Never reveal formulas during play.

~~~
Base Points = Architecture Base Q + Scale modifier
            + 2 × Combined Quality
            + 5 if Combined Size meets architecture baseline
            − 20 if below Scale ideal data size
            + Compute score + Focus score + 2 × starting E-Lv
            + snapshotted technology bonus + average training staff quality bonus
            + q_mod − floor(Artifacts / 2)
            − 15 if multiple datasets and architecture below TRF
            − 6 × min(3, previous equivalent models)
~~~

Compute score: effective compute ≥2×fixed requirement: +8; ≥requirement: +5; ≥half: −5; otherwise −15. CPU requirement 0 always +5. Focus score = max(0, 10 − sum absolute differences from architecture ideal).

For each benchmark, average dataset fits **weighted by dataset Size**: matching target domain +12, other web-mixed +3, other same-task user logs +3, otherwise −10. Conditions are exclusive in that order. Internal QA fit =0. Raw score = Base Points + Architecture/Task Match + weighted fit.

Normalize with diminishing returns: raw ≤70 → max(0, raw); raw >70 → 70 + 30 × (raw −70) / (raw −70 +40). Round half up to one decimal. Inheritance caps **each score** at parent Q +15. Scores are normalized game indices, not raw historical metrics.

Display all task benchmarks available at completion, marking Target or Expanded; include frozen Internal QA if targeted. Q = mean target scores, half-up to one decimal. LLM targets all general benchmarks available at completion. Store scores and target IDs permanently. Official rival = highest normalized score available by completion, ties latest date, or N/A. Explain each metric simply.

Equivalent setup = same architecture, task, scale and unordered dataset (domain, size, quality, taskId) tuples. IDs, names and Focus are excluded. Count equivalents across **all** prior completed models. noveltyMultiplier = max(0.25, 0.5 ** count); store at completion. Improved dataset stats or scale can constitute a new setup.

## Reception & Fame

| Q | Reception | Base Fame |
|---|---|---|
| ≥85 | Breakthrough | +800 |
| 70–84.9 | Great | +500 |
| 55–69.9 | Good | +300 |
| 40–54.9 | Mediocre | +100 |
| <40 | Failure | −100 |

Reception is awarded only on release. Positive Fame multiplies by novelty; penalties do not. Shelve grants none. Completion RP = (floor(Q) ×15 + completionResearchBonus) ×novelty, rounded once. Only models without an equivalent predecessor increment the engineering counter; each Contract still increments it once.

## Release & The Market Hype Cycle

A model releases once as Open-source, License or Product; Shelve is not a release. Release immediately or later from Portfolio. Q <40 only allows Open-source/Shelve. Public code or a paper published while Shelved restricts later release to Open-source.

Task-specific rival milestones at the same date count once. Scheduled rumor of a milestone in the next 1–3 months → First-Mover ×1.5; otherwise latest milestone: R/R+1 Clash ×1, R+2..R+7 Saturated ×0.75, outside that Normal ×1. Use market_window(task, date). No other forecasts.

Recompute **current SOTA** at release against matching target scores and current dated rivals. At least half of targets having a rival must exceed it; none may lag by >10. Historical SOTA at completion remains recorded but grants no perpetual commercial bonus. Current SOTA cash ×1.25 except First-Mover. Clash current SOTA grants +500 Fame ×novelty once.

Demand/hype/event prices are fixed at release; existing Product streams retain their quote for eight months.

| Release | Effect |
|---|---|
| Open-source | Positive reception Fame ×1.5 ×novelty; negative unchanged; extra RP 200 ×novelty. No cash or bonus for Artifacts. |
| License | Cash = Q ×$90 ×Demand ×segment ×hype ×current-SOTA ×novelty ×active license event multipliers. |
| Product | Fame ≥1000, Q ≥55. Neural inference reserves half Scale VRAM from installed hardware; CPU reserves 0. Cash/month = Q ×$25 ×Demand ×segment ×hype ×current-SOTA ×novelty ×active product event multipliers ×max(0.5, 1 −Artifacts/40), for eight months. |
| Shelve | No reception Fame; future release, Competition, Analyze or Paper remains possible. |

Streams pay starting **next month** after release. Normal expiry produces User Logs in the largest original dataset domain (tie original order), Size/Quality 3 if Q ≥75, else 2; taskId = model task, sourceId = model ID. Logs help the actual task/domain, not every benchmark. Shutdown/publication forfeits remaining income/logs.

Immediately render four dated Public Reviewers, actual changes, current/historical SOTA distinction and stream reservation before returning to menu.

Use quote_release to show legal choices/prices and release_model to apply the chosen release. Call product_logs only on normal expiry, then remove its stream. Never generate logs on shutdown or Paper cancellation.

## Post-Mortem Analysis (Portfolio)

Analyze once per model, instant/free. Mark analyzed; reveal qualitative pairing/domain hints for its setup, never numerical recipes. In 2–3 short paragraphs discuss coverage, task fit, compute, artifacts and Training/Eval trade-offs, with one observed improvement direction. Restore Portfolio. Prominently offer Analyze after the first model.
