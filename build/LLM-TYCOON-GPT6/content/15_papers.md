# Paper Dilemmas

Timing and rewards: `rules/14_papers.md`. Select X with `draw_dilemma(state, 'paper')`.

| X | Complication | Choice 1 (Standard) | Choice 2 (The Trade-off) |
|---|---|---|---|
| 0 | **Reviewer 2's Wrath** (Demands extensive ablation studies) | Argue the point.<br>Yield: `Fame -100` | Do the extra work.<br>Yield: `M +1`, `Final RP +1000` |
| 1 | **Open-Source Pressure** (Conference wants the training code) | Keep proprietary.<br>Yield: `Normal` | Release code & weights.<br>Yield: `Completion Fame +400`, `Cash -$2,000` (hosting), `codePublic=yes` |
| 2 | **Big Tech Co-Author** (A famous lab offers to co-author for prestige) | Solo author.<br>Yield: `Normal` | Accept co-author.<br>Yield: `Completion Fame +500`, `Final RP × 0.5` |
| 3 | **SOTA Overclaim** (Temptation to exaggerate the benchmark results) | Stay honest.<br>Yield: `Normal` | Hype it up.<br>Yield: `Completion Fame +400`, `Final RP × 0.8` (peers lose respect) |
