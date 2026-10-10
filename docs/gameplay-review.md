# Đánh giá gameplay LLM Tycoon 1.0

Ghi chú: đây là đánh giá bản trước chỉnh sửa. Các sửa đổi đã triển khai được ghi ở [gameplay-changes.md](gameplay-changes.md); dùng luật trong ZIP mới để chơi.

Ngày kiểm tra: 10/10/2026. Đối tượng: game chính trong `build/LLM-TYCOON-GPT6.zip`.

Đã đọc đủ 15 file Rules, 16 file Content, opening/scenario, hướng dẫn engine và các màn UI. Đối chiếu 36 file Rules/Content/UI/Scenario trong ZIP với thư mục build: khớp toàn bộ. Đã dùng Python tính các tình huống cân bằng và liệt kê các cấu hình phần cứng hợp lệ. Đây là phân tích luật và tình huống định lượng, chưa phải một lượt chơi hoàn chỉnh qua GPT-6/UI. Không thay đổi luật hay ZIP.

Các ví dụ Quality giả định không có staff bonus, không có q_mod, không bị repeat penalty, trừ khi ghi khác. Ví dụ kế thừa dùng model cha có setup khác để không tự kích hoạt repeat penalty; chưa tính event thưởng một lần vào hiệu suất lặp.

**Kết luận:** Core loop có nền tảng tốt, nhưng cân bằng hiện tại chưa giữ được chiều sâu suốt ván chơi. Giai đoạn khám phá có lựa chọn thú vị; khi hiểu công thức, người chơi có thể farm phần thưởng, đạt Q tối đa bằng model nhỏ và biến đoạn cuối thành tích tiền/chờ phần cứng. Nên sửa các động lực này trước khi thêm hệ thống mới.

**Bản chất game đang có**

Người chơi đổi một tháng lấy tiền, kiến thức, dữ liệu hoặc một sản phẩm nghiên cứu; sau đó chọn cách khai thác model để mở cơ hội tiếp theo. Ba tài nguyên Cash/RP/Fame có vai trò khác nhau. Vòng chính là:

`Kiếm runway → học công nghệ/chuẩn bị dữ liệu → chọn thiết kế → huấn luyện → đọc kết quả → phát hành → tái đầu tư`.

Những phần nên giữ:

- Lịch sử NLP tạo bối cảnh, thời điểm thị trường và cảm giác tiến bộ rõ.
- Ghép Architecture × Task × Dataset cho người chơi điều để khám phá, rồi Analyze giúp họ học từ kết quả.
- Open-source, License và Product có mục tiêu khác nhau: uy tín/kiến thức, tiền ngay, doanh thu và dữ liệu về sau.
- Artifacts/Fine-tuning có thể tạo một quyết định hay giữa tốc độ phát hành và chất lượng vận hành.
- Quy trình tính kết quả cố định giúp người chơi hiểu hậu quả và giúp engine tái hiện ván chơi.

Điểm yếu xuyên suốt là nhiều hệ thống cuối cùng cùng đổ vào một số Q. Khi Q chạm 100, nhiều quyết định mất tác dụng; khi thưởng được lấy trước khi hoàn thành, người chơi có thể bỏ qua chính vòng làm model.

**1. Ưu tiên cao nhất: nhận thưởng rồi hủy commitment**

[Project Dilemmas](C:/Users/tomis/TaiLieu/llm-tycoon/game/content/12_project_dilemmas.md:51) cho Large/Massive/Frontier nhận ngay 2.000 RP ở midpoint. [Actions](C:/Users/tomis/TaiLieu/llm-tycoon/game/rules/01_actions.md:52) cho hủy với −100 Fame; không có quy tắc thu hồi thưởng đó.

Một đường khai thác hợp lệ theo luật viết hiện tại:

1. Có NGRAM, Wikipedia và bốn GTX 780: 12 GB VRAM, bốn slot, giá phần cứng $6.000.
2. Khai báo NGRAM × AUTO, Scale Large, M = 2, Focus đúng ideal. Compute requirement vẫn bằng 0 vì `0 × 4 = 0`.
3. Midpoint ở tháng 1: Match 10 + Domain fit 3 + Focus 10 = 23, đủ Breakthrough.
4. Chọn Academic Shockwave: nhận 2.000 RP ngay.
5. Sau tháng đó, hủy rồi bắt đầu lại. Chi phí tháng là $1.200; khi Fame = 0, phạt −100 bị floor về 0. Không có model hoàn thành nên repeat penalty không xử lý vòng này.

