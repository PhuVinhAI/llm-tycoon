<!--
===============================================================================
FILE: 01_actions.md
MODULE: Rules / Actions

Mục đích:
Định nghĩa toàn bộ Player Action hợp lệ: hành động chính (tốn 1 tháng) và
hành động tức thời (miễn phí thời gian).

Tác dụng:
Đây là danh sách "những gì người chơi được làm". Mọi yêu cầu ngoài danh sách
này đều không hợp lệ (theo system/05_authority.md).

Trách nhiệm:
- Định nghĩa hành động chính và công thức của chúng.
- Định nghĩa hành động tức thời.
- Định nghĩa cơ chế cam kết và hủy ngang.
===============================================================================
-->

# Actions

## Main actions (one per month)

| Action | Effect |
|---|---|
| 💼 **Freelance** | Generates an Era-aware Dilemma (Content).<br>1. Calculate `Base Pay` = $3,500 + $100 × floor(Fame ÷ 500).<br>2. Determine **Era Theme** based on the current Year.<br>3. Select **Complication** `Y` = Turn % 6.<br>4. Pause the game. Use Creative License to output a short story combining the Era Theme and Complication, then present Choice 1 and Choice 2 (with exact calculated yields).<br>5. Wait for the Player's choice and apply the outcome. |
| 🔬 **Research** | Generates an Era-aware Dilemma (Content).<br>1. Calculate `Base RP` = 400 + 200 × R-Lv + staff bonuses.<br>2. Determine **Era Theme** based on the current Year.<br>3. Select **Complication** `Y` = (Turn + 3) % 6.<br>4. Pause the game. Use Creative License to output a short story combining the Era Theme and Complication, then present Choice 1 and Choice 2 (with exact calculated yields).<br>5. Wait for the Player's choice and apply the outcome. Increments the `research` counter by 1 (plus any bonus from the choice). |
| 🏗️ **Project month** | Advance the active Project by one month. If `months elapsed == floor(M ÷ 2)` (and M ≥ 2), pause and evaluate Project Synergy to potentially trigger a Dilemma (see Model Projects). |
| 📜 **Contract month** | Advance the active Contract by one month. If `months elapsed == floor(M ÷ 2)` (and M ≥ 2), pause and trigger a Contract Dilemma (see Contracts). |
| 📝 **Paper month** | Advance the active Paper by one month. At `months elapsed == floor(M ÷ 2)`, pause and trigger a Paper Dilemma (see Academic Papers). |
| 📦 **Collect dataset** | Create a Dataset in a chosen Domain: Size 2, Quality 2. SCRAPE technology → Size 3. Staff effects apply (Content). |
| 🧹 **Clean dataset** | One owned Dataset: Quality +1 (max 5). |

## Instant actions (free, any number per turn)

- Unlock a Technology by paying its RP cost (prerequisites required).
- Buy or sell Hardware; buy a Dataset; claim a free Dataset made available by an Event.
- Combine two Datasets (see Datasets rule).
- Pay a Headhunter to search for Employees, or fire an Employee.
- Accept a Contract (its months become committed, starting this month).
- Start a Project (its months become committed, starting this month).
- Start a Paper (its months become committed, starting this month. Instantly cancels the model's active Income Stream).
- Activate or deactivate cloud rental (Hardware rule).
- Submit a Model to an open Competition.
- View Portfolio (check released/shelved models and active income streams).
- Analyze a completed Model (ask the engine for a post-mortem review).
- Request save, help, rules explanation, current status, or play history (`history` command).

## Commitment and cancelling

- Starting a Project or accepting a Contract commits the coming months. While active, the Player's main action is restricted to "Continue Project" or "Continue Contract" until completion.
- Because the game pauses at the Dashboard every month, the Player can perform instant actions (like buying Hardware or claiming Datasets) mid-project.
- The Player may **cancel** from the Action Menu at any time: months already spent stay spent, nothing is produced, and Fame −100 (Project/Paper) or −200 (Contract).
- Only one Project, Contract, **or** Paper may be active at a time.

<!--
Tiếng Việt (tóm tắt):
Hành động chính (mỗi tháng 1): Freelance (+$3,000 + $100×⌊Fame/500⌋); Research
(tạo Dilemma với Base RP = 400 + 200×R-Lv + bonus nhân viên); tháng Dự án; tháng Hợp đồng; Thu thập
dataset (Size 2 Q2, có SCRAPE → Size 3); Làm sạch dataset (+1 Quality, tối
đa 5).

Hành động tức thời (miễn phí, không giới hạn): mở khóa công nghệ bằng RP;
mua/bán phần cứng; mua/nhận dataset; gộp dataset; thuê/sa thải nhân viên;
nhận hợp đồng; bắt đầu dự án; bật/tắt cloud; nộp thi; save/help/status.

Cam kết: bắt đầu dự án/nhận hợp đồng sẽ khóa các tháng tới. Hủy ngang được
tại điểm dừng: tháng đã tiêu không hoàn lại, không có sản phẩm, Fame −100 (dự
án) hoặc −200 (hợp đồng). Chỉ 1 dự án HOẶC 1 hợp đồng chạy tại một thời điểm.
-->
