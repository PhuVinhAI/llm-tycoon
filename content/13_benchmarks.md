<!--
===============================================================================
FILE: 13_benchmarks.md
MODULE: Content / Benchmarks

Mục đích:
Danh sách các chuẩn đánh giá (Benchmarks) lịch sử có thật trong ngành AI.

Tác dụng:
Cung cấp dữ liệu cứng cho hệ thống Review ở cuối mỗi dự án. AI bắt buộc phải
chọn Benchmark từ bảng này dựa trên Task và Năm hiện tại, thay vì tự bịa ra
để tránh sai lệch lịch sử.
===============================================================================
-->

# Historical Benchmarks

When generating the Local Evaluation for a completed Model, the Game Engine must use **ALL applicable Benchmarks** from the table below (matching the Task and available by the current in-game date).

Do not pad or fill the list. Show exactly as many Benchmarks as are available. (If 0 Benchmarks exist for a Task at the current date, use a single "Internal QA Metric" to calculate Q).

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
| SNLI (Stanford Inference) | May 2015 | CLS, LLM (general) | encyclopedic, news, dialogue |
| Winograd Schema (WSC) | Jul 2015 | AUTO, LLM (general) | books, encyclopedic, dialogue |
| CNN/DailyMail | Jun 2015 | SUMM | news |
| BLEU (Code domain) | Jan 2015 | CODE | code |
| WikiText | Sep 2016 | AUTO, LLM (general) | encyclopedic, books |
| LAMBADA | Oct 2016 | AUTO, LLM (general) | books |
| SQuAD 1.0 | Jun 2016 | QA | QA, encyclopedic |
| ConvAI (Conversational AI) | 2017 | CHAT | dialogue |
| PersonaChat | 2018 | CHAT | dialogue, social |
| SQuAD 2.0 | Jun 2018 | QA | QA, encyclopedic |
| CoQA | Aug 2018 | QA | QA, dialogue |
| GLUE Benchmark | May 2018 | CLS, AUTO, LLM (general) | encyclopedic, news, web-mixed |
| Natural Questions (NQ) | Jan 2019 | QA | QA, encyclopedic, web-mixed |
| HellaSwag | May 2019 | LLM (general) | social, dialogue, web-mixed |
| SuperGLUE | Aug 2019 | CLS, AUTO, LLM (general) | encyclopedic, books, math, logic |
| HumanEval (OpenAI) | Jul 2020 | CODE, LLM (general) | code |
| MBPP (Google) | Aug 2020 | CODE | code, math |
| MMLU | Sep 2020 | LLM (general) | encyclopedic, medical, legal, math |

## 2. Public Reviewers (For Release)
When a Model is officially released (Open-source, License, or Product), the Game Engine must deterministically select exactly **4** of these sources (based on the Model's ID or current Date) to generate the Public Reception reviews (S6-B).
- **ArXiv Peer Review** (Academic perspective)
- **r/MachineLearning** (Practitioner perspective)
- **HackerNews** (Startup/Tech perspective)
- **TechCrunch / Tech Media** (Mainstream hype/fear)
- **Twitter / X AI Community** (Trend-chasing perspective)
- **Hugging Face Community** (Open-source perspective, From 2017)
