// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Trang tĩnh hoàn toàn: `astro build` cho ra ./dist đem thả thẳng lên Cloudflare Pages.
export default defineConfig({
    site: 'https://cunpoi.tech',
    output: 'static',
    trailingSlash: 'ignore',
    integrations: [
        sitemap({
            i18n: {
                defaultLocale: 'vi',
                locales: { vi: 'vi-VN', en: 'en-US' },
            },
        }),
    ],
    build: {
        inlineStylesheets: 'auto',
    },
    // three.js tự tách thành chunk riêng nhờ `import()` động trong Hero.astro —
    // không cần cấu hình manualChunks (Rolldown chỉ nhận dạng hàm).
});
