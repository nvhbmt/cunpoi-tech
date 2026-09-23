/**
 * Tải lại ba bộ chữ về `public/fonts/` và sinh `src/styles/fonts.css`.
 *
 * Chạy: `npm run fonts`. Chỉ cần chạy khi muốn nâng phiên bản font — kết quả
 * đã commit sẵn trong repo nên `npm run build` không bao giờ cần mạng.
 *
 * Lấy font biến thiên (một file lo cả dải cân nặng) và chỉ ba subset thật sự
 * dùng tới: latin, latin-ext, vietnamese.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fontsDir = resolve(root, 'public/fonts');
const cssOut = resolve(root, 'src/styles/fonts.css');

const API =
    'https://fonts.googleapis.com/css2?family=Inter:wght@400..600' +
    '&family=Space+Grotesk:wght@500..700' +
    '&family=JetBrains+Mono:wght@400..500&display=swap';

// Google trả font biến thiên chỉ khi User-Agent là trình duyệt hiện đại;
// User-Agent mặc định của fetch sẽ nhận về .ttf tĩnh nặng gấp nhiều lần.
const UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const WANT = new Set(['latin', 'latin-ext', 'vietnamese']);
const FAMILY_ORDER = ['Inter', 'Space Grotesk', 'JetBrains Mono'];
const SUBSET_ORDER = { latin: 0, 'latin-ext': 1, vietnamese: 2 };

const css = await (await fetch(API, { headers: { 'User-Agent': UA } })).text();

mkdirSync(fontsDir, { recursive: true });

const faces = [];
for (const [, subset, body] of css.matchAll(/\/\*\s*([a-z-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)) {
    if (!WANT.has(subset)) continue;

    const family = /font-family:\s*'([^']+)'/.exec(body)[1];
    const weight = /font-weight:\s*([^;]+);/.exec(body)[1].trim();
    const url = /src:\s*url\(([^)]+)\)/.exec(body)[1];
    const range = /unicode-range:\s*([^;]+);/.exec(body)[1].trim();
    const file = `${family.toLowerCase().replace(/\s+/g, '-')}-${subset}.woff2`;

    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`${url} → ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(resolve(fontsDir, file), buf);
    console.log(`${file.padEnd(34)} ${(buf.length / 1024).toFixed(1)} KB`);

    faces.push({ family, weight, file, range, subset });
}

faces.sort(
    (a, b) =>
        FAMILY_ORDER.indexOf(a.family) - FAMILY_ORDER.indexOf(b.family) ||
        SUBSET_ORDER[a.subset] - SUBSET_ORDER[b.subset],
);

const header = `/* ==========================================================================
   Ba bộ chữ tự chứa — không gọi ra fonts.googleapis.com nữa.
   Trước đây <link> tới Google Fonts chặn lần vẽ đầu: trình duyệt phải mở thêm
   hai kết nối (googleapis + gstatic), tải một file CSS, rồi mới biết cần tải
   file .woff2 nào. Giờ file .woff2 nằm cùng máy chủ, tải song song ngay.

   Mỗi bộ là font biến thiên (variable), một file lo cả dải cân nặng:
   Inter 400–600, Space Grotesk 500–700, JetBrains Mono 400–500.
   Chỉ giữ ba subset cần dùng — latin, latin-ext, vietnamese; \`unicode-range\`
   lo phần còn lại: trang tiếng Anh không đụng tới file vietnamese và ngược lại.

   FILE NÀY SINH RA TỰ ĐỘNG — sửa scripts/fetch-fonts.mjs rồi chạy \`npm run fonts\`.
   ========================================================================== */
`;

const blocks = faces.map(
    (f) => `/* ${f.family} — ${f.subset} */
@font-face {
    font-family: '${f.family}';
    font-style: normal;
    font-weight: ${f.weight};
    font-display: swap;
    src: url('/fonts/${f.file}') format('woff2');
    unicode-range: ${f.range};
}`,
);

writeFileSync(cssOut, `${header}\n${blocks.join('\n\n')}\n`);
console.log(`\n→ ${faces.length} @font-face vào src/styles/fonts.css`);
