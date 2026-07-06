# Technologies

The full tree — names, costs, prerequisites, and effects — is always visible to the Player.

| ID | Technology | RP cost | Requires | Grants |
|---|---|---|---|---|
| BTP | Basic Text Processing | owned at start | — | foundation for everything |
| NGRAM | N-gram Language Model | 1000 | BTP | Architecture NGRAM |
| BOW | Bag-of-Words + Classic ML | 2000 | BTP | Architecture BOW |
| SCRAPE | Web Scraping Toolkit | 1500 | BTP | Collect action yields Size 3 |
| EMB | Word Embeddings | 4000 | BOW | Architecture EMB |
| GPUT | GPU Training | 3000 | — | neural Architectures may train |
| RNN | Recurrent Neural Networks | 5000 | EMB, GPUT | Architecture RNN |
| LSTM | LSTM / GRU | 6000 | RNN | Architecture LSTM |
| BPE | Subword Tokenization (BPE) | 4000 | EMB | +5 Q on S2S, S2SA, TRF, PTRF models |
| S2S | Sequence-to-Sequence | 7000 | LSTM | Architecture S2S |
| ATTN | Attention Mechanism | 9000 | S2S | Architecture S2SA |
| TRF | Transformer | 9000 | ATTN | Architecture TRF |
| PRET | Unsupervised Pre-training | 9500 | TRF | Architecture PTRF |
| FINE | Fine-tuning Toolkit | 5000 | PRET | PTRF minimum months −1; +5 Q on PTRF models |
| SCALE | Scaling Recipe | 8500 | PRET | unlocks The LLM Project |

# Architectures

| ID | Architecture | Base Q | TFLOPS-months req | Min months | Min Dataset Size | Ideal Focus D/M/T/E |
|---|---|---|---|---|---|---|---|---|
| NGRAM | N-gram LM | 15 | 0 | 1 | 1 | 4/2/1/3 |
| BOW | Bag-of-Words + Classic ML | 20 | 0 | 1 | 1 | 4/3/1/2 |
| EMB | Embedding-based | 18 | 100 | 1 | 2 | 3/3/2/2 |
| RNN | Recurrent NN | 22 | 200 | 2 | 2 | 2/3/3/2 |
| LSTM | LSTM / GRU | 26 | 400 | 2 | 2 | 2/3/3/2 |
| S2S | Seq2Seq | 30 | 800 | 2 | 3 | 2/3/4/1 |
| S2SA | Seq2Seq + Attention | 38 | 1200 | 3 | 3 | 2/3/3/2 |
| TRF | Transformer | 45 | 2000 | 3 | 3 | 2/2/4/2 |
| PTRF | Pretrained Transformer | 55 | 3000 | 4 | 5 | 3/2/4/1 |

- Architectures with TFLOPS-months req 0 train on the starting desktop PC; all others are neural (GPUT + TFLOPS ≥ 100 required).
- The LLM Project overrides PTRF's compute requirement to 60,000 TFLOPS-months (Rules).

# Tasks and Matching

## Tasks

| ID | Task | Description |
|---|---|---|
| CLS | Classification | Spam filtering, sentiment, tagging, moderation |
| AUTO | Autocomplete | Next-word prediction, smart keyboards |
| TRANS | Translation | Machine translation between languages |
| CHAT | Chatbot | Conversational agents |
| SUMM | Summarization | Condensing documents |
| QA | Question Answering | Answering questions over text |
| CODE | Code Completion | Suggesting source code |
| LLM (general) | Large Language Model | General purpose text generation |

(The **LLM (general)** task is initially exclusive to The LLM Project, but unlocks for standard projects after the first LLM is completed.)

## Architecture × Task match matrix

Values: +10 perfect · +5 good · 0 weak · −10 poor.

