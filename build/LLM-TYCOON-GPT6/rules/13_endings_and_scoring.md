# Endings and Scoring

## Endings

- WIN: accept qualifying LLM Term Sheet. Freeze campaign result after release choice; sandbox continues.
- Burned Out: month-end Cash <−$5,000. Score 0, run ends. Preserve any previous campaign WIN in history while reporting sandbox bankruptcy separately.

## Score

Use campaign_score(state). Investment is not operating earnings:

~~~
3 × Fame
+ 100 × Best Model Q
+ 400 × min(10, distinct model setups + completed contracts)
+ 100 × min(50, floor(max(0, Cash −capitalRaised) / 1000))
+ 4000 if WIN
+ max(0, 6000 −75 × (Turn −1)) if WIN
+ 1000 if an LLM was released during 2019
~~~

Distinct setups follow Model Projects equivalence; names/IDs/repeats cannot farm this component. capitalRaised includes Angel/Term Sheet, not initial savings. Half-up final total. Bankruptcy scores 0.

Store first-win date/turn/score/title/achievements in ending.lastResult after release choice. Do not update during sandbox or award investment again. Show epilogue, total and Content title; hide breakdown.
