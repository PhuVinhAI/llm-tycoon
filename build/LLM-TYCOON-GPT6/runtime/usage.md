# Python API

Python 3.7+; standard library only. Import the module from the execution tool. Paths follow the package location, not the tool's working directory.

## Import and startup

~~~python
import importlib.util
from pathlib import Path

root = Path("/actual/extracted/package")
spec = importlib.util.spec_from_file_location("tycoon", root / "runtime/state.py")
rt = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rt)

# The default session root is root / "session".
if rt.runtime.save_path.exists() or rt.runtime.journal_path.exists():
    state = rt.load()
else:
    state = None
~~~

The source need not be printed into context to import it. Read `runtime/schema.md` when creating/modifying records. The helper does not resolve gameplay formulas.

## API

| Function | Purpose |
|---|---|
| `new_state(player, company, language)` | Copy the Home Lab template; fill names/language/run ID; return uncommitted state |
| `load()` | Recover journal, validate and load current save |
| `validate(state)` | Structural checks; Rules still require action-specific validation |
| `commit(candidate, event, expected_revision)` | Commit a deep-copied candidate and structured event; New Game uses revision 0 |
| `events(year=None)` | Read committed history, optionally one year |
| `export_bundle()`, `export_json()` | Create a download ZIP or JSON; return its actual Path |
| `inspect_save(path)` | Validate an incoming JSON/ZIP and history without writing; return state/history for gameplay checks |
| `import_save(path)` | Import into an empty state directory |
| `archive_current()` | Export and archive existing state; return archive/download Paths |
| `history_export()` | Create a recap from structured events |
| `round_half_up(value, places=0)` | Decimal half-up rounding |
| `read_document(path, heading=None)` | Read one package file or exact Markdown heading section; return text |

`Runtime(root=...)` can isolate another **session directory**. Each session has `state/`, `exports/` and `archives/`. The default instance is `rt.runtime`.

## Read only what is needed

~~~python
print(rt.read_document("ui/views.md", "S12 — Project Wizard"))
print(rt.read_document("rules/08_model_projects.md", "Declaring a Project (the start wizard)"))
~~~

A section includes its subheadings and ends at the next heading of equal/higher level. Missing paths/headings raise an error. README routes actions to documents and sections; `package-index.json` contains heading names and hashes for Python lookup/verification, not routine context loading.
