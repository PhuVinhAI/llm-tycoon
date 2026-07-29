<!--
===============================================================================
FILE: 06_datasets.md
MODULE: Rules / Datasets

Mục đích:
Định nghĩa cách thu thập, làm sạch, mua, gộp Dataset và quy tắc "độ hợp
lĩnh vực" (domain fit) khi dùng Dataset cho một Task.

Tác dụng:
Dữ liệu là nguyên liệu của mọi Model. Module này tạo chiều sâu chiến lược:
đúng dữ liệu cho đúng bài toán, và dữ liệu web thô phải làm sạch mới dùng
tốt (đúng như đời thực).

Trách nhiệm:
- Định nghĩa các cách sở hữu Dataset.
- Định nghĩa nâng cấp (làm sạch, gộp).
- Định nghĩa quy tắc domain fit.
===============================================================================
-->

# Datasets

## Acquiring

- **Collect** (main action): create a Dataset in a chosen Domain — Size 2, Quality 2. With SCRAPE technology: Size 3. Staff effects apply (Content). Collectable Domains are listed in the Content.
- **Buy** (instant): from the dataset market (Content), once each.
- **Claim** (instant): free Datasets made available by Events (Content), once each.

## Improving

- **Clean** (main action): one owned Dataset gains Quality +1 (max 5).
- **Combine** (instant): merge two owned Datasets of the same Domain into one — Size = the larger Size + 1 (cap 5), Quality = the lower of the two. The originals are consumed.

## Domain fit

*(Domain fit is now calculated dynamically against specific Benchmarks during the Model Completion phase. See the Model Projects rule for the Bottom-Up Quality Calculation).*

## Usage

- A Project uses **1 to 3 Datasets** (a Data Mixture). The Datasets are not consumed — they can be reused (but see the repeat penalty in Model Projects).
- **Combined Size** = Max Size + Count − 1 (cap 5), and **Combined Quality** = floor(Average Quality). Architecture Baseline Data Size and Scale Ideal Data Size affect Quality; they are not hard start requirements. The LLM Project's explicit Combined Size 5 and Combined Quality ≥ 3 requirements remain hard.

<!--
Tiếng Việt (tóm tắt):
Sở hữu: Thu thập (hành động chính — Size 2 Q2, có SCRAPE → Size 3); Mua từ
chợ dữ liệu (tức thời, mỗi món một lần); Nhận miễn phí khi sự kiện mở
(mỗi món một lần).

Nâng cấp: Làm sạch (+1 Quality, tối đa 5); Gộp hai dataset cùng Domain
(Size = Size lớn hơn +1, trần 5; Quality = mức thấp hơn; hai bản gốc mất).

Domain Fit khi hoàn thành được tính riêng cho từng Benchmark theo Target
Domains: user-logs đúng Task hoặc khớp trực tiếp +20; nếu không khớp nhưng có
web-mixed +5; còn lại −15. Synergy giữa dự án dùng thang riêng +3/0/−3.

Sử dụng: mỗi Project dùng 1–3 Datasets, không bị tiêu hao (nhưng xem phạt
lặp lại ở Model Projects); Combined Size/Quality tính theo luật Model Projects.
-->
