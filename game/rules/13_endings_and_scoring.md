<!--
===============================================================================
FILE: 13_endings_and_scoring.md
MODULE: Rules / Endings and Scoring

Mục đích:
Định nghĩa các kết cục của game và công thức tính điểm.

Tác dụng:
Khép ván chơi lại bằng một màn tổng kết có điểm số và danh hiệu — tạo lý do
chơi lại để phá kỷ lục.

Trách nhiệm:
- Định nghĩa 3 kết cục.
- Định nghĩa công thức điểm (duy nhất tại đây).
- Không định nghĩa bảng danh hiệu (nằm ở content/).
===============================================================================
-->

# Endings and Scoring

## Endings

| Ending | Trigger |
|---|---|
| 🏆 **From Home Lab to Headquarters** (WIN) | Accept the Term Sheet upon completing an LLM with Q ≥ 70. The game continues in sandbox mode. |
| 💀 **Burned Out** | Bankruptcy: cash < −$5,000 (Economy rule). Score = 0. |

## Score

```
Score = 3 × Fame
      + 100 × Best Model Q
      + 500 × (completed Projects + completed Contracts)
      + 100 × floor(Cash ÷ $1,000)
      + WIN only: 4000
      + LLM released during 2019: +1000 (perfect timing)
```

Present the ending as a short narrated epilogue, then the final total score, then the title from the Content's titles table. Do not show the score breakdown.

<!--
Tiếng Việt (tóm tắt):
Hai kết cục: THẮNG "From Home Lab to Headquarters" (nhận Term Sheet sau LLM
Q ≥ 70; sau màn tổng kết vẫn tiếp tục sandbox) và "Burned Out" (phá sản,
điểm = 0). Không có kết cục bắt buộc ở 12/2020.

Điểm = 3×Fame + 100×Q của model tốt nhất + 500×số dự án/hợp đồng hoàn thành
+ 100×⌊Cash/1000⌋ + (chỉ khi THẮNG: 4000)
+ (+1000 nếu phát hành LLM trong năm 2019 — đúng thời điểm vàng).

Trình bày kết cục: đoạn kết ngắn có kể chuyện → tổng điểm cuối cùng → danh
hiệu theo bảng trong Content. Không hiển thị bảng phân rã điểm.
-->
