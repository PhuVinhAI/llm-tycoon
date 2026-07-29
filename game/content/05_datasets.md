<!--
===============================================================================
FILE: 05_datasets.md
MODULE: Content / Datasets

Mục đích:
Chợ dữ liệu, các bộ dữ liệu miễn phí (mở theo sự kiện), và danh sách domain
thu thập được.

Tác dụng:
Bám dữ liệu thật của NLP: Wikipedia dump, Common Crawl (thô — phải làm sạch
mới dùng được, đúng như đời), WMT cho dịch máy, BookCorpus cho dữ liệu sách tự xuất bản, SQuAD cho hỏi–đáp.
===============================================================================
-->

# Datasets

## Market (buy once each, instant)

| Item | Price | Domain | Size | Quality | From |
|---|---|---|---|---|---|
| News archive | $500 | news | 2 | 3 | start |
| Product reviews | $400 | reviews | 2 | 3 | start |
| Movie subtitles | $600 | dialogue | 3 | 3 | start |
| Social media dump | $800 | social | 3 | 2 | start |
| PubMed abstracts | $700 | medical | 3 | 3 | start |
| Legal contracts dump | $900 | legal | 2 | 3 | start |
| Open-source code crawl | $700 | code | 3 | 2 | Jan 2015 |
| Math StackExchange | $600 | math | 2 | 4 | Mar 2015 |

## Free (claim once each, when available)

| Item | Domain | Size | Quality | Available |
|---|---|---|---|---|
| Wikipedia dump | encyclopedic | 3 | 4 | start |
| Common Crawl (raw) | web-mixed | 5 | 1 | Dec 2013 (unlocked) |
| BookCorpus (Smashwords scrape) | books | 4 | 4 | Jan 2014 (unlocked) |
| WMT parallel corpora | parallel | 3 | 4 | Nov 2014 (unlocked) |
| SQuAD | QA | 2 | 5 | Jun 2016 (unlocked) |
| WebText (Reddit scrape) | web-mixed | 5 | 2 | Feb 2019 (unlocked) |

Common Crawl and WebText are the only base Size-5 datasets in the game, though the player can combine others to reach Size 5. The LLM Project requires a dataset (or mixture) of Combined Size 5 and Combined Quality ≥ 3.

## Collectable Domains

news, social, dialogue, reviews, code, encyclopedic, web-mixed, medical, legal, math, books, logic.

<!--
Tiếng Việt (tóm tắt):
Chợ (mua 1 lần/món, tức thời): kho tin tức, đánh giá sản phẩm, phụ đề phim,
dump mạng xã hội, tóm tắt PubMed, hợp đồng pháp lý, crawl mã nguồn mở và
Math StackExchange; dùng đúng giá/ngày/domain/Size/Quality trong bảng.

Miễn phí (nhận 1 lần/món khi mở): Wikipedia dump (encyclopedic 3/4, từ đầu);
Common Crawl thô (web-mixed 5/1, mở khóa 12/2013); BookCorpus (books 4/4,
mở khóa 1/2014); WMT song ngữ (parallel 3/4, mở khóa 11/2014); SQuAD
(QA 2/5, mở khóa 6/2016); WebText (web-mixed 5/2, mở khóa 2/2019).

Common Crawl và WebText là hai dataset gốc Size 5 duy nhất, nhưng có thể
gộp dataset khác để đạt Combined Size 5. Dự án LLM chấp nhận một dataset
hoặc hỗn hợp có Combined Size 5 và Combined Quality ≥ 3.

Domain thu thập được: news, social, dialogue, reviews, code, encyclopedic,
web-mixed, medical, legal, math, books, logic.
-->
