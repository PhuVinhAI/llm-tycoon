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

# Historical Benchmarks & AI Communities

When generating reviews for a completed Model, the Game Engine must use **ALL applicable Benchmarks** from the table below (matching the Task and available by the current in-game date).

If the total number of applicable Benchmarks is less than 4, the Engine must fill the remaining slots using entries from the **AI Communities & Platforms** list until there are exactly 4 reviews. If there are more than 4 applicable Benchmarks, display ALL of them (do not use fillers).

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

## 2. AI Communities & Platforms (Fillers)
Use these to pad the review list up to 4 if there aren't enough benchmarks:
- **ArXiv Peer Review** (Available: Always)
- **r/MachineLearning** (Available: Always)
- **HackerNews** (Available: Always)
- **Kaggle Community** (Available: Always)
- **TechCrunch / Tech Media** (Available: Always)
- **Hugging Face Community** (Available: From 2017)
- **PapersWithCode** (Available: From 2018)

<!--
Tiếng Việt (tóm tắt):
Danh sách toàn diện các Benchmark lịch sử.
Luật hiển thị: Lấy TẤT CẢ benchmark hợp lệ với Task và Năm.
- Nếu < 4: Lấy thêm các trang cộng đồng (Hugging Face, ArXiv...) đắp vào cho đủ 4.
- Nếu >= 4: Hiển thị toàn bộ, không giới hạn ở 4 dòng.
-->
