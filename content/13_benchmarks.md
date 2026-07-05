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

When generating reviews for a completed Model, the Game Engine must select Reviewer 1 from this table. The Benchmark must match the Model's Task and must be available in the current in-game year. If multiple match, pick the most recent one.

| Benchmark / Metric | Available From | Applicable Tasks |
|---|---|---|
| F1-Score / Accuracy | 2013 (Start) | CLS |
| Perplexity (PPL) | 2013 (Start) | AUTO, LLM (general) |
| BLEU Score | 2013 (Start) | TRANS |
| ROUGE Score | 2013 (Start) | SUMM |
| Human Turing Test | 2013 (Start) | CHAT |
| SQuAD 1.0 | Jun 2016 | QA |
| SQuAD 2.0 | Jun 2018 | QA |
| GLUE Benchmark | May 2018 | CLS, AUTO, LLM (general) |
| SuperGLUE | Aug 2019 | CLS, AUTO, LLM (general) |
| HumanEval | Jul 2020 | CODE |

*(The other 3 reviewers in the Completion Report are generated using archetypes: an Academic source, a Tech Media outlet, and a User/Client community).*

<!--
Tiếng Việt (tóm tắt):
Bảng chuẩn đánh giá theo lịch sử thực tế.
Khi mô hình hoàn thành, Engine bắt buộc phải chọn 1 Benchmark từ bảng này
(khớp với Task và Năm hiện tại) làm người đánh giá đầu tiên. Nếu có nhiều lựa
chọn, ưu tiên cái mới nhất. 3 người đánh giá còn lại (Học thuật, Báo chí,
Cộng đồng) AI tự tạo tên.
-->
