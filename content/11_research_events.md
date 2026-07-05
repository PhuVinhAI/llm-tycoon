<!--
===============================================================================
FILE: 11_research_events.md
MODULE: Content / Research Events Matrix

Mục đích:
Ma trận 4x4 tạo ra 16 tình huống Research kết hợp giữa Flavor (Chủ đề)
và Mechanics (Biến cố). AI dùng Creative License để kể câu chuyện nối 2 trục này.
===============================================================================
-->

# Research Events Matrix

This table provides the raw data for Research events. The logic and formulas for selecting these coordinates are defined in the Actions rule.

**Axis 1: Research Focus (Flavor only)**
| X | Focus | Flavor direction |
|---|---|---|
| 0 | **Algorithm** | Math, matrix multiplication, weights, neural network theory. |
| 1 | **Data Structure** | Tokenization, vectors, embeddings, parsing efficiency. |
| 2 | **Hardware** | CUDA cores, memory management, parallelism, overheating. |
| 3 | **Literature** | ArXiv papers, replicating old experiments, finding prior art. |

**Axis 2: The Complication (Mechanics)**
| Y | Complication | Choice 1 (Standard) | Choice 2 (The Trade-off) |
|---|---|---|---|
| 0 | **The Rabbit Hole** | Stick to the goal.<br>Yield: `Base RP` | Go deep into the theory.<br>Yield: `Base RP × 0.8`, `R-Lv counter +1` |
| 1 | **The Shortcut** | Do it right.<br>Yield: `Base RP` | Skip the math, use a pre-built library.<br>Yield: `Base RP × 1.3`, `Fame −50` |
| 2 | **Side Discovery** | Ignore it and focus.<br>Yield: `Base RP` | Publish a minor paper.<br>Yield: `Base RP × 0.6`, `Fame +150` |
| 3 | **Compute Hog** | Optimize the code first.<br>Yield: `Base RP` | Brute force it with rented cloud.<br>Yield: `Base RP × 1.4`, `Cash −$1,000` |

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