Đây không phải RP miễn phí: vẫn mất tháng và tiền. Nhưng nó cho 2.000 RP/tháng, cao hơn Research cơ bản 600–1.400 RP/tháng không nhân viên, và bỏ qua chất lượng, hoàn thành, dữ liệu tiến bộ lẫn R-Lv.

Paper có vấn đề tương tự. [Dilemma Co-author](C:/Users/tomis/TaiLieu/llm-tycoon/game/content/15_papers.md:23) cho +500 Fame ngay ở tháng 1, trong khi giảm RP chỉ áp dụng ở cuối. Hủy mất 100 Fame: còn lãi 400 Fame, model vẫn unpublished và có thể dùng lại. Không phải tháng nào cũng gặp đúng dilemma, nhưng vòng khai thác vẫn tồn tại ở các lượt phù hợp.

**Đề xuất:** Chi phí và quyết định áp dụng ngay; RP/Fame liên quan tới kết quả nghiên cứu được ghi là thưởng chờ và trả khi hoàn thành. Hủy thì mất thưởng chờ. Nếu muốn giữ thưởng khám phá giữa chừng, cần giới hạn theo đóng góp nghiên cứu thực sự và không cho lặp bằng cùng một setup chưa hoàn thành. Chuyển sang thưởng cuối là phương án đơn giản hơn.

**2. Trần Q đến quá sớm, làm mất lý do tăng quy mô**

[Công thức Quality](C:/Users/tomis/TaiLieu/llm-tycoon/game/rules/08_model_projects.md:80) cộng nhiều bonus phẳng rồi clamp từng benchmark về 100. Phần tài chính dùng Q, Demand và thời điểm; Scale không tăng doanh thu trực tiếp.

Tình huống vào năm 2017:

- TRF × AUTO, Tiny; Wikipedia + BookCorpus: Combined Size 5, Quality 4.
- E-Lv 5, BPE; kế thừa một TRF/PTRF có Q ≥ 85 và setup khác; M = 2.
- Một cloud unit trong hai tháng: compute requirement `2.000 × 0,5 × 1,5 × 0,5 = 750`, compute tích lũy ít nhất 2.000, đủ bonus +8.
- Raw Artifacts = 6; Focus ideal cho 10 điểm.
- Base Points = 83. Bốn benchmark AUTO năm 2017 đều phù hợp books/encyclopedic: `83 + 10 + 20 = 113`, clamp thành **Q = 100**.

Ngay cả Focus score bằng 0, cùng cấu hình đó vẫn có `73 + 10 + 20 = 103`, tức Q vẫn bằng 100. Focus tốt còn ảnh hưởng thưởng midpoint, nhưng không còn ảnh hưởng chất lượng cuối trong ví dụ này. Một TRF đầu tiên không kế thừa cũng có thể đạt Q rất cao với ba tháng và dữ liệu này; điều kiện model cha tốt không phải rào cản lớn.

PTRF + BPE + FINE càng dư điểm. Khi Tiny đã đạt 100, nâng Large/Massive tăng chi phí, VRAM và thời gian mà thường không tăng hiệu quả phát hành.

**Đề xuất:** Cân lại Q trước, thay vì tăng tất cả chi phí. Dùng điểm nội bộ tăng với lợi ích giảm dần; dành khoảng chất lượng cho tiến bộ về sau. Scale nên mở năng lực/bài toán/phân khúc mà model nhỏ không làm tốt. Cho phép model nhỏ vẫn xuất sắc ở tác vụ hẹp, nhưng không đạt mức hoàn hảo trên toàn bộ bộ đánh giá bằng vài bonus chung. Không nên đặt một trần thấp cố định cho mọi model Tiny vì sẽ phủ nhận giá trị chuyên môn hóa.

**3. Kiến trúc CPU nhận bonus scale nhưng không trả chi phí compute**

[NGRAM/BOW](C:/Users/tomis/TaiLieu/llm-tycoon/game/content/01_architectures.md:20) có compute requirement bằng 0. Mọi scale nhân lên vẫn bằng 0, trong khi Massive cộng 15 Quality.

