# Runtime Contract

## Source of truth

`runtime/state/save.json` is the current state. `runtime/state/events.jsonl` is the committed mechanical history. `runtime/state/transaction.json` is a temporary recovery journal.

Use `llm_tycoon_runtime.py` for transactions. It validates structural invariants, checks the expected revision, journals the candidate state and event, writes the log once, atomically replaces the save, and removes the journal. On load, it finishes an interrupted transaction without replaying gameplay effects.

The helper implements persistence and structural validation. GPT-6 must read the documented rules and compute action-specific mechanics in Python. Do not describe this helper as a complete deterministic mechanics engine.

## Transaction boundaries

- Create the initial state with a `new_game` transaction only after collecting the player's and company's names.
- Commit each successful instant action; when chaining actions, stop at the first invalid or unresolved step. Keep earlier committed actions.
- A main action consumes one month, with phases in `rules/00_time_and_turns.md`.
- If a phase pauses for input, commit the partial state and persist `flow.pendingChoice`, `flow.month`, the accumulated ledger, and triggered event IDs.
- Persist incomplete forms and view navigation as `navigation` transactions when needed for resume. These consume no game time or resources.
- Once a month is fully resolved, advance to the next decision month and store the completed report. Do not advance while waiting for a mid-month choice.
- A choice handler resumes at `flow.month.nextPhase`. It applies only the uncompleted effects; it never starts the month again.
- Save/export and history consume no main action. Export retains the underlying current view.

Use one stable `actionId` for retries of the same transaction. A retry with the same ID must return the committed state rather than charging twice. A widget must also carry the state revision it was generated from; reject stale clicks and redraw.

Use exactly one writer per run. Do not commit in parallel or let two Python processes share the same runtime directory. Revision checks detect stale actions; they are not a multi-process lock.

## History

Every committed event includes an action ID, revision, in-game date, turn, type, label, structured before/after resource balances, and optional change details and source paths. Generated narration is separate from mechanical changes.

Log partial-month choices and full month reports with distinct event types. Count monthly actions in recaps from `month_completed`, rather than counting every intermediate choice as another month.

Read only the needed log tail or year. If a portable JSON save has no log attached, mark earlier history unavailable. Never invent it from balances or conversation memory.

## Failure behavior

On an IO or validation failure, leave the last valid save intact and explain the failure briefly. Do not show a successful action or download link until the file actually exists.

Never silently reset an invalid save. Keep the original import and work on a copy. Hard-cap corrections must be documented as a repair transaction; structural corruption or version mismatch needs resolution before continuing.

Exports are derived artifacts: downloadable `save.json` is sufficient for exact current-state resume; a portable ZIP also includes the available history.

On an explicit New Game or replacement import, `archive_current()` first exports the current run, then moves its state directory into `runtime/archives/`. Retain that archive; it is never part of the game release ZIP. A load checks that the log's final action, revision, run and balances agree with the save. If the canonical log is missing, import a copy of the JSON into an empty runtime and disclose that earlier history is unavailable.
