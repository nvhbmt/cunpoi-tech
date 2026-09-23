/**
 * Biểu mẫu liên hệ: kiểm tra tại chỗ rồi POST bằng `fetch`.
 *
 * Trang là tĩnh hoàn toàn (Cloudflare Pages, không có máy chủ), nên phần nhận thư
 * phải nhờ dịch vụ ngoài. Mặc định dùng Web3Forms vì nó nhận JSON thẳng từ trình
 * duyệt, không cần backend và không cần đăng nhập để lấy thư.
 *
 * ──────────────────────────────────────────────────────────────────────────────
 * TODO — bật biểu mẫu:
 *   1. Vào https://web3forms.com, nhập email, lấy Access Key gửi về hộp thư.
 *   2. Dán vào `ACCESS_KEY` bên dưới. Khoá này lộ ra trong mã nguồn trang là
 *      chuyện bình thường: nó chỉ cho phép gửi thư về đúng địa chỉ đã đăng ký.
 *   3. Chưa dán thì biểu mẫu vẫn dựng và vẫn kiểm tra dữ liệu, chỉ là lúc bấm
 *      Gửi nó báo chưa nối dịch vụ và mời gửi email thẳng — không im lặng nuốt
 *      mất lời nhắn của người ta.
 *
 * Muốn dùng Formspree thay thế: đổi `ENDPOINT` thành https://formspree.io/f/<id>,
 * bỏ trường `access_key` khỏi phần thân và giữ nguyên phần còn lại — Formspree
 * cũng nhận JSON và cũng trả 200 khi thành công.
 * ──────────────────────────────────────────────────────────────────────────────
 */

const ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = "16e2b035-298e-4d8a-99e1-f7883f36421d";

/**
 * Chỉ chặn những thứ chắc chắn sai: có đúng một @, hai bên đều có ký tự, phần
 * sau có dấu chấm và không kết thúc bằng dấu chấm. Kiểm tra chặt hơn nữa thì bắt
 * đầu loại nhầm email thật, mà đằng nào máy chủ cũng kiểm lại.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@.]+$/;

type Status = "ok" | "fail" | "unconfigured";

interface Copy {
  sending: string;
  submit: string;
  ok: string;
  fail: string;
  unconfigured: string;
  nameError: string;
  emailError: string;
  emailInvalid: string;
  messageError: string;
}

/** Đọc các câu chữ đã kết xuất sẵn theo ngôn ngữ của trang, từ `data-*` của form. */
function readCopy(form: HTMLFormElement): Copy {
  const d = form.dataset;
  return {
    sending: d.copySending ?? "Sending…",
    submit: d.copySubmit ?? "Send",
    ok: d.copyOk ?? "Sent.",
    fail: d.copyFail ?? "Could not send.",
    unconfigured: d.copyUnconfigured ?? "Not connected yet.",
    nameError: d.copyNameError ?? "Required.",
    emailError: d.copyEmailError ?? "Required.",
    emailInvalid: d.copyEmailInvalid ?? "Invalid email.",
    messageError: d.copyMessageError ?? "Required.",
  };
}

/** Gắn/gỡ thông báo lỗi của một ô, kèm cờ `aria-invalid` cho trình đọc màn hình. */
function setFieldError(field: HTMLElement, message: string | null): void {
  const box = document.getElementById(`${field.id}-error`);
  field.setAttribute("aria-invalid", message ? "true" : "false");
  if (box) box.textContent = message ?? "";
}

export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>("[data-contact-form]");
  if (!form) return;

  const nameField = form.elements.namedItem("name") as HTMLInputElement | null;
  const emailField = form.elements.namedItem(
    "email",
  ) as HTMLInputElement | null;
  const messageField = form.elements.namedItem(
    "message",
  ) as HTMLTextAreaElement | null;
  const button = form.querySelector<HTMLButtonElement>("[data-submit]");
  const status = form.querySelector<HTMLElement>("[data-status]");
  if (!nameField || !emailField || !messageField || !button || !status) return;

  const copy = readCopy(form);

  const say = (kind: Status, text: string) => {
    status.dataset.state = kind;
    status.textContent = text;
  };

  const clearStatus = () => {
    delete status.dataset.state;
    status.textContent = "";
  };

  /** Trả về ô đầu tiên bị lỗi để đưa con trỏ về đó, hoặc `null` nếu sạch. */
  const validate = (): HTMLElement | null => {
    const problems: [HTMLElement, string | null][] = [
      [nameField, nameField.value.trim() ? null : copy.nameError],
      [
        emailField,
        !emailField.value.trim()
          ? copy.emailError
          : EMAIL.test(emailField.value.trim())
            ? null
            : copy.emailInvalid,
      ],
      [messageField, messageField.value.trim() ? null : copy.messageError],
    ];

    problems.forEach(([field, message]) => setFieldError(field, message));
    return problems.find(([, message]) => message !== null)?.[0] ?? null;
  };

  // Đang gõ lại thì xoá lỗi cũ ngay, đừng để câu mắng còn đó trong khi người ta đã sửa.
  [nameField, emailField, messageField].forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true")
        setFieldError(field, null);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearStatus();

    const firstBad = validate();
    if (firstBad) {
      firstBad.focus();
      return;
    }

    // Bẫy bot: ô này ẩn khỏi mắt người và khỏi trình đọc màn hình, chỉ script
    // tự điền bừa mới chạm vào. Có chữ trong đó thì coi như đã gửi, im lặng bỏ.
    if (
      (form.elements.namedItem("botcheck") as HTMLInputElement | null)?.value
    ) {
      say("ok", copy.ok);
      form.reset();
      return;
    }

    if (!ACCESS_KEY) {
      say("unconfigured", copy.unconfigured);
      return;
    }

    button.disabled = true;
    button.textContent = copy.sending;

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `cunpoi.tech — ${nameField.value.trim()}`,
          from_name: nameField.value.trim(),
          name: nameField.value.trim(),
          email: emailField.value.trim(),
          message: messageField.value.trim(),
        }),
      });

      if (!response.ok) throw new Error(String(response.status));

      say("ok", copy.ok);
      form.reset();
      [nameField, emailField, messageField].forEach((field) =>
        setFieldError(field, null),
      );
    } catch {
      say("fail", copy.fail);
    } finally {
      button.disabled = false;
      button.textContent = copy.submit;
    }
  });
}
