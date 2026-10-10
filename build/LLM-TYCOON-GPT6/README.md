# 🏭 LLM TYCOON — GPT-6

Play LLM Tycoon with GPT-6, Python and Intelligent UI. This README is the ZIP's entrypoint and complete file map. Extract the archive into a writable directory with Python; locate this README and use its parent as the package root.

## Startup

Require Python execution and writable files. Use only UI features supported by the host; numbered choices are the fallback when interactive controls cannot submit actions.

Read `engine.md`, `ui/presentation.md`, `runtime/contract.md` and `runtime/usage.md` once at startup or after a context reset. Import `runtime/state.py` without printing its source.

Check the default session's save/journal through the helper:
- Existing run: load/recover and resume its language, view and pending choice. Read only the current view's section in `ui/views.md`.
- No run: read `ui/boot.md` and show the menu. Create a run only after New Game and both names are supplied.
- Provided save: follow Runtime's import policy before resuming.

Read `runtime/schema.md` when creating/changing records; select its relevant sections. `reference/terms.md` is an optional lookup. `scenarios/home_lab.json` is a template, not an active save.

## Read routing

Follow `engine.md` for the action loop. Every action loads committed state. Every new month MUST call begin_month, commit the Events checkpoint, resolve the queued data rows and show/acknowledge all news before Action. finish_month and commit enforce this; never manually advance clock. Unshown outbox cards resume before a choice after context reset. Gameplay effects are computed/committed before their report; news display receipts are committed immediately after emission. The UI reads the active section of `ui/views.md`.

The table identifies dependencies to read **in addition to** retained startup instructions and current state. Read only relevant sections/dated rows, but follow all triggered Rule references. If context no longer contains a dependency, reread it.

| Action or phase | Documents / sections |
|---|---|
| Every main action/month, including Continue | `rules/00_time_and_turns.md`, `rules/01_actions.md`, `rules/02_economy.md`, `rules/04_skills.md`, `rules/05_reputation.md`, `rules/07_hardware.md`, `rules/11_events_and_competitions.md`; Call due_events/queue_due_events, not a memory-based calendar check; read returned current/triggered rows of `content/08_events_calendar.md`, `content/13_benchmarks.md`, `content/14_rival_models.md`. Check lasting effects, streams, active commitment and triggered dependencies. |
| Freelance | Actions plus `content/10_freelance_clients.md` |
| Research | `rules/03_research.md`, `content/11_research_events.md`, employed bonuses in `content/07_employees.md` |
| Technology / unlock | Research, `content/00_technologies.md`, granted designs in `content/01_architectures.md`; stored discounts |
| Data collect/clean/combine/buy/claim | `rules/06_datasets.md`, `content/05_datasets.md`, staff bonuses; claim's Event |
| Hardware / rewire / sell / cloud | Hardware, Economy, `content/04_hardware_shop.md`; cloud unlock |
| Project setup / wizard | `rules/08_model_projects.md` → **Declaring a Project (the start wizard)**; Datasets, Hardware, Skills; `content/00_technologies.md`, `content/01_architectures.md`, `content/02_tasks_and_matching.md`, staff |
| Project month / fine-tuning / midpoint | Model Projects → **Artifacts & Fine-Tuning**, **Project Dilemmas (Mid-Project)**; setup dependencies; `content/12_project_dilemmas.md`, Benchmarks |
| Model completion | Model Projects → **The Bottom-Up Quality Calculation**, **Reception & Fame**; setup dependencies, `content/13_benchmarks.md`, `content/14_rival_models.md` |
| Release / shelved release | Model Projects → **Release & The Market Hype Cycle** and **Reception & Fame**; Reputation, Hardware, `content/03_market_demand.md`, Benchmarks including Public Reviewers, Rival Models, active Events; current_sota and market_window helpers |
| Analyze | Model Projects → **Post-Mortem Analysis (Portfolio)**, quality/midpoint sections; original design/Task/Domain tables |
| Streams / shutdown | Model Projects → release section; Time, Hardware, Economy, Datasets; stored stream records |
| Contract | `rules/09_contracts.md`, Actions, `content/06_contracts.md` including dilemmas |
| Team / interviews / fire | `rules/10_employees.md`, Reputation, `content/07_employees.md` |
| Event choice / competition | Events, Reputation, applicable calendar rows |
| LLM / Term Sheet | `rules/12_llm_project.md`, normal Project dependencies, calendar |
| Paper | `rules/14_papers.md`, Actions, `content/15_papers.md`, affected model/stream |
| Ending / score | `rules/13_endings_and_scoring.md`, `content/09_scoring_titles.md` |
| New Game | `scenarios/home_lab.md`, schema, boot; derive S3/S5 fields from applicable Rules |
| Save / import / replacement / history | Runtime contract and API; schema for import; history from `session/state/events.jsonl` |
| Help / About / language / display | Presentation, boot, active view; public Requirements only |

