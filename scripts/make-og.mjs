/**
 * Sinh public/og.png (1200×630) — ảnh xem trước khi dán link lên Zalo, Slack, LinkedIn.
 * Chạy: npm run og   (cần sharp, vốn đã đi kèm Astro)
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Đỉnh của một khối 20 mặt chiếu phẳng — cùng ngôn ngữ hình với hero 3D. */
function lattice(cx, cy, r) {
    const pts = [];
    for (let ring = 0; ring < 2; ring += 1) {
        const radius = ring === 0 ? r : r * 0.55;
        const offset = ring === 0 ? 0 : Math.PI / 5;
        for (let i = 0; i < 10; i += 1) {
            const a = (i / 10) * Math.PI * 2 + offset;
            pts.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius * 0.92]);
        }
    }
    pts.push([cx, cy]);

    const edges = [];
    for (let i = 0; i < pts.length; i += 1) {
        for (let j = i + 1; j < pts.length; j += 1) {
            const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
            if (d < r * 0.78) edges.push([pts[i], pts[j]]);
        }
    }

    const lines = edges
        .map(([a, b], i) =>
            `<line x1="${a[0].toFixed(1)}" y1="${a[1].toFixed(1)}" x2="${b[0].toFixed(1)}" y2="${b[1].toFixed(1)}" stroke="#5f86c4" stroke-width="1" opacity="${(0.16 + (i % 5) * 0.06).toFixed(2)}"/>`,
        )
        .join('');
    const dots = pts
        .map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#8fb6ff" opacity="0.85"/>`)
        .join('');

    return lines + dots;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="name" x1="0" y1="0" x2="1" y2="0.6">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.5" stop-color="#cddcf7"/>
      <stop offset="1" stop-color="#6ea8ff"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.22" cy="0" r="0.9">
      <stop offset="0" stop-color="#6ea8ff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#6ea8ff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0.3" stop-color="#05070c"/>
      <stop offset="1" stop-color="#05070c" stop-opacity="0"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#6ea8ff" stroke-opacity="0.07" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="#05070c"/>
  <rect width="1200" height="630" fill="url(#grid)"/>
  <g transform="translate(880 300)">${lattice(0, 0, 250)}</g>
  <rect width="1200" height="630" fill="url(#veil)"/>
  <rect width="1200" height="630" fill="url(#halo)"/>

  <g font-family="Helvetica Neue, Helvetica, Arial, sans-serif">
    <text x="80" y="200" fill="#6b7a93" font-size="21" letter-spacing="5">FULLSTACK DEVELOPER</text>
    <text x="80" y="300" fill="url(#name)" font-size="78" font-weight="700" letter-spacing="-2">Nguyễn Việt Hoàng</text>
    <text x="80" y="360" fill="#a3b0c6" font-size="27">React · TypeScript · Go · Hono · PostgreSQL</text>
    <text x="80" y="404" fill="#a3b0c6" font-size="27">iExam · BCN Judge · M-Agent (MOSA)</text>
    <text x="80" y="520" fill="#6ea8ff" font-size="25" font-weight="600" letter-spacing="1">cunpoi.tech</text>
  </g>

  <rect x="0" y="626" width="1200" height="4" fill="#6ea8ff" opacity="0.55"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(join(root, 'public', 'og.png'));
await writeFile(join(root, 'public', 'og.svg'), svg, 'utf8');
console.log('→ public/og.png (1200×630) và public/og.svg');
