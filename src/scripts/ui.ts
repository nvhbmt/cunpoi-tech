/**
 * Các hiệu ứng giao diện không phụ thuộc Three.js: hiện dần khi cuộn tới,
 * thanh điều hướng đổi trạng thái, và mục đang xem được tô sáng.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Các phần tử `data-reveal` chỉ hiện khi cuộn tới, mỗi phần tử một lần. */
export function initReveal(): void {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (targets.length === 0) return;

    if (reduced || !('IntersectionObserver' in window)) return;

    // Bật cờ trước khi quan sát: CSS chỉ ẩn nội dung khi chắc chắn có người bật lại.
    document.documentElement.classList.add('js-reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('is-in');
                observer.unobserve(entry.target);
            }
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    targets.forEach((el) => observer.observe(el));
}

/** Thanh điều hướng: đặc lại khi rời khỏi hero, và tô sáng mục đang xem. */
export function initNav(): void {
    const nav = document.querySelector<HTMLElement>('[data-nav]');
    if (!nav) return;

    const onScroll = () => {
        nav.classList.toggle('is-stuck', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[data-section]'));
    const sections = links
        .map((link) => document.getElementById(link.dataset.section ?? ''))
        .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0 || !('IntersectionObserver' in window)) return;

    const setActive = (id: string) => {
        links.forEach((link) => {
            link.classList.toggle('is-active', link.dataset.section === id);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            const hit = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (hit) setActive(hit.target.id);
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.2, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
}

/** Thẻ dự án nghiêng nhẹ theo con trỏ, và biết con trỏ đang ở đâu để vẽ quầng sáng. */
export function initCardTilt(): void {
    if (reduced || window.matchMedia('(hover: none)').matches) return;

    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
    for (const card of cards) {
        card.addEventListener(
            'pointermove',
            (event) => {
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                card.style.setProperty('--mx', `${x * 100}%`);
                card.style.setProperty('--my', `${y * 100}%`);
                card.style.setProperty('--tilt-x', `${(0.5 - y) * 3}deg`);
                card.style.setProperty('--tilt-y', `${(x - 0.5) * 3}deg`);
            },
            { passive: true },
        );

        card.addEventListener('pointerleave', () => {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
        });
    }
}

export function initUi(): void {
    initReveal();
    initNav();
    initCardTilt();
}
