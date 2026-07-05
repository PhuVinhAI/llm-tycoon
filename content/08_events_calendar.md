<!--
===============================================================================
FILE: 08_events_calendar.md
MODULE: Content / Event Calendar

Mục đích:
Lịch sự kiện cố định 2013–2020 — nguồn "bất ngờ có kịch bản" duy nhất của
game, thay thế hoàn toàn cho ngẫu nhiên.

Tác dụng:
Tái hiện dòng lịch sử AI thật: word2vec (2013), seq2seq (2014), attention
(2015), TensorFlow (2015), AlphaGo (2016), Transformer (2017), GPT-1/BERT
(2018), GPT-2 (2019). Người chơi bám theo lịch sử thì được giảm giá nghiên
cứu; vượt trước lịch sử thì được vinh danh (+Fame).

Lưu ý cho Game Engine:
TUYỆT MẬT với người chơi — không bao giờ tiết lộ trước (system/07).
===============================================================================
-->

# Event Calendar — ⚠️ engine-only, never reveal in advance

## Dated events

| # | Date | Event | Effect |
|---|---|---|---|
| E0 | Jan 2013 | 📰 *Welcome to NLP (Tutorial)* | Headline: "The State of AI". Explain that the Player starts with only **BTP (Basic Text Processing)**. Guide them to use the **Research** action this month to earn Research Points and unlock **NGRAM**. |
| E1 | Mar 2013 | 📄 *word2vec published (Mikolov et al.)* | EMB cost ×0.5 if locked; if owned: +500 Fame ("prior art!") |
| E2 | Dec 2013 | 🌐 *Common Crawl in the spotlight* | Free Dataset claimable: Common Crawl raw (web-mixed 5/1) |
| E3 | Jun 2014 | 📄 *Seq2Seq paper (Sutskever et al.)* | S2S cost ×0.5 if locked; owned: +500 Fame |
| E4 | Aug 2014 | 📄 *GloVe Embeddings (Stanford)* | EMB cost ×0.75 if locked |
| E5 | Sep 2014 | 🛒 *GTX 980 launches* | Shop update (hardware table) |
| E6 | Nov 2014 | 🌐 *WMT corpora released* | Free Dataset claimable: WMT parallel (3/4) |
| E7 | Feb 2015 | 📄 *Attention paper (Bahdanau et al.)* | ATTN cost ×0.5 if locked; owned: +500 Fame |
| E8 | Jul 2015 | 🏆 **Sentiment Challenge** | Competition: CLS, Q ≥ 55, 3-month window → $2,000 + 400 Fame |
| E9 | Nov 2015 | 🔧 *TensorFlow open-sourced* | All research costs ×0.8, permanent |
| E10 | Dec 2015 | 📰 *OpenAI founded* | Headline; RP +500 (inspiration) |
| E11 | Mar 2016 | 🔥 *AlphaGo beats Lee Sedol* | AI hype: license & product income ×1.5 during Mar–Aug 2016 |
| E12 | Apr 2016 | 🤖 *The chatbot craze* | CHAT Demand = 3 until Dec 2017 |
| E13 | Jun 2016 | 🛒📊 *GTX 1080 launches; SQuAD released* | Shop update; free Dataset SQuAD (QA 2/5). Triggers **SQuAD Challenge**: QA, Q ≥ 60, 3-mo window → $3,000 + 500 Fame |
| E14 | Sep 2016 | 🏢 *Rival "VectorMind" demos a chatbot* | Flavor only; if Player Fame ≥ 1500, the article namechecks them |
| E15 | Jan 2017 | ☁️ *Cloud GPUs & PyTorch* | Cloud rental available (hardware). PyTorch released: All research costs ×0.9 (stacks with TF), permanent |
| E16 | Jun 2017 | 📄 *"Attention Is All You Need"* | TRF cost ×0.5 if locked; owned: +1000 Fame + headline "Indie researcher scooped Google?" |
| E17 | Aug 2017 | 🏆 **Translation Shared Task** | Competition: TRANS, Q ≥ 65, 3-month window → $4,000 + 600 Fame |
| E18 | Oct 2017 | 🛒 *Used K80 servers flood eBay* | Shop update |
| E19 | Feb 2018 | 📄 *ELMo* | PRET cost ×0.75 if locked |
| E20 | May 2018 | 🏆 **GLUE Benchmark Introduced** | Triggers **GLUE Competition**: CLS or AUTO, Q ≥ 75, 3-month window → $5,000 + 800 Fame |
| E21 | Jun 2018 | 📄 *GPT-1: pre-training works* | PRET cost ×0.5 if locked; owned: +1000 Fame |
| E22 | Sep 2018 | 🛒 *RTX 2080 launches* | Shop update |
| E23 | Oct 2018 | 🌍 *BERT drops — paradigm shift* | From now on, Models with Architecture below TRF earn ×0.5 on license/product. If PRET owned: +500 Fame |
| E24 | Feb 2019 | 📰 *GPT-2 "too dangerous to release"* | LLM hype headline; an LLM released during 2019 gains +1000 Score at the end |
| E25 | Oct 2019 | 📄 *T5 (Google) & Transformers Boom* | NLP unifies into Text-to-Text. Hugging Face explodes. License income ×1.2 permanent. If PRET owned: RP +1000 |
| E26 | May 2020 | 🦖 **GPT-3 Drops (175B Parameters)** | Shockwave! LLM Demand = 4 permanent. If Player already released an LLM prior to this month: +2000 Fame (Beat OpenAI!) |
| E27 | Dec 2020 | 🌅 *The horizon* | The game ends — Retirement scoring (Endings rule) |

## Threshold events

| # | Trigger | Event | Effect |
|---|---|---|---|
| T1 | First month Fame ≥ 800 / 1500 / 2200 | 👥 Candidate available / 📜 new Contract tier | Announce per Content tables |
| T2 | First month Fame ≥ 2500 | 😇 **Angel investor** | Choice: accept +$25,000, or decline for +200 Fame (bootstrapped pride) |
| T3 | LLM released with Q ≥ 70 | 💼 **The Term Sheet** | A VC offers $2M and a real office. Accept → WIN ending. Decline → +500 Fame, sandbox continues |

*(Discount stacking and event tracking follow the Research and Events rules).*

<!--
Tiếng Việt (tóm tắt):
Sự kiện theo ngày (E1–E23): các bài báo lịch sử giảm 50% giá nghiên cứu
công nghệ tương ứng nếu CHƯA mở (đã mở trước thì +Fame vinh danh); các đợt
GPU mở shop; dataset miễn phí xuất hiện; TensorFlow giảm 20% mọi nghiên cứu
vĩnh viễn; AlphaGo nhân 1.5 thu nhập bán model trong 6 tháng; cơn sốt
chatbot đẩy Demand CHAT = 3 đến hết 2017; BERT (10/2018) là cú sốc paradigm:
model kiến trúc dưới TRF chỉ còn bán được ×0.5; GPT-2 (2/2019) tạo hype —
phát hành LLM trong 2019 được +1000 điểm tổng kết; 12/2020 kết thúc game.

Sự kiện ngưỡng: Fame 800/1500/2200 mở ứng viên + bậc hợp đồng; Fame 2500 — thiên thần
đầu tư (nhận $25,000 hoặc từ chối +200 Fame); phát hành LLM Q ≥ 70 — Term Sheet
$2M (nhận = THẮNG, từ chối +500 Fame chơi tiếp).

Giảm giá chồng: nhân với nhau, làm tròn lên bội 5 (Rules/Research). Mọi sự
kiện đã nổ và hiệu lực kéo dài đều lưu thành cờ trong Game State.
-->