| | CLS | AUTO | TRANS | CHAT | SUMM | QA | CODE | LLM (general) |
|---|---|---|---|---|---|---|---|---|
| **NGRAM** | 0 | +10 | −10 | −10 | −10 | −10 | +5 | −10 |
| **BOW** | +10 | −10 | −10 | −10 | 0 | 0 | −10 | −10 |
| **EMB** | +10 | 0 | −10 | 0 | 0 | +5 | −10 | −10 |
| **RNN** | +5 | +10 | 0 | 0 | 0 | 0 | +5 | −10 |
| **LSTM** | +5 | +10 | +5 | +5 | +5 | +5 | +5 | −10 |
| **S2S** | 0 | +5 | +10 | +5 | +5 | 0 | 0 | −10 |
| **S2SA** | 0 | +5 | +10 | +10 | +10 | +5 | +5 | −10 |
| **TRF** | +5 | +10 | +10 | +5 | +5 | +5 | +10 | +5 |
| **PTRF** | +10 | +10 | +10 | +10 | +10 | +10 | +10 | +10 |

*(Domain fit is now dynamically evaluated against specific Benchmarks during Model Completion. See Benchmarks table for Target Domains).*

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

# Hardware Shop

| Available from | Item | Price | TFLOPS/mo | VRAM | Slots |
|---|---|---|---|---|---|---|
| start | GTX 780 | $1,500 | 100 | 3 GB | 1 |
| Sep 2014 | GTX 980 | $2,500 | 200 | 4 GB | 1 |
| Jun 2016 | GTX 1080 | $5,000 | 400 | 8 GB | 1 |
| Oct 2017 | Used K80 server | $8,000 | 600 | 24 GB | 2 |
| Sep 2018 | RTX 2080 Ti | $12,000 | 800 | 11 GB | 1 |

**Other purchases:**

| Item | Price | Effect |
|---|---|---|
| 🔌 Rewire the lab (once) | $4,000 | slots 4 → 8 |
| ☁️ Cloud rental (from Jan 2017) | $1,000/mo per unit | +1000 TFLOPS/mo and +120 GB VRAM per unit, max 2 units, project months only |

*(Refer to the Economy and Hardware rules for upkeep and sell-back mechanics).*

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

Common Crawl and WebText are the only base Size-5 datasets in the game, though the player can combine others to reach Size 5. The LLM Project requires a dataset (or mixture) of Combined Size 5 and Quality ≥ 3.

## Collectable Domains

news, social, dialogue, reviews, code, encyclopedic, web-mixed, medical, legal, math, books, logic.

# Contracts

| ID | Fame ≥ | Date ≥ | Client — job | Requires | Months | Pay | Bonus tech |
|---|---|---|---|---|---|---|---|
| C01 | 800 | Jan 2013 | Local ISP — spam filter | BOW | 2 | $10,000 | EMB |
| C02 | 800 | Jan 2014 | News site — keyword tagger | BOW | 1 | $6,000 | — |
| C10 | 1000 | Jan 2015 | Startup — sentiment API | EMB | 1 | $8,000 | — |
| C11 | 1200 | Jan 2015 | Phone OEM — keyboard autocomplete | EMB or RNN | 2 | $14,000 | LSTM |
| C12 | 1200 | Jun 2015 | Marketplace — review moderation | EMB | 2 | $12,000 | — |
| C21 | 1500 | Jan 2016 | Subtitle bureau — translation batch | S2S + a parallel Dataset Size ≥ 3 | 3 | $22,000 | ATTN |
| C22 | 1500 | Aug 2016 | Telecom — support ticket routing | LSTM | 2 | $16,000 | — |
| C31 | 2200 | Jan 2017 | Bank — chatbot pilot | ATTN | 3 | $30,000 | TRF |
| C32 | 2200 | Jan 2018 | Search portal — snippet QA | TRF | 3 | $36,000 | PRET |

## Mid-Contract Dilemmas

Triggered when an active Contract reaches `months elapsed == floor(M ÷ 2)` (for M ≥ 2). Flavor direction is determined by `Turn % 4`:

