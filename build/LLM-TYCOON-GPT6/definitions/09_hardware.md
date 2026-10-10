# Hardware

---

## Definition

Hardware is physical computing equipment owned by a Company, primarily GPUs.

Each piece of Hardware occupies one or more slots in the Company's facility, provides TeraFLOPS per month (TFLOPS/mo) for training speed, and VRAM (GB) for capacity. The Company's total TFLOPS/mo and Total VRAM is the sum over all installed Hardware, plus any rented cloud compute.

Training Models consumes compute measured in TFLOPS-months, but requires sufficient Available VRAM to even start.

---

## Attributes

A piece of Hardware may be associated with information such as:

* Name
* Price
* TFLOPS provided per month
* VRAM capacity (GB)
* Slots occupied
* Upkeep cost
* Availability date

The concrete values are defined in the Content.

---

## Relationships

* Hardware is owned by a Company and installed in its facility slots.
* Hardware provides the compute consumed by Projects.
* Hardware may be bought and sold as permitted by the Rules.
* Cloud compute is rented Hardware capacity that occupies no slot.
