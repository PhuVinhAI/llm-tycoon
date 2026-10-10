# State Schema — LLM Tycoon 1.0

Canonical path: `session/state/save.json`. Game version: `1.0.0`. Schema: `llm-tycoon.save.v1`. This release accepts only this schema and version.

## Top-level fields

| Key | Required contents |
|---|---|
| `meta` | game = LLM TYCOON; version = 1.0.0; schema = llm-tycoon.save.v1; runId; integer revision; updatedAt; lastActionId; historyAvailableFrom |
| `settings` | language; presentation = adaptive; displayPreferences object |
| `view` | current View ID; returnTo View ID; context object with selected IDs and menu mode |
| `player` | name; company |
| `clock` | date = YYYY-MM; turn, with Jan 2013 = 1 |
| `resources` | integer cash (may be negative); integer researchPoints ≥ 0; integer fame in 0..5000 |
| `counters` | integer research and models ≥0; models counts distinct setups + Contracts; capitalRaised ≥0; dilemmas {freelance,research,contract,paper} nonnegative draw counters |
| `technology` | owned canonical Technology IDs |
| `hardware` | inventory; cloudUnits (0..2); rewired boolean |
| `team` | employees (0..2); candidates (0 or 3); searchArchetype or null |
| `data` | datasets; sourcesUsed; nextDatasetId |
| `models` | completed models in immutable completion order, M1, M2, ... |
| `streams` | active Product income streams |
| `contractsDone` | completed Contract IDs |
| `active` | project, contract, paper, each null or full record; at most one active |
| `world` | fired event IDs; lasting effect records; permanently announced unlock IDs; competition records; llmUnlocked |
| `flow` | draft object; month checkpoint or null; pendingChoice or null; lastReport or null; newsOutbox array |
| `ending` | bankruptcy, winAwarded booleans; lastResult or null |
| `flavor` | optional recurring characters and prior public narration; never mechanics |

Do not store skill levels or dashboard totals as independent truth. Derive skills under `rules/04_skills.md`, capacity under `rules/07_hardware.md`, costs under `rules/02_economy.md` and stream totals from stored records.

## Rule shorthand

Rules and Content sometimes use compact formula names. Store their values in these canonical fields; do not create a second copy:

| Shorthand | Canonical field |
|---|---|
| `RP` | `resources.researchPoints` |
| `research`, `models` counters | `counters.research`, `counters.models` |
| `M`, months elapsed | commitment `monthsTotal`, `monthsElapsed` |
| `q_mod`, `art`, `dilemma_done` | project `qualityModifier`, `artifacts`, `dilemmaDone` |
| `anz`, `pub`, `sota` | model `analyzed`, `published`, `sotaHype` |
| `pay_mod` | contract `payModifierPercent` |
| `rp_mult`, `rp_bonus` | paper `researchMultiplier`, `researchBonus` |
| LLM task unlock flag | `world.llmUnlocked` |

## Record contracts

IDs never depend on display sorting. Do not recycle a consumed Dataset ID. Mark a combined dataset with combined=true for milestone M5; retain source provenance. Snapshot selected datasets at project start so later changes do not erase the setup's provenance.

- Hardware item: `id`, `itemId` (canonical shop name), `quantity`, `purchasePrice`, `tflops`, `vram`, `slots`. Content determines each stat. Starting PC is absent from GPU inventory, has no GPU slot/VRAM/TFLOPS, and supports CPU NGRAM/BOW projects/inference under Rules.
- Employee or candidate: `id`, `name`, `archetype`, `salary`, `effects` object with `researchBonus`, `qualityBonus`, `datasetQualityBonus`, `computeMultiplier`; `background` is flavor. Candidate values follow deterministic minimum/midpoint/maximum bounds.
- Dataset: `id`, `name`, `domain`, `size`, `quality`, `sourceId` (null for collected), `taskId` (null except Product/Client Logs provenance); combined=true on a combined dataset.
- Project: `id`, `name`, `architecture`, `scale`, `task`, `datasets` snapshots, `inheritModelId`, `monthsTotal`, `monthsElapsed`, `focus` [Data, Model, Training, Eval], `computeAccumulated`, `qualityModifier`, `artifacts`, `dilemmaDone`, `phase` (training/fine-tuning), `isLlm`, fixedComputeRequirement, engineeringLevel, technologyQualityBonus, staffQualitySum, initialTrainingMonths, trainingMonthsTotal, trainingMonthsElapsed, targetBenchmarkIds, completionResearchBonus. Persist any additional rule-required modifier, not an explanation in place of a value.
- Contract: `id`, `monthsTotal`, `monthsElapsed`, initialMonths, `payModifierPercent`, `dilemmaDone`, completionFameBonus.
- Paper: `id`, `modelId`, `monthsTotal`, `monthsElapsed`, `researchMultiplier`, `researchBonus`, `dilemmaDone`, `immediateConsequencesApplied`, completionFameBonus.
- Model: `id`, `name`, `architecture`, `scale`, `task`, `datasets` snapshots, `focus`, `quality`, `artifacts`, `completedDate`, `release` (Shelved/Open-source/License/Product), `releaseDate` (null if shelved), `analyzed`, `published`, `sotaHype`, `isLlm`, `benchmarks` frozen at completion; targetBenchmarkIds, noveltyMultiplier, codePublic. Each benchmark stores id, score, rival name/date/score or null. Store status of awarded completion RP and other one-time effects in the flow/flags; never recompute and award them again at Release.
- Stream: `id`, `modelId`, `monthlyCash`, `monthsRemaining`, `reservedVram`, `task`, `quality`. All are required for payout, shutdown and User Logs at expiry. Remaining months may temporarily be 0 only in a costs/completions checkpoint after the final payout, before expiry handling removes the stream and creates its User Logs.
- World effect: `id`, `sourceEventId`, `kind`, `target`, `value`, `starts`, `ends` (null if permanent). Preserve event discounts until consumed, overrides and market multipliers without flattening them into a prose flag.
- Pricing kinds used by quote_release: demand (target exact Task, value override); license/product/commercial (value multiplier; target all, exact Task, or belowTRF). E11 is commercial/all ×1.5 Mar–Aug 2016; E23 commercial/belowTRF ×0.5 permanent; E25 license/all ×1.2 permanent. Demand overrides are scanned in recorded event order. Research discounts use kind=research_discount and target exact Tech or all.
- Competition: `id`, `tasks`, `openedDate`, `closesDate`, `threshold`, `thresholdRevealed`, `submittedModelIds`, `won`, `prizeCash`, `prizeFame`.

