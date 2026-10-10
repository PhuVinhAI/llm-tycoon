# Hardware

## Slots

- The home lab has **4 slots**. A one-time upgrade — *Rewire the lab*, $4,000, available any time — raises it to **8 slots**.
- Each piece of Hardware occupies the slots listed in the Content.

## Compute & Capacity

- Total **TFLOPS/mo** = sum of installed Hardware TFLOPS + active cloud units.
- Total **VRAM** = sum of installed Hardware VRAM + active cloud units.
- **Inference VRAM** = sum of reserved VRAM from active Product streams.
- **Available VRAM** = Total VRAM − Inference VRAM.
- During a Project, compute accumulates monthly: effective training compute accumulates under Model Projects; fine-tuning adds none.
- Neural Architectures (compute requirement > 0 in the Content) cannot start with Total TFLOPS/mo < 100, and require the GPUT technology.

## Buying and selling

- Buying (instant): any shop item whose availability date has passed (Content). Upkeep starts the month of purchase (Economy rule).
- Selling (instant): returns 50% of the purchase price. Not allowed during an active Project, and never allowed if the sale would make installed Hardware VRAM lower than the Inference VRAM reserved by active Product streams.

## Cloud rental (available per the Event Calendar)

- $1,000 per month per **+1000 TFLOPS** unit (+160 GB VRAM); maximum 2 units.
- Cloud rental may be activated while a Project is active, or in the same instant-action chain immediately before starting a Project. If that Project fails validation or is not started in the same reply, cancel the activation with no charge.
- Cloud rental supplies compute and VRAM only during months whose main action starts or continues that Project. It is inactive and costs nothing during forced Freelance pauses.
- It deactivates before release choices when the Project ends. Cloud VRAM can never satisfy the persistent Inference VRAM reservation of a Product.
