/**
 * Nguồn dữ liệu duy nhất cho toàn trang, song ngữ.
 * Mỗi ngôn ngữ là một trang tĩnh riêng (`/` và `/en`), không có JS đổi ngôn ngữ.
 */

export const LANGS = ['vi', 'en'] as const;
export type Lang = (typeof LANGS)[number];

export const site = {
    domain: 'cunpoi.tech',
    url: 'https://cunpoi.tech',
    author: 'Nguyễn Việt Hoàng',
    authorLatin: 'Nguyen Viet Hoang',
    email: 'hoangnguyen1157@gmail.com',
    github: 'https://github.com/nvhbmt',
    githubHandle: 'nvhbmt',
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
    /** Nhãn nhỏ góc thẻ: đang chạy thật, đang làm, đã xong… */
    badge?: string;
    /** Repo để riêng tư — hiện nhãn thay vì một liên kết chết. */
    privateRepo?: boolean;
    /** Màu của nhãn góc thẻ: đang chạy / đang làm / nội bộ. */
    tone?: 'live' | 'wip' | 'closed';
}

export interface Content {
    htmlLang: string;
    label: string;
    switchTo: { href: string; label: string; aria: string };
    meta: { title: string; description: string; keywords: string };
    nav: { about: string; work: string; projects: string; skills: string; contact: string };
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
    };
    skills: {
        n: string;
        title: string;
        lead: string;
        groups: { title: string; items: string[] }[];
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
        cvLabel: string;
        liveLabel: string;
    };
    footer: { built: string; rights: string };
}

/* ------------------------------------------------------------------ */
/* Tiếng Việt                                                          */
/* ------------------------------------------------------------------ */

