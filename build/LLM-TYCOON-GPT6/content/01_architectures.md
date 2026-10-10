# Architectures

| ID | Architecture | Base Q | TFLOPS-months req | Min months | Baseline Data Size | Ideal Focus D/M/T/E |
|---|---|---|---|---|---|---|
| NGRAM | N-gram LM | 15 | 0 | 1 | 1 | 4/2/1/3 |
| BOW | Bag-of-Words + Classic ML | 20 | 0 | 1 | 1 | 4/3/1/2 |
| EMB | Embedding-based | 18 | 100 | 1 | 2 | 3/3/2/2 |
| RNN | Recurrent NN | 22 | 200 | 2 | 2 | 2/3/3/2 |
| LSTM | LSTM / GRU | 26 | 400 | 2 | 2 | 2/3/3/2 |
| S2S | Seq2Seq | 30 | 800 | 2 | 3 | 2/3/4/1 |
| S2SA | Seq2Seq + Attention | 38 | 1200 | 3 | 3 | 2/3/3/2 |
| TRF | Transformer | 45 | 2000 | 3 | 3 | 2/2/4/2 |
| PTRF | Pretrained Transformer | 55 | 3000 | 4 | 5 | 3/2/4/1 |

- Architectures with TFLOPS-months req 0 train on the starting desktop PC; all others are neural (GPUT + TFLOPS ≥ 100 required).
- `Baseline Data Size` is a Quality target, not a hard start Requirement. Falling below it forfeits the +5 Base Points bonus; Scale Ideal Data Size may separately cause Data Starvation.
- The LLM Project uses a special final pre-modifier compute requirement of 60,000 TFLOPS-months instead of applying Frontier ×20 to PTRF a second time (Rules).
