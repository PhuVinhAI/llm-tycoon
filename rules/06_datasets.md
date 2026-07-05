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

- A Project uses exactly one Dataset. The Dataset is not consumed — it can be reused (but see the repeat penalty in Model Projects).
- A Project requires the Dataset's Size ≥ the Architecture's minimum Size (Content).

<!--
Tiếng Việt (tóm tắt):
Sở hữu: Thu thập (hành động chính — Size 2 Q2, có SCRAPE → Size 3); Mua từ
chợ dữ liệu (tức thời, mỗi món một lần); Nhận miễn phí khi sự kiện mở
(mỗi món một lần).

Nâng cấp: Làm sạch (+1 Quality, tối đa 5); Gộp hai dataset cùng Domain
(Size = Size lớn hơn +1, trần 5; Quality = mức thấp hơn; hai bản gốc mất).

Domain fit trong công thức Quality: Domain nằm trong danh sách hợp của Task
→ +3; web-mixed = 0 với mọi Task trừ AUTO (+3) và TRANS (−3); còn lại −3.

Sử dụng: mỗi Project dùng đúng 1 Dataset, không bị tiêu hao (nhưng xem phạt
lặp lại ở Model Projects); Size phải ≥ mức tối thiểu của Architecture.
-->
