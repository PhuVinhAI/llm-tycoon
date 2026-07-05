<!--
===============================================================================
FILE: 11_events_and_competitions.md
MODULE: Rules / Events and Competitions

Mục đích:
Định nghĩa cách Event Calendar vận hành và cơ chế cuộc thi.

Tác dụng:
Thế giới chuyển động không phụ thuộc người chơi: các bài báo khoa học, đợt
ra mắt GPU, cơn sốt thị trường... nổ đúng lịch (Content). Đây là nguồn
"bất ngờ có kịch bản" duy nhất của game — thay thế hoàn toàn cho ngẫu nhiên.

Trách nhiệm:
- Định nghĩa cách kích hoạt và hiệu lực của sự kiện.
- Định nghĩa cơ chế Competition.
- Không liệt kê sự kiện cụ thể (Event Calendar nằm ở content/).
===============================================================================
-->

# Events and Competitions

## Firing events & Historical News

- In the Events step of every month, the Engine fires events from two sources:
  1. **The Event Calendar (Content):** Fire entries matching the current month, plus threshold events (Fame, releases). Track these as flags in the Game State. Apply their mechanical effects.
  2. **Auto-generated Historical News:** The Engine monitors the **Historical Benchmarks** and **Historical SOTA (Rival Models)** tables. If the current in-game Month and Year exactly matches the release date of a Benchmark or SOTA model, the Engine automatically fires a News Event for it. (These have no mechanical effects unless they also appear in the Event Calendar).
- Events with a Player choice pause any batch and wait for the answer.
- Never foreshadow events (Output Discipline).

## Lasting effects

- Some events change the world permanently or for a stated period: research discounts, demand overrides, income multipliers, paradigm shifts. Apply them from the moment they fire until their stated end (or forever if none), and record them as flags.

## Competitions

- A competition event opens a **3-month submission window** (the firing month and the two after).
- **Submitting** is an instant action. Eligible Model: matches the required Task, was completed within the last 12 months, and has not been submitted to this competition before.
- If the Model's Q ≥ the threshold: win the listed prize immediately. Otherwise nothing happens, but the engine reveals the threshold.
- Each competition can be won once; multiple different Models may be submitted within the window until it is won or the window closes.

<!--
Tiếng Việt (tóm tắt):
Kích hoạt: ở bước Sự kiện mỗi tháng, nổ mọi sự kiện đúng tháng trong Event
Calendar + mọi sự kiện ngưỡng vừa thỏa (Fame, phát hành model). Mỗi sự kiện
nổ đúng một lần; lưu cờ (flag) trong Game State. Sự kiện cần lựa chọn thì
tạm dừng chuỗi tháng đang chạy. Không bao giờ tiết lộ trước sự kiện.

Hiệu lực kéo dài: giảm giá nghiên cứu, đổi Demand, nhân thu nhập, chuyển
paradigm... áp dụng từ lúc nổ đến hết hạn ghi trong sự kiện (không ghi thì
vĩnh viễn), lưu thành cờ.

Cuộc thi: sự kiện thi mở cửa sổ nộp bài 3 tháng (tháng nổ + 2 tháng sau).
Nộp là hành động tức thời. Model hợp lệ: đúng Task, hoàn thành trong 12
tháng gần nhất, chưa từng nộp cuộc thi này. Q ≥ ngưỡng → thắng giải ngay;
không đạt thì không mất gì nhưng engine công bố ngưỡng. Mỗi cuộc thi chỉ
thắng một lần; được nộp nhiều model khác nhau trong cửa sổ.
-->