| X | Complication | Choice 1 (Standard) | Choice 2 (The Trade-off) |
|---|---|---|---|
| 0 | **Scope Creep** (Client wants a new feature mid-way) | Refuse the change.<br>Yield: `Normal` | Accept the extra work.<br>Yield: `M +1`, `Pay +30%` |
| 1 | **Messy Client Data** (The provided data is garbage) | Train on it anyway.<br>Yield: `Pay -20%` | Clean it manually.<br>Yield: `M +1`, `Fame +50` |
| 2 | **Integration Hell** (Legacy systems are blocking deployment) | Hack a quick fix.<br>Yield: `Normal` | Build a proper API.<br>Yield: `M +1`, `Pay +20%`, `Fame +100` |
| 3 | **Early Delivery Request** (Client needs it ASAP) | Decline.<br>Yield: `Normal` | Crunch time.<br>Yield: `Pay +20%`, `Cash -$1,000` (cloud/coffee) |

# Employee Archetypes

Instead of fixed characters, the Player must pay a Headhunter Fee to search for an Archetype. The Engine then generates **3 unique candidates** for that Archetype. The Engine uses Creative License to invent a name and background fitting the player's language. To remain deterministic, the Engine must select exact stats within the bounds below based on the current in-game Turn (e.g., higher turn = higher stats/salary), ensuring the 3 candidates offer fixed trade-offs: Candidate 1 (Low Salary, Low Stats), Candidate 2 (Mid Salary, Mid Stats), Candidate 3 (High Salary, High Stats).

| Archetype | Fame ≥ | Headhunter Fee | Salary/mo Range | Stat Bounds |
|---|---|---|---|---|
| **The Data Specialist** | 800 | $1,000 | $800 – $1,200 | Collected Datasets +1 Quality; Research + (150 to 250) RP |
| **The Hardware Optimizer** | 1500 | $2,500 | $1,500 – $2,200 | All compute requirements ×0.75 (round up) |
| **The Research Scientist** | 2200 | $5,000 | $3,000 – $4,500 | Research + (600 to 900) RP; All Models + (2 to 4) Q |

Maximum 2 hired at a time (Employees rule).

# Event Calendar — ⚠️ engine-only, never reveal in advance

## Dated events

