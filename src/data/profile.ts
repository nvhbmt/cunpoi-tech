/**
 * Nguồn dữ liệu duy nhất cho toàn trang, song ngữ.
 * Mỗi ngôn ngữ là một trang tĩnh riêng (`/` và `/en`), không có JS đổi ngôn ngữ.
 */

export const LANGS = ['vi', 'en'] as const;
export type Lang = (typeof LANGS)[number];

/**
 * Đường dẫn trang chủ của từng ngôn ngữ, luôn có dấu `/` cuối.
 *
 * Astro dựng ra `dist/en/index.html`, sitemap khai `/en/`, và Cloudflare tự
 * chuyển hướng `/en` sang `/en/`. Nếu thẻ canonical lại ghi `/en` thì ba nơi nói
 * ba kiểu, Google đọc được một trang dưới hai địa chỉ. Mọi nơi trong mã lấy
 * đường dẫn từ hàm này để không còn chỗ nào lệch.
 */
export function homePath(lang: Lang): string {
    return lang === 'vi' ? '/' : `/${lang}/`;
}

export const site = {
    domain: 'cunpoi.tech',
    url: 'https://cunpoi.tech',
    author: 'Nguyễn Việt Hoàng',
    authorLatin: 'Nguyen Viet Hoang',
    email: 'hoangnguyen1157@gmail.com',
    github: 'https://github.com/nvhbmt',
    githubHandle: 'nvhbmt',
    // TODO: thay bằng đường dẫn hồ sơ thật, ví dụ https://www.linkedin.com/in/nvhbmt/
    // Để trống chuỗi này thì mọi chỗ hiển thị LinkedIn tự ẩn đi, không có liên kết chết.
    linkedin: 'https://www.linkedin.com/in/',
    cv: '/cv/CV_Nguyen_Viet_Hoang_Fullstack.pdf',
    live: 'https://iexam.vn',
    themeColor: '#05070c',
} as const;

export interface Metric {
    value: string;
    label: string;
}

export interface ProjectLink {
    label: string;
    href: string;
    kind: 'live' | 'code';
}

/**
 * Ảnh chụp màn hình của dự án.
 *
 * Chưa có ảnh thật thì để trống cả trường `shot` — thẻ tự vẽ một ô giữ chỗ,
 * khung HTML và kích thước đã sẵn nên lúc thả ảnh vào bố cục không xê dịch.
 */
export interface Shot {
    /** Ảnh nền, định dạng phổ thông (.png/.jpg) — luôn phải có. */
    src: string;
    /** Bản .webp nhẹ hơn, trình duyệt nào hiểu thì lấy bản này trước. */
    webp?: string;
    /** Kích thước thật của ảnh, tính bằng pixel — đặt sẵn để khỏi giật bố cục. */
    width: number;
    height: number;
    /** Mô tả nội dung ảnh, viết theo ngôn ngữ của trang. */
    alt: string;
}

export interface Project {
    key: string;
    name: string;
    subtitle: string;
    period: string;
    role: string;
    summary: string;
    bullets: string[];
    stack: string[];
    metrics: Metric[];
    links: ProjectLink[];
    /** Ảnh chụp màn hình; bỏ trống thì thẻ hiện ô giữ chỗ. */
    shot?: Shot;
    /** Nhãn nhỏ góc thẻ: đang chạy thật, đang làm, đã xong… */
    badge?: string;
    /** Repo để riêng tư — hiện nhãn thay vì một liên kết chết. */
    privateRepo?: boolean;
    /** Màu của nhãn góc thẻ: đang chạy / đang làm / nội bộ. */
    tone?: 'live' | 'wip' | 'closed';
}

/**
 * Mức độ thành thạo, quyết định cả thứ tự lẫn màu của nhóm kỹ năng.
 * `daily` đậm nhất, `learning` chỉ viền mờ — người đọc lướt là thấy ngay
 * cái nào tôi gõ mỗi ngày, cái nào mới chỉ nghịch qua.
 */
export type SkillLevel = 'daily' | 'shipped' | 'learning';

export interface SkillTier {
    level: SkillLevel;
    title: string;
    /** Một dòng giải thích "đủ nhiều" nghĩa là gì ở mức này. */
    note: string;
    items: string[];
}

export interface Testimonial {
    /** Nội dung lời nhận xét, không kèm dấu ngoặc kép — CSS tự thêm. */
    quote: string;
    name: string;
    role: string;
    company: string;
    /** Ảnh đại diện; bỏ trống thì dùng chữ cái đầu của tên. */
    avatar?: string;
}

export interface Content {
    htmlLang: string;
    label: string;
    switchTo: { href: string; label: string; aria: string };
    meta: { title: string; description: string; keywords: string };
    nav: { about: string; work: string; projects: string; skills: string; contact: string };
    /** Nhãn mục "lời nhận xét" trên thanh điều hướng — chỉ hiện khi mục đó bật. */
    navTestimonials: string;
    skipToContent: string;
    hero: {
        eyebrow: string;
        name: string;
        roles: string[];
        tagline: string;
        ctaProjects: string;
        ctaCv: string;
        scroll: string;
        available: string;
    };
    stats: Metric[];
    about: {
        n: string;
        title: string;
        lead: string;
        paragraphs: string[];
        pillars: { title: string; body: string; items: string[] }[];
    };
    work: {
        n: string;
        title: string;
        lead: string;
        company: string;
        position: string;
        period: string;
        location: string;
        intro: string;
        bullets: string[];
        products: Project[];
        productsTitle: string;
    };
    projects: {
        n: string;
        title: string;
        lead: string;
        items: Project[];
        viewCode: string;
        viewLive: string;
        privateRepo: string;
        moreOnGithub: string;
        /** Chữ trong ô giữ chỗ khi dự án chưa có ảnh chụp màn hình. */
        shotSoon: string;
    };
    skills: {
        n: string;
        title: string;
        lead: string;
        /** Ba bậc theo mức độ dùng thật, xếp từ thành thạo nhất xuống. */
        tiers: SkillTier[];
        /**
         * Quy trình và ngoại ngữ không nằm trên cùng một thước đo với thư viện,
         * nên để riêng phía dưới thay vì nhét bừa vào một bậc nào đó.
         */
        aside: { title: string; items: string[] }[];
    };
    testimonials: {
        /*
         * Cố tình không có số thứ tự: dãy 01–05 của trang giữ nguyên dù mục này
         * bật hay tắt, khỏi phải đánh số lại mỗi lần đổi ý.
         */
        title: string;
        lead: string;
        /**
         * Bật lên khi đã có lời nhận xét thật. Để `false` thì cả mục biến mất
         * khỏi trang — thà thiếu còn hơn trưng lời khen bịa ra cho có.
         */
        show: boolean;
        items: Testimonial[];
    };
    education: {
        title: string;
        school: string;
        degree: string;
        period: string;
        details: string[];
    };
    contact: {
        n: string;
        title: string;
        lead: string;
        body: string;
        emailLabel: string;
        githubLabel: string;
        linkedinLabel: string;
        cvLabel: string;
        liveLabel: string;
        form: {
            title: string;
            name: { label: string; placeholder: string; error: string };
            email: { label: string; placeholder: string; error: string; invalid: string };
            message: { label: string; placeholder: string; error: string };
            submit: string;
            sending: string;
            ok: string;
            fail: string;
            /** Hiện khi chưa điền khoá API — biểu mẫu tự chuyển sang mời gửi email. */
            unconfigured: string;
        };
    };
    footer: { built: string; rights: string };
}

