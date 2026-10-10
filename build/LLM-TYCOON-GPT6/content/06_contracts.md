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

Triggered at most once, when an active Contract first reaches `months elapsed == floor(M ÷ 2)` (for M ≥ 2). Flavor direction is determined by `Turn % 4`:

| X | Complication | Choice 1 (Standard) | Choice 2 (The Trade-off) |
|---|---|---|---|
| 0 | **Scope Creep** (Client wants a new feature mid-way) | Refuse the change.<br>Yield: `Normal` | Accept the extra work.<br>Yield: `M +1`, `Pay +30%` |
| 1 | **Messy Client Data** (The provided data is garbage) | Train on it anyway.<br>Yield: `Pay -20%` | Clean it manually.<br>Yield: `M +1`, `Fame +50` |
| 2 | **Integration Hell** (Legacy systems are blocking deployment) | Hack a quick fix.<br>Yield: `Normal` | Build a proper API.<br>Yield: `M +1`, `Pay +20%`, `Fame +100` |
| 3 | **Early Delivery Request** (Client needs it ASAP) | Decline.<br>Yield: `Normal` | Crunch time.<br>Yield: `Pay +20%`, `Cash -$1,000` (cloud/coffee) |
