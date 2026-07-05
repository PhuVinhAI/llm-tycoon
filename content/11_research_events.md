<!--
===============================================================================
FILE: 11_research_events.md
MODULE: Content / Research Era-Aware Dilemmas

Mục đích:
Hệ thống tạo tình huống Research theo Thời đại (Era-aware) + 6 biến cố.
Thay thế ma trận 4x4 cũ để tránh lặp nội dung và phản ánh đúng bối cảnh AI.
===============================================================================
-->

# Research Era-Aware Dilemmas

This table provides the generation data for Research events. The Engine invents a research topic fitting the **Era Theme**, then applies the mathematically selected **Complication**.

**Axis 1: Era Themes (Flavor only - based on current Year)**
| Years | Theme | Flavor direction |
|---|---|---|
| 2013–2014 | **Foundations** | Counting frequencies, word vectors, parsing Wikipedia dumps, math proofs, CPU constraints. |
| 2015–2016 | **Neural Struggles** | RNNs, LSTMs, vanishing gradients, CUDA out-of-memory errors, early TensorFlow bugs. |
| 2017–2018 | **Attention & Scale** | Attention matrices, parallelizing across GPUs, reading ArXiv daily, PyTorch migrations. |
| 2019–2020 | **Pre-training** | Scaling laws, massive datasets, tokenization edge cases, multi-node cluster optimization. |

**Axis 2: The Complication (Mechanics - selected by Y = (Turn + 3) % 6)**
| Y | Complication | Choice 1 (Standard) | Choice 2 (The Trade-off) |
|---|---|---|---|
| 0 | **The Rabbit Hole** | Stick to the goal.<br>Yield: `Base RP` | Go deep into the theory.<br>Yield: `Base RP × 0.8`, `R-Lv counter +1` |
| 1 | **The Shortcut** | Do it right.<br>Yield: `Base RP` | Skip the math, use a pre-built library.<br>Yield: `Base RP × 1.3`, `Fame −50` |
| 2 | **Side Discovery** | Ignore it and focus.<br>Yield: `Base RP` | Publish a minor paper.<br>Yield: `Base RP × 0.6`, `Fame +150` |
| 3 | **Compute Hog** | Optimize the code first.<br>Yield: `Base RP` | Brute force it with rented cloud.<br>Yield: `Base RP × 1.4`, `Cash −$1,000` |
| 4 | **Data Epiphany** | Stick to standard parsing.<br>Yield: `Base RP` | Buy advanced scraping scripts.<br>Yield: `Base RP × 1.2`, `Cash −$300` |
| 5 | **Peer Consulting** | Ignore the emails.<br>Yield: `Base RP` | Help a peer debug their model.<br>Yield: `Base RP × 0.5`, `Cash +$1,500` |

<!--
Tiếng Việt (tóm tắt):
Ma trận 4x4 cho hành động Research.
Trục X (Chủ đề - Flavor): 0 Thuật toán, 1 Cấu trúc dữ liệu, 2 Phần cứng, 3 Tài liệu.
Trục Y (Biến cố - Cơ chế):
0 Hố thỏ (Rabbit Hole): Chuẩn = Base RP; Đào sâu = Base RP x0.8, R-Lv counter +1.
1 Lối tắt (Shortcut): Chuẩn = Base RP; Dùng thư viện sẵn = Base RP x1.3, Fame -50.
2 Phát hiện phụ (Side Discovery): Chuẩn = Base RP; Đăng báo = Base RP x0.6, Fame +150.
3 Ngốn Compute (Compute Hog): Chuẩn = Base RP; Thuê cloud chạy bạo lực = Base RP x1.4, Cash -$1,000.
-->
