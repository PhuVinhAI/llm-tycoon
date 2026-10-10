# Freelance Era-Aware Dilemmas

This table provides the generation data for Freelance events. The Engine invents a client and job fitting the **Era Theme**, then applies the mathematically selected **Complication**.

**Axis 1: Era Themes (Flavor only - based on current Year)**
| Years | Theme | Flavor direction |
|---|---|---|
| 2013–2014 | **Rule-based & Regex** | Clients want basic spam filters, web scraping, keyword taggers. They are skeptical of "AI" and prefer hardcoded rules. |
| 2015–2016 | **Early Deep Learning** | Word embeddings, sentiment analysis for brands, basic translation. Clients throw around the buzzword "Deep Learning" but lack data. |
| 2017–2018 | **The Chatbot Craze** | Everyone wants a chatbot, sequence-to-sequence customer support, VC hype. Highly unrealistic expectations. |
| 2019–2020 | **Transformer Era** | Text generation, auto-writing SEO, massive API wrappers. Clients ask for "human-like" text and massive scale. |
| 2021+ sandbox | **Mature Transformer Market** | Continue the 2020 market context using only technologies and historical developments already present in the Game State. Do not invent later real-world products, companies, or events. |

**Axis 2: The Complication (Mechanics - selected by Y = draw_dilemma(state, 'freelance'))**
| Y | Complication | Choice 1 (Standard) | Choice 2 (The Trade-off) |
|---|---|---|---|
| 0 | **Perfectionism** | Do the bare minimum.<br>Yield: `Base Pay` | Refactor/Polish it perfectly.<br>Yield: `Base Pay × 0.8`, `Fame +80` |
| 1 | **The Dirty Hack** | Build it properly.<br>Yield: `Base Pay` | Use an unstable, messy hack.<br>Yield: `Base Pay × 1.15`, `Fame −80`, `RP −min(200, current RP)`` |
| 2 | **Academic Pivot**| Stick to the spec.<br>Yield: `Base Pay` | Deep dive into the underlying math.<br>Yield: `Base Pay × 0.6`, `RP +400` |
| 3 | **Scope Creep** | Refuse extra work.<br>Yield: `Base Pay` | Accept the heavy extra workload.<br>Yield: `Base Pay × 0.9`, `Fame +100` |
| 4 | **Hardware Crisis**| Work slowly on CPU.<br>Yield: `Base Pay` | Rent emergency cloud compute.<br>Yield: `Base Pay × 1.4`, `Cash −(Base Pay × 0.45)`, `RP +150` |
| 5 | **Open Source** | Keep it proprietary.<br>Yield: `Base Pay` | Open-source a core module.<br>Yield: `Base Pay × 0.7`, `Fame +150` |