/* ------------------------------------------------------------------ */
/* Tiếng Việt                                                          */
/* ------------------------------------------------------------------ */

const vi: Content = {
    htmlLang: 'vi',
    label: 'Tiếng Việt',
    switchTo: { href: '/en/', label: 'EN', aria: 'Switch to English' },
    meta: {
        title: 'Nguyễn Việt Hoàng — Fullstack Developer',
        description:
            'Fullstack developer tại TP.HCM. Hơn một năm xây nền tảng AI Agent doanh nghiệp cho thị trường Nhật, song song tự thiết kế và vận hành iExam — nền tảng thi online đang có hơn 500 giáo viên sử dụng.',
        keywords:
            'fullstack developer, React, TypeScript, Go, Hono, Astro, Nguyễn Việt Hoàng, cunpoi, iExam, iexam.vn',
    },
    nav: {
        about: 'Giới thiệu',
        work: 'Kinh nghiệm',
        projects: 'Dự án',
        skills: 'Kỹ năng',
        contact: 'Liên hệ',
    },
    navTestimonials: 'Nhận xét',
    skipToContent: 'Bỏ qua, tới nội dung chính',
    hero: {
        eyebrow: 'Fullstack Developer · TP. Hồ Chí Minh',
        name: 'Nguyễn Việt Hoàng',
        roles: ['React & TypeScript', 'Go · Hono · FastAPI', 'Hệ thống chạy thật'],
        tagline:
            'Tôi xây sản phẩm web chạy thật — từ nền tảng AI Agent cho doanh nghiệp Nhật Bản, đến hệ thống thi trực tuyến hơn 500 giáo viên Việt Nam đang dùng mỗi ngày.',
        ctaProjects: 'Xem dự án',
        ctaCv: 'Tải CV (PDF)',
        scroll: 'Cuộn xuống',
        available: 'Đang làm toàn thời gian · nhận thêm dự án bán thời gian',
    },
    stats: [
        { value: '500+', label: 'giáo viên đang dùng iExam mỗi ngày' },
        { value: '3', label: 'sản phẩm tôi tự làm và đang tự vận hành' },
        { value: '2', label: 'nền tảng doanh nghiệp Nhật Bản đang tham gia' },
        { value: '1+', label: 'năm làm sản phẩm có người dùng thật' },
    ],
    about: {
        n: '01',
        title: 'Giới thiệu',
        lead: 'Đang là sinh viên năm 4, nhưng code đã chạy thật được một năm rưỡi.',
        paragraphs: [
            'Tôi là sinh viên năm 4 ngành Kỹ thuật phần mềm tại Đại học Công nghiệp TP.HCM (IUH). Từ năm 2025 tôi làm fullstack tại HDC Flowtech trên M-Agent (MOSA) — nền tảng AI Agent và tự động hoá quy trình cho khách hàng doanh nghiệp Nhật Bản — phụ trách **cả ba module frontend và ba service backend**, đồng thời **dẫn một nhóm hai người**.',
            'Ngoài giờ làm, tôi **tự thiết kế, viết và vận hành** hệ thống của riêng mình: iExam hiện có **hơn 500 giáo viên** dùng để tổ chức thi, BCN Judge đang chấm bài cho câu lạc bộ, và hệ thi đua nề nếp đang chạy ở một trường THPT — **cả ba đều đã đi vào sử dụng thật**. Phần tôi thấy đáng làm nhất lại là phần người dùng không bao giờ nhìn thấy: đọc định dạng nhị phân, dựng sandbox, viết migration không đụng vào dữ liệu cũ, và test đủ nhiều để bấm deploy mà không phải hồi hộp.',
        ],
        pillars: [
            {
                title: 'Frontend có kiến trúc',
                body: 'Giao diện lớn, nhiều vai trò, nhiều ngôn ngữ — và vẫn đọc được sau sáu tháng.',
                items: ['React 19 · Next.js', 'TypeScript nghiêm ngặt', 'Zustand · TanStack Query', 'i18n JA/EN/VI'],
            },
            {
                title: 'Backend và hạ tầng',
                body: 'Service tôi tự viết, tự deploy, và tự dậy sửa khi nó sập lúc nửa đêm.',
                items: ['Go · gRPC · Protobuf', 'Hono · Drizzle · Postgres', 'Python FastAPI', 'Docker · GitLab CI/CD'],
            },
            {
                title: 'Bài toán khó nhằn',
                body: 'Những bài toán không có thư viện sẵn: định dạng nhị phân, chấm bài, chống gian lận.',
                items: ['MathType MTEF/OLE → LaTeX', 'Sandbox chấm bài Docker', 'Chống gian lận khi thi', 'KaTeX · TipTap · XYFlow'],
            },
        ],
    },
    work: {
        n: '02',
        title: 'Kinh nghiệm',
        lead: 'Một nơi làm việc, hai sản phẩm doanh nghiệp cho thị trường Nhật.',
        company: 'HDC Flowtech',
        position: 'Fullstack Developer',
        period: '2025 — nay',
        location: 'TP. Hồ Chí Minh',
        intro:
            'Làm sản phẩm AI cho thị trường Nhật Bản: fullstack cả frontend lẫn backend, và dẫn một nhóm hai người.',
        bullets: [
            'Viết frontend cho ba module — Admin Console, User Portal và Superadmin Dashboard — bằng React 19, TypeScript, Vite và Tailwind CSS, có bộ kiểm thử tự động chạy trước mỗi lần phát hành.',
            'Dựng Workflow Builder trực quan (XYFlow) cho phép kéo thả pipeline tự động hoá nối Gmail, Google Drive, Telegram, Zoho, Chatwork, Jira và GitLab qua OAuth2.',
            'Xây Credit Management (số lớn BigInt, biểu đồ SVG, xuất CSV), Chat AI (streaming, xem trước tệp, tối ưu cuộn), xác thực 2FA và i18n Nhật/Anh cho toàn bộ module.',
            'Dẫn nhóm 2 lập trình viên: giao việc qua Jira, review merge request và kèm cặp về chuẩn code frontend.',
            'Quản lý CI/CD bằng GitLab pipeline, Docker và Husky; duy trì ba nhánh main/staging/dev, mỗi bản phát hành đánh tag.',
        ],
        productsTitle: 'Sản phẩm đã tham gia',
        products: [
            {
                key: 'mosa',
                name: 'M-Agent (MOSA)',
                subtitle: 'Nền tảng AI Agent & tự động hoá quy trình cho doanh nghiệp Nhật',
                period: '2025 — nay',
                role: 'Fullstack developer · Team lead (2 người)',
                summary:
                    'Nền tảng để doanh nghiệp tự ráp luồng tự động hoá bằng AI, nối email, lưu trữ đám mây, CRM và các dịch vụ nhắn tin.',
                bullets: [
                    'Workflow Builder kéo thả trên XYFlow và hệ connector OAuth2 cho 7+ nhà cung cấp.',
                    'Credit Management tính bằng BigInt cho khỏi sai số, biểu đồ SVG tự vẽ và xuất CSV.',
                    'Chat AI streaming kèm xem trước tệp, cùng xác thực hai lớp 2FA.',
                    'Phục vụ khách hàng doanh nghiệp Nhật (Eigyo DX, Kunii) với i18n JA/EN đầy đủ.',
                ],
                stack: ['React 19', 'TypeScript', 'Go', 'gRPC', 'Hono', 'FastAPI', 'Docker', 'GitLab CI'],
                metrics: [
                    { value: '2', label: 'khách hàng doanh nghiệp Nhật đang dùng' },
                    { value: '7+', label: 'dịch vụ ngoài nối được vào một luồng' },
                    { value: '3 + 3', label: 'mảng giao diện / dịch vụ nền tôi phụ trách' },
                ],
                links: [],
                badge: 'Nội bộ doanh nghiệp',
                tone: 'closed',
            },
            {
                key: 'mrag',
                name: 'MRAG (Musashino)',
                subtitle: 'Nền tảng tri thức RAG',
                period: '2025 — 2026',
                role: 'Frontend developer (Admin · User · Superadmin)',
                summary:
                    'Nền tảng Retrieval-Augmented Generation với cổng quản trị và cổng người dùng để quản lý bộ tri thức, use case và trò chuyện với AI.',
                bullets: [
                    'Hybrid Builder: nhập tài liệu từ Google Drive, chọn từng slide PPTX.',
                    'File Manager với chia sẻ, phân quyền và vai trò Supervisor.',
                    'Sinh slide/poster ngay trong khung chat, cấu hình watermark MCBuilder, xuất CSV.',
                    'Widget chat nhúng (mrag-embed) viết bằng Preact + Vite, đẩy lên Google Cloud Storage.',
                ],
                stack: ['Next.js 15', 'React 19', 'TypeScript', 'FastAPI', 'Tailwind CSS', 'Radix UI', 'DnD Kit'],
                metrics: [
                    { value: '3', label: 'cổng giao diện' },
                    { value: 'JA/EN', label: 'song ngữ toàn hệ thống' },
                ],
                links: [],
                badge: 'Nội bộ doanh nghiệp',
                tone: 'closed',
            },
        ],
    },
    projects: {
        n: '03',
        title: 'Dự án cá nhân',
        lead: 'Tự đặt bài toán, tự thiết kế, tự viết, tự deploy và tự trực khi có sự cố.',
        viewCode: 'Mã nguồn',
        viewLive: 'Xem trang thật',
        privateRepo: 'Mã nguồn để riêng tư — mở ra xem được khi phỏng vấn',
        moreOnGithub: 'GitHub của tôi',
        shotSoon: 'Ảnh màn hình sắp bổ sung',
        items: [
            {
                key: 'iexam',
                name: 'iExam',
                subtitle: 'Hệ thống thi trắc nghiệm trực tuyến hỗ trợ công thức toán',
                period: '06/2026 — nay',
                role: 'Một mình: thiết kế, frontend, backend, vận hành VPS',
                summary:
                    'Nền tảng thi online đang có hơn 500 giáo viên sử dụng, dựng riêng cho đề toán: công thức LaTeX hiển thị bằng KaTeX, ba dạng câu hỏi theo chuẩn đề thi Việt Nam, theo dõi tiến độ làm bài theo thời gian thực.',
                bullets: [
                    'Ba vai trò Admin · Giáo viên · Học sinh ẩn danh, ba dạng câu hỏi: trắc nghiệm, đúng/sai bốn mệnh đề, trả lời ngắn.',
                    'Chống gian lận: phát hiện chuyển tab, rời cửa sổ, chặn copy và ghi nhận số lần vi phạm.',
                    'Bốn gói engine dùng chung, không dính vào framework nào: parser MTEF, editor, parser TikZ và parser TeX.',
                    'Chạy được trên máy và điện thoại đời cũ của học sinh: mỗi sự cố từng gặp ngoài thực tế đều được cài sẵn luật chặn để không lặp lại.',
                    'Deploy blue-green lên VPS tự quản qua GitHub Actions, có smoke test trước khi đổi luồng.',
                ],
                stack: ['React 19', 'Vite 8', 'TypeScript', 'Tailwind v4', 'Zustand', 'Hono', 'Drizzle', 'PostgreSQL', 'KaTeX'],
                metrics: [
                    { value: '500+', label: 'giáo viên đang sử dụng' },
                    { value: 'Tự động', label: 'chấm xong ngay khi học sinh nộp bài' },
                    { value: '06/2026', label: 'chạy thật liên tục từ' },
                ],
                /*
                 * TODO — ảnh chụp màn hình: đặt file vào `public/shots/iexam.png`
                 * (kèm `iexam.webp` nếu xuất được) rồi mở khối dưới đây:
                 *
                 *   shot: {
                 *       src: '/shots/iexam.png',
                 *       webp: '/shots/iexam.webp',
                 *       width: 1600,
                 *       height: 1000,
                 *       alt: '…mô tả đúng thứ đang có trên ảnh…',
                 *   },
                 *
                 * `width`/`height` phải là kích thước thật của file: thẻ dùng nó để
                 * chừa sẵn chỗ, thiếu là ảnh tải xong sẽ đẩy nội dung nhảy xuống.
                 * Chưa mở thì thẻ hiện ô giữ chỗ, bố cục vẫn y như khi đã có ảnh.
                 */
                links: [{ label: 'iexam.vn', href: 'https://iexam.vn', kind: 'live' }],
                privateRepo: true,
                badge: 'Đang chạy thật',
                tone: 'live',
            },
            {
                key: 'bcn-judge',
                name: 'BCN Judge',
                subtitle: 'Online judge của câu lạc bộ: chấm bài trong sandbox Docker',
                period: '09/2026 — nay',
                role: 'Một mình: đặc tả, thiết kế, frontend, backend, worker chấm bài',
                summary:
                    'Hệ thống chấm bài tập lập trình nội bộ: ban quản lý ra đề theo khoá học, thành viên code ngay trên trình duyệt, chấm tự động bằng testcase, contest theo tuần có bảng xếp hạng đóng băng.',
                bullets: [
                    'Worker chấm bài chạy từng bài nộp trong container Docker riêng, giới hạn thời gian, bộ nhớ và ghi đĩa.',
                    'Contest theo tuần với bảng xếp hạng, luật ưu tiên, đóng băng cuối giờ và chế độ luyện tập sau khi kết thúc.',
                    'Team và leader: leader theo dõi tiến độ, bài nộp của nhóm mình; đăng nhập bằng Discord.',
                    'Dữ liệu gửi xuống thành viên chỉ đi qua tầng serializer — các trường cấm được khai kiểu `never`, nên lỡ tay để lộ đáp án là lỗi biên dịch ngay.',
                    'Migration viết tay, chỉ thêm chứ không xoá, có script kiểm tra chặn lại trước khi deploy.',
                ],
                stack: ['React 19', 'Vite', 'Tailwind v4', 'Hono', 'Drizzle', 'PostgreSQL 17', 'dockerode', 'MinIO', 'Playwright'],
                metrics: [
                    { value: 'Tự động', label: 'chấm bài và trả kết quả ngay khi nộp' },
                    { value: 'Hàng tuần', label: 'contest có bảng xếp hạng' },
                    { value: 'Discord', label: 'đăng nhập, không phải tạo tài khoản mới' },
                ],
                /*
                 * TODO — ảnh chụp màn hình: đặt file vào `public/shots/bcn-judge.png`
                 * (kèm `bcn-judge.webp` nếu xuất được) rồi mở khối dưới đây:
                 *
                 *   shot: {
                 *       src: '/shots/bcn-judge.png',
                 *       webp: '/shots/bcn-judge.webp',
                 *       width: 1600,
                 *       height: 1000,
                 *       alt: '…mô tả đúng thứ đang có trên ảnh…',
                 *   },
                 *
                 * `width`/`height` phải là kích thước thật của file: thẻ dùng nó để
                 * chừa sẵn chỗ, thiếu là ảnh tải xong sẽ đẩy nội dung nhảy xuống.
                 * Chưa mở thì thẻ hiện ô giữ chỗ, bố cục vẫn y như khi đã có ảnh.
                 */
                links: [{ label: 'GitHub', href: 'https://github.com/nvhbmt/bcn-judge', kind: 'code' }],
                badge: 'Đang chạy thật',
                tone: 'live',
            },
            {
                key: 'tonglenh',
                name: 'Thi đua THPT Tông Lệnh',
                subtitle: 'PWA quản lý thi đua nề nếp cho trường THPT',
                period: '09/2026 — nay',
                role: 'Một mình: kiểm kê bản cũ, đặc tả, thiết kế, triển khai',
                summary:
                    'Xây lại hệ thống thi đua nề nếp của một trường THPT thành PWA React theo clean architecture, cắt hẳn Firebase mà bản gốc phụ thuộc vào.',
                bullets: [
                    'Chấm điểm Cờ đỏ, trực ban, sổ đầu bài, quét QR học sinh và nghiệp vụ Đoàn trên điện thoại.',
                    'Quy tắc nghiệp vụ và hợp đồng dữ liệu để hết ở `shared/`, client và server dùng chung một bản.',
                    'Sáu bản kiểm kê tính năng của hệ thống cũ, dùng làm checklist đối chiếu lúc chuyển dữ liệu sang.',
                    'Nhận diện theo phong cách Đoàn TNCS Hồ Chí Minh, huy hiệu và cờ được dựng lại dạng vector.',
                ],
                stack: ['React 19', 'Vite', 'Tailwind v4', 'PWA', 'Hono', 'Drizzle', 'PostgreSQL 17'],
                metrics: [
                    { value: 'Điện thoại', label: 'chấm nề nếp ngay tại lớp' },
                    { value: 'Quét QR', label: 'tra cứu học sinh tại chỗ' },
                    { value: '1 app', label: 'Cờ đỏ, trực ban, sổ đầu bài, Đoàn' },
                ],
                /*
                 * TODO — ảnh chụp màn hình: đặt file vào `public/shots/tonglenh.png`
                 * (kèm `tonglenh.webp` nếu xuất được) rồi mở khối dưới đây:
                 *
                 *   shot: {
                 *       src: '/shots/tonglenh.png',
                 *       webp: '/shots/tonglenh.webp',
                 *       width: 1600,
                 *       height: 1000,
                 *       alt: '…mô tả đúng thứ đang có trên ảnh…',
                 *   },
                 *
                 * `width`/`height` phải là kích thước thật của file: thẻ dùng nó để
                 * chừa sẵn chỗ, thiếu là ảnh tải xong sẽ đẩy nội dung nhảy xuống.
                 * Chưa mở thì thẻ hiện ô giữ chỗ, bố cục vẫn y như khi đã có ảnh.
                 */
                links: [],
                privateRepo: true,
                badge: 'Đang chạy thật',
                tone: 'live',
            },
        ],
    },
    skills: {
        n: '04',
        title: 'Kỹ năng',
        lead: 'Chia theo mức tôi thật sự dùng, không phải theo danh sách nghe cho oai.',
        tiers: [
            {
                level: 'daily',
                title: 'Dùng hằng ngày',
                note: 'Mở máy lên là gõ. Nhận việc gấp bằng những thứ này thì tôi không phải tra cứu.',
                items: [
                    'React 19',
                    'TypeScript',
                    'Next.js 15/16',
                    'Vite',
                    'Tailwind CSS v3/v4',
                    'Go (Golang)',
                    'Hono',
                    'Python · FastAPI',
                    'Node.js',
                    'PostgreSQL',
                    'Drizzle ORM',
                    'Zustand',
                    'TanStack Query',
                    'Docker',
                    'Git',
                ],
            },
            {
                level: 'shipped',
                title: 'Đã dùng trong dự án thật',
                note: 'Đủ để đưa lên chạy thật và tự sửa khi hỏng, nhưng không phải tuần nào cũng đụng.',
                items: [
                    'gRPC · Protobuf',
                    'Kiến trúc microservice',
                    'Prisma',
                    'Astro',
                    'React Router',
                    'Radix UI',
                    'XYFlow',
                    'KaTeX',
                    'TipTap',
                    'PWA',
                    'Three.js',
                    'Recharts',
                    'PDF.js',
                    'GitLab CI/CD',
                    'GitHub Actions',
                    'Vitest · Playwright',
                    'Husky · commitlint',
                    'ESLint · Prettier',
                    'MinIO',
                ],
            },
            {
                level: 'learning',
                title: 'Đã thử · đang học',
                note: 'Làm được việc nhỏ hoặc mới dựng thử. Nhận việc chính bằng mấy thứ này thì tôi nói trước.',
                items: [
                    'Milkdown · Lexical',
                    'ApexCharts',
                    'DnD Kit',
                    'FullCalendar',
                    'Mermaid',
                    'Framer Motion',
                    'Sentry',
                ],
            },
        ],
        aside: [
            {
                title: 'Quy trình',
                items: ['Jira', 'Agile / Scrum', 'Code review · Merge request', 'Đặc tả và thiết kế trước khi code', 'Dẫn nhóm nhỏ'],
            },
            {
                title: 'Ngôn ngữ',
                items: ['Tiếng Việt (bản ngữ)', 'Tiếng Anh (đọc viết tài liệu kỹ thuật)'],
            },
        ],
    },
    testimonials: {
        title: 'Người từng làm cùng nói gì',
        lead: 'Vài dòng từ người đã dùng sản phẩm hoặc đã ngồi review code của tôi.',
        /*
         * TODO: xin lời nhận xét thật (quản lý ở HDC Flowtech, giáo viên đang dùng
         * iExam, ban chủ nhiệm câu lạc bộ), điền vào `items` rồi đổi `show` thành
         * `true`. Chừng nào chưa có thì để nguyên `false`: trưng lời khen tự bịa
         * lên trang cá nhân là nói dối người đọc, hại nhiều hơn lợi.
         */
        show: false,
        items: [
            {
                quote: 'TODO — thay bằng lời nhận xét thật, giữ nguyên giọng của người nói.',
                name: 'TODO — họ tên',
                role: 'TODO — chức danh',
                company: 'TODO — nơi làm việc',
            },
            {
                quote: 'TODO — thay bằng lời nhận xét thật, giữ nguyên giọng của người nói.',
                name: 'TODO — họ tên',
                role: 'TODO — chức danh',
                company: 'TODO — nơi làm việc',
            },
        ],
    },
    education: {
        title: 'Học vấn',
        school: 'Đại học Công nghiệp TP. Hồ Chí Minh (IUH)',
        degree: 'Kỹ sư Kỹ thuật phần mềm — sinh viên năm 4',
        period: '2023 — nay',
        details: [
            'Môn liên quan: Cấu trúc dữ liệu & Giải thuật, Lập trình Web, Cơ sở dữ liệu, Hệ điều hành, Mạng máy tính, Công nghệ phần mềm.',
        ],
    },
    contact: {
        n: '05',
        title: 'Liên hệ',
        lead: 'Nhận thêm dự án bán thời gian.',
        body: 'Tôi đang làm toàn thời gian tại HDC Flowtech nên chỉ nhận thêm việc bán thời gian hoặc freelance — thường là những dự án quy mô nhỏ, không cần phân biệt rõ frontend hay backend. Bạn cứ gửi phạm vi công việc và thời hạn, tôi trả lời trong ngày.',
        emailLabel: 'Gửi email',
        githubLabel: 'GitHub',
        linkedinLabel: 'LinkedIn',
        cvLabel: 'Tải CV (PDF)',
        liveLabel: 'Sản phẩm đang chạy',
        form: {
            title: 'Hoặc nhắn thẳng ở đây',
            name: {
                label: 'Họ tên',
                placeholder: 'Nguyễn Văn A',
                error: 'Cho tôi xin tên bạn với.',
            },
            email: {
                label: 'Email',
                placeholder: 'ban@congty.com',
                error: 'Cần email để tôi trả lời bạn.',
                invalid: 'Email này trông chưa đúng — kiểm tra lại giúp tôi.',
            },
            message: {
                label: 'Lời nhắn',
                placeholder: 'Phạm vi công việc, thời hạn mong muốn, ngân sách nếu có…',
                error: 'Viết vài dòng về việc bạn cần nhé.',
            },
            submit: 'Gửi',
            sending: 'Đang gửi…',
            ok: 'Đã gửi, cảm ơn bạn! Tôi trả lời trong ngày.',
            fail: 'Gửi không được. Bạn email thẳng cho tôi giúp nhé.',
            unconfigured: 'Biểu mẫu chưa nối với dịch vụ gửi thư — bạn email thẳng cho tôi nhé.',
        },
    },
    footer: {
        built: 'Dựng bằng Astro và Three.js · trang tĩnh, không theo dõi người dùng',
        rights: 'Nguyễn Việt Hoàng',
    },
};

