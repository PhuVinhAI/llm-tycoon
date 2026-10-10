# Game Terms

Use this reference only when a term is unclear. Mechanical values and limits live in Rules/Content; record fields live in `runtime/schema.md`.

| Term | Meaning |
|---|---|
| Player / Company | One human manages one AI company in this Home Lab run. The company owns the recorded resources, employees, data, hardware and models. |
| Game State / Canonical Save | The current committed JSON in `session/state/save.json`, including view and unfinished decisions. |
| Turn / Main Action | One in-game month and the one activity that consumes it. Instant actions consume no month. |
| Requirement / Outcome | A condition checked before an action; a documented mechanical result after it. |
| Cash / Research Points (RP) / Fame | Money in dollars; research currency spent on technologies; public reputation that gates opportunities. |
| Research Level (R-Lv) / Engineering Level (E-Lv) | Founder skills derived from research/completion counters under `rules/04_skills.md`. |
| Technology / Architecture | Owned knowledge unlocks a design family; a trained Model is one concrete result built with that design. |
| Task / Domain / Demand | The model's target problem; the dataset's subject; the task's market multiplier for the current era. |
| Dataset / Size / Quality | An owned data asset; abstract coverage and preparation ratings. Dataset Quality and Model Q use different scales. |
| Project / Scale / Focus | A fixed training plan and commitment; model size tier; allocation across Data, Model, Training and Eval. |
| TFLOPS/mo / TFLOPS-months | Monthly training capacity / accumulated training compute. |
| VRAM / Inference VRAM | Memory capacity / installed memory reserved for active Products; cloud cannot sustain a Product reservation. |
| Artifacts / Fine-Tuning | Training anomalies / additional training months to reduce those anomalies. |
| Model / Q / Release | A completed Project's result; frozen overall evaluation; Open-source, License or Product deployment. Shelved means no release yet. |
| Benchmark / SOTA | A dated evaluation metric / its historical rival result. SOTA Hype is earned at completion under Model Projects. |
| Income Stream / User Logs | A Product's recurring payments / data created when its stream expires normally. |
| Employee / Candidate | A hired staff record / one persisted interview option. Effects apply only as specified by Employees. |
| Contract / Paper | A client-work commitment / a publication commitment tied to an eligible completed model. |
| Event / Competition / Dilemma | A dated or conditional world effect / a timed submission opportunity / a choice reserved for the player. |
| Event Log / Transaction | Committed history in `session/state/events.jsonl` / a state and event persisted together. |
| Save Export | A downloadable JSON state or ZIP containing state and available history. |
| View ID / Intelligent UI | A stable screen identity such as S3 or S10 / supported controls, cards, tables and charts presenting public state. |
| Flavor | Narrative content with no mechanical effect. |