| # | Date | Event | Effect |
|---|---|---|---|
| E0 | Jan 2013 | 📰 *Welcome to NLP (Tutorial)* | Headline: "The State of AI". Explain that the Player starts with only **BTP (Basic Text Processing)**. Guide them to use the **Research** action this month to earn Research Points and unlock **NGRAM**. |
| E1 | Jan 2013 | 📄 *word2vec core preprint (Mikolov et al.)* | EMB cost ×0.5 if locked; if owned: +500 Fame ("prior art!") |
| E2 | Dec 2013 | 🌐 *Common Crawl becomes widely accessible* | Free Dataset claimable: Common Crawl raw (web-mixed 5/1) |
| E2b | Jan 2014 | 📚 *BookCorpus published (Smashwords scrape)* | Free Dataset claimable: BookCorpus (books 4/4) |
| E3 | Sep 2014 | 📄 *Seq2Seq paper (Sutskever et al.)* | S2S cost ×0.5 if locked; owned: +500 Fame |
| E4 | Sep 2014 | 🛒 *GTX 980 launches* | Shop update (hardware table) |
| E5 | Oct 2014 | 📄 *GloVe Embeddings (Stanford)* | EMB cost ×0.75 if locked |
| E6 | Nov 2014 | 🌐 *WMT corpora popularized* | Free Dataset claimable: WMT parallel (3/4) |
| E7 | Feb 2015 | 📄 *Attention mechanism gains traction (Bahdanau et al. 2014)* | ATTN cost ×0.5 if locked; owned: +500 Fame |
| E8 | Jul 2015 | 🏆 **Sentiment Challenge** | Competition: CLS, Q ≥ 55.0, 3-month window → $2,000 + 400 Fame |
| E9 | Nov 2015 | 🔧 *TensorFlow open-sourced* | All research costs ×0.8, permanent |
| E10 | Dec 2015 | 📰 *OpenAI founded* | Headline; RP +500 (inspiration) |
| E11 | Mar 2016 | 🔥 *AlphaGo beats Lee Sedol* | AI hype: license & product income ×1.5 during Mar–Aug 2016 |
| E12 | Apr 2016 | 🤖 *The chatbot craze* | CHAT Demand = 3 until Dec 2017 |
| E13 | Jun 2016 | 🛒📊 *GTX 1080 launches; SQuAD released* | Shop update; free Dataset SQuAD (QA 2/5). Triggers **SQuAD Challenge**: QA, Q ≥ 60.0, 3-mo window → $3,000 + 500 Fame |
| E14 | Sep 2016 | 🏢 *Rival "VectorMind" demos a chatbot* | Flavor only; if Player Fame ≥ 1500, the article namechecks them |
| E15 | Jan 2017 | ☁️ *PyTorch released & Cloud GPUs unlocked* | Cloud rental available (hardware). PyTorch released: All research costs ×0.9 (stacks with TF), permanent |
| E16 | Jun 2017 | 📄 *"Attention Is All You Need"* | TRF cost ×0.5 if locked; owned: +1000 Fame + headline "Indie researcher scooped Google?" |
| E17 | Aug 2017 | 🏆 **Translation Shared Task** | Competition: TRANS, Q ≥ 65.0, 3-month window → $4,000 + 600 Fame |
| E18 | Oct 2017 | 🛒 *Used K80 servers flood eBay* | Shop update |
| E19 | Feb 2018 | 📄 *ELMo* | PRET cost ×0.75 if locked |
| E20 | Apr 2018 | 🏆 **GLUE Benchmark Introduced** | Triggers **GLUE Competition**: CLS or AUTO, Q ≥ 75.0, 3-month window → $5,000 + 800 Fame |
| E21 | Jun 2018 | 📄 *GPT-1: pre-training works* | PRET cost ×0.5 if locked; owned: +1000 Fame |
| E22 | Sep 2018 | 🛒 *RTX 2080 Ti launches* | Shop update |
| E23 | Oct 2018 | 🌍 *BERT drops — paradigm shift* | From now on, Models with Architecture below TRF earn ×0.5 on license/product. If PRET owned: +500 Fame |
| E24 | Feb 2019 | 📰 *GPT-2 "too dangerous to release"* | Free Dataset claimable: WebText (web-mixed 5/2). LLM hype headline: an LLM released during 2019 gains +1000 Score at the end |
| E25 | Oct 2019 | 📄 *T5 (Google) & Transformers Boom* | NLP unifies into Text-to-Text. Hugging Face adoption grows rapidly. License income ×1.2 permanent. If PRET owned: RP +1000 |
| E26 | May 2020 | 🦖 **GPT-3 Drops (175B Parameters)** | Shockwave! LLM Demand = 4 permanent. If Player already released an LLM prior to this month: +2000 Fame (Beat OpenAI!) |

## Threshold events

| # | Trigger | Event | Effect |
|---|---|---|---|
| T1 | First month Fame ≥ 800 / 1500 / 2200 | 👥 Headhunter available | Announce that a headhunter can now recruit the respective Archetype |
| T2 | First month Fame ≥ 2500 | 😇 **Angel investor** | Choice: accept +$25,000, or decline for +200 Fame (bootstrapped pride) |
| T3 | LLM completed with Q ≥ 70.0 | 💼 **The Term Sheet** | A VC offers $2,000,000. Accept → +$2,000,000, WIN ending triggered, game continues. Decline → +500 Fame, game continues. |

## Dynamic Press Coverage (Milestones & Twists)

These events fire exactly once per playthrough when their condition is met. The Engine acts as a tech journalist covering the Player's company.

