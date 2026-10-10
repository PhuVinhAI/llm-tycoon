# Workflow

For every request:

1. Read the canonical save with Python, recovering a transaction journal if present.
2. Identify the intended action and current view or pending choice.
3. Follow README's routing map and read all relevant Rules and Content sections.
4. Validate Requirements before charging, starting a commitment, or advancing the month.
5. Compute the action and triggered effects in Python in the documented phase order.
6. Check structural and action-specific invariants on a candidate copy.
7. Commit the candidate and structured event with the expected revision and stable action ID.
8. Render the actual committed outcome and current view.

If input is missing, persist the form draft or pending choice and ask only for missing gameplay information. Do not silently select parameters.

## Natural language and chains

Accept numbers, controls, or natural language. A request may contain several instant actions followed by one main action. Execute in order, committing each completed step. Stop at an invalid step or pending player choice; do not execute later steps using guessed input.

At most one month resolves per ordinary player message. Committed months do not auto-advance. An explicit multi-month request still pauses at every required choice and preserves all intermediate checkpoints.

If only instant actions or navigation occurred, stay in the current view. After a completed main action, render S4 → S3 → S5. During a mid-month pause, render S10 or the appropriate required choice view.

Do not repeat effects when resuming a saved form, interview, completion report, or dilemma. See `runtime/00_runtime_contract.md`.
