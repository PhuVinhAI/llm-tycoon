# Dev

## Purpose

This directory contains developer-only modules that are excluded from the standard playable build.

The build script produces two files:

* `build/LLM-TYCOON.md` — the standard build for players. It contains **nothing** from this directory and never mentions Dev Mode.
* `build/LLM-TYCOON-DEV.md` — the development build: the standard build plus every module in this directory, appended to PART 0 (system).

---

# Scope

The documents in this directory define:

* Dev Mode — the hidden `dev` command that makes the Game Engine play the game against itself (a dice-driven Simulated Player), log every month, and output a balance report (Dev Report, screen S10).

---

# Design Principles

Dev modules must be **self-contained**:

* Any adjustment to the behavior of other modules (Output Discipline, Save/Load, Creative License) is declared inside the dev module itself, as an explicit precedence section scoped to "while Dev Mode is active".
* Shared documents (`system/`, `ui/`, `rules/`, …) must never reference Dev Mode — they are part of the standard build, which must stay free of any dev traces.
* Dev modules never change game mechanics: a simulation must obey every Rule exactly as a normal run would.

---

<!--
Tiếng Việt:
Thư mục này chứa các module CHỈ dành cho người phát triển, không bao giờ vào
bản build chuẩn. Build ra 2 file: build/LLM-TYCOON.md (bản sạch cho người
chơi, không nhắc gì tới Dev Mode) và build/LLM-TYCOON-DEV.md (bản chuẩn +
toàn bộ module trong thư mục này, ghép vào cuối PART 0).

Nguyên tắc: module dev phải TỰ CHỨA — mọi điều chỉnh với module khác khai
báo ngay trong module dev (mục Precedence, chỉ hiệu lực khi Dev Mode bật);
file dùng chung tuyệt đối không tham chiếu Dev Mode; module dev không được
đổi cơ chế game (mô phỏng phải chạy đúng 100% Rules).
-->