| # | Trigger | Headline Theme | Effect |
|---|---|---|---|
| M1 | First Model achieves **SOTA Hype** | 📰 **David vs Goliath!** Indie lab beats Big Tech on global benchmarks. | Fame +200 |
| M2 | First Model achieves **Q ≥ 90.0** | 📰 **A Glimpse of the Future?** [Company]'s new model [Model Name] shocks the academic world. | RP +500 |
| M3 | Model released (License/Product) with **Artifacts ≥ 15** | 📰 **AI Gone Rogue!** [Company] faces backlash over hallucinating, biased AI. | Fame −150 |
| M4 | Cash drops below **$0** for the first time | 📰 **Rumors:** Is [Company] running out of runway? Whispers of financial trouble. | Flavor only |
| M5 | Player combines datasets to reach **Size 5** | 📰 **Data Monopoly?** Privacy advocates raise alarms over [Company]'s massive data scraping. | Fame +100 |
| M6 | First Model achieves **Q ≥ 55.0** | 📰 **Rising Star!** [Company] proves they are a serious contender in the AI space. | RP +2500 |

*(Discount stacking and event tracking follow the Research and Events rules).*

# Score Titles

| Score | Title |
|---|---|
| ≥ 33000 | 👑 Home Lab Legend |
| 25000–32999 | 🚀 AI Pioneer |
| 15000–24999 | 🔬 Indie Researcher |
| < 15000 | 🌱 Hobbyist |
| Bankruptcy | 💀 Burned Out (score 0) |

# Freelance Era-Aware Dilemmas

This table provides the generation data for Freelance events. The Engine invents a client and job fitting the **Era Theme**, then applies the mathematically selected **Complication**.

**Axis 1: Era Themes (Flavor only - based on current Year)**
| Years | Theme | Flavor direction |
|---|---|---|
| 2013–2014 | **Rule-based & Regex** | Clients want basic spam filters, web scraping, keyword taggers. They are skeptical of "AI" and prefer hardcoded rules. |
| 2015–2016 | **Early Deep Learning** | Word embeddings, sentiment analysis for brands, basic translation. Clients throw around the buzzword "Deep Learning" but lack data. |
| 2017–2018 | **The Chatbot Craze** | Everyone wants a chatbot, sequence-to-sequence customer support, VC hype. Highly unrealistic expectations. |
| 2019–2020 | **Transformer Era** | Text generation, auto-writing SEO, massive API wrappers. Clients ask for "human-like" text and massive scale. |

**Axis 2: The Complication (Mechanics - selected by Y = Turn % 6)**
| Y | Complication | Choice 1 (Standard) | Choice 2 (The Trade-off) |
|---|---|---|---|
| 0 | **Perfectionism** | Do the bare minimum.<br>Yield: `Base Pay` | Refactor/Polish it perfectly.<br>Yield: `Base Pay × 0.8`, `Fame +80` |
| 1 | **The Dirty Hack** | Build it properly.<br>Yield: `Base Pay` | Use an unstable, messy hack.<br>Yield: `Base Pay × 1.3`, `Fame −80` |
| 2 | **Academic Pivot**| Stick to the spec.<br>Yield: `Base Pay` | Deep dive into the underlying math.<br>Yield: `Base Pay × 0.6`, `RP +400` |
| 3 | **Scope Creep** | Refuse extra work.<br>Yield: `Base Pay` | Accept the heavy extra workload.<br>Yield: `Base Pay × 1.2`, `Fame +100` |
| 4 | **Hardware Crisis**| Work slowly on CPU.<br>Yield: `Base Pay` | Rent emergency cloud compute.<br>Yield: `Base Pay × 1.4`, `Cash −$500` |
| 5 | **Open Source** | Keep it proprietary.<br>Yield: `Base Pay` | Open-source a core module.<br>Yield: `Base Pay × 0.7`, `Fame +150` |

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

# Project Dilemmas

Triggered mid-project based on the Synergy score (see Model Projects rule). The Engine checks the Model's **Scale** to render the appropriate flavor and choices.

---

## Breakthrough (Synergy ≥ 16)

