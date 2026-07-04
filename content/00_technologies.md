<!--
===============================================================================
FILE: 00_technologies.md
MODULE: Content / Technologies

Mục đích:
Cây công nghệ của chương Home Lab — xương sống tiến trình của cả game.

Tác dụng:
Mô phỏng lộ trình NLP ngoài đời thực 2013–2018: từ n-gram và túi từ, qua
word embeddings (word2vec), RNN/LSTM, seq2seq, attention, đến Transformer
và pre-training — kết thúc bằng "công thức scale" mở ra dự án LLM.

Ghi chú thiết kế:
- Chi phí RP cân để người chơi "bám theo lịch sử" mở Transformer quanh
  2017 và pretrain quanh 2018 (các sự kiện giảm giá trong Event Calendar
  kéo người chơi theo đúng nhịp lịch sử).
- Người chơi rush nghiên cứu có thể vượt trước lịch sử — các sự kiện sẽ
  thưởng REP ("prior art!").
===============================================================================
-->

# Technologies

The full tree — names, costs, prerequisites, and effects — is always visible to the Player.

| ID | Technology | RP cost | Requires | Grants |
|---|---|---|---|---|
| BTP | Basic Text Processing | owned at start | — | foundation for everything |
| NGRAM | N-gram Language Model | 10 | BTP | Architecture NGRAM |
| BOW | Bag-of-Words + Classic ML | 20 | BTP | Architecture BOW |
| SCRAPE | Web Scraping Toolkit | 15 | BTP | Collect action yields Size 3 |
| EMB | Word Embeddings | 40 | BOW | Architecture EMB |
| GPUT | GPU Training | 30 | — | neural Architectures may train |
| RNN | Recurrent Neural Networks | 50 | EMB, GPUT | Architecture RNN |
| LSTM | LSTM / GRU | 60 | RNN | Architecture LSTM |
| BPE | Subword Tokenization (BPE) | 40 | EMB | +5 Q on S2S, S2SA, TRF, PTRF models |
| S2S | Sequence-to-Sequence | 70 | LSTM | Architecture S2S |
| ATTN | Attention Mechanism | 90 | S2S | Architecture S2SA |
| TRF | Transformer | 120 | ATTN | Architecture TRF |
| PRET | Unsupervised Pre-training | 140 | TRF | Architecture PTRF |
| FINE | Fine-tuning Toolkit | 60 | PRET | PTRF minimum months −1; +5 Q on PTRF models |
| SCALE | Scaling Recipe | 160 | PRET | unlocks The LLM Project |

<!--
Tiếng Việt (tóm tắt):
Cây công nghệ luôn hiển thị đầy đủ cho người chơi (tên, giá RP, điều kiện,
hiệu ứng). Một công nghệ khởi điểm: BTP. NGRAM giá 1000 RP. Nhánh xương sống:
BOW → EMB → (cùng GPUT) → RNN → LSTM → S2S → ATTN → TRF → PRET → SCALE.
Nhánh phụ: SCRAPE (thu thập dữ liệu tốt hơn), BPE (+5 Q cho các kiến trúc
seq2seq trở lên), FINE (giảm 1 tháng tối thiểu + 5 Q cho PTRF).
-->
