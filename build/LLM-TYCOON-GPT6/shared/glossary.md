# Glossary

---

## Game Documentation

The complete collection of official documentation that defines the game.

This includes system instructions, definitions, rules, content, scenarios, and any other official documents.

---

## Game State

The complete state of the current game session at a specific point in time.

---

## Player Action

Any action requested or performed by the player.

---

## Outcome

The final result produced after resolving a player action.

---

## Requirement

A condition that must be satisfied before an action can be executed.

---

## Event

A predefined occurrence that is triggered when its conditions are satisfied.

---

## Game Data

Any official information defined within the game documentation.

---

## Turn

One step of the game. In LLM Tycoon, one Turn equals one in-game month.

---

## RP (Research Points)

The resource earned through research and spent to unlock Technologies.

---

## Fame (Danh tiếng)

The Company's public standing, ranging from 0 to 5000. Fame gates contracts, hires, and investor interest.

---

## TFLOPS (TeraFLOPS)

The measure of computing power. Hardware provides TFLOPS per month; training consumes TFLOPS-months.

---

## Quality (Q)

The overall score of a completed Model, from 0.0 to 100.0, computed by the Rules.

---

## Domain

The subject area of a Dataset (news, social, dialogue, reviews, code, encyclopedic, parallel, QA, web-mixed, medical, legal, math, books, logic).

---

## Demand

The market multiplier of a Task in a given era. Demand scales the money earned from selling models.

---

## Income Stream

Recurring monthly income owned by the Company, with a fixed amount and an expiry.

---

## Competition

A time-limited challenge opened by an Event. Qualifying models win fixed prizes.

---

## Canonical Save File

The complete current Game State stored in `runtime/state/save.json`. Python loads it before an action and commits validated changes atomically. Chat memory is not a substitute.

---

## Event Log

Structured committed transitions in `runtime/state/events.jsonl`, used for action deduplication and accurate history. Partial choices and full month completion are distinct entries.

---

## Save Export

A downloadable JSON state or portable ZIP containing the state and available Event Log. Use it to resume in another chat with the game package.

---

## View ID

A stable screen identity such as S3 (Dashboard) or S10 (Dilemma), stored with its context in the Game State. Its layout adapts to the current surface.

---

## Intelligent UI

The host's supported interactive presentation of the game: cards, tables, charts, forms and controls. A control must submit a real action to the Python transaction flow; otherwise offer numbered choices and natural-language input.

---

## Flavor

Narrative content with zero mechanical effect. Flavor may be freely invented within the Creative License; it can never change the Game State.
