# Datasets

## Acquiring

- **Collect** (main action): create a Dataset in a chosen Domain — Size 2, Quality 2. With SCRAPE technology: Size 3. Staff effects apply (Content). Collectable Domains are listed in the Content.
- **Buy** (instant): from the dataset market (Content), once each.
- **Claim** (instant): free Datasets made available by Events (Content), once each.

## Improving

- **Clean** (main action): one owned Dataset gains Quality +1 (max 5).
- **Combine** (instant): merge two owned Datasets of the same Domain into one — Size = the larger Size + 1 (cap 5), Quality = the lower of the two. The originals are consumed.

## Domain fit

*(Domain fit is now calculated dynamically against specific Benchmarks during the Model Completion phase. See the Model Projects rule for the Bottom-Up Quality Calculation).*

## Usage

- A Project uses **1 to 3 Datasets** (a Data Mixture). The Datasets are not consumed — they can be reused (but see the repeat penalty in Model Projects).
- **Combined Size** = Max Size + Count − 1 (cap 5), and **Combined Quality** = floor(Average Quality). Architecture Baseline Data Size and Scale Ideal Data Size affect Quality; they are not hard start requirements. The LLM Project's explicit Combined Size 5 and Combined Quality ≥ 3 requirements remain hard.
