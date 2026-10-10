# 🏭 LLM Tycoon 1.0

Game xây công ty AI từ Home Lab tháng 1/2013, dành cho GPT-6 có Python và Giao diện thông minh.

Đính kèm [LLM-TYCOON-GPT6.zip](build/LLM-TYCOON-GPT6.zip) rồi yêu cầu chơi. **Một README chung ở ngay gốc ZIP** chứa quy trình khởi động, routing theo hành động và map toàn bộ file. GPT-6 đọc tài liệu theo nhu cầu; `read_document(path, heading)` lấy đúng một mục.

## Cấu trúc gói chơi

~~~text
README.md                 # điểm bắt đầu + routing + map
engine.md                 # chỉ dẫn vận hành
reference/terms.md        # thuật ngữ cần dùng
rules/                    # cơ chế theo nghiệp vụ
content/                  # bảng dữ liệu, lịch, dilemmas
ui/
  presentation.md         # controls, ngôn ngữ, disclosure, kể chuyện
  boot.md                 # menu, hướng dẫn chơi, About
  views.md                # nội dung và tương tác từng View ID
runtime/
  contract.md             # transaction, save/load, recovery, history
  schema.md               # cấu trúc trạng thái
  usage.md                # API Python và đọc theo mục
  state.py                # helper Python; import trực tiếp
scenarios/
  home_lab.md             # bối cảnh mở màn
  home_lab.json           # trạng thái đầu chuẩn
package-index.json        # paths, headings, bytes và hashes
~~~

Khi chơi, Python tạo `session/state/`, `session/exports/` và `session/archives/` riêng với tài liệu/mã. Các thư mục này không nằm trong ZIP phát hành. Build loại file phát hành đã bị bỏ khỏi map trước đó và giữ tiến trình chơi.

`save` xuất file tải xuống, giữ cả form, ứng viên, lựa chọn đang chờ và phase chưa hoàn tất. Mang ZIP game cùng save sang chat mới để tiếp tục. Sandbox có thể hết hạn; giữ file tải xuống.

## Build và kiểm tra

~~~sh
bun install
bun run build
bun run typecheck
bun run lint
bun test
py -3.7 -m unittest discover -s tests/python -v
~~~

Nguồn chơi nằm trong `game/`; hướng dẫn sửa nguồn ở [docs/authoring.md](docs/authoring.md). Các README của người phát triển và tài liệu authoring không vào ZIP.

GPT-6 diễn giải, áp dụng Rules và kể chuyện; Python tính số, kiểm tra và lưu/khôi phục. Helper chưa mã hóa toàn bộ gameplay thành engine độc lập. Kiểm tra phần mềm xác minh đóng gói, đọc tài liệu và save/resume; độ đúng khi chơi vẫn phụ thuộc model áp dụng luật, cần playtest.
