# Datasets

## Acquiring

- **Collect** (main action): create a Dataset in a chosen Domain — Size 2, Quality 2. With SCRAPE technology: Size 3. Staff effects apply (Content). Collectable Domains are listed in the Content.
- **Buy** (instant): from the dataset market (Content), once each.
- **Claim** (instant): free Datasets made available by Events (Content), once each.

## Improving

- **Clean** (main action): one owned Dataset gains Quality +1 (max 5).
- **Combine** (instant): merge two owned Datasets of the same Domain into one — Size = the larger Size + 1 (cap 5), Quality = the lower of the two. The originals are consumed.

## Domain fit

Evaluate dataset domains against benchmark targets under `rules/08_model_projects.md`; target domains are in `content/13_benchmarks.md`.

## Usage

- Mixtures require distinct IDs and distinct (domain, size, quality, taskId) records; renaming does not create coverage. Combine requires distinct owned IDs of one Domain and preserves source provenance in sourceId (joined sorted source IDs); originals are consumed.
- A Project uses **1 to 3 Datasets** (a Data Mixture). The Datasets are not consumed — they can be reused (but see the repeat penalty in Model Projects).
- **Combined Size** = Max Size + Count − 1 (cap 5), and **Combined Quality** = floor(Average Quality). Architecture Baseline Data Size and Scale Ideal Data Size affect Quality; they are not hard start requirements. The LLM Project's explicit Combined Size 5 and Combined Quality ≥ 3 requirements remain hard.
