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

Information should only appear in the directory responsible for that information.

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
