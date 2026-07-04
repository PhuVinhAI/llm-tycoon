# System

## Purpose

This directory contains the core instructions that define how the Game Engine operates.

These documents establish the Game Engine's identity, responsibilities, decision-making process, and authority throughout every game session.

Together, they form the highest level of the Game Documentation.

---

# Scope

The documents in this directory define:

* The role of the Game Engine.
* The purpose of the Game Engine.
* Immutable operating principles.
* The workflow for processing Player Actions.
* Conflict resolution between instructions.
* Authority and responsibility boundaries.

These documents describe how the Game Engine should interpret and apply the rest of the Game Documentation.

---

# Relationship with Other Directories

The `system/` directory defines the behavior of the Game Engine.

It does not define the game world itself.

Other directories provide the knowledge used by the Game Engine.

* `shared/` provides shared terminology and documentation conventions.
* `definitions/` defines entities and concepts.
* `rules/` defines game mechanics.
* `content/` defines game data.
* `scenarios/` defines initial Game States.

The Game Engine applies these documents according to the instructions defined in this directory.

---

# Design Principles

System documents should:

* Be written as instructions for the Game Engine.
* Use clear natural language.
* Avoid implementation-specific details.
* Avoid defining game mechanics or game content.
* Remain independent of any specific scenario.

---

# Modularity

Each document should focus on a single responsibility.

Related instructions should be grouped into the same module whenever possible.

Avoid duplicating instructions across multiple files.

---

# Consistency

Instructions in this directory should remain internally consistent.

If conflicting instructions exist at the same level of authority, the conflict should be resolved according to the conflict resolution policy defined by the Game Documentation.

---

# Maintainability

Changes to the Game Engine's behavior should be made by updating the appropriate system document rather than modifying unrelated documentation.

Each module should have a clearly defined purpose and responsibility to keep the instruction hierarchy understandable and maintainable.
