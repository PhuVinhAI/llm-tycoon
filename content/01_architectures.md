<!--
===============================================================================
FILE: 01_architectures.md
MODULE: Content / Architectures

Mục đích:
Bảng thông số của từng Architecture — đầu vào cho công thức Quality.

Tác dụng:
Thang Base Q tăng dần theo lịch sử công nghệ; yêu cầu compute tăng theo cấp
số buộc người chơi đầu tư GPU; Focus lý tưởng khác nhau tạo "meta" phải học
(n-gram nặng dữ liệu + đánh giá, neural nặng huấn luyện).
===============================================================================
-->

# Architectures

| ID | Architecture | Base Q | TFLOPS-months req | Min months | Min Dataset Size | Ideal Focus D/M/T/E |
|---|---|---|---|---|---|---|---|
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
- The LLM Project overrides PTRF's compute requirement to 4000 TFLOPS-months (Rules).

<!--
Tiếng Việt (tóm tắt):
Bảng thông số kiến trúc: Base Q (điểm nền), yêu cầu CU-month, số tháng tối
thiểu, Size dataset tối thiểu, phân bổ Focus lý tưởng (Data/Model/Training/
Eval, tổng 10). Kiến trúc yêu cầu compute 0 (NGRAM, BOW) chạy được trên PC
cũ; còn lại là neural — cần GPUT và ít nhất 1 CU. Dự án LLM nâng yêu cầu
compute của PTRF lên 40 CU-month.
-->
