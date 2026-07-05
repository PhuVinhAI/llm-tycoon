<!--
===============================================================================
FILE: 14_rival_models.md
MODULE: Content / Rival Models (SOTA)

Mục đích:
Lưu trữ lịch sử các mô hình AI đỉnh cao (State-of-the-Art) ngoài đời thực.

Tác dụng:
Cung cấp đối thủ cạnh tranh trên bảng xếp hạng Benchmark của màn hình S6.
Người chơi sẽ thấy rõ mô hình của mình đang đứng ở đâu so với Google, OpenAI, 
Meta, v.v. tại đúng thời điểm lịch sử đó.
===============================================================================
-->

# Historical SOTA (Rival Models)

When rendering the Benchmark comparison in the Model Completion Report (S6), the Game Engine must find the current SOTA Rival for each Benchmark. 
**Rule:** Find the most recent entry in this table for the specific Benchmark that is ≤ the current in-game Year.

| Year | Benchmark | Rival Model (Creator) | SOTA Score (/100) |
|---|---|---|---|
| 2013 | F1-Score (IMDB/Reuters) | SVM / Naive Bayes Baselines | 60 |
| 2013 | Perplexity (Penn Treebank) | KenLM (N-gram baseline) | 50 |
| 2013 | BLEU Score | Moses (Statistical MT) | 40 |
| 2014 | BLEU Score | Seq2Seq (Google) | 55 |
| 2015 | F1-Score (IMDB/Reuters) | TextCNN (Yoon Kim) | 75 |
| 2016 | BLEU Score | GNMT (Google Neural MT) | 65 |
| 2016 | SQuAD 1.0 | BiDAF (AllenAI) | 77 |
| 2017 | BLEU Score | Transformer (Google) | 75 |
| 2018 | SQuAD 2.0 | BERT (Google) | 86 |
| 2018 | GLUE Benchmark | BERT (Google) | 82 |
| 2019 | GLUE Benchmark | RoBERTa (Meta) | 88 |
| 2019 | SuperGLUE | T5 (Google) | 89 |
| 2020 | HumanEval (OpenAI) | GPT-3 (OpenAI) | 60 |
| 2020 | MMLU | GPT-3 (OpenAI) | 65 |

*(For any Benchmark not explicitly listed here at a given time, or for AI Community fillers, the Game Engine sets the Rival to "Industry Average" with a SOTA Score of `50`).*

<!--
Tiếng Việt (tóm tắt):
Danh sách các mô hình đối thủ lịch sử. Khi show điểm Benchmark, Engine tìm 
mô hình đối thủ mới nhất (tính đến năm hiện tại) của Benchmark đó để làm 
tiêu chuẩn so sánh. Nếu không có, dùng "Trung bình ngành - 50 điểm".
-->
