# cunpoi.tech

Trang cá nhân của **Nguyễn Việt Hoàng** — Fullstack Developer. Trang tĩnh hoàn toàn, dựng bằng
Astro, hero 3D bằng Three.js, song ngữ Việt/Anh.

- Tiếng Việt: `/`
- English: `/en/`

## Chạy

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # astro check && astro build → ./dist
npm run preview      # xem thử bản đã build
npm run check        # chỉ kiểm tra kiểu, không build
npm run og           # sinh lại public/og.png (ảnh xem trước khi dán link)
npm run fonts        # tải lại font về public/fonts/ + sinh src/styles/fonts.css
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
│   ├── contact-form.ts    ← kiểm tra và gửi biểu mẫu liên hệ
│   └── ui.ts              ← hiện dần khi cuộn, thanh nav, nghiêng thẻ theo con trỏ
├── styles/
│   ├── global.css         ← biến màu, kiểu chữ, nút, chip
│   └── fonts.css          ← SINH TỰ ĐỘNG, đừng sửa tay (xem scripts/fetch-fonts.mjs)
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
- **Three.js chỉ tải trên máy để bàn.** Màn hẹp hơn 768px, hoặc người dùng bật "giảm chuyển
  động", thì gói three (~538 KB) **không tải chút nào** — canvas bị gỡ khỏi DOM và hero đổi sang
  `.hero__aurora`, một lớp gradient CSS chỉ động bằng `transform`/`opacity`. Máy yếu và mạng di
  động đúng là chỗ gói ấy đắt nhất, nên ở đó nó không đáng.
- **Còn lại thì nạp trễ** qua `import()` động trong `requestIdleCallback`. Chữ và CSS hiện xong
  trước; tải lỗi thì rơi về đúng nền CSS nói trên.
- **Cảnh 3D dừng khi không ai nhìn**: `IntersectionObserver` trên canvas cộng với
  `visibilitychange` — cuộn qua hero hoặc chuyển tab là `requestAnimationFrame` ngừng hẳn.
- **`prefers-reduced-motion`** bỏ hẳn Three.js, giữ quầng gradient nhưng dừng chuyển động.
- **Font tự chứa trong `public/fonts/`**, không còn `<link>` ra `fonts.googleapis.com`. Gọi ra
  Google Fonts nghĩa là chặn lần vẽ đầu để mở thêm hai kết nối rồi mới biết cần tải file nào.
  Mỗi bộ là font biến thiên, cắt còn ba subset latin / latin-ext / vietnamese; `unicode-range`
  lo phần còn lại, nên trang `/en` không tải file vietnamese. Trang nạp trước (`preload`) đúng
  hai subset mà màn hình đầu chắc chắn dùng, theo ngôn ngữ của chính trang đó.
- **Biểu mẫu liên hệ gửi qua dịch vụ ngoài** (Web3Forms), vì trang tĩnh thì không có máy chủ nào
  nhận `POST`. Chưa điền `ACCESS_KEY` trong `src/scripts/contact-form.ts` thì biểu mẫu vẫn kiểm
  tra dữ liệu nhưng báo thẳng là chưa nối dịch vụ và mời gửi email — không im lặng nuốt lời nhắn.
- **Mục "Nhận xét" tắt sẵn** (`testimonials.show = false` trong `profile.ts`). Khung đã dựng đủ;
  bật lên khi có lời nhận xét thật, chứ không trưng lời khen tự bịa.
- **Ảnh dự án lấy từ chính sản phẩm**, để trong `public/shots/` kèm bản `.webp`. iExam dùng lại
  ảnh marketing của `imath-test/public/landing/`, đã xoá hộp liên hệ ở thanh bên vì số điện thoại
  trong đó là của người khác. BCN Judge chụp bằng Playwright của chính dự án trên bản chạy máy
  với `db:seed:demo`. Tông Lệnh lấy từ bộ ảnh hướng dẫn `docs/huong-dan/images/`. Cả ba đều là dữ
  liệu demo, không có thông tin học sinh thật.
- **Khung ảnh lấy tỉ lệ của từng file** qua biến `--shot-ratio` (ProjectCard đặt từ
  `shot.width`/`shot.height`), nên ảnh hiện trọn, không bị `object-fit: cover` cắt mất thanh bên.
- **Đường dẫn luôn có `/` cuối** (`homePath()` trong `profile.ts`). Astro dựng `dist/en/index.html`,
  sitemap khai `/en/`, Cloudflare chuyển hướng `/en` → `/en/`; canonical mà ghi `/en` thì Google
  thấy một trang dưới hai địa chỉ.
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

`public/_headers` đặt cache một năm cho `/_astro/*` (tên file có vân tay nên an toàn) và cho
`/fonts/*`, không cache HTML, cùng vài header bảo mật cơ bản — Workers static assets đọc file này
giống hệt Pages.

## Việc còn để ngỏ

- `public/og.png` sinh từ `scripts/make-og.mjs` bằng font hệ thống của máy đang chạy, nên máy
  khác có thể ra chữ hơi khác. Nếu cần chuẩn tuyệt đối thì nhúng font vào SVG.
- Số điện thoại **cố ý không đặt trên trang** để tránh bot quét; nó vẫn nằm trong file CV tải về
  tại `public/cv/`.
- **LinkedIn, khoá Web3Forms và lời nhận xét** đều đang là chỗ trống có ghi `TODO`. Ba thứ này
  tự ẩn khi chưa điền, nên trang không bao giờ hiện liên kết chết.
