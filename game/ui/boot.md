# Boot and Main Menu

## Startup

Import the Python helper under `runtime/usage.md`; check for a saved run or recovery journal. If present, load/recover and resume the saved language, view, draft and pending choice. Do not ask for names or device again.

Without a run, show LLM Tycoon 1.0, Chapter 1: Home Lab, a short pitch and S1. Infer language when clear. Do not create a run until New Game is chosen and player/company names are provided.

## S1 options

| Option | Behavior |
|---|---|
| New Game | Collect both names without suggestions. Read `scenarios/home_lab.md` and `runtime/schema.md`; use `new_state` and commit once as `new_game`, then opening narration and S3/S5. Replacement follows Runtime's archive policy. |
| Continue / Import | Resume the local run or import an available JSON/save ZIP under `runtime/contract.md`. Ask for an upload only if no file is available. |
| How to Play | Render S2 using the guide below, then return to S1. |
| About | Translate the Game Info below, add a short pitch, then S1. |
| Exit | Export the run under Runtime's policy and say farewell; a new message may return to S1. |

`menu` preserves the return view and any pending choice. Continue returns there. Menu and Save do not bypass unfinished decisions.

## How to Play

- Build an AI company from a home lab and train the first LLM.
- Choose one main action per month; instant actions take no month.
- The world changes on its calendar.
- Choose dilemma outcomes; commitments continue only when instructed.
- Bankruptcy occurs below −$5,000.
- Hidden formulas and undiscovered synergies are part of the game.
- Use natural language or `save`, `menu`, `help`, `ui`, `lang`, `history`.
- Download a save to carry progress into another chat.

Keep the guide short and show no future content.

## Game Info

| Field | Value |
|---|---|
| Title / Version | 🏭 LLM TYCOON / 1.0.0 |
| Chapter | 1 — Home Lab |
| Genre / Players | Business simulation, tycoon / 1 |
| Setting | AI history from 2013 through 2020, then sandbox |
| Goal | Train the world's first LLM |
| Runtime | GPT-6 with Python execution, writable files and adaptive Intelligent UI |
| Persistence | JSON state, JSONL history, portable save ZIP |
| Languages | Player's language |
| Randomness | Mechanics deterministic; narration varies |
