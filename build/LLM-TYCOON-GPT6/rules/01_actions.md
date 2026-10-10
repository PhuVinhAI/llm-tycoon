# Actions

## Main actions (one per month)

| Action | Effect |
|---|---|
| 💼 **Freelance** | Generates an Era-aware Dilemma (Content).<br>1. Calculate `Base Pay` = $3,800 + $100 × floor(Fame ÷ 500).<br>2. Determine **Era Theme** based on the current Year.<br>3. Select **Complication** `Y` = Turn % 6.<br>4. Pause the game. Use Creative License to output a short story combining the Era Theme and Complication, then present Choice 1 and Choice 2 (with exact calculated yields).<br>5. Wait for the Player's choice and apply the outcome. |
| 🔬 **Research** | Generates an Era-aware Dilemma (Content).<br>1. Calculate `Base RP` = 400 + 200 × R-Lv + staff bonuses.<br>2. Determine **Era Theme** based on the current Year.<br>3. Select **Complication** `Y` = (Turn + 3) % 6.<br>4. Pause the game. Use Creative License to output a short story combining the Era Theme and Complication, then present Choice 1 and Choice 2 (with exact calculated yields).<br>5. Wait for the Player's choice and apply the outcome. Increments the `research` counter by 1 (plus any bonus from the choice). |
| 🏗️ **Start/Continue Project** | Start a new Project (advances month 1) or advance an active Project by one month. At the midpoint, evaluate Project Synergy at most once and record `dilemma_done=yes` (see Model Projects). |
| 📜 **Accept/Continue Contract** | Accept a new Contract (advances month 1) or advance an active Contract by one month. At the midpoint, trigger at most one Contract Dilemma and record `dilemma_done=yes` (see Contracts). |
| 📝 **Start/Continue Paper** | Select an eligible Model and start a Paper (applies its release-specific immediate consequences and advances month 1), or advance an active Paper by one month. At month 1, trigger its single Paper Dilemma and record `dilemma_done=yes` (see Academic Papers). |
| 📦 **Collect dataset** | Create a Dataset in a chosen Domain: Size 2, Quality 2. SCRAPE technology → Size 3. Staff effects apply (Content). |
| 🧹 **Clean dataset** | One owned Dataset: Quality +1 (max 5). |

## Instant actions (free, any number per turn)

- Unlock a Technology by paying its RP cost (prerequisites required).
- Buy or sell Hardware; buy a Dataset; claim a free Dataset made available by an Event.
- Combine two Datasets (see Datasets rule).
- Pay a Headhunter to search for Employees, or fire an Employee.
- Activate or deactivate cloud rental (Hardware rule).
- Submit a Model to an open Competition.
- View Portfolio (check released/shelved models and active income streams).
- Shutdown a Product (instantly cancel an active Income Stream to free up its reserved Inference VRAM; forfeits remaining income and User Logs).
- Analyze a completed Model (ask the engine for a post-mortem review).
- Request a downloadable save, help, public Requirements, current status, or play history from the Event Log. Help follows the disclosure rules; hidden formulas and unearned synergy knowledge remain hidden.

## Commitment and cancelling

- Starting a Project, accepting a Contract, or starting a Paper consumes the current month's main action. While active, the Player's main action is restricted to "Continue Project", "Continue Contract", or "Continue Paper" until completion.
- Because the game pauses at the Dashboard every month, the Player can perform instant actions (like buying Hardware or claiming Datasets) mid-project.
- The Player may **cancel** from the Action Menu at any time: months already spent stay spent, nothing is produced, and Fame −100 (Project/Paper) or −200 (Contract).
- Only one Project, Contract, **or** Paper may be active at a time.
