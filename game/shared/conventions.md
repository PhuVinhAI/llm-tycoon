# Documentation Conventions

Canonical terminology lives in the Glossary.

## Responsibility

- system: GPT-6 behavior, workflow, language, output and authority.
- definitions: entity meaning.
- rules: mechanics.
- content: canonical tables and Events.
- scenarios: initial state and narration.
- ui: semantic views and interactive presentation.
- runtime: Python persistence, transactions and state schema.
- meta: game identity.
- package: source for the generated root README.

Each fact belongs in one authoritative location. References may describe it without introducing a competing rule. Examples are illustrative.

## Authoring and release

Write the canonical body in clear English. Optional Vietnamese maintainer explanations go in HTML comments; the default build strips those comments.

Prefix ordered modules with two digits. Keep one responsibility per file. Explicit runtime schemas and code are appropriate in runtime documents.

The manifest in `src/build/manifest.ts` packages separate files. Source authoring READMEs are excluded. `game/package/00_entrypoint.md` becomes the single `README.md` at the ZIP root; the build appends the complete file map and creates `package-index.json`.

Run `bun run build` after edits. Version 1.0.0 ships only the folder and ZIP. Do not concatenate modules or add a second README inside a content directory.

Keep routing dependencies complete: a month requires Economy, Skills, Reputation, Hardware, Events and the relevant Content as well as its specific action. The README map must help an AI find any shipped file.

## Runtime compatibility

Game version and save schema are explicit contracts. This release accepts only 1.0.0 / llm-tycoon.save.v1. Do not add silent compatibility conversions. The helper implements persistence; formulas remain in Rules and are executed by GPT-6 using Python.