Ví dụ tháng 10/2017: NGRAM × AUTO, Massive, BookCorpus được clean lên Quality 5, E-Lv 1, một tháng, Focus ideal. Hai K80 đủ 48 GB installed VRAM. Kết quả trên bốn benchmark AUTO là **Q = 90**, dù compute requirement bằng 0. Đây là một thiết kế thống kê cũ có thể vượt các đối thủ học sâu nhờ bonus scale chung.

**Đề xuất:** NGRAM/BOW dùng quy mô dữ liệu/CPU/RAM thích hợp hoặc chỉ có tier nhỏ, không dùng chung thang tham số neural tới Massive/Frontier. Việc này cũng chặn đường farm Large NGRAM ở mục 1, nhưng vẫn cần sửa thưởng trước hoàn thành vì các kiến trúc khác cũng khai thác được.

**4. Điểm kết thúc bị khoản vốn đầu tư lấn át**

[Score](C:/Users/tomis/TaiLieu/llm-tycoon/game/rules/13_endings_and_scoring.md:32) cộng `100 × floor(Cash / 1.000)`. Term Sheet trả $2.000.000, tương đương **200.000 điểm từ riêng khoản vốn đó**. [Danh hiệu cao nhất](C:/Users/tomis/TaiLieu/llm-tycoon/game/content/09_scoring_titles.md:19) chỉ cần 33.000.

Vì vậy, người thắng gần như tự động có danh hiệu cao nhất; Fame, chất lượng, số dự án và bonus năm 2019 đều bị lấn át. Score còn thưởng số lần hoàn thành không giới hạn, trong khi game không có hạn cuối: kéo dài ván cũng có thể tăng điểm mà không tăng thành tựu đáng kể.

**Đề xuất:** Tách vốn huy động khỏi tiền vận hành khi chấm điểm, gồm cả angel investment. Chốt điểm campaign ở lần thắng đầu tiên; sandbox tiếp tục với thống kê riêng. Điểm nên phản ánh thời gian tới cột mốc, thành tựu có giá trị và hiệu quả kinh doanh. Nếu thưởng số dự án, thưởng giảm dần hoặc đóng góp mới, không thưởng đều mọi lần lặp. Hiệu chỉnh lại các danh hiệu sau khi có phân bố điểm từ playtest.

**5. Một số dilemma và lựa chọn tuyển dụng có đáp án luôn tốt hơn**

Đối chiếu ở Base Pay thấp nhất $3.800:

| Lựa chọn | Chênh lệch so với phương án chuẩn | Vấn đề |
|---|---|---|
| Freelance Scope Creep | +$760 và +100 Fame, cùng một tháng | “Khối lượng thêm” không có chi phí cơ học |
| Freelance Hardware Crisis | +$1.020 ròng, cùng một tháng | Tiền thuê $500 luôn thấp hơn tiền tăng thêm |
| Contract Early Delivery | +$1.000 tới +$6.200 ròng, không thêm tháng | Mọi contract có midpoint đều có base pay > $5.000 |
| Hardware Optimizer ứng viên đắt | Lương cao hơn, vẫn cùng multiplier 0,75 | Ứng viên rẻ luôn tốt hơn về cơ học |

Nguồn: [Freelance](C:/Users/tomis/TaiLieu/llm-tycoon/game/content/10_freelance_clients.md:31), [Contracts](C:/Users/tomis/TaiLieu/llm-tycoon/game/content/06_contracts.md:39), [Employees](C:/Users/tomis/TaiLieu/llm-tycoon/game/content/07_employees.md:23).

Fame floor/cap cũng làm vài đánh đổi biến mất trong một số trạng thái: hack khi Fame = 0 không mất uy tín; thưởng counter Research sau R-Lv 5 không còn giúp lên cấp. Điều này không tự động là lỗi — phương án tốt có thể thay đổi theo tình huống — nhưng cần kiểm tra từng trạng thái thay vì chỉ đọc tên dilemma.

**Đề xuất:** Cho khối lượng thêm tiêu tốn thời gian hoặc chi phí đủ ý nghĩa; điều chỉnh tiền tăng thêm theo chi phí thực. Optimizer cần multiplier khác nhau theo mức lương, hoặc chỉ một mức ứng viên nếu không có khác biệt. Khi một lợi ích đã chạm cap, thay dilemma bằng một đánh đổi còn giá trị.

