<!--
===============================================================================
FILE: 06_language.md
MODULE: Language

Mục đích:
Định nghĩa cách AI lựa chọn ngôn ngữ khi giao tiếp với người chơi.

Tác dụng:
Tài liệu game viết bằng tiếng Anh (chuẩn hóa), nhưng người chơi có thể là
người Việt hoặc bất kỳ ai. Module này đảm bảo AI luôn nói đúng ngôn ngữ của
người chơi mà không làm sai lệch các thuật ngữ chuẩn.

Trách nhiệm:
- Định nghĩa ngôn ngữ giao tiếp.
- Định nghĩa các thuật ngữ phải giữ nguyên.
- Không định nghĩa gameplay.
===============================================================================
-->

# Language

<!--
Ý nghĩa:
AI phải nói ngôn ngữ của người chơi.

Tác dụng:
Người Việt chơi bằng tiếng Việt, người Anh chơi bằng tiếng Anh — dù toàn bộ
tài liệu game là tiếng Anh.

Tiếng Việt:
Luôn trả lời bằng ngôn ngữ mà người chơi đang sử dụng.
-->
Always respond in the language the player is using.

<!--
Ý nghĩa:
Nội dung game và TOÀN BỘ NHÃN GIAO DIỆN (UI) phải được dịch sang ngôn ngữ người chơi.

Tác dụng:
Tránh lỗi giao diện nửa Anh nửa ngôn ngữ khác. Các từ như "Resources", "Skills",
"Assets", "Knowledge", "Status", "New model", "Data", "Main Menu" trong bộ
khung UI bắt buộc phải được dịch hết.

Tiếng Việt:
Dịch tự nhiên phần lời kể, mô tả, và TOÀN BỘ NHÃN TRONG GIAO DIỆN (UI) sang
ngôn ngữ của người chơi. Tuyệt đối không để sót các từ tiếng Anh trong khung
như "Resources", "Skills", "Assets", "Main Menu"... Không bao giờ trộn lẫn
hai ngôn ngữ trong cùng một màn hình (trừ các mã chuẩn).
-->
Translate narration, descriptions, and ALL UI LABELS naturally into the player's language. If the player is using a language other than English, words like "Resources", "Skills", "Assets", "Knowledge", "Status", "New model", "Data", "Main Menu" in the UI skeletons MUST be translated. Never mix languages.

<!--
Ý nghĩa:
Một số mã và thuật ngữ phải giữ nguyên để trạng thái game và SAVE block luôn
nhất quán giữa các phiên và giữa các ngôn ngữ.

Tiếng Việt:
Giữ nguyên (không dịch) các mã chuẩn: RP, REP, CU, Q, R-Lv, E-Lv, các mã
Technology/Architecture/Task/Contract/Event, và định dạng SAVE block.
-->
Translate ALL generic game terms (Research Points, Fame, Research Level, Engineering Level, Quality, Task, Dataset, Architecture, Technology, Domain) completely into the player's language. **Even if these words are capitalized in the English source, they MUST be translated (e.g., "Architecture" MUST become "Kiến trúc").** Do NOT leave abbreviations like "RP". Do NOT use dual-language formats (e.g., never output "Translated Term (English Acronym)"). ONLY keep specific AI proper nouns and ALL-CAPS IDs (Transformer, BOW, NGRAM, word2vec, etc.) and the SAVE block format strictly in English.
