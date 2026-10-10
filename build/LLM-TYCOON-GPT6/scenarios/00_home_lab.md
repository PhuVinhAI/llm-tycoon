# Scenario: Home Lab

## Initial Game State

The machine-readable initial state is `scenarios/00_home_lab.json`. Use the runtime helper's `new_state(player, company, language)` to copy that template, fill names and language, allocate a run ID, and validate. Commit it once as `new_game`; loading the package alone does not start a run. The table below describes that same scenario.

| Field | Value |
|---|---|
| Date | January 2013 (Turn 1) |
| Cash | $10,000 |
| RP / Fame | 0 / 0 |
| Skills | R-Lv 1, E-Lv 1 (counters: research 0, models 0) |
| Technologies | BTP |
| Hardware | old desktop PC (0 TFLOPS, occupies no slot); 4 empty slots; not rewired |
| Team | solo |
| Datasets | "Old blog scrape" (web-mixed, Size 1, Quality 2) |
| Models / Streams / Contracts | none |
| Active project | none |
| Flags | none |

## Opening narration (theme — the engine may embellish; facts are fixed)

January 2013. You've quit your job. The spare room of your tiny rented apartment is now a **home lab**: one desk, a secondhand desktop, a corkboard of printed papers, and a whiteboard with a single sentence on it: **"One day, machines will truly understand language."**

You have $10,000 in savings, an internet connection, and a hunch that the deep learning wave rippling out of image recognition is about to hit language — hard. Your only asset is your knowledge of **Basic Text Processing (BTP)** — the old-school art of writing regex rules, counting word frequencies, and cleaning messy text. It is primitive, but it is a foundation. Nobody has heard of you yet. That part is temporary.
