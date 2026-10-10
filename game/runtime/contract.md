# Runtime Contract

## State and transactions

Use `runtime/state.py`. Current state is `session/state/save.json`; committed history is `session/state/events.jsonl`; `session/state/transaction.json` is a temporary recovery journal. See `runtime/schema.md` for records and `runtime/usage.md` for the API.

The helper checks structure/revision, journals a candidate and event, writes the log once, atomically replaces the save, then removes the journal. Load finishes an interrupted transaction without replaying gameplay. GPT-6 checks canonical IDs, Requirements and action-specific mechanics against Rules.

Use one stable `actionId` for a transaction and its retries. A completed retry returns the current save without repeating effects. Check the revision carried by a UI action; a stale click must reload/redraw rather than recompute as a new action. Exactly one writer uses a session directory; revision checks are not a multi-process lock.

## Commit boundaries

- New Game commits once after collecting both names.
- Commit each successful instant action; earlier successes survive an invalid later step.
- Persist incomplete forms, navigation and generated candidates when needed to resume. They consume no month.
- A main action follows the seven phases in `rules/00_time_and_turns.md`.
- Before showing an unresolved choice, commit its exact options, view, unfinished phase, applied step IDs and accumulated ledger. Record prechoice penalties/rewards separately from effects still waiting.
- Resume at the saved unfinished sub-step. Do not repeat Events, stream payments, costs, completion rewards or the main action.
- After the report is complete, advance date/turn exactly once and save `flow.lastReport`. Keep the resolving date while paused.
- Save/export/history do not consume an action or replace the underlying view.

## Export

On `save`, exit and the end of each in-game June/December, finish the current transaction or checkpoint the pending choice, call `export_bundle()`, and expose the actual returned file through the host's download facility. Do not show a success or link before the file exists.

Downloads go in `session/exports/`. A portable ZIP contains `save.json`, available `events.jsonl` and a short import README. `export_json()` is also sufficient for exact current-state resume; it carries no earlier log. Preserve the active view/choice; do not print complete state in ordinary screens.

Sandbox files may expire. A downloadable save carries progress between chats alongside the game ZIP.

## Import, replacement and recovery

Accept only version 1.0.0 / `llm-tycoon.save.v1`. Read uploaded files directly with Python; preserve originals. Validate state/history and gameplay invariants before importing; reject corruption/version mismatch instead of guessing a conversion.

`import_save` requires an empty session state. For an explicit replacement import, call `inspect_save(path)` and validate gameplay first; then archive the existing run with `archive_current()` and import. For New Game over a run, collect the new names before archiving. Make the archived run's returned download available. Retain `session/archives/`; reattaching the package never replaces progress.

Trust accumulated balances, dates and completed history. Recompute derived skills/capacity from stored records without reconstructing or charging old expenses. A hard-cap repair requires a separate documented repair transaction, never a silent correction.

A canonical load checks final action/revision/run/balances against the log. If the log is missing, import a copy of the JSON into an empty session and disclose the history gap. Never reset an invalid save; preserve corrupt data separately before resolving it. A failed write does not justify presenting an uncommitted result.

## Monthly news and clock guards

All new main actions start with begin_month and a committed Events checkpoint. The save keeps flow.newsOutbox and month.newsRequiredIds separately from world.firedEvents. Emitting news and resolving mechanics are distinct obligations. Acknowledge only actual emitted text; persist before leaving Events. New milestone conditions trigger another scan. finish_month preserves all cards in lastReport and advances exactly once; commit rejects skipped news/choices, removed checkpoints and arbitrary clock changes. After recovery/import, show unacknowledged news before resuming. No full content reload is needed: Python retrieves exact due rows each month.

## History

Each event records action ID, revision, resolving date/turn, type, label, actual before/after balances and optional structured changes/source paths. Narration is separate.

Count months from `month_completed`, not intermediate choices/checkpoints. Read only the needed tail/year; summarize actions, model completions, technologies and last balances of each year. A JSON-only import starts available history at the import date. Never invent missing history from balances, memory or transcript.
