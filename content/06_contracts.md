<!--
===============================================================================
FILE: 06_contracts.md
MODULE: Content / Contracts

Mục đích:
Kho hợp đồng mở khóa theo cả bậc Fame và Thời đại (Ngày tháng).

Tác dụng:
Nguồn tiền ổn định giữa các dự án; nhu cầu khách hàng leo thang theo trình
độ công nghệ (spam filter → autocomplete → dịch phụ đề → chatbot ngân hàng
→ QA cho cổng tìm kiếm), phản chiếu thị trường NLP outsourcing thật.
===============================================================================
-->

# Contracts

| ID | Fame ≥ | Date ≥ | Client — job | Requires | Months | Pay | Bonus tech |
|---|---|---|---|---|---|---|---|
| C01 | 800 | Jan 2013 | Local ISP — spam filter | BOW | 2 | $3,000 | EMB |
| C02 | 800 | Jan 2014 | News site — keyword tagger | BOW | 1 | $1,500 | — |
| C11 | 1200 | Jan 2015 | Phone OEM — keyboard autocomplete | EMB or RNN | 2 | $5,000 | LSTM |
| C12 | 1200 | Jun 2015 | Marketplace — review moderation | EMB | 2 | $4,000 | — |
| C21 | 1500 | Jan 2016 | Subtitle bureau — translation batch | S2S + a parallel Dataset Size ≥ 3 | 3 | $9,000 | ATTN |
| C22 | 1500 | Aug 2016 | Telecom — support ticket routing | LSTM | 2 | $6,500 | — |
| C31 | 2200 | Jan 2017 | Bank — chatbot pilot | ATTN | 3 | $14,000 | TRF |
| C32 | 2200 | Jan 2018 | Search portal — snippet QA | TRF | 3 | $16,000 | PRET |

<!--
Tiếng Việt (tóm tắt):
8 hợp đồng, mở khóa dựa trên cả Fame và Ngày tháng. Mỗi hợp đồng: yêu cầu
công nghệ (có khi kèm dataset), số tháng cam kết, tiền công cố định, và 
công nghệ bonus (sở hữu thì tiền ×1.2). Hợp đồng thấp nhất yêu cầu Fame 800 
để khớp với thời điểm UI mở khóa menu.
-->
