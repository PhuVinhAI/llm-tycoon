# Project

---

## Definition

A Project is a multi-month commitment by a Company to build a Model.

A Project is declared with a fixed plan: an Architecture, a Scale, an optional inherited Model, a Task, a Dataset mixture of 1 to 3 Datasets, a number of months, and a focus allocation. Once started, the committed months fill the Company's main activity until the Project completes or is cancelled.

The special endgame effort to train the first Large Language Model is also a Project, with additional requirements defined by the Rules.

---

## Attributes

A Project may be associated with information such as:

* Model name
* Architecture
* Scale
* Optional inherited Model
* Task
* Dataset mixture (1 to 3 Datasets)
* Committed months and months elapsed
* Focus allocation (Data / Model / Training / Eval)
* Compute accumulated (TFLOPS-months)
* Whether the one-time midpoint Dilemma evaluation is done

---

## Relationships

* A Project is conducted by a Company.
* A Project consumes months and compute.
* A completed Project produces exactly one Model.
* A cancelled Project produces nothing.
* An active Project is part of the Game State and is stored in the Canonical Save File.
