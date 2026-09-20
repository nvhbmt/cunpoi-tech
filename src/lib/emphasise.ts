/**
 * Cho phép in đậm trong `src/data/profile.ts` bằng cú pháp `**...**`.
 *
 * Escape toàn bộ trước, rồi mới dựng thẻ, nên thứ duy nhất lọt được vào HTML
 * là `<strong>` — dữ liệu không thể chèn thẻ nào khác.
 *
 * Hàm này để ở file riêng thay vì trong frontmatter của `.astro`: chuỗi chứa
 * `<strong>` đặt trong frontmatter làm bộ phân tích của Astro tưởng đã hết
 * frontmatter, và khối `<style>` phía dưới bị đọc nhầm thành TypeScript.
 */
export function emphasise(text: string): string {
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}
