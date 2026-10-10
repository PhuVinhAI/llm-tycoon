# S8 — Files and Portable Saves

## Canonical state

`runtime/state/save.json` follows `runtime/02_state_schema.md`. Store JSON numbers, booleans, arrays, and null; do not encode lists as prose or use the string “none”.

The save includes all mechanical state, ordered Models, frozen completion results, active commitments, triggered Events and lasting effects, acquired-source history, candidate list, form draft, pending choice, and next unfinished month phase. Current-state resume never needs a transcript.

## Export

On `save`, exit, and the end of each in-game June or December:

1. Finish the current transaction or checkpoint a pending choice.
2. Use the helper to generate a portable ZIP in `runtime/exports/`.
3. Make the actual file downloadable using the host's file-attachment/link facility.
4. Keep the player's current view and next legal actions.

The portable ZIP includes `save.json`, available `events.jsonl`, and a short import README. A JSON save alone is also valid for current-state resume; earlier history is unavailable unless the log travels with it.

Exports do not consume time or resources. Keep at least the latest downloadable save visible on explicit request; do not print the entire JSON each turn.

## Load and import

Read an uploaded file directly with Python; never make the player manually paste a block if a file is available. Require the correct schema and game version, preserve the original file, validate both structure and gameplay invariants, and resume the saved view. Reject a wrong version or corruption; do not guess a migration.

Trust accumulated balances, Date, RP and completed history; do not retroactively charge reconstructed expenses. Report hard-cap repairs explicitly. Recompute derived values from stored counters/inventory according to the rules without replaying prior actions.

For an explicitly requested replacement import, validate the incoming state and history first, then call `archive_current()` to export/archive the existing run. The helper's `import_save` accepts an empty runtime only, so accidental imports cannot overwrite current progress. If the active save is corrupt, preserve its directory separately before creating an empty runtime; never delete it.

## Release contract

This is version 1.0.0. Accept only `llm-tycoon.save.v1` saves for this release. Unsupported formats require a separate explicit development task; gameplay never guesses a conversion.
