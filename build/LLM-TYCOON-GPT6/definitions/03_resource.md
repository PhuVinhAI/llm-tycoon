# Resource

---

## Definition

A Resource is a quantifiable asset owned by a Company. LLM Tycoon uses four kinds of Resources:

* **Cash** — money, measured in US dollars. Used for purchases, salaries, and fixed costs.
* **RP (Research Points)** — accumulated research insight. Spent to unlock Technologies. RP is a single pool and can be banked without limit.
* **Fame (Danh tiếng)** — the Company's public standing, an integer from 0 to 5000. Fame is never spent; it gates opportunities.
* **Income Stream** — recurring monthly Cash income with a fixed monthly amount, remaining months, and the original Model's Task and Q (used to generate User Logs upon expiry).

---

## Attributes

* Cash: current balance (may be negative within the limits defined by the Rules).
* RP: current balance (never negative).
* Fame: current value (0–5000).
* Income Stream: source name, amount per month, months remaining, original Task, original Q, and reserved Inference VRAM.

---

## Relationships

* Resources belong to exactly one Company.
* Player Actions, Events, and Income Streams change Resources only as permitted by the Rules.
* Resources are part of the Game State and are stored in the Canonical Save File.
