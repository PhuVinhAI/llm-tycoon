# Player

---

## Definition

A Player is the participant who interacts with the Game Engine to play the game.

The Player provides Player Actions that allow the game to progress.

The Player exists outside the game world and is not considered part of the simulation.

---

## Attributes

A Player may be associated with information such as:

* Identity
* Controlled entities
* Current progress
* Available Player Actions

The Game Documentation determines which information is relevant to the game.

---

## Relationships

A Player may:

* control one or more Companies
* perform Player Actions
* receive Outcomes from the Game Engine
* influence the Game State through valid Player Actions

A Player does not directly modify the Game Documentation.