const vi: Content = {
    htmlLang: 'vi',
    label: 'Tiếng Việt',
    switchTo: { href: '/en', label: 'EN', aria: 'Switch to English' },
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
        { value: '1+', label: 'năm làm fullstack trên sản phẩm chạy thật' },
        { value: '8', label: 'repo sản phẩm từng tham gia ở HDC Flowtech' },
        { value: '500+', label: 'giáo viên đang dùng iExam — sản phẩm tôi tự làm' },
        { value: '6.500+', label: 'test tự động trên các dự án cá nhân' },
    ],
    about: {
        n: '01',
        title: 'Giới thiệu',
        lead: 'Đang là sinh viên năm 4, nhưng code đã chạy thật được một năm rưỡi.',
        paragraphs: [
            'Tôi là sinh viên năm 4 ngành Kỹ thuật phần mềm tại Đại học Công nghiệp TP.HCM (IUH). Từ năm 2025 tôi làm fullstack tại HDC Flowtech trên M-Agent (MOSA) — nền tảng AI Agent và tự động hoá quy trình cho khách hàng doanh nghiệp Nhật Bản — phụ trách **cả ba module frontend và ba service backend**, đồng thời **dẫn một nhóm hai người**.',
            'Ngoài giờ làm, tôi **tự thiết kế, viết và vận hành** hệ thống của riêng mình: iExam hiện có **hơn 500 giáo viên** dùng để tổ chức thi, BCN Judge chấm bài trong sandbox Docker, và một hệ thi đua nề nếp cho trường THPT. Phần tôi thấy đáng làm nhất lại là phần người dùng không bao giờ nhìn thấy: đọc định dạng nhị phân, dựng sandbox, viết migration không đụng vào dữ liệu cũ, và test đủ nhiều để bấm deploy mà không phải hồi hộp.',
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
        lead: 'Một nơi làm việc, hai sản phẩm doanh nghiệp, tám repo.',
        company: 'HDC Flowtech',
        position: 'Fullstack Developer',
        period: '2025 — nay',
        location: 'TP. Hồ Chí Minh',
        intro:
            'Làm sản phẩm AI cho thị trường Nhật Bản: fullstack cả frontend lẫn backend, và dẫn một nhóm hai người.',
        bullets: [
            'Viết frontend cho ba module — Admin Console, User Portal và Superadmin Dashboard — bằng React 19, TypeScript, Vite và Tailwind CSS, kèm hơn 2.000 unit test.',
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
                    { value: '2.000+', label: 'unit test' },
                    { value: '3 + 3', label: 'module FE / service BE' },
                    { value: '100+', label: 'MR đã merge' },
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
                    'Hai luật ESLint tự viết chặn lỗi đã từng gây sự cố thật: component dài quá 250 dòng, và regex lookbehind khiến Safari đời cũ vỡ nguyên trang.',
                    'Deploy blue-green lên VPS tự quản qua GitHub Actions, có smoke test trước khi đổi luồng.',
                ],
                stack: ['React 19', 'Vite 8', 'TypeScript', 'Tailwind v4', 'Zustand', 'Hono', 'Drizzle', 'PostgreSQL', 'KaTeX'],
                metrics: [
                    { value: '500+', label: 'giáo viên đang sử dụng' },
                    { value: '2.389', label: 'test tự động' },
                    { value: '126k', label: 'dòng TypeScript' },
                    { value: '524', label: 'commit' },
                ],
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
                    { value: '904', label: 'test xanh bốn tầng' },
                    { value: '56k', label: 'dòng TypeScript' },
                    { value: '193', label: 'commit' },
                ],
                links: [{ label: 'GitHub', href: 'https://github.com/nvhbmt/bcn-judge', kind: 'code' }],
                badge: 'Đang phát triển',
                tone: 'wip',
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
                    { value: '3.281', label: 'test tự động' },
                    { value: '173k', label: 'dòng TypeScript' },
                    { value: '202', label: 'commit' },
                ],
                links: [],
                privateRepo: true,
                badge: 'Đang phát triển',
                tone: 'wip',
            },
        ],
    },
    skills: {
        n: '04',
        title: 'Kỹ năng',
        lead: 'Những thứ tôi dùng đủ nhiều để dám nhận việc.',
        groups: [
            {
                title: 'Frontend',
                items: ['React 19', 'Next.js 15/16', 'TypeScript', 'Vite', 'Astro', 'Tailwind CSS v3/v4', 'Zustand', 'TanStack Query', 'React Router', 'Radix UI', 'Framer Motion'],
            },
            {
                title: 'Backend',
                items: ['Go (Golang)', 'gRPC · Protobuf', 'Hono', 'Python · FastAPI', 'Node.js', 'REST API', 'Kiến trúc microservice', 'PostgreSQL · Drizzle · Prisma'],
            },
            {
                title: 'Thư viện chuyên biệt',
                items: ['XYFlow', 'Three.js', 'Recharts · ApexCharts', 'TipTap · Milkdown · Lexical', 'DnD Kit', 'FullCalendar', 'Mermaid', 'KaTeX', 'PDF.js'],
            },
            {
                title: 'DevOps & công cụ',
                items: ['Docker', 'GitLab CI/CD', 'GitHub Actions', 'Git', 'Husky · commitlint', 'ESLint · Prettier', 'Vitest · Playwright', 'Sentry', 'MinIO'],
            },
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
        cvLabel: 'Tải CV (PDF)',
        liveLabel: 'Sản phẩm đang chạy',
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
        { value: '1+', label: 'year of fullstack work in production' },
        { value: '8', label: 'product repositories at HDC Flowtech' },
        { value: '500+', label: 'teachers using iExam, a product I built alone' },
        { value: '6,500+', label: 'automated tests across personal projects' },
    ],
    about: {
        n: '01',
        title: 'About',
        lead: 'Final-year student — and eighteen months of shipping to production.',
        paragraphs: [
            'I am a fourth-year Software Engineering student at Industrial University of Ho Chi Minh City (IUH). Since 2025 I have worked fullstack at HDC Flowtech on M-Agent (MOSA) — an AI agent and workflow automation platform for Japanese enterprise clients — owning **all three frontend modules and three backend services** while **leading a team of two**.',
            'Outside work I **design, write and operate** my own systems: iExam runs real exams for **more than 500 teachers**, BCN Judge grades submissions inside Docker sandboxes, and a conduct-tracking system serves a high school. I like the hard parts users never see: binary parsers, sandboxes, safe migrations, and a test suite thick enough that pressing deploy is not a gamble.',
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
        lead: 'One company, two enterprise products, eight repositories.',
        company: 'HDC Flowtech',
        position: 'Fullstack Developer',
        period: '2025 — Present',
        location: 'Ho Chi Minh City',
        intro:
            'Building AI products for the Japanese market: fullstack across frontend and backend, plus team lead for two developers.',
        bullets: [
            'Developed frontend for three modules — Admin Console, User Portal and Superadmin Dashboard — using React 19, TypeScript, Vite and Tailwind CSS, backed by 2,000+ unit tests.',
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
                    { value: '2,000+', label: 'unit tests' },
                    { value: '3 + 3', label: 'FE modules / BE services' },
                    { value: '100+', label: 'merge requests' },
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
                    'Two custom ESLint rules that encode real incidents: a 250-line cap per component, and a ban on regex lookbehind that once broke rendering on older Safari.',
                    'Blue-green deploys to a self-managed VPS through GitHub Actions, with smoke tests before the switch.',
                ],
                stack: ['React 19', 'Vite 8', 'TypeScript', 'Tailwind v4', 'Zustand', 'Hono', 'Drizzle', 'PostgreSQL', 'KaTeX'],
                metrics: [
                    { value: '500+', label: 'teachers using it' },
                    { value: '2,389', label: 'automated tests' },
                    { value: '126k', label: 'lines of TypeScript' },
                    { value: '524', label: 'commits' },
                ],
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
                    { value: '904', label: 'green tests, four tiers' },
                    { value: '56k', label: 'lines of TypeScript' },
                    { value: '193', label: 'commits' },
                ],
                links: [{ label: 'GitHub', href: 'https://github.com/nvhbmt/bcn-judge', kind: 'code' }],
                badge: 'In development',
                tone: 'wip',
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
                    { value: '3,281', label: 'automated tests' },
                    { value: '173k', label: 'lines of TypeScript' },
                    { value: '202', label: 'commits' },
                ],
                links: [],
                privateRepo: true,
                badge: 'In development',
                tone: 'wip',
            },
        ],
    },
    skills: {
        n: '04',
        title: 'Skills',
        lead: 'The things I have used enough to take a job on.',
        groups: [
            {
                title: 'Frontend',
                items: ['React 19', 'Next.js 15/16', 'TypeScript', 'Vite', 'Astro', 'Tailwind CSS v3/v4', 'Zustand', 'TanStack Query', 'React Router', 'Radix UI', 'Framer Motion'],
            },
            {
                title: 'Backend',
                items: ['Go (Golang)', 'gRPC · Protobuf', 'Hono', 'Python · FastAPI', 'Node.js', 'REST APIs', 'Microservice architecture', 'PostgreSQL · Drizzle · Prisma'],
            },
            {
                title: 'Specialised libraries',
                items: ['XYFlow', 'Three.js', 'Recharts · ApexCharts', 'TipTap · Milkdown · Lexical', 'DnD Kit', 'FullCalendar', 'Mermaid', 'KaTeX', 'PDF.js'],
            },
            {
                title: 'DevOps & tooling',
                items: ['Docker', 'GitLab CI/CD', 'GitHub Actions', 'Git', 'Husky · commitlint', 'ESLint · Prettier', 'Vitest · Playwright', 'Sentry', 'MinIO'],
            },
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
        cvLabel: 'Download CV (PDF)',
        liveLabel: 'See it running',
    },
    footer: {
        built: 'Built with Astro and Three.js · static, no tracking',
        rights: 'Nguyen Viet Hoang',
    },
};

export const content: Record<Lang, Content> = { vi, en };
