# Technologies

| ID | Technology | RP cost | Requires | Grants |
|---|---|---|---|---|
| BTP | Basic Text Processing | owned at start | — | foundation for everything |
| NGRAM | N-gram Language Model | 1000 | BTP | Architecture NGRAM |
| BOW | Bag-of-Words + Classic ML | 2000 | BTP | Architecture BOW |
| SCRAPE | Web Scraping Toolkit | 1500 | BTP | Collect action yields Size 3 |
| EMB | Word Embeddings | 4000 | BOW | Architecture EMB |
| GPUT | GPU Training | 3000 | — | neural Architectures may train |
| RNN | Recurrent Neural Networks | 5000 | EMB, GPUT | Architecture RNN |
| LSTM | LSTM / GRU | 6000 | RNN | Architecture LSTM |
| BPE | Subword Tokenization (BPE) | 4000 | EMB | +5 Q on S2S, S2SA, TRF, PTRF models |
| S2S | Sequence-to-Sequence | 7000 | LSTM | Architecture S2S |
| ATTN | Attention Mechanism | 9000 | S2S | Architecture S2SA |
| TRF | Transformer | 9000 | ATTN | Architecture TRF |
| PRET | Unsupervised Pre-training | 9500 | TRF | Architecture PTRF |
| FINE | Fine-tuning Toolkit | 5000 | PRET | PTRF minimum months −1; +5 Q on PTRF models |
| SCALE | Scaling Recipe | 8500 | PRET | unlocks The LLM Project |