## Month checkpoint and pending choices

`flow.month` is null outside a month transaction. During a paused month it stores:

- `date`, `turn`, `mainAction` with explicit parameters
- `nextPhase`: events, action, streams, costs, completions, checks, or report
- `appliedSteps`: unique stable effect IDs already applied in this month
- `ledger`: structured changes already accumulated
- `eventCards`: all source cards, including shown/publicText receipts
- `newsRequiredIds`: every source ID queued for this resolving month
- any commitment/completion checkpoint needed to resume at the exact sub-step

Set `flow.pendingChoice` before showing a player choice. It contains `id`, `kind`, `view`, `date`, `turn`, `title`, `sourceFiles`, `options`, `resume`. Each option has stable `id`, translated `label`, and explicit `effects` object. `resume` identifies the next phase and action/target.

Kinds include freelance, research, project_dilemma, fine_tuning, contract_dilemma, paper_dilemma, event_choice, term_sheet, release, interview.

An event_choice includes eventId of its displayed source; it may interrupt Action/Completions/Checks without rewinding phase order. Store a deferred next choice in flow.draft and resume it after the event resolves. Only a displayed pending eventId may remain unfired during such a checkpoint; finish_month still requires all effects resolved.

Preserve prechoice penalties and awarded completion rewards separately from effects still waiting. Fine-tuning can repeat a choice, but midpoint dilemma evaluation remains done. Persist generated interview candidates and fee-paid state. `flow.draft` stores incomplete wizard configuration, never a secretly started Project. newsOutbox cards store id/date/kind/title/effect/source/shown/publicText, plus original source lines; shown requires actual emitted publicText.

## Calendar semantics

At an idle decision point `clock` is the next month to act in. During a paused month it stays on that resolving month. Use finish_month only after Report and no choice/required news remains. It preserves cards/required IDs in lastReport and advances exactly one month and turn. A month_completed commit must use the resolving date/turn and rejects manual clock changes. `flow.lastReport` records the resolved date, action, structured changes, events and balances.

## Validation and repairs

The helper enforces structural fields, numeric bounds, stable IDs, valid dates, revision, exclusive commitments, candidate count, and resumable flow shape. Month transition guards also enforce queued/acknowledged source news. GPT-6 additionally checks canonical IDs, stats, requirements, available inventory/capacity, record provenance, and action-specific Rules before a commit.

Do not silently change accumulated balances. Reject corruption and unsupported versions; preserve original imports. If a documented hard-cap repair is appropriate, write it as a separate repair transaction with old/new values.

## Structured transaction event

~~~json
{
  "actionId": "stable-unique-id-for-this-step",
  "date": "2013-01",
  "turn": 1,
  "type": "month_completed",
  "label": "Research",
  "details": {
    "action": "research",
    "technologyUnlocked": [],
    "modelsCompleted": [],
    "changes": []
  },
  "sources": ["rules/01_actions.md", "rules/03_research.md"]
}
~~~

Helper fills revision, loggedAt, view, and before/after resource balances from the actual saves. Event types: new_game, navigation, instant_action, checkpoint, choice, month_completed, import, repair. Export itself is not a gameplay transition.
