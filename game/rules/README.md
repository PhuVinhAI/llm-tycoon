# Rules

## Purpose

This directory defines the game mechanics of LLM Tycoon — how the simulation behaves.

Rules describe how defined entities act and interact: how time passes, how actions resolve, how money and reputation flow, how models are built and evaluated, and how the game ends.

Rules reference Definitions for meaning and Content for concrete numbers whenever the data may grow (catalogs, pools, calendars). Formulas and thresholds that ARE the mechanic live here.

---

# Scope

* Turn structure and order of operations.
* Player Actions and their effects.
* Economy: costs, income, rounding, failure states.
* Research, skills, reputation.
* Datasets, hardware, model projects, contracts, employees.
* Events, competitions, the endgame, endings and scoring.

---

# What Rules Do Not Include

Rules do not define what an entity is (Definitions).

Rules do not list concrete game data such as the technology tree, shop items, or the event calendar (Content).

Rules do not establish an initial Game State (Scenarios).

Rules do not define output formatting (UI).

---

# Ordering

Files are numbered in reading order: general mechanics first, specific systems later. The build assembles them in file-name order.

## Tiếng Việt

Thư mục này định nghĩa cơ chế trò chơi — mô phỏng vận hành thế nào: thời
gian, hành động, kinh tế, nghiên cứu, kỹ năng, danh tiếng, dữ liệu, phần
cứng, dự án model, hợp đồng, nhân sự, sự kiện, endgame và tính điểm.

Rules không định nghĩa thực thể (việc của definitions/), không chứa bảng dữ
liệu cụ thể (việc của content/), không thiết lập trạng thái đầu (việc của
scenarios/), không định nghĩa định dạng đầu ra (việc của ui/).
