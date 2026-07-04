# Documentation Conventions

## Purpose

This document defines the writing conventions used throughout the Game Documentation.

These conventions promote consistency, readability, and predictable interpretation across all documentation.

---

# Canonical Terms

Terms defined in the Glossary are canonical.

When referring to a canonical concept, always use its canonical name exactly as defined.

Examples include:

* Game Documentation
* Game State
* Player Action
* Requirement
* Event
* Game Data

Avoid alternative wording when the canonical term is intended.

---

# Separation of Responsibilities

Each directory has a distinct purpose.

* `system/` defines how the Game Engine operates.
* `shared/` provides terminology and documentation conventions.
* `definitions/` describes entities and concepts.
* `rules/` describes game mechanics and behavior.
* `content/` contains game data.
* `scenarios/` defines initial Game States.
* `templates/` defines the exact output formats the Game Engine must produce.
* `meta/` contains build-file wrappers (header, footer) that are not game knowledge.
* `scripts/` contains the build tooling (not part of the Game Documentation).

Information should only appear in the directory responsible for that information.

---

# Bilingual Documentation

The canonical body of every document is written in English.

Vietnamese explanations live inside HTML comments (`<!-- ... -->`), following the established header style (`Mục đích / Tác dụng / Trách nhiệm`) and inline notes (`Tiếng Việt:`).

The build strips HTML comments by default, so the playable build stays lean while the source stays fully documented for Vietnamese maintainers. At runtime the Game Engine speaks the player's language regardless (see `system/06_language.md`).

---

# File Naming and Ordering

When the order of documents matters (system, rules, content, templates), prefix file names with two digits (`00_`, `01_`, …).

The build assembles each directory's `.md` files sorted by name, excluding `README.md`. A `README.md` describes its directory for developers and never enters the build.

---

# Build

`scripts/build.js` assembles the Game Documentation into a single playable file, `build/LLM-TYCOON-MVP.md`, following the MANIFEST declared in the script.

Run `npm run build` after any documentation change. Never edit the build output directly.

---

# One Responsibility per Document

Each document should focus on a single subject.

Avoid combining unrelated concepts into the same file.

If a topic grows significantly, consider splitting it into multiple documents.

---

# Single Source of Truth

Each piece of information should have one authoritative location.

Other documents should reference the concept rather than redefining it.

This reduces duplication and prevents inconsistencies.

---

# Definitions Before Rules

Define a concept before describing its behavior.

For example:

* Define what a Company is before describing hiring.
* Define what a Model is before describing training.
* Define what a Dataset is before describing data collection.

---

# Rules Before Content

Rules describe how the simulation works.

Content provides the data that follows those rules.

Game content should not introduce new mechanics.

---

# Scenarios Use Existing Knowledge

Scenarios establish an initial Game State.

They should use existing Definitions, Rules, and Content without modifying them.

---

# Examples

Examples exist to clarify documentation.

Examples are illustrative only.

They do not define mechanics, create exceptions, or introduce new Game Data unless explicitly stated elsewhere.

---

# Consistent Terminology

Prefer the same wording for the same concept throughout the Game Documentation.

Avoid unnecessary synonyms when referring to canonical concepts.

Consistent terminology improves interpretation by both humans and language models.

---

# Natural Language

Documentation should be written in clear natural language.

Avoid software schemas, programming syntax, or implementation-specific notation unless the documentation explicitly requires it.

The Game Documentation is intended to communicate knowledge rather than source code.

---

# Progressive Detail

Introduce concepts before discussing their details.

General information should appear before specific information.

Readers should not need to understand later documents to interpret earlier ones.

---

# Maintainability

Documentation should be organized so that updates can be made in a single location whenever possible.

Prefer extending existing documentation over duplicating information across multiple files.
