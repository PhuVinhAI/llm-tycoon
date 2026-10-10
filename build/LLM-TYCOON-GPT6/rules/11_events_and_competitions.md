# Events and Competitions

## Firing events & Historical News

- In the Events step of every month, the Engine fires events from two sources:
  1. **The Event Calendar (Content):** Fire entries matching the current month, plus threshold events (Fame, releases), and Dynamic Press Coverage (M1-M6) if their conditions are met. Track these as flags in the Game State so they fire exactly once. Apply their mechanical effects.
  2. **Auto-generated Historical News:** The Engine monitors the **Historical Benchmarks** and **Historical SOTA (Rival Models)** tables. If the current in-game Month and Year exactly matches the release date of a Benchmark or SOTA model (if only a Year is listed, assume January), the Engine automatically fires a News Event for it. (These have no mechanical effects unless they also appear in the Event Calendar).
  3. **The Rumor Mill (Market Intelligence):** If the current in-game date is exactly **3 months before** a Rival Model's release date (from the Historical SOTA table), automatically fire a Rumor News Event. The Engine maps the Rival's Benchmark to its corresponding Task, then uses Creative License to write a rumor (e.g., "Leaks suggest Google is working on a massive Translation model, expected in 3 months").
- Events with a Player choice pause any batch and wait for the answer.
- Never foreshadow events (Output Discipline).

## Lasting effects

- Some events change the world permanently or for a stated period: research discounts, demand overrides, income multipliers, paradigm shifts. Apply them from the moment they fire until their stated end (or forever if none), and record them as flags.

## Competitions

- A competition event opens a **3-month submission window** (the firing month and the two after).
- **Submitting** is an instant action. Eligible Model: matches the required Task, was completed within the last 12 months, and has not been submitted to this competition before.
- If the Model's Q ≥ the threshold: win the listed prize immediately. Otherwise nothing happens, but the engine reveals the threshold.
- Each competition can be won once; multiple different Models may be submitted within the window until it is won or the window closes.
