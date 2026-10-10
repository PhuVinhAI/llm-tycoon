# Events and Competitions

## Firing events & Historical News

Every main action, including Continue, forced Freelance and fine-tuning, begins with begin_month(state, action). Python queries **all three canonical tables** for the resolving date, independent of action:

1. Calendar dated rows in `content/08_events_calendar.md`, plus unfired Fame/press milestones.
2. Benchmark introductions in `content/13_benchmarks.md` and rival releases in `content/14_rival_models.md`.
3. Rival rumors exactly three months before release. Only scheduled rumors authorize public forecasts.

Year-only dates mean January. Each item has a stable ID and source row. Every item becomes a persisted news card, even without an effect. Preserve its data headline/subject; translate and explain it, never replace it with unrelated generated news. Same rival name/date can cover multiple benchmarks in one card.

Call due_events(state) after every mutation that could satisfy a threshold/release condition. Apply each effect once; mark ID in world.firedEvents **and** retain its card in the outbox. A fired flag means mechanics resolved, not that the player saw the news. Benchmark/rival/rumor news still must be marked and shown.

Queue cards before leaving Events. Emit every new card **before a dilemma or month report**, showing effects. Only after emitting full text call `acknowledge_news(state, {news_id: exact_emitted_text})`. Context reset/import resumes unshown cards before another action. Never acknowledge silently or discard the outbox.

The helper rejects leaving Events or ending a month if due sources are missing, effects unmarked, or queued news unacknowledged. Python cannot inspect the host's screen; GPT acknowledges only text actually emitted. Resolve listed IDs and retry instead of bypassing checks.

Choices pause the month. A displayed unresolved event-choice card may be acknowledged, but its effect remains unapplied until resolved. Term Sheet is evaluated in LLM completion, recurs on a later qualifying LLM after decline, and grants investment/WIN at most once. All other milestones fire once.

For an event choice triggered after Events, persist pendingChoice.eventId and its exact resume phase; do not rerun earlier phases. Defer the next completion/release choice in flow.draft until this event choice resolves. Checkpoint guards permit this one displayed unresolved source while waiting; finishing the month still requires its resolved effect.

## Lasting effects

Store discounts, demand changes and price modifiers with inclusive dates. Prices apply to releases while active, not already quoted streams. Investment increases Cash and counters.capitalRaised; campaign scoring excludes it.

## Competitions

Window: firing month plus two. Instant submission: task fits, completion in last 12 months, no prior submission of this model to this competition. Evaluate frozen target Q. Award Content prize once; otherwise reveal threshold. Store submissions, never reroll or duplicate awards.
