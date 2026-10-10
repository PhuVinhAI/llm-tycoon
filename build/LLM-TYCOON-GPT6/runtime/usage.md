# Python API

Python 3.7+; standard library only. Import the module from the execution tool. Paths follow the package location, not the tool's working directory.

## Import and startup

~~~python
import importlib.util
import copy
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

The source need not be printed into context to import it. Read `runtime/schema.md` when creating/modifying records. Targeted calculators resolve Quality, effective compute, timing, current SOTA and campaign score. Rules still govern actions and nonimplemented effects.

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
| `begin_month(state, action)` | Create Events checkpoint and queue every due data news row; commit before resolving |
| `due_events(state)`, `queue_due_events(state)` | Read due source rows / append them idempotently to the checkpoint outbox |
| `acknowledge_news(state, rendered)` | After emission, record {news ID: exact emitted full text}; commit the receipt |
| `finish_month(state, report)` | Require resolved choices/effects/display receipts, preserve report, advance one month |
| `draw_dilemma(state, kind)` | Consume one run-seeded deck item only when creating a persisted choice |
| `project_quality(project, models, date)` | Quality, benchmark targets, novelty and completion RP from snapshotted project |
| `create_project(state, declaration, is_llm=False)` | Validate/snapshot setup, optionally charge LLM upfront; no month advancement |
| `advance_project(state)` | Apply one requested training/fine-tuning Action month, using actual staff |
| `project_midpoint(project, date)` | Once-only synergy result; persist Content choice if triggered |
| `extend_project(state, fine_tuning=False)` | Dilemma training extension or one fine-tuning month |
| `complete_project(state, release_raw=False)` | Completion RP/novelty/engineering, immutable model; then resolve LLM/release choices |
| `cancel_commitment(state, kind)` | Forfeit pending rewards, cancellation penalty and clear commitment |
| `complete_paper(state)` | Award final RP/Fame and mark model public/published exactly once |
| `complete_contract(state)` | Apply final quote, pending Fame, engineering and canonical Client Logs once |
| `quote_release(state, model_id, release)`, `release_model(...)` | Validate/quote or apply one release; always render public reception |
| `product_logs(state, model_id)` | Generate provenance/domain-preserving logs only after normal expiry |
| `resolve_term_sheet(state, model_id, accept)`, `freeze_campaign(state)` | Once-only funding choice / freeze first campaign result after release |
| `fixed_requirement(project)`, `training_compute(tflops, focus, multipliers)` | Fixed requirement / actual effective monthly training compute |
| `market_window(task, date)`, `current_sota(model, date)` | Public current timing / comparable dated target evaluation |
| `campaign_score(state)` | Bounded campaign score excluding investment |
| `round_half_up(value, places=0)` | Decimal half-up rounding |
| `read_document(path, heading=None)` | Read one package file or exact Markdown heading section; return text |

`Runtime(root=...)` can isolate another **session directory**. Each session has `state/`, `exports/` and `archives/`. The default instance is `rt.runtime`.

## Read only what is needed

~~~python
print(rt.read_document("ui/views.md", "S12 — Project Wizard"))
print(rt.read_document("rules/08_model_projects.md", "Declaring a Project (the start wizard)"))
~~~

A section includes its subheadings and ends at the next heading of equal/higher level. Missing paths/headings raise an error. README routes actions to documents and sections; `package-index.json` contains heading names and hashes for Python lookup/verification, not routine context loading.

## Mandatory month sequence

~~~python
candidate = copy.deepcopy(state)
cards = rt.begin_month(candidate, {"action": "research"})
# Commit this Events checkpoint before applying events/choices.
# Each card retains its source, title and effect. Read/apply exact calendar effects.
# Mark each resolved ID once in candidate["world"]["firedEvents"].
# Emit all card texts to the player, THEN:
rt.acknowledge_news(candidate, {card_id: exact_emitted_text})
# Commit receipts before moving nextPhase beyond "events".
# Continue Action / Streams / Costs / Completions / Checks in Rule order.
# Queue and resolve any new milestones; stop at every pending player choice.
candidate["flow"]["month"]["nextPhase"] = "report"
resolving_clock = dict(candidate["clock"])
rt.finish_month(candidate, structured_report)
# Commit type="month_completed", date/turn=resolving_clock, expected current revision.
~~~

Helpers mutate a candidate, never persist by themselves. Do not copy the example's placeholders as data. If a month is already active, resume its nextPhase rather than calling begin_month again. If a guard lists missing news, queue those rows, apply effects once, emit/acknowledge and retry. On reload, unshown news is displayed before the pending choice. Python does not observe the UI, so a receipt requires GPT's actual emitted text.
