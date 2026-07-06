<!--
===============================================================================
FILE: 12_llm_project.md
MODULE: Rules / The LLM Project

Mục đích:
Định nghĩa dự án cuối game: huấn luyện Large Language Model đầu tiên.

Tác dụng:
Đây là "trận đấu trùm" và điều kiện thắng của chương Home Lab. Cả ván chơi —
công nghệ, dữ liệu, phần cứng, tiền — hội tụ về một lần huấn luyện lớn.

Trách nhiệm:
- Định nghĩa yêu cầu khởi động, chi phí, công thức và các kết cục.
===============================================================================
-->

# The LLM Project

The LLM Project is a special Model Project: pretraining a large language model on web-scale data. All Model Project rules apply unless overridden below.

## Requirements to start

- **SCALE** technology owned (which implies PRET and the PTRF Architecture).
- A Dataset mixture (or single dataset) with **Combined Size 5** and **Combined Quality ≥ 3**.
- **Available VRAM ≥ 320 GB** (Requires massive Cloud rental).
- Committed months **M ≥ 4**, with projected compute TFLOPS/mo × M ≥ **60,000 TFLOPS-months** (staff compute reductions apply). The engine validates the projection before starting.
- **$20,000** upfront infrastructure cost, paid at start.

## Quality

- Use the PTRF row of the architectures table, but with compute requirement **60,000** TFLOPS-months.
- Task = **LLM (general)**: Match +10; Demand per the market table's LLM row.
- The Scale choice is fixed to **Frontier** (which grants a special **+25 LLM scale bonus** to the Base Points formula).

## Outcomes

| Q | Outcome |
|---|---|
| ≥ 70.0 | 🚀 The **Term Sheet** event fires (Content): accept → **+$2,000,000 and the sandbox continues** (WIN ending triggered); decline → +500 Fame and the sandbox continues. |
| 55.0–69.9 | It works, but demos underwhelm: Fame +1000, and the Model may be released normally (Model Projects rule). |
| < 55.0 | A very expensive lesson: Fame −300, RP +2000. |

- **Permanent Unlock:** Completing The LLM Project (regardless of Q) permanently unlocks the **LLM (general)** Task for standard Model Projects. The Engine must record the flag `llm_unlocked` in the Game State (and SAVE block) to track this.
- The LLM may be retried any number of times: better data cleaning, more compute, FINE/BPE technologies, and higher E-Lv all raise Q. The repeat penalty applies as usual if the same Dataset is reused.
- Name the model — this is the game's namesake moment.
