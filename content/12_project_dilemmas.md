<!--
===============================================================================
FILE: 12_project_dilemmas.md
MODULE: Content / Project Dilemmas

Mục đích:
Ma trận sự kiện phát sinh giữa dự án dựa trên điểm Synergy (độ hợp lý của setup).

Tác dụng:
Phạt người chơi nếu setup dự án bừa bãi (Synergy thấp) và thưởng nếu setup
hoàn hảo (Synergy cao). Tạo ra các quyết định đánh đổi (Trade-off) giữa Quality
và Thời gian.
===============================================================================
-->

# Project Dilemmas

Triggered mid-project based on the Synergy score (see Model Projects rule).

## Breakthrough (Synergy ≥ 16)
Flavor direction determined by `Turn % 4`:
| X | Flavor direction |
|---|---|
| 0 | **Loss dropping beautifully** (Math is perfectly aligned, gradients flow smoothly). |
| 1 | **Emergent property** (The model is learning unexpected, high-level patterns early). |
| 2 | **Compute efficiency** (Training is running much faster and cooler than expected). |
| 3 | **Data harmony** (The dataset structure fits the architecture's assumptions perfectly). |

| Option | Yield / Effect |
|---|---|
| 1. **The Polish** (Spend extra time to perfect it) | `M (total months) +1`, `q_mod +5` |
| 2. **The Spin-off** (Publish intermediate findings) | `RP +800`, `q_mod +0` |

## Complication (Synergy ≤ 8)
Flavor direction determined by `Turn % 4`:
| X | Flavor direction |
|---|---|
| 0 | **Exploding gradients** (Loss is spiking to NaN, math is unstable). |
| 1 | **OOM Errors** (Out of memory, architecture is too heavy for the batch size). |
| 2 | **Data mismatch** (Tokenization/parsing errors are degrading quality). |
| 3 | **Severe overfitting** (Memorizing the training set, failing validation). |

| Option | Yield / Effect |
|---|---|
| 1. **Accept Flaws** (Ignore it and push through) | `q_mod -8` |
| 2. **Refactor** (Delay the project to fix the architecture/data) | `M (total months) +1`, `q_mod +0` |

<!--
Tiếng Việt (tóm tắt):
Sự kiện Tốt (Breakthrough - Synergy >= 16): Chọn 1 (Đánh bóng: Tốn thêm 1 tháng, Quality +5); Chọn 2 (Đăng báo: +800 RP, Quality giữ nguyên).
Sự kiện Xấu (Complication - Synergy <= 8): Chọn 1 (Chấp nhận lỗi: Quality -8); Chọn 2 (Đập đi xây lại: Tốn thêm 1 tháng, Quality giữ nguyên).
-->
