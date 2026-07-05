# 🏭 LLM Tycoon

**A tycoon game about building an AI company — run entirely by an LLM.**
**Game tycoon về việc xây dựng một công ty AI — do chính LLM vận hành.**

You start in a tiny **home lab** in **January 2013**, when LLMs don't exist yet. Research your way through real AI history — word2vec, LSTM, Seq2Seq, Attention, Transformer, pre-training — and race the timeline to train the world's first LLM before 2021.

## ▶️ Play now / Chơi ngay

1. Run `npm run build` (or grab the latest [`build/LLM-TYCOON.md`](./build/LLM-TYCOON.md)).
2. **Send the file** to a capable LLM chat (ChatGPT, Claude, Gemini…) — attach it or paste its full contents.
3. The AI boots as the Game Engine: title screen → pick your **language** and **UI** (📱 mobile / 🖥️ desktop) → main menu (New game / Continue / How to play / About / Exit).

> Bản chơi được là **một file duy nhất**, sạch tuyệt đối (không comment, không nhắc gì đến repo) — gửi hẳn file cho LLM là game tự khởi động với màn hình tiêu đề và main menu.

## 🔨 Build

The game is authored as modular Markdown (one directory per concern, one file per idea, Vietnamese notes in HTML comments). A small Node.js script assembles everything into the single playable file:

```bash
npm run build        # bản chuẩn gửi cho LLM: sạch mọi comment
npm run build:full   # giữ comment tiếng Việt (CHỈ để review, không dùng để chơi)
```

Every build produces **two files**:

| Output | Contents | For |
|---|---|---|
| [`build/LLM-TYCOON.md`](./build/LLM-TYCOON.md) | The game, clean — zero mention of Dev Mode | Players: send this one to the LLM |
| `build/LLM-TYCOON-DEV.md` | Same game **+ the `dev/` modules** (hidden `dev` command) | Developers: autoplay simulations & balance reports |

The assembly order is the `MANIFEST` in [`scripts/build.js`](./scripts/build.js); entries flagged `devOnly` go only into the DEV file. Never edit the build outputs directly — edit the source modules and rebuild.

## 🎮 v0.3 — Chapter 1: Home Lab

- **Era:** 2013–2020, from pre-LLM to the first LLM. A fixed event calendar built from real AI history (word2vec, TensorFlow, AlphaGo, *Attention Is All You Need*, BERT, GPT-2…). Follow history for research discounts — or beat the papers to it for glory.
- **Loop:** 1 turn = 1 month. Freelance for cash, research the tech tree, collect & clean datasets, buy GPUs, hire up to 2 helpers, ship models (open-source / license / product), take contracts, win competitions.
- **Endgame:** train an LLM with Quality ≥ 70 → VC term sheet → *From Home Lab to Headquarters*. Scored endings with titles.
- **Game-like shell:** title screen, language + device setup, main menu (New / Continue / How to play / About / Exit), in-game commands `save` `menu` `help` `ui` `lang`.
- **Multi-UI:** every screen has two pre-configured markdown skeletons — 🖥️ desktop (landscape) and 📱 mobile (portrait) — switchable at any time.
- **Deterministic core, creative shell:** every number derives from formulas, tables, and the calendar (portable across chats via SAVE blocks) — while the **Creative License** system lets the AI improvise flavor scenes, recurring characters, and era-true world color that never touch the mechanics.
- **🧪 Dev Mode (separate DEV build only):** in a session running `build/LLM-TYCOON-DEV.md`, type `dev` to make the AI **play the game against itself** — a Simulated Player makes every choice with a deterministic dice protocol (LCG, reproducible per seed), one log line per month, up to 5 runs per batch — then outputs a **balance report** (economy curve, tech progress, action distribution, auto-detected balance flags, tuning suggestions). Config: `runs= seed= policy=random|human until=`; control with `dev report` / `dev continue` / `dev exit`. The player build contains no trace of it. See [`dev/00_dev_mode.md`](./dev/00_dev_mode.md).

## 📁 Repository structure

| Directory | Purpose |
|---|---|
| `system/` | How the Game Engine (the LLM) must behave: role, principles, workflow, conflicts, authority, language, output discipline, save/load, creative license |
| `dev/` | Developer-only modules — Dev Mode (dice-driven autoplay + balance report). Assembled **only** into `LLM-TYCOON-DEV.md` |
| `shared/` | Canonical glossary and documentation conventions |
| `definitions/` | What each entity **is**: Player, Company, Employee, Resource, Skill, Technology, Architecture, Task, Dataset, Hardware, Model, Project, Contract |
| `rules/` | How the simulation **behaves**: turns, actions, economy, research, skills, REP, datasets, hardware, model projects, contracts, employees, events, the LLM endgame, scoring |
| `content/` | Game **data**: tech tree, architectures, match matrix, demand, shops, contracts, employees, the 2013–2020 event calendar, titles |
| `scenarios/` | Initial Game States (`00_home_lab.md`) |
| `ui/` | The player-facing shell: boot sequence, main menu, per-profile screen skeletons (desktop/mobile), SAVE format, worked example |
| `meta/` | Build-file wrappers (header/footer) and the Game Info card |
| `scripts/` | `build.js` — assembles the single-file game |
| `build/` | Generated playable file (do not edit) |

Authoring conventions (bilingual English body + Vietnamese comments, one idea per file, numbered ordering) live in [`shared/conventions.md`](./shared/conventions.md).

## 🗺️ Roadmap

- [x] System instructions, glossary, entity definitions
- [x] Rules, content, scenario — Chapter 1 gameplay
- [x] Node.js build → single LLM-runnable file (comment-free)
- [x] Game shell: title screen, main menu, Game Info card
- [x] Multi-UI system (desktop landscape / mobile portrait)
- [x] Creative License — bounded AI improvisation on top of the deterministic core
- [x] Dev Mode — hidden `dev` command in the separate DEV build: dice-driven autoplay simulation + statistics + balance report
- [ ] Balance pass from real playthroughs (use Dev Mode reports)
- [ ] Chapter 2: the Office era (bigger teams, products, API business, safety incidents)
- [ ] Chapter 3: frontier lab era (scaling laws, alignment, compute wars)
