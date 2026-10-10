# Authoring LLM Tycoon

The playable source lives in `game/`. The manifest in `src/build/manifest.ts` assembles separate runtime files; `game/package/00_entrypoint.md` becomes the sole root README with an automatically generated complete file map.

## Responsibility and authority

- `engine.md`: interpretation, action loop and authority.
- `reference/terms.md`: compact entity/term meanings; no new mechanics.
- `rules/`: formulas, Requirements and transitions.
- `content/`: canonical catalogs, calendar and dilemma outcomes.
- `ui/`: presentation, boot/About and required view information.
- `runtime/`: transaction/export/import policy, schema and Python API.
- `scenarios/`: opening setting and authoritative starting-state JSON.

Each fact has one authoritative location. UI/README route to it; avoid copying formulas or save policy into other documents. Content explicitly referenced by a Rule can supply a documented effect.

## Source and release

Keep `game/` limited to playable instructions, canonical data, the initial-state template and runtime helpers. Write prompt text and headings in clear English. Put design rationale and maintainer notes in `docs/`; do not add HTML comments, bilingual summaries or directory READMEs to `game/`. The generated root README is the package's sole map. Player-facing narration and labels follow the player's chosen language under `ui/presentation.md`. Numbered Rules/Content stay separate for targeted reads. Avoid duplicate mechanics, screen layouts and development examples.

README routing must include the action's actual dependencies and relevant section headings. `runtime/state.py` supports exact section reads, and the generated index includes headings/line numbers. The index does not hash itself.

`session/` is mutable player data, created only during play and excluded from packages. Build prunes retired files from the previous package inventory, not user data. Never hand-edit release files; change source then rebuild.

Version 1.0.0 / `llm-tycoon.save.v1` is the only supported save contract. No silent conversions. The Python helper supplies persistence, monthly news guards and targeted gameplay calculations; GPT-6 interprets actions and applies remaining Rules. Tables remain canonical, read directly by runtime/gameplay.py. Any calendar edit must pass the source-row scheduling tests; do not hardcode a second dated news catalog.

## Verification

Run build, typecheck, lint, Bun tests and Python unittest discovery. Verify the archive's sole root README, complete map, valid references/sections, CRC/hashes, absence of development/state files, successful import of the shipped helper, and save/recovery behavior. Playtests are needed separately to evaluate the model's application of gameplay.