Việc dùng Turn modulo khiến người đã hiểu chu kỳ có thể hẹn Freelance/Research theo tháng để luôn gặp loại có lợi. Nếu muốn tăng khả năng chơi lại, dùng bộ tình huống được xáo theo seed lưu trong save: cùng state vẫn tái hiện đúng kết quả, nhưng mỗi ván có chuỗi khác nhau. Lịch sử lớn vẫn giữ ngày cố định.

**6. Mở đầu đang gây cản trở cho chính gameplay tutorial**

[Opening](C:/Users/tomis/TaiLieu/llm-tycoon/game/scenarios/home_lab.md:11) đặt PC ở mức narrative-only, 0 VRAM. NGRAM/BOW được mô tả chạy trên PC, nhưng [wizard](C:/Users/tomis/TaiLieu/llm-tycoon/game/rules/08_model_projects.md:29) yêu cầu ít nhất 2 GB VRAM cho Tiny, không miễn trừ CPU. [Shop](C:/Users/tomis/TaiLieu/llm-tycoon/game/ui/views.md:39) lại ẩn tới khi có GPUT hoặc công nghệ neural.

Không phải hết đường chơi: người chơi còn Research/Freelance và có thể yêu cầu mua hardware bằng ngôn ngữ tự nhiên. Nhưng đường tutorial “học NGRAM rồi chạy trên PC” không hoạt động như mô tả và menu không dẫn người mới tới cách giải quyết.

Tháng đầu R-Lv 1 cho 600 RP hoặc 720 RP từ Data Epiphany, thấp hơn giá NGRAM 1.000. Nếu tutorial muốn hứa mở NGRAM ngay tháng này thì không khớp; nếu chỉ muốn nói bắt đầu tích RP thì cần diễn đạt rõ.

**Đề xuất:** Cho kiến trúc CPU nhỏ chạy trên PC khởi đầu mà không cần GPU VRAM; mở Shop/Data Market từ đầu. Tutorial dẫn qua một model đầu tiên có thể thực hiện được, giải thích số tháng cần nghiên cứu và cho Analyze sau kết quả. Đây là sửa tính nhất quán, không phải bật mí recipe tối ưu.

**7. Đường tới LLM phụ thuộc mạnh vào một mốc phần cứng**

[LLM](C:/Users/tomis/TaiLieu/llm-tycoon/game/rules/12_llm_project.md:26) cần 320 GB Available VRAM. Trước K80 tháng 10/2017, tám GTX 1080 cộng hai cloud unit chỉ cho **304 GB**, cấu hình tốt nhất về VRAM trong catalog lúc đó. Vì vậy, tiền và công nghệ đủ cũng chưa thể khởi động LLM.

Python liệt kê cấu hình hợp lệ tại tháng 10/2017: giá phần cứng thấp nhất là **$33.000**, gồm rewire, ba K80 và một GTX 1080; 7 slot, 80 GB installed + 240 GB cloud, 4.200 TFLOPS/tháng. Cộng phí hạ tầng $20.000: **$53.000 trước chi phí vận hành**. Một cấu hình đồng giá dùng ba K80 và hai GTX 980 nhưng tốn thêm một slot.

Khóa theo thời đại có thể là chủ ý tốt. Vấn đề là người chơi có thể chuẩn bị xong từ trước rồi chỉ còn kiếm tiền và chờ một SKU. Mặt khác, chất lượng final boss lại dễ dư điểm: với cấu hình $33.000 nói trên, TRF/PTRF cha Q ≥ 85, Wikipedia + BookCorpus, E-Lv 5 và BPE, requirement kế thừa là 45.000. M = 11 đủ compute; dù còn 44 Artifacts và chưa Fine-tune, bốn benchmark LLM năm 2017 vẫn đạt **Q = 100**. Ngưỡng Term Sheet chỉ là 70.

**Đề xuất:** Đặt LLM là cột mốc có mục tiêu năng lực rõ và chuẩn chất lượng được cân cùng Q. Hoặc hỗ trợ một phương án compute/cloud hợp lý khi SCALE đã mở, hoặc dẫn game tới mốc phần cứng bằng những mục tiêu trung gian có giá trị. Trước khi bắt đầu, UI nên hiển thị upfront + operating cost + runway theo doanh thu hiện có; đây đều là thông tin công khai, không cần tiết lộ công thức Q.

**8. Open-source, License, Product có ý tưởng tốt nhưng phần thưởng còn lệch**

