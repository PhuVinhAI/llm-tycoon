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
| LLM (general) | Large Language Model | General purpose text generation |

## Architecture × Task match matrix

Values: +10 perfect · +5 good · 0 weak · −10 poor.

| | CLS | AUTO | TRANS | CHAT | SUMM | QA | CODE | LLM (general) |
|---|---|---|---|---|---|---|---|---|
| **NGRAM** | 0 | +10 | −10 | −10 | −10 | −10 | +5 | −10 |
| **BOW** | +10 | −10 | −10 | −10 | 0 | 0 | −10 | −10 |
| **EMB** | +10 | 0 | −10 | 0 | 0 | +5 | −10 | −10 |
| **RNN** | +5 | +10 | 0 | 0 | 0 | 0 | +5 | −10 |
| **LSTM** | +5 | +10 | +5 | +5 | +5 | +5 | +5 | −10 |
| **S2S** | 0 | +5 | +10 | +5 | +5 | 0 | 0 | −10 |
| **S2SA** | 0 | +5 | +10 | +10 | +10 | +5 | +5 | −10 |
| **TRF** | +5 | +10 | +10 | +5 | +5 | +5 | +10 | +5 |
| **PTRF** | +10 | +10 | +10 | +10 | +10 | +10 | +10 | +10 |

Task availability and domain-fit calculations: `rules/08_model_projects.md`. Target domains: `content/13_benchmarks.md`.
