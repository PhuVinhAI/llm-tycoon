# Contract

---

## Definition

A Contract is a one-time client job: the client specifies requirements, the Company commits months of work, and the client pays a fixed amount on completion.

Contracts trade time for reliable money and modest Fame. They become available as the Company's Fame grows and time progresses.

---

## Attributes

A Contract may be associated with information such as:

* Identifier (ID)
* Client and job description
* Fame and Date thresholds
* Requirements (Technologies, Datasets)
* Committed months and months elapsed
* Payment (and modifiers)
* Bonus condition

The concrete values are defined in the Content.

---

## Relationships

* A Contract is offered to a Company when its Fame threshold is reached.
* An accepted Contract consumes committed months as the main activity.
* A completed Contract yields Cash and Fame.
* Each Contract may be completed at most once.
