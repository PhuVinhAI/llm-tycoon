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
**Rule:** Find the most recent entry in this table for the specific Benchmark where the `Date` is ≤ the current in-game Month and Year.

| Date | Benchmark | Rival Model (Creator) | SOTA Score (/100) |
|---|---|---|---|
| Jan 2013 | F1-Score (IMDB/Reuters) | SVM / Naive Bayes Baselines | 60.0 |
| Jan 2013 | SST-2 (Stanford Sentiment) | RNTN (Stanford) | 85.0 |
| Jan 2013 | Perplexity (Penn Treebank) | KenLM (N-gram baseline) | 50.0 |
| Jan 2013 | BLEU Score | Moses (Statistical MT) | 40.0 |
| Jan 2013 | ROUGE Score | LexRank Baseline | 45.0 |
| Jan 2013 | Human Evaluation | Cleverbot / ALICE | 40.0 |
| Sep 2013 | Perplexity (Penn Treebank) | word2vec + RNN (Mikolov) | 65.0 |
| Sep 2014 | WMT14 En-De Translation | Seq2Seq (Google) | 55.0 |
| Jan 2015 | BLEU (Code domain) | Statistical AST Baselines | 45.0 |
| Jun 2015 | CNN/DailyMail | Attentive Reader (DeepMind) | 61.6 |
| Jul 2015 | Winograd Schema (WSC) | Statistical Co-occurrence | 52.0 |
| Aug 2015 | F1-Score (IMDB/Reuters) | TextCNN (Yoon Kim) | 75.0 |
| Aug 2015 | SNLI (Stanford Inference) | LSTM Baseline (NYU) | 77.0 |
| Mar 2016 | SNLI (Stanford Inference) | Decomposable Attention (Google) | 86.0 |
| Jun 2016 | SQuAD 1.0 | Logistic Regression Baseline | 51.0 |
| Jun 2016 | LAMBADA | Word CNN | 55.0 |
| Sep 2016 | WikiText | AWD-LSTM (Salesforce) | 68.0 |
| Nov 2016 | SQuAD 1.0 | BiDAF (AllenAI) | 77.0 |
| Nov 2016 | WMT14 En-De Translation | GNMT (Google Neural MT) | 65.0 |
| Jan 2017 | ConvAI (Conversational AI) | ParlAI Baselines (Meta) | 60.0 |
| Apr 2017 | CNN/DailyMail | Pointer-Generator (Stanford) | 72.0 |
| Jun 2017 | WMT14 En-De Translation | Transformer (Google) | 75.0 |
| Jan 2018 | PersonaChat | Key-Value Profile Net (Meta) | 65.0 |
| Feb 2018 | SNLI (Stanford Inference) | ELMo (AllenAI) | 89.1 |
| Apr 2018 | GLUE Benchmark | BiLSTM + ELMo | 70.2 |
| Jun 2018 | SQuAD 2.0 | No-Answer Baseline | 66.0 |
| Jun 2018 | WikiText | GPT-1 (OpenAI) | 75.3 |
| Jun 2018 | LAMBADA | GPT-1 (OpenAI) | 60.2 |
| Aug 2018 | CoQA | DrQA + features (Stanford) | 71.6 |
| Oct 2018 | SQuAD 2.0 | BERT (Google) | 83.5 |
| Oct 2018 | GLUE Benchmark | BERT (Google) | 82.3 |
| Jan 2019 | Natural Questions (NQ) | BERT-QA (Google) | 81.4 |
| Jan 2019 | PersonaChat | TransferTransfo (HuggingFace) | 82.0 |
| Feb 2019 | WikiText | GPT-2 (OpenAI) | 82.4 |
| Feb 2019 | LAMBADA | GPT-2 (OpenAI) | 75.3 |
| May 2019 | HellaSwag | BERT (Google) | 47.3 |
| May 2019 | SuperGLUE | RoBERTa (Meta) | 84.1 |
| Jul 2019 | GLUE Benchmark | RoBERTa (Meta) | 88.2 |
| Oct 2019 | SuperGLUE | T5 (Google) | 88.9 |
| Oct 2019 | CNN/DailyMail | BART (Meta) | 42.9 |
| Jan 2020 | Human Evaluation | Meena (Google) | 80.0 |
| May 2020 | HellaSwag | GPT-3 (OpenAI) | 85.1 |
| May 2020 | LAMBADA | GPT-3 (OpenAI) | 86.2 |
| Sep 2020 | MMLU | GPT-3 175B (OpenAI) | 44.0 |
| Oct 2020 | Human Evaluation | BlenderBot (Meta) | 85.1 |

*(For any Benchmark not explicitly listed here at a given time, or for AI Community fillers, the Game Engine sets the Rival to "Industry Average" with a SOTA Score of `50.0`).*

<!--
Tiếng Việt (tóm tắt):
Danh sách các mô hình đối thủ lịch sử. Khi show điểm Benchmark, Engine tìm 
mô hình đối thủ mới nhất (tính đến năm hiện tại) của Benchmark đó để làm 
tiêu chuẩn so sánh. Nếu không có, dùng "Trung bình ngành - 50 điểm".
-->
