<!--
===============================================================================
FILE: 03_market_demand.md
MODULE: Content / Market Demand

Mục đích:
Bảng Demand (hệ số thị trường) của từng Task theo thời kỳ.

Tác dụng:
Mô phỏng làn sóng thị trường AI thật: phân loại văn bản có giá sớm rồi bão
hòa; dịch máy nóng lên giữa thập kỷ; chatbot bùng nổ cuối thập kỷ; code
completion chỉ bắt đầu có giá gần 2019–20.
===============================================================================
-->

# Market Demand

Demand multiplies sale income (refer to the Model Projects rule for the exact formulas).

| Task | 2013–14 | 2015–16 | 2017–18 | 2019–20 |
|---|---|---|---|---|
| CLS | 2 | 2 | 1 | 1 |
| AUTO | 1 | 2 | 2 | 2 |
| TRANS | 1 | 2 | 2 | 1 |
| CHAT | 1 | 2 | 2 | 3 |
| SUMM | 1 | 1 | 2 | 2 |
| QA | 1 | 1 | 2 | 2 |
| CODE | 1 | 1 | 1 | 2 |
| LLM (general) | — | — | 2 | 3 |

Event overrides (Event Calendar) apply on top of this table — e.g., the chatbot craze, the AlphaGo hype multiplier, and the post-BERT paradigm shift.

<!--
Tiếng Việt (tóm tắt):
Demand nhân vào tiền bán model: Bán bản quyền = Q × $60 × Demand; Sản phẩm
= Q × Demand × $10/tháng. Bảng theo 4 thời kỳ (2013–14, 2015–16, 2017–18,
2019–20) phản ánh sóng thị trường thật: CLS có giá sớm rồi bão hòa; TRANS
nóng giữa thập kỷ; CHAT lên đỉnh 2019–20; CODE chỉ có giá từ 2019. Các sự
kiện (cơn sốt chatbot, hype AlphaGo, cú sốc BERT) ghi đè lên bảng này.
-->