Short names in routing refer to the corresponding file in the complete map. A choice can trigger another choice or completion; read that phase's dependencies before resuming.

Use `read_document(path, heading)` to print just one section into context. Its heading is the exact text after the Markdown `#` prefix. For programmatic navigation, `package-index.json` lists paths, headings, sizes and hashes; do not load the full index each turn.

## Package and session

The shipped folders contain immutable instructions, Rules, Content, UI, starting scenario and Python persistence. Runtime data is created separately under `session/`; the game ZIP never includes progress.

GPT-6 applies the Rules and tells the story; Python performs numeric work and persistence. The helper schedules mandatory data news, guards monthly completion and supplies targeted deterministic gameplay calculations; remaining actions follow Rules. Save exports carry pending choices and available history into another chat with this game package.

Every shipped file is mapped below. Do not concatenate them or automatically read the entire map's targets.

## Complete file map

Every shipped file is listed here. Read a linked document only when its topic is relevant.

| File | Purpose |
|---|---|
| [content/00_technologies.md](content/00_technologies.md) | Technologies |
| [content/01_architectures.md](content/01_architectures.md) | Architectures |
| [content/02_tasks_and_matching.md](content/02_tasks_and_matching.md) | Tasks and Matching |
| [content/03_market_demand.md](content/03_market_demand.md) | Market Demand |
| [content/04_hardware_shop.md](content/04_hardware_shop.md) | Hardware Shop |
| [content/05_datasets.md](content/05_datasets.md) | Datasets |
| [content/06_contracts.md](content/06_contracts.md) | Contracts |
| [content/07_employees.md](content/07_employees.md) | Employee Archetypes |
| [content/08_events_calendar.md](content/08_events_calendar.md) | Event Calendar — ⚠️ engine-only, never reveal in advance |
| [content/09_scoring_titles.md](content/09_scoring_titles.md) | Score Titles |
| [content/10_freelance_clients.md](content/10_freelance_clients.md) | Freelance Era-Aware Dilemmas |
| [content/11_research_events.md](content/11_research_events.md) | Research Era-Aware Dilemmas |
| [content/12_project_dilemmas.md](content/12_project_dilemmas.md) | Project Dilemmas |
| [content/13_benchmarks.md](content/13_benchmarks.md) | Historical Benchmarks |
| [content/14_rival_models.md](content/14_rival_models.md) | Historical SOTA (Rival Models) |
| [content/15_papers.md](content/15_papers.md) | Paper Dilemmas |
| [engine.md](engine.md) | Engine Instructions |
| [README.md](README.md) | 🏭 LLM TYCOON — GPT-6 |
| [reference/terms.md](reference/terms.md) | Game Terms |
| [rules/00_time_and_turns.md](rules/00_time_and_turns.md) | Time and Turns |
| [rules/01_actions.md](rules/01_actions.md) | Actions |
| [rules/02_economy.md](rules/02_economy.md) | Economy |
| [rules/03_research.md](rules/03_research.md) | Research |
| [rules/04_skills.md](rules/04_skills.md) | Skills |
| [rules/05_reputation.md](rules/05_reputation.md) | Fame |
| [rules/06_datasets.md](rules/06_datasets.md) | Datasets |
| [rules/07_hardware.md](rules/07_hardware.md) | Hardware |
| [rules/08_model_projects.md](rules/08_model_projects.md) | Model Projects |
| [rules/09_contracts.md](rules/09_contracts.md) | Contracts |
| [rules/10_employees.md](rules/10_employees.md) | Employees |
| [rules/11_events_and_competitions.md](rules/11_events_and_competitions.md) | Events and Competitions |
| [rules/12_llm_project.md](rules/12_llm_project.md) | The LLM Project |
| [rules/13_endings_and_scoring.md](rules/13_endings_and_scoring.md) | Endings and Scoring |
| [rules/14_papers.md](rules/14_papers.md) | Academic Papers |
| [runtime/contract.md](runtime/contract.md) | Runtime Contract |
| [runtime/gameplay.py](runtime/gameplay.py) | Python state, transactions, import, export and history |
| [runtime/schema.md](runtime/schema.md) | State Schema — LLM Tycoon 1.0 |
| [runtime/state.py](runtime/state.py) | Python state, transactions, import, export and history |
| [runtime/usage.md](runtime/usage.md) | Python API |
| [scenarios/home_lab.json](scenarios/home_lab.json) | Machine-readable Home Lab starting state |
| [scenarios/home_lab.md](scenarios/home_lab.md) | Home Lab Opening |
| [ui/boot.md](ui/boot.md) | Boot and Main Menu |
| [ui/presentation.md](ui/presentation.md) | Presentation |
| [ui/views.md](ui/views.md) | View Contracts |
| [package-index.json](package-index.json) | Release version, paths, sizes and SHA-256 hashes |

Created during play (excluded from the release): `session/state/save.json`, `session/state/events.jsonl`, `session/state/transaction.json`, `session/exports/` and `session/archives/`.