Một BOW Tiny × CLS dùng Product reviews, E-Lv 1, M = 1, Focus ideal:

| Phát hành open-source | Q | Fame từ release | RP completion + open-source |
|---|---:|---:|---:|
| Raw, 5 Artifacts | 71 | 1.300 | 1.565 |
| Fine-tune thêm một tháng | 73 | 1.000 | 1.595 |

Các event một lần không tính trong bảng. Q cùng nằm tier Great, nên clean model mất một tháng và 300 Fame để lấy thêm 30 RP. Việc raw model hữu ích cho cộng đồng có thể là chủ ý; nhưng bonus +300 chỉ cần còn bất kỳ Artifact nào, nên một model còn 1 Artifact cũng hưởng trọn bonus. Khi Quality đã cap, cố giữ lỗi thường có lợi hơn làm sạch nếu chọn open-source.

Với cùng Q/Demand/Hype/SOTA, bỏ qua modifier chỉ áp dụng cho License:

- Product sạch trả tổng tám tháng bằng **4/3 License**; phải thu sáu kỳ mới ngang số tiền License nhận ngay.
- Product raw bị ×0,5 nên tổng tám tháng chỉ bằng **2/3 License**, còn giữ Inference VRAM.
- User Logs là lợi ích khác của Product; vì thế không thể kết luận License luôn thắng Product về mọi mặt.

Từ tháng 10/2019, License còn có modifier ×1,2 riêng: premium tiền của Product sạch giảm nữa. License hợp lý cho runway; Product chỉ thật sự hấp dẫn khi người chơi đánh giá cao dòng tiền và logs.

Giá License cũng dễ làm lu mờ Contracts sau khi biết recipe. BOW Q = 71 trong tháng 5/2013, CLS Demand = 2, Saturated ×0,5 và SOTA Hype ×1,5 cho **$15.975 sau một tháng**, cộng completion RP/Fame. C01 không bonus cho $10.000 sau hai tháng, cộng 100 Fame và engineering progress. Contract có giá trị chắc chắn, nhưng khi đã biết cách làm model tốt, giá bán model khiến việc nhận hợp đồng sớm ít hấp dẫn. Repeat penalty −15 không giải quyết triệt để thị trường mua các bản gần giống nhau: model vẫn có thể trên ngưỡng bán và tiếp tục cấp RP/E-Lv.

**Đề xuất:** Gắn Fame open-source và giá License với đóng góp hữu ích/độ mới, giảm lợi ích của những release gần giống nhau. Đừng dùng “còn lỗi” làm điều kiện thưởng cố định cho mọi model. Contracts nên có lợi ích riêng như khách hàng, dữ liệu hoặc khả năng khai thác thị trường, bên cạnh tiền chắc chắn. Làm lợi ích User Logs cụ thể theo phân khúc, và cho Product mục tiêu giữ khách hoặc tái đầu tư sau chu kỳ đầu; có thể triển khai nhẹ mà chưa cần thêm cả hệ thống quản trị khách hàng.

**9. Dữ liệu và benchmark cần tách đúng mục đích**

Domain Fit +20/−15 tạo chênh **35 điểm**, trong khi mỗi nấc Dataset Quality chỉ cho +2 Base Points. “ANY dataset matches” cho toàn bộ bonus nên một phần dữ liệu đúng domain có thể quyết định kết quả của cả mixture, không xét tỷ trọng. Size tăng theo số dataset, kể cả các tập có thể trùng lặp. Repeat penalty dựa trên đúng tập dataset, thay vì độ mới của đóng góp. Các quy tắc này thuận tiện cho engine nhưng tạo incentive thay ID/setup để né phạt hơn là cải thiện dữ liệu.

Medical/legal hầu như không có benchmark mục tiêu riêng trước MMLU năm 2020; dữ liệu đó thiếu thị trường ngách tương ứng. User Logs cùng task lại +20 cho mọi benchmark, dù logs sản phẩm không tự động bao phủ mọi năng lực của task rộng.

Việc lấy trung bình tất cả benchmark hiện có còn khiến Q của hai dự án giống nhau phụ thuộc ngày hoàn thành. Ví dụ giữ nguyên BOW × CLS/Product reviews ở trên, không repeat, cùng E-Lv:

