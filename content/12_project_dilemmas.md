<!--
===============================================================================
FILE: 12_project_dilemmas.md
MODULE: Content / Project Dilemmas

Mục đích:
Ma trận sự kiện phát sinh giữa dự án dựa trên điểm Synergy (độ hợp lý của setup)
và Scale (Tiny/Base vs Large/Massive/Frontier).

Tác dụng:
Phạt người chơi nếu setup dự án bừa bãi (Synergy thấp) và thưởng nếu setup
hoàn hảo (Synergy cao). Tạo ra các quyết định đánh đổi (Trade-off) giữa Quality,
Thời gian, và Tiền bạc. Scale càng lớn thì rủi ro và phần thưởng càng cao.
===============================================================================
-->

# Project Dilemmas

Triggered mid-project based on the Synergy score (see Model Projects rule). The Engine checks the Model's **Scale** to render the appropriate flavor and choices.

---

## Breakthrough (Synergy ≥ 16)

### 1. For Small Scales (Tiny, Base)
Flavor direction determined by `Turn % 4`:
| X | Flavor direction |
|---|---|
| 0 | **Loss dropping beautifully** (Math is perfectly aligned, gradients flow smoothly). |
| 1 | **Sleek abstraction** (Your training loops are clean and highly optimized). |
| 2 | **Data harmony** (The dataset structure fits the architecture's assumptions perfectly). |
| 3 | **Quick Convergence** (The model is learning much faster than expected). |

| Option | Yield / Effect |
|---|---|
| 1. **The Polish** (Spend extra time to perfect it) | `M (total months) +1`, `q_mod +5` |
| 2. **The Spin-off** (Publish intermediate findings) | `RP +800`, `q_mod +0` |

### 2. For Massive Scales (Large, Massive, Frontier)
Flavor direction determined by `Turn % 4`:
| X | Flavor direction |
|---|---|
| 0 | **Emergent property detected!** (The giant model is learning unexpected, high-level reasoning early). |
| 1 | **Hardware synergy** (The custom CUDA kernels you wrote are accelerating the cluster perfectly). |
| 2 | **Scaling Law Alignment** (The validation curve matches scaling laws to the decimal point). |
| 3 | **Zero-shot breakthrough** (The model is solving downstream tasks it wasn't even trained on!). |

| Option | Yield / Effect |
|---|---|
| 1. **The Grand Polish** (Extend training to lock in these emergent capabilities) | `M (total months) +1`, `q_mod +8` |
| 2. **The Academic Shockwave** (Publish a massive preprint to ArXiv immediately) | `RP +2,000`, `q_mod +0` |

---

## Complication (Synergy ≤ 8)

### 1. For Small Scales (Tiny, Base)
Flavor direction determined by `Turn % 4`:
| X | Flavor direction |
|---|---|
| 0 | **Exploding gradients** (Loss is spiking to NaN, math is unstable). |
| 1 | **Data mismatch** (Tokenization/parsing errors are degrading quality). |
| 2 | **Severe overfitting** (Memorizing the training set, failing validation). |
| 3 | **Dead neurons** (ReLU activation collapse is stalling the weights). |

| Option | Yield / Effect |
|---|---|
| 1. **Accept Flaws** (Ignore it and push through) | `q_mod -8` |
| 2. **Refactor** (Delay the project by 1 month to fix the bugs) | `M (total months) +1`, `q_mod +0` |

### 2. For Massive Scales (Large, Massive, Frontier)
Flavor direction determined by `Turn % 4`:
| X | Flavor direction |
|---|---|
| 0 | **CUDA Out of Memory (OOM)** (The massive model layers are too heavy for your GPU memory pool). |
| 1 | **NCCL Cluster Bottleneck** (Inter-GPU communications are stalling, thermal-throttling your rigs). |
| 2 | **Power Grid Overload** (The home lab's circuit breakers are tripping under the immense electrical draw). |
| 3 | **Tokenization Corruption** (A silent parser bug is poisoning the weights with garbage characters). |

| Option | Yield / Effect |
|---|---|
| 1. **Brute Force** (Ignore the errors, bypass safety checks, and let it run hot) | `q_mod -15`, `Fame -50` (due to unstable outputs) |
| 2. **Emergency Infrastructure** (Delay the project 1 month and pay cloud/hardware emergency costs) | `M (total months) +1`, `Cash -$2,500` (cloud/coffee/rewiring), `q_mod +0` |

<!--
Tiếng Việt (tóm tắt):
Phân hóa theo Scale — Tiny/Base: Breakthrough (+5 Q hoặc +800 RP) / Complication (-8 Q hoặc +1 tháng).
Large/Massive/Frontier: Breakthrough (+8 Q hoặc +2000 RP) / Complication (-15 Q + -50 Fame hoặc +1 tháng + -$2,500).
-->