/* ------------------------------------------------------------------ */
/* English                                                             */
/* ------------------------------------------------------------------ */

const en: Content = {
    htmlLang: 'en',
    label: 'English',
    switchTo: { href: '/', label: 'VI', aria: 'Chuyển sang tiếng Việt' },
    meta: {
        title: 'Nguyen Viet Hoang — Fullstack Developer',
        description:
            'Fullstack developer based in Ho Chi Minh City. Over a year building an enterprise AI-agent platform for the Japanese market, alongside iExam — an exam platform now used by over 500 teachers.',
        keywords:
            'fullstack developer, React, TypeScript, Go, Hono, Astro, Nguyen Viet Hoang, cunpoi, iExam, iexam.vn',
    },
    nav: {
        about: 'About',
        work: 'Experience',
        projects: 'Projects',
        skills: 'Skills',
        contact: 'Contact',
    },
    navTestimonials: 'Recommendations',
    skipToContent: 'Skip to main content',
    hero: {
        eyebrow: 'Fullstack Developer · Ho Chi Minh City',
        name: 'Nguyen Viet Hoang',
        roles: ['React & TypeScript', 'Go · Hono · FastAPI', 'Systems in production'],
        tagline:
            'I build web products that actually run — from an enterprise AI-agent platform for Japanese companies to an online exam system more than 500 Vietnamese teachers use every day.',
        ctaProjects: 'See projects',
        ctaCv: 'Download CV (PDF)',
        scroll: 'Scroll',
        available: 'Employed full-time · open to part-time projects',
    },
    stats: [
        { value: '500+', label: 'teachers using iExam every day' },
        { value: '3', label: 'products I built and run myself' },
        { value: '2', label: 'enterprise platforms for Japanese clients' },
        { value: '1+', label: 'year building software people use daily' },
    ],
    about: {
        n: '01',
        title: 'About',
        lead: 'Final-year student — and eighteen months of shipping to production.',
        paragraphs: [
            'I am a fourth-year Software Engineering student at Industrial University of Ho Chi Minh City (IUH). Since 2025 I have worked fullstack at HDC Flowtech on M-Agent (MOSA) — an AI agent and workflow automation platform for Japanese enterprise clients — owning **all three frontend modules and three backend services** while **leading a team of two**.',
            'Outside work I **design, write and operate** my own systems: iExam runs real exams for **more than 500 teachers**, BCN Judge grades club submissions, and a conduct-tracking system runs at a high school — **all three are in daily use**. I like the hard parts users never see: binary parsers, sandboxes, safe migrations, and a test suite thick enough that pressing deploy is not a gamble.',
        ],
        pillars: [
            {
                title: 'Frontend with architecture',
                body: 'Large surfaces, many roles, many languages — still readable six months later.',
                items: ['React 19 · Next.js', 'Strict TypeScript', 'Zustand · TanStack Query', 'i18n JA/EN/VI'],
            },
            {
                title: 'Backend and infrastructure',
                body: 'Services I write, deploy and get paged for when they fall over at midnight.',
                items: ['Go · gRPC · Protobuf', 'Hono · Drizzle · Postgres', 'Python FastAPI', 'Docker · GitLab CI/CD'],
            },
            {
                title: 'Hard problem domains',
                body: 'The work with no library waiting for it: binary formats, grading, anti-cheat.',
                items: ['MathType MTEF/OLE → LaTeX', 'Docker grading sandbox', 'Exam anti-cheat', 'KaTeX · TipTap · XYFlow'],
            },
        ],
    },
    work: {
        n: '02',
        title: 'Experience',
        lead: 'One company, two enterprise products for the Japanese market.',
        company: 'HDC Flowtech',
        position: 'Fullstack Developer',
        period: '2025 — Present',
        location: 'Ho Chi Minh City',
        intro:
            'Building AI products for the Japanese market: fullstack across frontend and backend, plus team lead for two developers.',
        bullets: [
            'Developed frontend for three modules — Admin Console, User Portal and Superadmin Dashboard — using React 19, TypeScript, Vite and Tailwind CSS, with an automated test suite gating every release.',
            'Developed a visual Workflow Builder (XYFlow) enabling drag-and-drop automation pipelines connecting Gmail, Google Drive, Telegram, Zoho, Chatwork, Jira and GitLab via OAuth2.',
            'Implemented Credit Management (BigInt precision, SVG dashboards, CSV export), Chat AI (streaming, file preview, scroll optimisation), 2FA authentication and i18n (Japanese/English) across all modules.',
            'Led a team of 2 developers: assigned tasks via Jira, reviewed merge requests and mentored on frontend code standards.',
            'Managed CI/CD with GitLab pipelines, Docker and Husky; maintained a main/staging/dev branching strategy with tag-based releases.',
        ],
        productsTitle: 'Products I worked on',
        products: [
            {
                key: 'mosa',
                name: 'M-Agent (MOSA)',
                subtitle: 'Enterprise AI agent & workflow automation platform for Japan',
                period: '2025 — Present',
                role: 'Fullstack developer · Team lead (2 people)',
                summary:
                    'A platform that lets companies assemble AI-powered automation workflows across email, cloud storage, CRM and messaging services.',
                bullets: [
                    'Drag-and-drop Workflow Builder on XYFlow and an OAuth2 connector system covering 7+ providers.',
                    'Credit Management with BigInt precision, hand-drawn SVG charts and CSV export.',
                    'Streaming Chat AI with file preview, plus two-factor authentication.',
                    'Served Japanese enterprise clients (Eigyo DX, Kunii) with full JA/EN localisation.',
                ],
                stack: ['React 19', 'TypeScript', 'Go', 'gRPC', 'Hono', 'FastAPI', 'Docker', 'GitLab CI'],
                metrics: [
                    { value: '2', label: 'Japanese enterprise clients on it' },
                    { value: '7+', label: 'outside services wired into one workflow' },
                    { value: '3 + 3', label: 'frontend modules / backend services I own' },
                ],
                links: [],
                badge: 'Private / enterprise',
                tone: 'closed',
            },
            {
                key: 'mrag',
                name: 'MRAG (Musashino)',
                subtitle: 'RAG knowledge platform',
                period: '2025 — 2026',
                role: 'Frontend developer (Admin · User · Superadmin)',
                summary:
                    'A Retrieval-Augmented Generation platform with admin and user portals for managing knowledge collections, use cases and AI chat.',
                bullets: [
                    'Hybrid Builder: Google Drive import with per-slide PPTX selection.',
                    'File Manager with sharing, permissions and Supervisor roles.',
                    'Slide and poster generation from chat, MCBuilder watermark settings, dashboard CSV export.',
                    'An embeddable chat widget (mrag-embed) in Preact + Vite, deployed to Google Cloud Storage.',
                ],
                stack: ['Next.js 15', 'React 19', 'TypeScript', 'FastAPI', 'Tailwind CSS', 'Radix UI', 'DnD Kit'],
                metrics: [
                    { value: '3', label: 'portals' },
                    { value: 'JA/EN', label: 'localised end to end' },
                ],
                links: [],
                badge: 'Private / enterprise',
                tone: 'closed',
            },
        ],
    },
    projects: {
        n: '03',
        title: 'Personal projects',
        lead: 'My own brief, my own design, my own code, my own deploy — and my own pager.',
        viewCode: 'Source',
        viewLive: 'Visit site',
        privateRepo: 'Private repository — happy to walk through it in an interview',
        moreOnGithub: 'My GitHub',
        shotSoon: 'Screenshot coming soon',
        items: [
            {
                key: 'iexam',
                name: 'iExam',
                subtitle: 'Online exam platform built for mathematics',
                period: 'Jun 2026 — Present',
                role: 'Everything: design, frontend, backend, VPS operations',
                summary:
                    'An exam platform now used by over 500 teachers, built specifically for maths papers: LaTeX rendered with KaTeX, the three question types Vietnamese exams use, and live progress tracking while students sit the test.',
                bullets: [
                    'Three roles — admin, teacher, anonymous student — and three question types: multiple choice, four-proposition true/false, short answer.',
                    'Anti-cheat: tab-switch and window-blur detection, copy blocking, and a recorded violation count per attempt.',
                    'Four framework-free shared engines: MTEF parser, editor, TikZ parser and TeX parser.',
                    'Works on the old laptops and phones students actually bring: every incident we hit in the wild is encoded as a rule that blocks it from recurring.',
                    'Blue-green deploys to a self-managed VPS through GitHub Actions, with smoke tests before the switch.',
                ],
                stack: ['React 19', 'Vite 8', 'TypeScript', 'Tailwind v4', 'Zustand', 'Hono', 'Drizzle', 'PostgreSQL', 'KaTeX'],
                metrics: [
                    { value: '500+', label: 'teachers using it' },
                    { value: 'Instant', label: 'marking the moment a student submits' },
                    { value: '06/2026', label: 'running in production since' },
                ],
                /*
                 * TODO — ảnh chụp màn hình: đặt file vào `public/shots/iexam.png`
                 * (kèm `iexam.webp` nếu xuất được) rồi mở khối dưới đây:
                 *
                 *   shot: {
                 *       src: '/shots/iexam.png',
                 *       webp: '/shots/iexam.webp',
                 *       width: 1600,
                 *       height: 1000,
                 *       alt: '…mô tả đúng thứ đang có trên ảnh…',
                 *   },
                 *
                 * `width`/`height` phải là kích thước thật của file: thẻ dùng nó để
                 * chừa sẵn chỗ, thiếu là ảnh tải xong sẽ đẩy nội dung nhảy xuống.
                 * Chưa mở thì thẻ hiện ô giữ chỗ, bố cục vẫn y như khi đã có ảnh.
                 */
                links: [{ label: 'iexam.vn', href: 'https://iexam.vn', kind: 'live' }],
                privateRepo: true,
                badge: 'Live in production',
                tone: 'live',
            },
            {
                key: 'bcn-judge',
                name: 'BCN Judge',
                subtitle: 'A club online judge grading inside Docker sandboxes',
                period: 'Sep 2026 — Present',
                role: 'Everything: requirements, design, frontend, backend, judge worker',
                summary:
                    'An internal programming judge: organisers publish problems per course, members code in the browser, submissions are graded automatically against testcases, and weekly contests have a freezing scoreboard.',
                bullets: [
                    'A judge worker runs every submission in its own Docker container with time, memory and disk-write limits.',
                    'Weekly contests with standings, tie-break rules, an end-of-contest freeze and practice mode afterwards.',
                    'Teams and leaders: a leader follows their own team’s progress and submissions; Discord login.',
                    'Member-facing data leaves only through a serializer layer — forbidden fields are typed `never`, so leaking an answer is a compile error.',
                    'Hand-written, additive-only migrations with a guard script that blocks unsafe ones before deploy.',
                ],
                stack: ['React 19', 'Vite', 'Tailwind v4', 'Hono', 'Drizzle', 'PostgreSQL 17', 'dockerode', 'MinIO', 'Playwright'],
                metrics: [
                    { value: 'Instant', label: 'grading and feedback on submit' },
                    { value: 'Weekly', label: 'contests with a live scoreboard' },
                    { value: 'Discord', label: 'login, no new account needed' },
                ],
                /*
                 * TODO — ảnh chụp màn hình: đặt file vào `public/shots/bcn-judge.png`
                 * (kèm `bcn-judge.webp` nếu xuất được) rồi mở khối dưới đây:
                 *
                 *   shot: {
                 *       src: '/shots/bcn-judge.png',
                 *       webp: '/shots/bcn-judge.webp',
                 *       width: 1600,
                 *       height: 1000,
                 *       alt: '…mô tả đúng thứ đang có trên ảnh…',
                 *   },
                 *
                 * `width`/`height` phải là kích thước thật của file: thẻ dùng nó để
                 * chừa sẵn chỗ, thiếu là ảnh tải xong sẽ đẩy nội dung nhảy xuống.
                 * Chưa mở thì thẻ hiện ô giữ chỗ, bố cục vẫn y như khi đã có ảnh.
                 */
                links: [{ label: 'GitHub', href: 'https://github.com/nvhbmt/bcn-judge', kind: 'code' }],
                badge: 'Live in production',
                tone: 'live',
            },
            {
                key: 'tonglenh',
                name: 'Tong Lenh School Conduct System',
                subtitle: 'A PWA for school-wide conduct and merit tracking',
                period: 'Sep 2026 — Present',
                role: 'Everything: inventory of the old system, spec, design, build',
                summary:
                    'A rebuild of a high school’s conduct-and-merit system as a React PWA on clean architecture, dropping the original’s Firebase dependency entirely.',
                bullets: [
                    'Red-flag scoring, duty rosters, class logbooks, student QR scanning and Youth Union workflows, all usable on a phone.',
                    'Pure domain rules and data contracts live in `shared/`, used by both client and server.',
                    'Six feature inventories of the legacy system act as the migration checklist.',
                    'Visual identity in the Ho Chi Minh Communist Youth Union style, with the badge and flag rebuilt as vectors.',
                ],
                stack: ['React 19', 'Vite', 'Tailwind v4', 'PWA', 'Hono', 'Drizzle', 'PostgreSQL 17'],
                metrics: [
                    { value: 'Mobile', label: 'scoring done in the classroom' },
                    { value: 'QR scan', label: 'pull up any student on the spot' },
                    { value: '1 app', label: 'monitors, day book and union duties' },
                ],
                /*
                 * TODO — ảnh chụp màn hình: đặt file vào `public/shots/tonglenh.png`
                 * (kèm `tonglenh.webp` nếu xuất được) rồi mở khối dưới đây:
                 *
                 *   shot: {
                 *       src: '/shots/tonglenh.png',
                 *       webp: '/shots/tonglenh.webp',
                 *       width: 1600,
                 *       height: 1000,
                 *       alt: '…mô tả đúng thứ đang có trên ảnh…',
                 *   },
                 *
                 * `width`/`height` phải là kích thước thật của file: thẻ dùng nó để
                 * chừa sẵn chỗ, thiếu là ảnh tải xong sẽ đẩy nội dung nhảy xuống.
                 * Chưa mở thì thẻ hiện ô giữ chỗ, bố cục vẫn y như khi đã có ảnh.
                 */
                links: [],
                privateRepo: true,
                badge: 'Live in production',
                tone: 'live',
            },
        ],
    },
    skills: {
        n: '04',
        title: 'Skills',
        lead: 'Sorted by how much I actually use them, not by how good the list looks.',
        tiers: [
            {
                level: 'daily',
                title: 'Daily drivers',
                note: 'What I open the editor to. Hand me urgent work in these and I will not be reading docs.',
                items: [
                    'React 19',
                    'TypeScript',
                    'Next.js 15/16',
                    'Vite',
                    'Tailwind CSS v3/v4',
                    'Go (Golang)',
                    'Hono',
                    'Python · FastAPI',
                    'Node.js',
                    'PostgreSQL',
                    'Drizzle ORM',
                    'Zustand',
                    'TanStack Query',
                    'Docker',
                    'Git',
                ],
            },
            {
                level: 'shipped',
                title: 'Shipped in real projects',
                note: 'Enough to put it in production and fix it when it breaks — just not every week.',
                items: [
                    'gRPC · Protobuf',
                    'Microservice architecture',
                    'Prisma',
                    'Astro',
                    'React Router',
                    'Radix UI',
                    'XYFlow',
                    'KaTeX',
                    'TipTap',
                    'PWA',
                    'Three.js',
                    'Recharts',
                    'PDF.js',
                    'GitLab CI/CD',
                    'GitHub Actions',
                    'Vitest · Playwright',
                    'Husky · commitlint',
                    'ESLint · Prettier',
                    'MinIO',
                ],
            },
            {
                level: 'learning',
                title: 'Tried · learning',
                note: 'Small jobs or prototypes so far. If a project leans on these, I will say so upfront.',
                items: [
                    'Milkdown · Lexical',
                    'ApexCharts',
                    'DnD Kit',
                    'FullCalendar',
                    'Mermaid',
                    'Framer Motion',
                    'Sentry',
                ],
            },
        ],
        aside: [
            {
                title: 'Process',
                items: ['Jira', 'Agile / Scrum', 'Code review · merge requests', 'Spec and design before code', 'Leading a small team'],
            },
            {
                title: 'Languages',
                items: ['Vietnamese (native)', 'English (technical reading and writing)'],
            },
        ],
    },
    testimonials: {
        title: 'What people I worked with say',
        lead: 'A few words from people who used the products or reviewed the code.',
        // TODO: xem ghi chú ở bản tiếng Việt — hai bản phải bật cùng lúc.
        show: false,
        items: [
            {
                quote: 'TODO — replace with a real quote, in the speaker’s own words.',
                name: 'TODO — full name',
                role: 'TODO — job title',
                company: 'TODO — company',
            },
            {
                quote: 'TODO — replace with a real quote, in the speaker’s own words.',
                name: 'TODO — full name',
                role: 'TODO — job title',
                company: 'TODO — company',
            },
        ],
    },
    education: {
        title: 'Education',
        school: 'Industrial University of Ho Chi Minh City (IUH)',
        degree: 'B.Eng. Software Engineering — fourth year',
        period: '2023 — Present',
        details: [
            'Relevant coursework: Data Structures & Algorithms, Web Programming, Database Systems, Operating Systems, Computer Networks, Software Engineering.',
        ],
    },
    contact: {
        n: '05',
        title: 'Contact',
        lead: 'Open to part-time and freelance work.',
        body: 'I work full-time at HDC Flowtech, so I only take on part-time or freelance work — usually small-scale projects, frontend or backend alike. Send me the scope and the timeline; I reply the same day.',
        emailLabel: 'Send an email',
        githubLabel: 'GitHub',
        linkedinLabel: 'LinkedIn',
        cvLabel: 'Download CV (PDF)',
        liveLabel: 'See it running',
        form: {
            title: 'Or write to me right here',
            name: {
                label: 'Name',
                placeholder: 'Jane Doe',
                error: 'Please tell me your name.',
            },
            email: {
                label: 'Email',
                placeholder: 'you@company.com',
                error: 'I need an email to reply to.',
                invalid: 'That email does not look right — mind checking it?',
            },
            message: {
                label: 'Message',
                placeholder: 'Scope, timeline, budget if you have one…',
                error: 'A couple of lines about the work, please.',
            },
            submit: 'Send',
            sending: 'Sending…',
            ok: 'Sent — thank you! I reply the same day.',
            fail: 'That did not go through. Please email me directly instead.',
            unconfigured: 'This form is not wired to a mail service yet — please email me directly.',
        },
    },
    footer: {
        built: 'Built with Astro and Three.js · static, no tracking',
        rights: 'Nguyen Viet Hoang',
    },
};

export const content: Record<Lang, Content> = { vi, en };
