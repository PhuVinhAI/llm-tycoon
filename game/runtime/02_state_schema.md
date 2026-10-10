# State Schema — LLM Tycoon 1.0

Canonical path: `runtime/state/save.json`. Game version: `1.0.0`. Schema: `llm-tycoon.save.v1`. This release accepts only this schema and version.

## Top-level fields

| Key | Required contents |
|---|---|
| `meta` | game = LLM TYCOON; version = 1.0.0; schema = llm-tycoon.save.v1; runId; integer revision; updatedAt; lastActionId; historyAvailableFrom |
| `settings` | language; presentation = adaptive; displayPreferences object |
| `view` | current View ID; returnTo View ID; context object with selected IDs and menu mode |
| `player` | name; company |
| `clock` | date = YYYY-MM; turn, with Jan 2013 = 1 |
| `resources` | integer cash (may be negative); integer researchPoints ≥ 0; integer fame in 0..5000 |
| `counters` | integer research and models ≥ 0; models counts completed Projects + Contracts |
| `technology` | owned canonical Technology IDs |
| `hardware` | inventory; cloudUnits (0..2); rewired boolean |
| `team` | employees (0..2); candidates (0 or 3); searchArchetype or null |
| `data` | datasets; sourcesUsed; nextDatasetId |
| `models` | completed models in immutable completion order, M1, M2, ... |
| `streams` | active Product income streams |
| `contractsDone` | completed Contract IDs |
| `active` | project, contract, paper, each null or full record; at most one active |
| `world` | fired event IDs; lasting effect records; permanently announced unlock IDs; competition records; llmUnlocked |
| `flow` | draft object; month checkpoint or null; pendingChoice or null; lastReport or null |
| `ending` | bankruptcy, winAwarded booleans; lastResult or null |
| `flavor` | optional recurring characters and prior public narration; never mechanics |

Do not store skill levels or dashboard totals as independent truth. Derive Research Level = min(5, 1 + research // 4), Engineering Level = min(5, 1 + models // 2), slots = 8 if rewired else 4, and hardware/VRAM/stream/cost totals from Rules and the stored records.

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

IDs never depend on display sorting. Do not recycle a consumed Dataset ID. Snapshot selected datasets at project start so later changes do not erase the setup's provenance.

- Hardware item: `id`, `itemId` (canonical shop name), `quantity`, `purchasePrice`, `tflops`, `vram`, `slots`. Content determines each per-item stat. Starting PC has no slot/VRAM/compute and may remain narrative-only.
- Employee or candidate: `id`, `name`, `archetype`, `salary`, `effects` object with `researchBonus`, `qualityBonus`, `datasetQualityBonus`, `computeMultiplier`; `background` is flavor. Candidate values follow deterministic minimum/midpoint/maximum bounds.
- Dataset: `id`, `name`, `domain`, `size`, `quality`, `sourceId` (null for collected), `taskId` (null except User Logs provenance).
- Project: `id`, `name`, `architecture`, `scale`, `task`, `datasets` snapshots, `inheritModelId`, `monthsTotal`, `monthsElapsed`, `focus` [Data, Model, Training, Eval], `computeAccumulated`, `qualityModifier`, `artifacts`, `dilemmaDone`, `phase` (training/fine-tuning), `isLlm`. Persist any additional rule-required modifier, not an explanation in place of a value.
- Contract: `id`, `monthsTotal`, `monthsElapsed`, `payModifierPercent`, `dilemmaDone`.
- Paper: `id`, `modelId`, `monthsTotal`, `monthsElapsed`, `researchMultiplier`, `researchBonus`, `dilemmaDone`, `immediateConsequencesApplied`.
- Model: `id`, `name`, `architecture`, `scale`, `task`, `datasets` snapshots, `focus`, `quality`, `artifacts`, `completedDate`, `release` (Shelved/Open-source/License/Product), `releaseDate` (null if shelved), `analyzed`, `published`, `sotaHype`, `isLlm`, `benchmarks` frozen at completion. Each benchmark stores id, score, rival name/date/score or null. Store status of awarded completion RP and other one-time effects in the flow/flags; never recompute and award them again at Release.
- Stream: `id`, `modelId`, `monthlyCash`, `monthsRemaining`, `reservedVram`, `task`, `quality`. All are required for payout, shutdown and User Logs at expiry. Remaining months may temporarily be 0 only in a costs/completions checkpoint after the final payout, before expiry handling removes the stream and creates its User Logs.
- World effect: `id`, `sourceEventId`, `kind`, `target`, `value`, `starts`, `ends` (null if permanent). Preserve event discounts until consumed, overrides and market multipliers without flattening them into a prose flag.
- Competition: `id`, `tasks`, `openedDate`, `closesDate`, `threshold`, `thresholdRevealed`, `submittedModelIds`, `won`, `prizeCash`, `prizeFame`.

## Month checkpoint and pending choices

`flow.month` is null outside a month transaction. During a paused month it stores:

- `date`, `turn`, `mainAction` with explicit parameters
- `nextPhase`: events, action, streams, costs, completions, checks, or report
- `appliedSteps`: unique stable effect IDs already applied in this month
- `ledger`: structured changes already accumulated
- `eventCards`: public event information already triggered
- any commitment/completion checkpoint needed to resume at the exact sub-step

Set `flow.pendingChoice` before showing a player choice. It contains `id`, `kind`, `view`, `date`, `turn`, `title`, `sourceFiles`, `options`, `resume`. Each option has stable `id`, translated `label`, and explicit `effects` object. `resume` identifies the next phase and action/target.

Kinds include freelance, research, project_dilemma, fine_tuning, contract_dilemma, paper_dilemma, event_choice, term_sheet, release, interview.

Preserve prechoice penalties and awarded completion rewards separately from effects still waiting. Fine-tuning can repeat a choice, but midpoint dilemma evaluation remains done. Persist generated interview candidates and fee-paid state. `flow.draft` stores incomplete wizard configuration, never a secretly started Project.

## Calendar semantics

At an idle decision point `clock` is the next month to act in. During a paused month it stays on that resolving month. After report completion, advance exactly one month and turn. `flow.lastReport` records the resolved date, action, structured changes, events and balances.

## Validation and repairs

The helper enforces structural fields, numeric bounds, stable IDs, valid dates, revision, exclusive commitments, candidate count, and resumable flow shape. GPT-6 additionally checks canonical IDs, stats, requirements, available inventory/capacity, record provenance, and action-specific Rules before a commit.

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
