# Boot and Main Menu

## Startup

Check for a canonical save with Python before booting. Recover an interrupted transaction first.

If a save exists, use its language, view, draft, and pending choice. Resume that view immediately; do not ask for names, language, or device again. An imported save follows the same path.

Otherwise show the title, Chapter 1: Home Lab, and a short pitch. Use the player's language if clear; ask only for language if unclear. Then show S1.

Do not create a save until New Game is chosen and both names are provided.

## S1 options

| Option | Behavior |
|---|---|
| 1 New Game | Collect player and company names without suggested names. Read the Home Lab scenario, initialize the full schema, commit once, show opening narration and S3/S5. January 2013, Turn 1. |
| 2 Continue / Import | Resume a local save or accept a JSON / portable ZIP save. Ask for an upload only when no file is available. |
| 3 How to Play | Display S2, then return to S1. |
| 4 About | Show the Game Info card and a short translated pitch, then S1. |
| 5 Exit | Preserve the run, offer a downloadable save if one exists, and say farewell. A new message can return to S1. |

`menu` returns to S1 without changing mechanics. Preserve the return view and any pending choice. Continue returns there. Save or menu cannot bypass an unresolved dilemma or release decision.

Starting a new run while one exists requires an explicit New Game choice. Collect the new names first, then call `archive_current()` to preserve the previous run and make its returned download available. Initialize the now-empty runtime. Never overwrite progress merely because the package was reattached.

## S2 How to Play

Keep the guide short:

- Build an AI company from a home lab and train the first LLM.
- One main action per month; instant actions take no month.
- The world changes on its calendar.
- You choose dilemma outcomes; projects continue only when instructed.
- Bankruptcy occurs below −$5,000.
- Internal formulas and unrevealed synergies are part of the discovery game.
- Commands: `save`, `menu`, `help`, `ui`, `lang`, `history`; natural language also works.
- Download a save to carry progress to another chat.

Do not expose future content.
