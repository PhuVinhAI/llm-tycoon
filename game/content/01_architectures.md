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

Project requirements and Quality: `rules/08_model_projects.md`. Special LLM overrides: `rules/12_llm_project.md`.
