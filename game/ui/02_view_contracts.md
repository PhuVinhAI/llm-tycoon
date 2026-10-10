# View Contracts

These specify required information and interactions. GPT-6 chooses the layout; mechanics and disclosure rules stay fixed.

## S0 — Title

Game title, version, Chapter 1: Home Lab, short pitch, language if unclear. No device question.

## S1 — Main Menu

New Game, Continue / Import, How to Play, About, Exit. Show whether a run can be resumed. Follow `01_boot_and_main_menu.md`.

## S2 — Info

Guide or translated Game Info, followed by a route back to S1.

## S3 — Dashboard

Company, month and turn; Cash, Research Points, Fame / 5000; Research and Engineering levels; TFLOPS/mo, available/total VRAM, occupied/total slots; team; dataset count; owned Technologies; current Project (including Artifacts), Contract, or Paper progress; total monthly streams and fixed costs.

Use summary cards. Hardware and dataset details may be expanded on request. Derive totals from current state using applicable Rules.

## S4 — Turn Report

Fixed semantic order: each triggered event/news card → month's action and ledger → S3 → S5.

Each event gets its own headline, 2–3 short educational or atmospheric sentences, and explicit mechanical effects if any. Display current dated news and rumors only when the Events rule schedules them. Explain a scientific breakthrough in accessible language.

Show the main action and 1–2 sentences of flavor; each mechanical change, including generated Artifacts; resulting balances; skills that rose; datasets from expired streams; technology explanations where applicable.

While a month is paused, show S10 instead of pretending S4 is complete.

## S5 — Action Menu

Idle: Freelance, Research, New Model, Data, eligible Contracts, Shop, Team, Tech Tree, Portfolio, Save, eligible Publish Paper, Main Menu.

Commitment active: Continue matching Project/Contract/Paper, Cancel, and legal instant destinations. Cash below zero forces Freelance and pauses commitments per the Economy rule. Never display another illegal main action as available.

Contracts and Team require their announced unlock; initially hide them until Fame 800. An announced unlock remains available if Fame falls. Shop appears after GPUT or neural architecture technology. Paper appears if a model has Q ≥ 60 and is unpublished.

Always provide access to Save, Main Menu, and legal actions needed to continue. Include one short contextual tip about resources or navigation. Tips never disclose an ideal allocation or unseen pairing.

## S6 — Model Completion / Release

Model name; Architecture × Task; Scale and datasets; unresolved Artifacts; **all** applicable benchmarks, scores to one decimal, dated current rival and score or N/A; brief explanation of each metric and qualitative result; overall Q and reception tier; RP already earned; estimated Fame (awarded only on release).

Provide Open-source, License with exact payout, Product with exact monthly payout / eight months / VRAM reservation, and Shelve with zero Fame. Show unmet Requirements for locked choices. Apply Failure-model restrictions.

Show relevant First-Mover, Clash, Saturated, SOTA Hype and Artifact warnings according to Rules. Explain market conditions without exposing future rival identity or a secret release row. Persist a pending release choice so a chat restart cannot duplicate completion RP or Fame.

## S6-B — Public Reception

Immediately after release, before returning to S5: exactly four reviewers selected per Content, each with a fresh one-sentence quote reacting to Q, SOTA and Artifacts. Show actual Fame change, immediate cash or Product stream, and reservation. Shelving does not grant reception Fame.

## S7 — Market List

Current month, item IDs/names, relevant stats, prices, eligibility and available cash. Include back navigation. Show only date-available hardware/data/contracts; keep unannounced future content hidden.

## S8 — Save / Export

A real downloadable JSON save or portable ZIP, its in-game month, and a concise “saved” confirmation only after successful write. Preserve the active view or pending choice. Read `04_save_format.md`; do not dump raw state into the ordinary game screen.

## S9 — Ending

Narrated epilogue, total score, title from Content, major achievements, Save and recap. Hide score breakdown.

Bankruptcy ends the run. Winning by accepting the Term Sheet is a scored milestone and continues in sandbox. Offer Continue for that outcome; do not silently erase the run.

## S10 — Dilemma

Title, 2–3 short story sentences, each legal option with exact calculated public yield/effect, and a clear selection.

Persist the exact options and resume phase before showing them. Wait; do not pick for the player. On resume use those saved options. Already committed Events, costs, pay and penalties must not repeat.

## S11 — Sub-Menu

Menu title, available actions, instant/month classification, relevant costs, Back. Keep this view after a question or invalid action.

## S12 — Project Wizard

Available compute / VRAM; owned Architectures with base compute requirements; eligible Scales with required VRAM; optional TRF/PTRF inheritance; available Tasks with descriptions; 1–3 owned Datasets; minimum months and exact months needed for full compute for the configured plan; Focus: exactly 10 integer points across Data/Model/Training/Eval; player-chosen name.

Show only Match/Domain knowledge earned by analyzing that precise pairing. Do not warn about hidden quality penalties. Examples use placeholders, never optimal values. Persist the draft as fields are filled. Filling the form takes no month; confirming a valid plan is a main action and runs month 1.

## S13 — Data

Owned stable IDs/names, Domain, Size, Quality. Collect (one month), Clean (one month), Combine (instant), Market (instant), Back. Describe illegal selections; do not consume a month for validation failure.

## S14 — Technology Tree

Current Research Points, owned Technology IDs, visible tree names, current discounted costs, prerequisites, and plain effects. Distinguish unlockable and prerequisite-locked entries; the tree is public. Unlock is instant.

## S15 — Portfolio and Streams

Streams: model ID/name, monthly income, remaining months, reserved VRAM. Models: completion-order M IDs, name, Architecture × Task, Scale, Q, release status, analyzed and published flags.

Actions: Analyze, Release shelved model, Shutdown Product, Paper if eligible, Back. A completed model never gets a new ID merely because a table was sorted.

## S16 — Team and Interviews

Current team (maximum two), archetype, salary and exact effects; available headhunter archetypes, fee and Requirement. Fire and Back.

Interview: show the fee already paid, **exactly three persisted candidates** in low/mid/high stat order, salary, exact effects and short background. Choose one or reject all; fee is nonrefundable. Do not regenerate candidates after resume or charge the fee twice.

## S17 — Academic Publishing

Models with Q ≥ 60 and unpublished, original release status, publication consequences and selected model's exact cost/penalty. Product cancels only that model's stream and loses Fame; License incurs its lawsuit; Open-source/Shelved is safe. Explain initial two-month commitment and possible dilemma changes.

Form selection is instant. Confirmation starts a main action, runs month 1 and pauses for the paper's single dilemma. Persist modifiers and progress; completion/Continue/Cancel follow Rules.
