<!--
===============================================================================
FILE: 02_tasks_and_matching.md
MODULE: Content / Tasks and Matching

Mục đích:
Danh sách Task, ma trận độ hợp Architecture × Task, và danh sách domain hợp
với từng Task.

Tác dụng:
Tương đương bảng Topic×Genre của Game Dev Tycoon — phần "kiến thức phải
khám phá" của game. Giá trị dựa trên trực giác NLP thật: n-gram gợi ý từ
tốt nhưng dịch thuật thì vô vọng; seq2seq sinh ra để dịch; pretrained
transformer giỏi mọi thứ.
===============================================================================
-->

# Tasks and Matching

## Tasks

| ID | Task | Description |
|---|---|---|
| CLS | Classification | Spam filtering, sentiment, tagging, moderation |
| AUTO | Autocomplete | Next-word prediction, smart keyboards |
| TRANS | Translation | Machine translation between languages |
| CHAT | Chatbot | Conversational agents |
| SUMM | Summarization | Condensing documents |
| QA | Question Answering | Answering questions over text |
| CODE | Code Completion | Suggesting source code |

(The LLM Project uses the special task **LLM (general)** — Rules.)

## Architecture × Task match matrix

Values: +10 perfect · +5 good · 0 weak · −10 poor.

| | CLS | AUTO | TRANS | CHAT | SUMM | QA | CODE |
|---|---|---|---|---|---|---|---|
| **NGRAM** | 0 | +10 | −10 | −10 | −10 | −10 | +5 |
| **BOW** | +10 | −10 | −10 | −10 | 0 | 0 | −10 |
| **EMB** | +10 | 0 | −10 | 0 | 0 | +5 | −10 |
| **RNN** | +5 | +10 | 0 | 0 | 0 | 0 | +5 |
| **LSTM** | +5 | +10 | +5 | +5 | +5 | +5 | +5 |
| **S2S** | 0 | +5 | +10 | +5 | +5 | 0 | 0 |
| **S2SA** | 0 | +5 | +10 | +10 | +10 | +5 | +5 |
| **TRF** | +5 | +10 | +10 | +5 | +5 | +5 | +10 |
| **PTRF** | +10 | +10 | +10 | +10 | +10 | +10 | +10 |

## Domain fit lists (Refer to the Datasets rule for exact matching mechanics)

| Task | Fit Domains |
|---|---|
| CLS | reviews, social, news |
| AUTO | web-mixed, news, social, encyclopedic |
| TRANS | parallel (only) |
| CHAT | dialogue, social |
| SUMM | news, encyclopedic |
| QA | QA, encyclopedic |
| CODE | code (only) |

<!--
Tiếng Việt (tóm tắt):
7 Task: phân loại (CLS), gợi ý từ (AUTO), dịch (TRANS), chatbot (CHAT), tóm
tắt (SUMM), hỏi–đáp (QA), gợi ý code (CODE). Dự án LLM dùng task đặc biệt
"LLM (general)".

Ma trận Architecture × Task: +10 hoàn hảo / +5 tốt / 0 yếu / −10 tệ — dựa
trên trực giác NLP thật (n-gram giỏi gợi ý từ, BOW giỏi phân loại, seq2seq
sinh ra để dịch, transformer giỏi gần như mọi thứ, pretrained +10 tất cả).

Danh sách domain hợp từng Task (+3 khi khớp; web-mixed = 0 trừ AUTO +3 và
TRANS −3; lệch hoàn toàn −3).
-->
