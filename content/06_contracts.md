<!--
===============================================================================
FILE: 06_contracts.md
MODULE: Content / Contracts

Mục đích:
Kho hợp đồng theo bậc REP.

Tác dụng:
Nguồn tiền ổn định giữa các dự án; nhu cầu khách hàng leo thang theo trình
độ công nghệ (spam filter → autocomplete → dịch phụ đề → chatbot ngân hàng
→ QA cho cổng tìm kiếm), phản chiếu thị trường NLP outsourcing thật.
===============================================================================
-->

# Contracts

| ID | Fame ≥ | Client — job | Requires | Months | Pay | Bonus tech (pay ×1.2) |
|---|---|---|---|---|---|---|
| C01 | 0 | Local ISP — spam filter | BOW | 2 | $3,000 | EMB |
| C02 | 0 | News site — keyword tagger | BOW | 1 | $1,500 | — |
| C11 | 800 | Phone OEM — keyboard autocomplete | EMB or RNN | 2 | $5,000 | LSTM |
| C12 | 800 | Marketplace — review moderation | EMB | 2 | $4,000 | — |
| C21 | 1500 | Subtitle bureau — translation batch | S2S + a parallel Dataset Size ≥ 3 | 3 | $9,000 | ATTN |
| C22 | 1500 | Telecom — support ticket routing | LSTM | 2 | $6,500 | — |
| C31 | 2200 | Bank — chatbot pilot | ATTN | 3 | $14,000 | TRF |
| C32 | 2200 | Search portal — snippet QA | TRF | 3 | $16,000 | PRET |

<!--
Tiếng Việt (tóm tắt):
8 hợp đồng, 4 bậc REP (0 / 8 / 15 / 22). Mỗi hợp đồng: yêu cầu công nghệ
(có khi kèm dataset), số tháng cam kết, tiền công cố định, và công nghệ
bonus (sở hữu thì tiền ×1.2). Ví dụ: bậc 0 — lọc spam cho ISP ($3,000, cần
BOW, 2 tháng); bậc 22 — QA cho cổng tìm kiếm ($16,000, cần TRF, 3 tháng).
-->
