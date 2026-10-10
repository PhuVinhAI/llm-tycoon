# 🏭 LLM Tycoon 1.0

Game xây dựng công ty AI từ một home lab tháng 1/2013, dành cho **GPT-6 có Python và Giao diện thông minh**.

Bản chơi là [LLM-TYCOON-GPT6.zip](build/LLM-TYCOON-GPT6.zip). **README.md chung nằm ngay ở gốc ZIP**, chứa hướng dẫn khởi động, bảng định tuyến theo hành động và danh mục toàn bộ file. GPT-6 giải nén rồi đọc đúng tài liệu cần cho mỗi lượt, thay vì nạp một prompt khổng lồ.

## Chơi

Đính kèm ZIP vào chat GPT-6 có khả năng thực thi Python và yêu cầu chơi. Model đọc README trong ZIP, khởi động game hoặc nạp save đã cung cấp. Bạn chọn hành động bằng giao diện tương tác hoặc ngôn ngữ tự nhiên.

Giao diện thích ứng theo nội dung; không cần chọn PC hay điện thoại. Luật, Content và số liệu vẫn xác định. GPT-6 diễn giải và kể chuyện; Python tính toán, kiểm tra và lưu các chuyển trạng thái.

Lệnh `save` tạo file tải xuống. ZIP save chứa trạng thái và lịch sử, kể cả tình huống đang chờ bạn chọn. Đính kèm ZIP game cùng save để tiếp tục ở chat mới. File trong sandbox có thể hết hạn, nên file tải xuống là cách mang tiến trình qua các phiên.

## Cấu trúc bên trong ZIP

~~~text
README.md                  ← điểm bắt đầu + map toàn bộ file
package-index.json         ← phiên bản, đường dẫn và hash
meta/                      ← thông tin game
system/                    ← chỉ dẫn vận hành GPT-6
shared/                    ← glossary
definitions/               ← thực thể
rules/                     ← luật
content/                   ← dữ liệu và lịch AI
scenarios/                 ← Home Lab + state JSON khởi đầu
ui/                        ← hợp đồng nội dung các màn hình
runtime/                   ← schema + helper Python
  state/                   ← tạo khi chơi: save, log, journal
  exports/                 ← tạo khi chơi: file tải xuống
~~~

ZIP phát hành chỉ chứa tài liệu và mã runtime cần chơi. Chỉ có một README chung; các README dành cho người phát triển ở từng thư mục nguồn không vào ZIP.

## Build và kiểm tra

~~~sh
bun install
bun run build
bun run typecheck
bun run lint
bun test tests/package.test.ts
py -3.7 -m unittest discover -s tests/python -v
~~~

Build xuất thư mục [build/LLM-TYCOON-GPT6](build/LLM-TYCOON-GPT6) và ZIP cùng tên. README và index được sinh từ manifest, nên danh mục tự cập nhật theo file nguồn. Không xuất prompt Markdown gộp hay biến thể DEV.

Sửa nguồn trong `game/`, rồi build lại; không sửa trực tiếp artifact. Helper Python dùng standard library, hỗ trợ Python 3.7 trở lên.

## Gameplay và giới hạn runtime

Một tháng gồm sự kiện, hành động, thu nhập, chi phí, hoàn tất và kiểm tra. Nghiên cứu công nghệ, quản lý dữ liệu/GPU, huấn luyện model, phát hành, thuê người, hợp đồng và bài báo dẫn tới dự án LLM. Chương Home Lab vẫn có sandbox sau cột mốc thắng.

Helper có schema validation, transaction journal, chống lặp cùng action ID, lưu trạng thái đang chờ, import/export và lịch sử. **Nó chưa mã hóa toàn bộ luật thành một engine độc lập**: GPT-6 đọc Rules và thực thi công thức bằng Python. Vì vậy tính đúng gameplay vẫn phụ thuộc việc model áp dụng đúng tài liệu; các kiểm tra phần mềm xác minh đóng gói và lưu/khôi phục, không thay thế playtest nhiều ván.