- Trước SNLI: hai benchmark đều 71, Q = 71.
- Khi [SNLI xuất hiện tháng 8/2015](C:/Users/tomis/TaiLieu/llm-tycoon/game/content/13_benchmarks.md:33): benchmark mới không phù hợp reviews, score 36; Q = `(71 + 71 + 36) / 3 = 59,3`.

Model cũ giữ Q 71; model mới tương tự bị đánh giá thấp hơn dù nhu cầu khách hàng sentiment không đổi. Học cách thích nghi với benchmark mới có thể vui, nhưng nó đang đổi cả giá bán và Fame của một sản phẩm hẹp.

**Đề xuất:** Tách chất lượng cho khách hàng/tác vụ đã chọn khỏi bảng đánh giá học thuật. Chọn bộ benchmark mục tiêu ở đầu project, công khai; vẫn có thể hiện thêm đánh giá mở rộng. Domain coverage nên phản ánh phần đóng góp của mixture, User Logs nên giữ domain/provenance. Nếu giữ một Q tổng cho đơn giản, ít nhất cần chuẩn hóa nó để bộ benchmark tăng không tự động đổi chuẩn kinh doanh.

**10. Thị trường và SOTA chưa tạo áp lực cạnh tranh bền**

[SOTA Hype](C:/Users/tomis/TaiLieu/llm-tycoon/game/rules/08_model_projects.md:151) chỉ cần vượt một benchmark và giữ vĩnh viễn từ lúc hoàn thành. Hoard model rồi phát hành lúc Demand cao là chiến thuật có chủ ý; nhưng giữ mãi bonus “dẫn đầu” sau khi đối thủ đã vượt làm áp lực đổi mới yếu đi.

[Hype Cycle](C:/Users/tomis/TaiLieu/llm-tycoon/game/rules/08_model_projects.md:143) chọn ngày rival gần nhất từ mọi benchmark cùng Task, kể cả row tương lai. Nó tạo timing game, nhưng nhiều milestone của các benchmark khác nhau có thể làm thị trường nhảy mạnh vì một phép chọn row. Clash còn so Q trung bình của model với score một benchmark của rival, là hai đại lượng không cùng cơ sở.

Catalog cũng có một bất nhất ngay trong dữ liệu: CNN/DailyMail đang từ [72,0](C:/Users/tomis/TaiLieu/llm-tycoon/game/content/14_rival_models.md:43) xuống [42,9](C:/Users/tomis/TaiLieu/llm-tycoon/game/content/14_rival_models.md:62), nhưng rule “row gần nhất là SOTA” làm mức vượt đối thủ thấp hơn trong năm 2019. Chưa xác minh lịch sử bên ngoài; kết luận ở đây chỉ là các giá trị trong game chưa nằm trên một thang SOTA nhất quán.

**Đề xuất:** Giữ tin đồn/thời điểm phát hành nhưng dùng milestone thị trường rõ cho từng task. Tính vị thế hiện tại khi release, hoặc cho SOTA bonus hết hạn/giảm dần; thành tích lịch sử vẫn lưu trong portfolio. So benchmark với đúng benchmark. Tách “đối thủ mới ra mắt” khỏi “điểm tốt nhất hiện tại”. Nói rõ score là chỉ số game đã chuẩn hóa; đặc biệt Perplexity thực tế thấp hơn mới tốt hơn, không trình bày số /100 như perplexity thô.

**11. Khám phá, nhân viên và nhịp chơi cần thêm quyết định có ý nghĩa**

Analyze là phần tốt nhất cho việc học, nhưng hiện một pairing/domain chỉ mở lời gợi ý, Focus có recipe cố định theo architecture và chỉ có tác dụng cộng điểm. Khi đã học recipe, replay chủ yếu lặp lại đường tối ưu; Q cap càng làm feedback vô nghĩa.

Nhân viên chủ yếu là bonus thụ động. Tăng lương Scientist cho thêm RP/Q, nhưng Q có thể đã cap và Research cũng có thể nhường cho model/paper. Data Specialist giúp Collect, trong khi nhiều dataset miễn phí đã mạnh. Hardware Optimizer có giá trị thật với compute lớn, nhưng hai optimizer cùng archetype cũng được phép, khiến build giảm compute kép có thể lấn át đội hình đa dạng.

