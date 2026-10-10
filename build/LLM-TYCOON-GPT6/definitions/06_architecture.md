# Architecture

---

## Definition

An Architecture is a family of model designs that a Company knows how to train.

An Architecture is granted by owning its corresponding Technology. It defines the baseline capability, computing requirement, and Baseline Data Size Quality target of Models built from it.

An Architecture is knowledge; a Model is a concrete product built from an Architecture.

---

## Attributes

An Architecture may be associated with information such as:

* Identifier (ID)
* Name
* Base Quality
* Compute requirement (TFLOPS-months)
* Minimum training months
* Baseline Dataset Size target
* Ideal focus allocation

The concrete values are defined in the Content.

---

## Relationships

* An Architecture is granted by a Technology.
* An Architecture is combined with a Task and a Dataset mixture to form a Project.
* Models are built from Architectures.