### 1. For Small Scales (Tiny, Base)
Flavor direction determined by `Turn % 4`:
| X | Flavor direction |
|---|---|
| 0 | **Loss dropping beautifully** (Math is perfectly aligned, gradients flow smoothly). |
| 1 | **Sleek abstraction** (Your training loops are clean and highly optimized). |
| 2 | **Data harmony** (The dataset structure fits the architecture's assumptions perfectly). |
| 3 | **Quick Convergence** (The model is learning much faster than expected). |

| Option | Yield / Effect |
|---|---|
| 1. **The Polish** (Spend extra time to perfect it) | `M (total months) +1`, `q_mod +5` |
| 2. **The Spin-off** (Publish intermediate findings) | `RP +800`, `q_mod +0` |

### 2. For Massive Scales (Large, Massive, Frontier)
Flavor direction determined by `Turn % 4`:
| X | Flavor direction |
|---|---|
| 0 | **Emergent property detected!** (The giant model is learning unexpected, high-level reasoning early). |
| 1 | **Hardware synergy** (The custom CUDA kernels you wrote are accelerating the cluster perfectly). |
| 2 | **Scaling Law Alignment** (The validation curve matches scaling laws to the decimal point). |
| 3 | **Zero-shot breakthrough** (The model is solving downstream tasks it wasn't even trained on!). |

| Option | Yield / Effect |
|---|---|
| 1. **The Grand Polish** (Extend training to lock in these emergent capabilities) | `M (total months) +1`, `q_mod +8` |
| 2. **The Academic Shockwave** (Publish a massive preprint to ArXiv immediately) | `RP +2,000`, `q_mod +0` |

---

## Complication (Synergy ≤ 8)

### 1. For Small Scales (Tiny, Base)
Flavor direction determined by `Turn % 4`:
| X | Flavor direction |
|---|---|
| 0 | **Exploding gradients** (Loss is spiking to NaN, math is unstable). |
| 1 | **Data mismatch** (Tokenization/parsing errors are degrading quality). |
| 2 | **Severe overfitting** (Memorizing the training set, failing validation). |
| 3 | **Dead neurons** (ReLU activation collapse is stalling the weights). |

| Option | Yield / Effect |
|---|---|
| 1. **Accept Flaws** (Ignore it and push through) | `q_mod -8` |
| 2. **Refactor** (Delay the project by 1 month to fix the bugs) | `M (total months) +1`, `q_mod +0` |

### 2. For Massive Scales (Large, Massive, Frontier)
Flavor direction determined by `Turn % 4`:
| X | Flavor direction |
|---|---|
| 0 | **CUDA Out of Memory (OOM)** (The massive model layers are too heavy for your GPU memory pool). |
| 1 | **NCCL Cluster Bottleneck** (Inter-GPU communications are stalling, thermal-throttling your rigs). |
| 2 | **Power Grid Overload** (The home lab's circuit breakers are tripping under the immense electrical draw). |
| 3 | **Tokenization Corruption** (A silent parser bug is poisoning the weights with garbage characters). |

| Option | Yield / Effect |
|---|---|
| 1. **Brute Force** (Ignore the errors, bypass safety checks, and let it run hot) | `q_mod -15`, `Fame -50` (due to unstable outputs) |
| 2. **Emergency Infrastructure** (Delay the project 1 month and pay cloud/hardware emergency costs) | `M (total months) +1`, `Cash -$2,500` (cloud/coffee/rewiring), `q_mod +0` |

# Historical Benchmarks

When generating the Local Evaluation for a completed Model, the Game Engine must use **ALL applicable Benchmarks** from the table below (matching the Task and available by the current in-game date).

Do not pad or fill the list. Show exactly as many Benchmarks as are available. (If 0 Benchmarks exist for a Task at the current date, use a single "Internal QA Metric" to calculate Q).

## 1. Official Benchmarks

| Benchmark / Dataset | Available From | Applicable Tasks | Target Domains (Domain Fit) |
|---|---|---|---|
| F1-Score (IMDB/Reuters) | 2013 | CLS | reviews, news, social |
| SST-2 (Stanford Sentiment) | 2013 | CLS | reviews, social, dialogue |
| Perplexity (Penn Treebank) | 2013 | AUTO | news, books, encyclopedic |
| BLEU Score | 2013 | TRANS | parallel |
| ROUGE Score | 2013 | SUMM | news, encyclopedic, books |
| Human Evaluation | 2013 | CHAT | dialogue, social |
| WMT14 En-De Translation | Nov 2014 | TRANS | parallel |
| SNLI (Stanford Inference) | Aug 2015 | CLS, LLM (general) | encyclopedic, news, dialogue |
| Winograd Schema (WSC) | Jul 2015 | AUTO, LLM (general) | books, encyclopedic, dialogue |
| CNN/DailyMail | Jun 2015 | SUMM | news |
| BLEU (Code domain) | Jan 2015 | CODE | code |
| LAMBADA | Jun 2016 | AUTO, LLM (general) | books |
| WikiText | Sep 2016 | AUTO, LLM (general) | encyclopedic, books |
| SQuAD 1.0 | Jun 2016 | QA | QA, encyclopedic |
| ConvAI (Conversational AI) | 2017 | CHAT | dialogue |
| PersonaChat | 2018 | CHAT | dialogue, social |
| SQuAD 2.0 | Jun 2018 | QA | QA, encyclopedic |
| GLUE Benchmark | Apr 2018 | CLS, AUTO, LLM (general) | encyclopedic, news, web-mixed |
| CoQA | Aug 2018 | QA | QA, dialogue |
| Natural Questions (NQ) | Jan 2019 | QA | QA, encyclopedic, web-mixed |
| SuperGLUE | May 2019 | CLS, AUTO, LLM (general) | encyclopedic, books, math, logic |
| HellaSwag | May 2019 | LLM (general) | social, dialogue, web-mixed |
| MMLU | Sep 2020 | LLM (general) | encyclopedic, medical, legal, math |

## 2. Public Reviewers (For Release)
When a Model is officially released (Open-source, License, or Product), the Game Engine must deterministically select exactly **4** of these sources (based on the Model's ID or current Date) to generate the Public Reception reviews (S6-B).
- **ArXiv Peer Review** (Academic perspective)
- **r/MachineLearning** (Practitioner perspective)
- **HackerNews** (Startup/Tech perspective)
- **TechCrunch / Tech Media** (Mainstream hype/fear)
- **Twitter / X AI Community** (Trend-chasing perspective)
- **Hugging Face Community** (Open-source perspective, From 2017)

# Historical SOTA (Rival Models)

When rendering the Benchmark comparison in the Model Completion Report (S6), the Game Engine must find the current SOTA Rival for each Benchmark. 
**Rule:** Find the most recent entry in this table for the specific Benchmark where the `Date` is ≤ the current in-game Month and Year.

| Date | Benchmark | Rival Model (Creator) | SOTA Score (/100) |
|---|---|---|---|
| Jan 2013 | F1-Score (IMDB/Reuters) | SVM / Naive Bayes Baselines | 60.0 |
| Jan 2013 | SST-2 (Stanford Sentiment) | RNTN (Stanford) | 85.0 |
| Jan 2013 | Perplexity (Penn Treebank) | KenLM (N-gram baseline) | 50.0 |
| Jan 2013 | BLEU Score | Moses (Statistical MT) | 40.0 |
| Jan 2013 | ROUGE Score | LexRank Baseline | 45.0 |
| Jan 2013 | Human Evaluation | Cleverbot / ALICE | 40.0 |
| Sep 2013 | Perplexity (Penn Treebank) | word2vec + RNN (Mikolov) | 65.0 |
| Sep 2014 | WMT14 En-De Translation | Seq2Seq (Google) | 55.0 |
| Jan 2015 | BLEU (Code domain) | Statistical AST Baselines | 45.0 |
| Jun 2015 | CNN/DailyMail | Attentive Reader (DeepMind) | 61.6 |
| Jul 2015 | Winograd Schema (WSC) | Statistical Co-occurrence | 52.0 |
| Aug 2015 | F1-Score (IMDB/Reuters) | TextCNN (Yoon Kim) | 75.0 |
| Aug 2015 | SNLI (Stanford Inference) | LSTM Baseline (NYU) | 77.0 |
| Mar 2016 | SNLI (Stanford Inference) | Decomposable Attention (Google) | 86.0 |
| Jun 2016 | SQuAD 1.0 | Logistic Regression Baseline | 51.0 |
| Jun 2016 | LAMBADA | Word CNN | 55.0 |
| Sep 2016 | WikiText | AWD-LSTM (Salesforce) | 68.0 |
| Nov 2016 | SQuAD 1.0 | BiDAF (AllenAI) | 77.0 |
| Nov 2016 | WMT14 En-De Translation | GNMT (Google Neural MT) | 65.0 |
| Jan 2017 | ConvAI (Conversational AI) | ParlAI Baselines (Meta) | 60.0 |
| Apr 2017 | CNN/DailyMail | Pointer-Generator (Stanford) | 72.0 |
| Jun 2017 | WMT14 En-De Translation | Transformer (Google) | 75.0 |
| Jan 2018 | PersonaChat | Key-Value Profile Net (Meta) | 65.0 |
| Feb 2018 | SNLI (Stanford Inference) | ELMo (AllenAI) | 89.1 |
| Apr 2018 | GLUE Benchmark | BiLSTM + ELMo | 70.2 |
| Jun 2018 | SQuAD 2.0 | No-Answer Baseline | 66.0 |
| Jun 2018 | WikiText | GPT-1 (OpenAI) | 75.3 |
| Jun 2018 | LAMBADA | GPT-1 (OpenAI) | 60.2 |
| Aug 2018 | CoQA | DrQA + features (Stanford) | 71.6 |
| Oct 2018 | SQuAD 2.0 | BERT (Google) | 83.5 |
| Oct 2018 | GLUE Benchmark | BERT (Google) | 82.3 |
| Jan 2019 | Natural Questions (NQ) | BERT-QA (Google) | 81.4 |
| Jan 2019 | PersonaChat | TransferTransfo (HuggingFace) | 82.0 |
| Feb 2019 | WikiText | GPT-2 (OpenAI) | 82.4 |
| Feb 2019 | LAMBADA | GPT-2 (OpenAI) | 75.3 |
| May 2019 | HellaSwag | BERT (Google) | 47.3 |
| May 2019 | SuperGLUE | RoBERTa (Meta) | 84.1 |
| Jul 2019 | GLUE Benchmark | RoBERTa (Meta) | 88.2 |
| Oct 2019 | SuperGLUE | T5 (Google) | 88.9 |
| Oct 2019 | CNN/DailyMail | BART (Meta) | 42.9 |
| Jan 2020 | Human Evaluation | Meena (Google) | 80.0 |
| May 2020 | HellaSwag | GPT-3 (OpenAI) | 85.1 |
| May 2020 | LAMBADA | GPT-3 (OpenAI) | 86.2 |
| Sep 2020 | MMLU | GPT-3 175B (OpenAI) | 44.0 |
| Oct 2020 | Human Evaluation | BlenderBot (Meta) | 85.1 |

*(For any Benchmark not explicitly listed here at a given time, or for AI Community fillers, the Game Engine sets the Rival to "Industry Average" with a SOTA Score of `50.0`).*

# Paper Dilemmas

Triggered mid-paper (month 1 of 2). Flavor direction determined by `Turn % 4`:

| X | Complication | Choice 1 (Standard) | Choice 2 (The Trade-off) |
|---|---|---|---|
| 0 | **Reviewer 2's Wrath** (Demands extensive ablation studies) | Argue the point.<br>Yield: `Fame -100` | Do the extra work.<br>Yield: `M +1`, `Final RP +1000` |
| 1 | **Open-Source Pressure** (Conference wants the training code) | Keep proprietary.<br>Yield: `Normal` | Release code & weights.<br>Yield: `Fame +400`, `Cash -$2,000` (hosting) |
| 2 | **Big Tech Co-Author** (A famous lab offers to co-author for prestige) | Solo author.<br>Yield: `Normal` | Accept co-author.<br>Yield: `Fame +500`, `Final RP × 0.5` |
| 3 | **SOTA Overclaim** (Temptation to exaggerate the benchmark results) | Stay honest.<br>Yield: `Normal` | Hype it up.<br>Yield: `Fame +400`, `Final RP × 0.8` (peers lose respect) |
