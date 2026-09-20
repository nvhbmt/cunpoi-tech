# cunpoi.tech

Trang cá nhân của **Nguyễn Việt Hoàng** — Fullstack Developer. Trang tĩnh hoàn toàn, dựng bằng
Astro, hero 3D bằng Three.js, song ngữ Việt/Anh.

- Tiếng Việt: `/`
- English: `/en`

## Chạy

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # astro check && astro build → ./dist
npm run preview      # xem thử bản đã build
npm run check        # chỉ kiểm tra kiểu, không build
npm run og           # sinh lại public/og.png (ảnh xem trước khi dán link)
```

Yêu cầu Node 20+ (đang phát triển trên Node 22).

## Bố cục

```
src/
├── data/profile.ts        ← TOÀN BỘ nội dung, cả hai ngôn ngữ, sửa ở đây
├── layouts/Base.astro     ← thẻ <head>, SEO, JSON-LD, nạp script
├── components/            ← mỗi mục một file .astro, CSS scoped ngay trong file
├── scripts/
│   ├── hero3d.ts          ← cảnh Three.js: lưới toạ độ + cụm đa diện wireframe
│   └── ui.ts              ← hiện dần khi cuộn, thanh nav, nghiêng thẻ theo con trỏ
├── styles/global.css      ← biến màu, kiểu chữ, nút, chip
└── pages/
    ├── index.astro        ← lang="vi"
    ├── en/index.astro     ← lang="en"
    └── 404.astro
```

**Sửa nội dung chỉ cần mở `src/data/profile.ts`.** Hai đối tượng `vi` và `en` cùng tuân theo
interface `Content`, nên thiếu một trường ở bên nào là `astro check` báo lỗi ngay — không có
chuyện một ngôn ngữ bị bỏ sót.

## Vài quyết định đáng nhớ

- **Song ngữ bằng hai trang tĩnh**, không phải JS đổi ngôn ngữ. `/` và `/en` là hai file HTML
  riêng, khai báo `hreflang` chéo nhau, nên Google lập chỉ mục cả hai.
- **Three.js nạp trễ** qua `import()` động trong `requestIdleCallback`. Chữ và CSS hiện xong
  trước; gói three (~538 KB) mới tải sau, và nếu tải lỗi thì canvas tự gỡ, nền lưới CSS ở dưới
  vẫn giữ bố cục.
- **Cảnh 3D dừng khi không ai nhìn**: `IntersectionObserver` trên canvas cộng với
  `visibilitychange` — cuộn qua hero hoặc chuyển tab là `requestAnimationFrame` ngừng hẳn.
- **`prefers-reduced-motion`** vẽ đúng một khung hình tĩnh rồi thôi.
- **Tiếng Việt cần `line-height` ≥ 1.18** ở tiêu đề. Dấu xếp hai tầng (ễ, ộ, ỹ) vượt ra ngoài
  hộp chữ, và riêng tên ở hero còn tô nền gradient qua `background-clip: text` nên phải nới thêm
  `padding-block`, nếu không dấu bị mất màu.
- **Không có `manualChunks` dạng object** trong `astro.config.mjs`: Astro 7 dùng Rolldown, chỉ
  nhận hàm. Việc tách gói đã do `import()` động lo.

## Deploy — Cloudflare Workers (static assets)

Bản build là thư mục tĩnh, không cần máy chủ Node.

> **Đã vấp một lần:** ban đầu `wrangler.toml` khai `pages_build_output_dir = "dist"`, nhưng khoá
> đó **chỉ** `wrangler pages deploy` mới đọc. Máy build của Cloudflare chạy `wrangler deploy`
> (luồng Workers) nên báo `Missing entry-point to Worker script or to assets directory`. Cách sửa
> là khai `[assets] directory = "./dist"` — xem `wrangler.toml`.

**Cách 1 — nối Git, mỗi lần push là tự deploy.** Cloudflare Dashboard → Workers & Pages →
Create → Import a repository → chọn `nvhbmt/cunpoi-tech`, rồi điền:

| Trường | Giá trị |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Biến môi trường | `NODE_VERSION` = `22` |

**Cách 2 — đẩy thẳng từ máy.**

```bash
npm run build
npx wrangler deploy            # [assets] trong wrangler.toml đã trỏ ./dist
npx wrangler deploy --dry-run  # thử trước, không đẩy gì lên
```

**Gắn tên miền.** Project → Settings → Domains & Routes → Add → Custom domain → `cunpoi.tech`,
làm lại lần nữa cho `www.cunpoi.tech`. Tên miền đã nằm sẵn trong tài khoản Cloudflare
(nameserver `houston` / `sarah.ns.cloudflare.com`) nên bản ghi DNS và chứng chỉ TLS tự tạo.

`public/_headers` đặt cache một năm cho `/_astro/*` (tên file có vân tay nên an toàn), không cache
HTML, cùng vài header bảo mật cơ bản — Workers static assets đọc file này giống hệt Pages.

## Việc còn để ngỏ

- `public/og.png` sinh từ `scripts/make-og.mjs` bằng font hệ thống của máy đang chạy, nên máy
  khác có thể ra chữ hơi khác. Nếu cần chuẩn tuyệt đối thì nhúng font vào SVG.
- Số điện thoại **cố ý không đặt trên trang** để tránh bot quét; nó vẫn nằm trong file CV tải về
  tại `public/cv/`.
