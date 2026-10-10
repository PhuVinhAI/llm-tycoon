# Python Helper

Standard library only; Python 3.7 or later. Paths are relative to this helper's location, not the shell's current directory.

Prefer importing the module from a Python execution tool. A terminal is optional.

~~~python
from pathlib import Path
import importlib.util

root = Path("/path/to/extracted/LLM-TYCOON-GPT6")
spec = importlib.util.spec_from_file_location("tycoon", root / "runtime/llm_tycoon_runtime.py")
rt = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rt)

state = rt.load()
rules = (root / "rules/02_economy.md").read_text(encoding="utf-8")
# Calculate the requested action in Python using the relevant documents.
# Build candidate as a deep copy of state; do not alter state in place.
updated = rt.commit(candidate, event, expected_revision=state["meta"]["revision"])
download = rt.export_bundle()
~~~

The example deliberately leaves `candidate` and `event` to the action resolver: the helper does not implement all game mechanics.

Functions:

| Function | Use |
|---|---|
| `new_state(player, company, language)` | Build an uncommitted new run from `scenarios/00_home_lab.json`; commit once with expected revision 0 |
| `load()` | Recover a journal if necessary, then read and validate the save |
| `validate(state)` | Check schema, field types, IDs, pending flows, hard bounds |
| `commit(candidate, event, expected_revision)` | Persist a new state and event together; new game uses expected revision 0 |
| `events(year=None)` | Read committed log entries, optionally filter by year |
| `export_bundle()` | Write a portable ZIP containing save + available log |
| `export_json()` | Write a shareable JSON save |
| `import_save(path)` | Import JSON or a portable ZIP into an empty runtime; reject an existing run |
| `archive_current()` | Export and archive the current run before an explicit New Game or replacement import; return archive and download paths |
| `history_export()` | Write a recap from structured log entries |
| `round_half_up(value, places=0)` | Canonical rounding using Decimal |

For snippets that only need a section:

~~~python
text = (root / "ui/02_view_contracts.md").read_text(encoding="utf-8")
heading = "## S12 — Project Wizard"
section = text.split(heading, 1)[1].split("\n## ", 1)[0]
print(heading + section)
~~~

Read date-appropriate calendar rows and required flags internally. Do not expose hidden data in UI artifacts.

Optional terminal commands: `python runtime/llm_tycoon_runtime.py load`, `export`, `history`, or `import PATH`. Gameplay users need no command-line workflow.
