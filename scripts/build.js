/**
 * ============================================================================
 * FILE: scripts/build.js
 * MODULE: Build
 *
 * Mục đích:
 * Ghép toàn bộ Game Documentation (các file .md dạng module) thành MỘT file
 * Markdown duy nhất để GỬI THẲNG cho một LLM chạy làm Game Engine.
 *
 * Cách hoạt động:
 * 1. Đọc MANIFEST bên dưới — mỗi mục là một PART của file build, trỏ tới một
 *    thư mục (hoặc một file cụ thể).
 * 2. Với mỗi thư mục: tự động lấy tất cả file .md (trừ README.md — README chỉ
 *    mô tả thư mục cho người phát triển, không phải nội dung game), sắp xếp
 *    theo tên file. Vì vậy các file cần đúng thứ tự phải có tiền tố số
 *    (00_, 01_, ...).
 * 3. Mặc định loại bỏ toàn bộ HTML comment (<!-- ... -->) — phần giải thích
 *    tiếng Việt dành cho người phát triển. File build là sản phẩm gửi cho
 *    LLM nên TUYỆT ĐỐI không chứa comment hay lời nói về dự án/repo; script
 *    cũng không tự chèn thêm bất kỳ ghi chú nào vào output.
 * 4. Ghi kết quả ra build/LLM-TYCOON.md kèm thống kê kích thước (in ra
 *    console, không in vào file).
 *
 * Chạy:  npm run build          (bản chuẩn để gửi cho LLM)
 *        npm run build:full     (giữ comment tiếng Việt — CHỈ để review,
 *                                không dùng để chơi)
 * ============================================================================
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'build');
const OUT_FILE = join(OUT_DIR, 'LLM-TYCOON.md');
const KEEP_COMMENTS = process.argv.includes('--keep-comments');

/**
 * MANIFEST — thứ tự lắp ráp file build.
 *
 * - `title: null`  → không chèn banner PART (dùng cho header/game info/footer).
 * - `dir`          → lấy mọi file .md trong thư mục (trừ README.md), sort theo tên.
 * - `file`         → lấy đúng một file.
 *
 * Thêm thư mục/file mới vào game = thêm một dòng vào đây (hoặc bỏ file vào
 * thư mục đã có sẵn trong manifest).
 */
const MANIFEST = [
  { title: null, file: 'meta/00_header.md' },
  { title: null, file: 'meta/01_game_info.md' },
  { title: 'PART 0 — GAME ENGINE (SYSTEM)', dir: 'system' },
  { title: 'PART 1 — GLOSSARY', file: 'shared/glossary.md' },
  { title: 'PART 2 — DEFINITIONS', dir: 'definitions' },
  { title: 'PART 3 — RULES', dir: 'rules' },
  { title: 'PART 4 — CONTENT (GAME DATA)', dir: 'content' },
  { title: 'PART 5 — SCENARIO', dir: 'scenarios' },
  { title: 'PART 6 — USER INTERFACE (SCREENS)', dir: 'ui' },
  { title: null, file: 'meta/99_footer.md' },
];

/** Đọc một file markdown và chuẩn hóa xuống dòng về \n. */
function read(relPath) {
  return readFileSync(join(ROOT, relPath), 'utf8').replace(/\r\n/g, '\n');
}

/** Liệt kê các file .md của một thư mục theo thứ tự tên, bỏ qua README.md. */
function listDir(relDir) {
  return readdirSync(join(ROOT, relDir))
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort()
    .map((f) => `${relDir}/${f}`);
}

/** Làm sạch nội dung một module trước khi ghép. */
function clean(markdown) {
  let text = markdown;
  if (!KEEP_COMMENTS) {
    // Bỏ HTML comment (chú thích tiếng Việt cho người phát triển).
    text = text.replace(/<!--[\s\S]*?-->/g, '');
  }
  // Gom 3+ dòng trống liên tiếp còn 1 dòng trống; bỏ khoảng trắng thừa 2 đầu.
  return text.replace(/\n{3,}/g, '\n\n').trim();
}

// ---------------------------------------------------------------------------
// Lắp ráp
// ---------------------------------------------------------------------------

const version = JSON.parse(read('package.json')).version;
const pieces = [];
let fileCount = 0;

for (const entry of MANIFEST) {
  const files = entry.dir ? listDir(entry.dir) : [entry.file];
  if (files.length === 0) {
    console.warn(`⚠ Thư mục rỗng, bỏ qua: ${entry.dir}`);
    continue;
  }
  if (entry.title) {
    pieces.push(`---\n\n# ${entry.title}`);
  }
  for (const f of files) {
    pieces.push(clean(read(f)));
    fileCount++;
  }
}

// Output thuần nội dung game — KHÔNG chèn notice/comment nào (file được gửi
// thẳng cho LLM; mọi thông tin build chỉ in ra console bên dưới).
const output = pieces.join('\n\n') + '\n';

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, output, 'utf8');

// Thống kê để theo dõi "ngân sách context" khi gửi cho LLM.
const bytes = Buffer.byteLength(output, 'utf8');
const words = output.split(/\s+/).length;
console.log(`✅ Build xong: build/LLM-TYCOON.md (nguồn v${version})`);
console.log(`   ${fileCount} module | ${(bytes / 1024).toFixed(1)} KB | ~${words.toLocaleString()} từ | ~${Math.round(bytes / 4).toLocaleString()} token (ước lượng)`);
console.log(`   Chế độ: ${KEEP_COMMENTS ? 'GIỮ comment (chỉ để review — đừng gửi bản này cho LLM)' : 'sạch comment (bản chuẩn để gửi cho LLM)'}`);
if (!KEEP_COMMENTS && output.includes('<!--')) {
  console.warn('⚠ Cảnh báo: output vẫn còn chuỗi "<!--" — kiểm tra lại nguồn.');
}
