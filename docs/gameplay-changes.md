# Gameplay 1.0 — chỉnh sửa sau đánh giá

Đã triển khai trong nguồn game và ZIP ngày 10/10/2026. Báo cáo gameplay-review là phân tích bản trước chỉnh sửa; số liệu trong báo cáo đó không còn là luật hiện hành.

- Tin tức: Python lấy mọi dated row từ Event Calendar, Benchmarks và Rival Models, gồm cả rumor và tin chỉ có nội dung. Mỗi nguồn có ID; save giữ outbox và nội dung đã hiển thị. Không thể kết thúc tháng hay bỏ checkpoint khi thiếu tin/hiệu ứng/xác nhận hiển thị. Lịch không phụ thuộc Research, Freelance hay Continue. Tin đã gửi cũng được ghi vào event log; context reset/import tiếp tục tin chưa gửi.
- Commitment: RP từ breakthrough và Fame từ Paper/Contract được trả ở completion; hủy mất thưởng đang chờ. Code đã public không thể đổi lại thành proprietary bằng hủy Paper.
- Model: NGRAM/BOW chỉ Tiny/Base, chạy trên CPU khởi đầu. Quality tăng với lợi ích giảm dần thay vì cap sớm; Training/Eval thay đổi compute/artifacts. Staff được tính theo tháng thực làm; Fine-tune không thêm training compute.
- Đánh giá: target benchmark đóng băng ở đầu project; test mới hiển thị Expanded, không tự giảm giá trị sản phẩm cũ. LLM dùng tất cả general tests tại completion. Domain fit tính theo coverage có trọng số; tên User Logs không cấp bonus. Mixture chặn ID/coverage trùng.
- Tiến bộ: thiết kế tương đương dựa trên architecture/task/scale/data stats, không theo tên/ID. Lặp giảm Q và RP/Fame/doanh thu; chỉ thiết kế mới tăng engineering. Dilemma dùng deck theo seed của run, không lựa tháng để farm loại tốt.
- Kinh tế: bỏ Fame thưởng vì còn Artifacts; License $90/Q và Product $25/Q/tháng tạo lợi ích rõ hơn cho giữ sản phẩm. Scale có phân khúc giá; Artifacts giảm thu theo mức độ. Logs giữ domain/provenance. Contract trả thêm dữ liệu khách hàng.
- Đội ngũ: chỉ một người mỗi archetype. Optimizer rẻ/vừa/đắt có multiplier 0.85/0.75/0.65 tương ứng; trả lương cao có hiệu quả cao. Sửa các lựa chọn thêm việc/cloud/early delivery để có chi phí thật.
- Thị trường: SOTA hiện tại tính lại khi release, so đúng target benchmark. Hype theo các milestone task/date rõ, không chọn arbitrary future row gần nhất. Stream giữ quote tại release; event mới chỉ tác động release mới. CNN/DailyMail rival scores được đưa về thang game nhất quán.
- LLM: hai cloud unit đủ 320 GB từ 2017, không phải chờ K80. Thắng cần Q ≥80 và mọi target ≥65. Từ chối funding vẫn có thể nhận offer ở LLM sau; không nhận vốn hai lần.
- Điểm: vốn huy động loại khỏi phần Cash; số thiết kế và thành phần tiền có giới hạn, thêm thưởng thời gian. Chốt campaign ở lần thắng đầu sau release; sandbox không farm lại điểm campaign.
- UI: mở Shop/Data từ đầu, tutorial chỉ đúng RP cần tích, wizard hiển thị chi phí/runway. Chạy tới checkpoint theo yêu cầu vẫn gửi tin từng tháng và dừng ở mọi quyết định.

Python có helper cho các phép tính/transition trọng yếu; GPT vẫn xử lý các action, effect calendar, choices và diễn đạt nội dung. Runtime không quan sát màn hình: xác nhận tin phải được ghi sau khi AI đã phát nội dung thực tế, không bảo đảm được một model cố tình ghi nhận giả.

Kiểm tra gồm toàn bộ source rows, nhiều tin đồng tháng, Continue/fine-tune, tháng không có tin, bỏ sót hiển thị, pause/import, duyệt đủ 96 tháng 2013–2020 qua save/commit và đối chiếu log, cùng các tình huống thưởng/Quality/kinh tế/LLM. Đây là kiểm thử phần mềm và tình huống định lượng; độ khó tổng thể vẫn cần các ván chơi qua GPT-6/UI.
