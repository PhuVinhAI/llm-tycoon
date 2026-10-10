# Research Era-Aware Dilemmas

Research action and yields: `rules/01_actions.md`. Invent a short scene using the current Era Theme and the drawn Complication.

## Era Themes

Flavor only; select by the current year.

| Years | Theme | Flavor direction |
|---|---|---|
| 2013–2014 | **Foundations** | Counting frequencies, word vectors, parsing Wikipedia dumps, math proofs, CPU constraints. |
| 2015–2016 | **Neural Struggles** | RNNs, LSTMs, vanishing gradients, CUDA out-of-memory errors, early TensorFlow bugs. |
| 2017–2018 | **Attention & Scale** | Attention matrices, parallelizing across GPUs, reading ArXiv daily, PyTorch migrations. |
| 2019–2020 | **Pre-training** | Scaling laws, massive datasets, tokenization edge cases, multi-node cluster optimization. |
| 2021+ sandbox | **Scaling & Refinement** | Continue exploring pre-training, data quality, tokenization, efficiency, and already-unlocked techniques. Do not introduce real-world discoveries after December 2020. |

## Complications

Select Y with `draw_dilemma(state, 'research')`.

| Y | Complication | Choice 1 (Standard) | Choice 2 (The Trade-off) |
|---|---|---|---|
| 0 | **The Rabbit Hole** | Stick to the goal.<br>Yield: `Base RP` | Go deep into the theory.<br>Yield: `Base RP × 0.8`, `research counter +1 additional` (at R-Lv 5: replace extra counter with `Cash +$600`) |
| 1 | **The Shortcut** | Do it right.<br>Yield: `Base RP` | Skip the math, use a pre-built library.<br>Yield: `Base RP × 1.15`, `Fame −50`, `Cash −$200` |
| 2 | **Side Discovery** | Ignore it and focus.<br>Yield: `Base RP` | Publish a minor paper.<br>Yield: `Base RP × 0.6`, `Fame +150` |
| 3 | **Compute Hog** | Optimize the code first.<br>Yield: `Base RP` | Brute force it with rented cloud.<br>Yield: `Base RP × 1.4`, `Cash −$1,000` |
| 4 | **Data Epiphany** | Stick to standard parsing.<br>Yield: `Base RP` | Buy advanced scraping scripts.<br>Yield: `Base RP × 1.2`, `Cash −$300` |
| 5 | **Peer Consulting** | Ignore the emails.<br>Yield: `Base RP` | Help a peer debug their model.<br>Yield: `Base RP × 0.5`, `Cash +$1,500` |