Trong commitment, Continue nhiều tháng không tạo quyết định mới ngoài các midpoint/Fine-tune và quản lý instant actions. Quy tắc chỉ cho một commitment là tốt để tránh phức tạp, nhưng cần kiểm tra độ dài thực tế của các đoạn chỉ bấm Continue.

**Đề xuất:** Giữ Focus nhưng cho nó điều chỉnh quá trình: ưu tiên Data cải thiện coverage; Training đổi hiệu quả compute; Eval giảm lỗi/kiểm thử; Model đầu tư năng lực. Cần vài trade-off có thể quan sát, không chỉ một phân bổ đúng. Cho đội nghiên cứu/open-source và đội sản phẩm/hiệu suất mỗi đội có mục tiêu tốt riêng. Hỗ trợ yêu cầu chạy tới checkpoint tiếp theo, vẫn dừng ở lựa chọn bắt buộc; UI hiện thông tin thay đổi và runway để các tháng dài có ý nghĩa. Không cần thêm nhiều archetype hay mở hai project song song trước khi cân được hệ thống hiện tại.

**12. Các điểm luật cần chốt để kết quả không tùy cách engine hiểu**

Các điểm dưới đây là khoảng trống/va chạm quy tắc, chưa coi là exploit đã được chứng minh:

- Event được ghi là chỉ fire một lần, trong khi LLM có thể retry và mỗi lần Q ≥ 70 nói Term Sheet fires. Nếu từ chối T3 lần đầu, lần sau có còn đường thắng không? Nên cho offer lại tới khi nhận, hoặc xác định rõ chiến thắng bootstrapped và cảnh báo lựa chọn đóng đường nào.
- Dataset đã snapshot ở đầu project; tech/staff bonus và compute requirement chưa nói rõ cố định lúc nào. Hire/fire giữa project có thể đổi requirement dự kiến và chất lượng ra sao? Nên tính theo tháng tham gia hoặc quy định checkpoint rõ, không để engine tự chọn.
- Fine-tuning không tạo Artifacts, nhưng rule Hardware nói mọi project month cộng compute. Compute fine-tune có tăng training compute score không? Cần tách hoặc khẳng định rõ.
- Cùng Dataset ID được chọn nhiều lần trong mixture có hợp lệ không? Hai nội dung trùng nhau nhưng khác ID có làm tăng Size không? Repeat so với bất kỳ model cũ hay chỉ model trước liền kề; data được clean lại có được coi là nghiên cứu mới?
- Paper “release code & weights” có đổi release status hay không? Model Shelved đã được public code có còn chọn License/Product trước khi paper hoàn tất không?
- Event multiplier theo một thời gian có sửa payout của các stream đang chạy không, hay chỉ khóa giá cho release mới? Schema lưu monthlyCash, còn calendar nói “income ×1,5 during Mar–Aug”; cần một cách hiểu thống nhất.

**Thứ tự cải thiện đề nghị**

| Đợt | Việc làm | Kết quả cần đạt |
|---|---|---|
| 1 | Đưa thưởng commitment về completion; sửa CPU/VRAM/tutorial; loại lựa chọn luôn tốt hơn; chốt các khoảng trống luật | Người chơi không vượt progression bằng hủy/lặp hoặc mắc kẹt vì menu |
| 2 | Cân Quality/Scale/Artifacts; chỉnh đóng góp dữ liệu, SOTA và Score | Mỗi lần đầu tư thêm vẫn tạo giá trị, điểm phản ánh thành tựu |
| 3 | Cân hai hướng open-source/nghiên cứu và thương mại; nhân viên; nhịp LLM | Có nhiều đường thắng đáng chọn, ít tháng chờ vô nghĩa |
| 4 | Chạy ba ván hoàn chỉnh: người mới, researcher, doanh nghiệp sản phẩm | Đo thời gian tới model đầu, các đoạn cạn runway, tần suất Q = 100, số quyết định thực và thời gian tới LLM |

Các tình huống tính ở trên đủ chứng minh lỗi cục bộ, chưa đủ để chốt toàn bộ bộ số mới. Bộ cân bằng cuối nên đạt được các tiêu chí: không còn vòng nhận thưởng rồi hủy; model lớn có công dụng cụ thể; model nhỏ giữ ưu thế tác vụ hẹp; open-source, License, Product đều có trạng thái đáng chọn; LLM thành công phản ánh quyết định chuẩn bị; điểm thắng không tự động khóa một danh hiệu.
