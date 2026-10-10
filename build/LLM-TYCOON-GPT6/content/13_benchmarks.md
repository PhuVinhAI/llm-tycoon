# Historical Benchmarks

Evaluate and show every applicable dated benchmark under `rules/08_model_projects.md`; frozen Target scores determine Q, and other tests are Expanded. Scores are normalized game indices where higher is better, never raw perplexity. Do not invent benchmarks. A Task without official tests uses `Internal QA Metric` (Domain Fit 0; rival N/A).

## 1. Official Benchmarks

| Benchmark / Dataset | Available From | Applicable Tasks | Target Domains (Domain Fit) |
|---|---|---|---|
| F1-Score (IMDB/Reuters) | 2013 | CLS | reviews, news, social |
| SST-2 (Stanford Sentiment) | 2013 | CLS | reviews, social, dialogue |
| Perplexity (Penn Treebank) | 2013 | AUTO | news, books, encyclopedic |
| BLEU Score | 2013 | TRANS | parallel |
| ROUGE Score | 2013 | SUMM | news, encyclopedic, books |
| Human Evaluation | 2013 | CHAT | dialogue, social |
| WMT14 En-De Translation | Nov 2014 | TRANS | parallel |
| SNLI (Stanford Inference) | Aug 2015 | CLS, LLM (general) | encyclopedic, news, dialogue |
| Winograd Schema (WSC) | Jul 2015 | AUTO, LLM (general) | books, encyclopedic, dialogue |
| CNN/DailyMail | Jun 2015 | SUMM | news |
| BLEU (Code domain) | Jan 2015 | CODE | code |
| LAMBADA | Jun 2016 | AUTO, LLM (general) | books |
| WikiText | Sep 2016 | AUTO, LLM (general) | encyclopedic, books |
| SQuAD 1.0 | Jun 2016 | QA | QA, encyclopedic |
| ConvAI (Conversational AI) | 2017 | CHAT | dialogue |
| PersonaChat | 2018 | CHAT | dialogue, social |
| SQuAD 2.0 | Jun 2018 | QA | QA, encyclopedic |
| GLUE Benchmark | Apr 2018 | CLS, AUTO, LLM (general) | encyclopedic, news, web-mixed |
| CoQA | Aug 2018 | QA | QA, dialogue |
| Natural Questions (NQ) | Jan 2019 | QA | QA, encyclopedic, web-mixed |
| SuperGLUE | May 2019 | CLS, AUTO, LLM (general) | encyclopedic, books, math, logic |
| HellaSwag | May 2019 | LLM (general) | social, dialogue, web-mixed |
| MMLU | Sep 2020 | LLM (general) | encyclopedic, medical, legal, math |

## 2. Public Reviewers (For Release)

When a Model is officially released (Open-source, License, or Product), build the eligible list below in displayed order, excluding sources not yet available, and index it from `0` to `N − 1`. Let `start = (Model completion ordinal + current Turn) mod N`, where the first completed Model has ordinal 1. Select four consecutive sources beginning at zero-based index `start`, wrapping to the beginning. This deterministically selects exactly **4 distinct** sources.

- **ArXiv Peer Review** (Academic perspective)
- **r/MachineLearning** (Practitioner perspective)
- **HackerNews** (Startup/Tech perspective)
- **TechCrunch / Tech Media** (Mainstream hype/fear)
- **Twitter / X AI Community** (Trend-chasing perspective)
- **Hugging Face Community** (Open-source perspective, From 2017)
