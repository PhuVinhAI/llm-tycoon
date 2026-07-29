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
- Committed months **M ≥ 4**, with projected compute `TFLOPS/mo × M` meeting the adjusted LLM compute requirement defined below. The LLM's `M ≥ 4` overrides all minimum-month reductions. The engine validates the projection before starting.
- **$20,000** upfront infrastructure cost, paid at start.

## Quality

- Use the PTRF row, but set the LLM's compute requirement to **60,000 TFLOPS-months before Data Mixture, Inherit, and Employee multipliers**. This replaces the normal `PTRF requirement × Frontier scale multiplier`; do **not** multiply 60,000 by Frontier ×20 again. Apply the usual Data Mixture multiplier, optional Inherit ×0.5, and all Employee compute multipliers, then round the final requirement up to a whole TFLOPS-month.
- Task = **LLM (general)**: Match +10; Demand per the market table's LLM row.
- The Scale choice is fixed to **Frontier** (which grants a special **+25 LLM scale bonus** to the Base Points formula).

## Outcomes

| Q | Outcome |
|---|---|
| ≥ 70.0 | 🚀 The **Term Sheet** event fires (Content): accept → **+$2,000,000 and the sandbox continues** (WIN ending triggered); decline → +500 Fame and the sandbox continues. |
| 55.0–69.9 | It works, but demos underwhelm: Fame +1000, and the Model may be released normally (Model Projects rule). |
| < 55.0 | A very expensive lesson: Fame −300, RP +2000. |

- **Permanent Unlock:** Completing The LLM Project (regardless of Q) permanently unlocks the **LLM (general)** Task for standard Model Projects. The Engine must record the flag `llm_unlocked` in the Game State (and SAVE block) to track this.
- After resolving the outcome table (including the Term Sheet choice at Q ≥ 70), finish normal Model completion and present the legal Release choices. The Term Sheet does not itself release the LLM.
- The LLM may be retried any number of times: better data cleaning, more compute, FINE/BPE technologies, and higher E-Lv all raise Q. The repeat penalty applies as usual to the same Architecture + Task + unordered Dataset mixture.
- Name the model — this is the game's namesake moment.
