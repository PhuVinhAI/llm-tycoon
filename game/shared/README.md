# Shared

## Purpose

This directory contains documentation shared across the entire Game Documentation.

Its purpose is to provide common terminology, writing conventions, and other reference material that supports consistency throughout the project.

The documents in this directory are intended to be referenced by all other directories.

---

# Scope

Shared documentation may include:

* Canonical terminology.
* Documentation conventions.
* Common reference material.
* Project-wide documentation standards.

These documents establish a common understanding without defining game mechanics or game content.

---

# Relationship with Other Directories

The `shared/` directory supports every other part of the Game Documentation.

* `system/` uses shared terminology when defining Game Engine behavior.
* `definitions/` uses shared terminology when describing entities.
* `rules/` uses shared terminology when describing game mechanics.
* `content/` uses shared terminology when describing the game world.
* `scenarios/` uses shared terminology when defining initial Game States.

Shared documentation should not duplicate information owned by other directories.

---

# Single Source of Truth

Common concepts and project-wide conventions should be documented only once.

Other documents should reference shared documentation instead of redefining the same information.

This promotes consistency and simplifies maintenance.

---

# Independence

Shared documentation should remain independent of game mechanics, game content, and individual scenarios.

Its purpose is to support the interpretation of the Game Documentation rather than define the game itself.

---

# Maintainability

Documents in this directory should be stable and broadly applicable.

Project-wide terminology and conventions should be updated here whenever possible instead of being repeated throughout the Game Documentation.
