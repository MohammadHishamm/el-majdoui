"use client";

import { useActionState, useId } from "react";
import { submitContactMessage, type ContactState } from "@/components/home/contact-actions";
import { CONTACT_FIELD, ContactSelect } from "@/components/contact/ContactSelect";
import { CONTACT_SUBJECTS } from "@/lib/site/contact-subjects";

const initialState: ContactState = { ok: false, error: null };

const fieldClass = `${CONTACT_FIELD} text-right`;

const textareaClass = `${CONTACT_FIELD} h-auto resize-none py-3 leading-6 text-right`;

const labelClass = "mb-2 block text-right text-base font-medium text-body-1 dark:text-heading";

// Verbatim from the content guide (§2.4). Do not reword.
const MESSAGES = {
  ok: "شكرًا لتواصلك. وصلت رسالتك، وسيتم الرد عليك خلال أيام العمل الرسمية.",
  failed: "تعذّر إرسال الرسالة. يمكنك المحاولة مرة أخرى أو مراسلتنا على info@almajdouie.org",
  missing: "هذا الحقل مطلوب",
  subject: "هذا الحقل مطلوب",
} as const;

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactMessage, initialState);
  const uid = useId();

  const feedback = state.ok
    ? { tone: "ok" as const, text: MESSAGES.ok }
    : state.error
      ? { tone: "error" as const, text: MESSAGES[state.error as keyof typeof MESSAGES] ?? MESSAGES.failed }
      : null;

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate={false}>
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          الاسم
        </label>
        <input id="contact-name" name="name" type="text" required className={fieldClass} />
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          البريد الإلكتروني
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          dir="ltr"
          className={fieldClass}
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelClass}>
          رقم الجوال
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          dir="ltr"
          className={fieldClass}
          placeholder="05XXXXXXXX"
        />
      </div>

      <div>
        <label htmlFor={`${uid}-subject`} className={labelClass}>
          الموضوع
        </label>
        <ContactSelect
          id={`${uid}-subject`}
          name="subject"
          required
          placeholder="اختر الموضوع"
          options={CONTACT_SUBJECTS.map((s) => ({ value: s, label: s }))}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          الرسالة
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          className={textareaClass}
        />
      </div>

      {/* Honeypot — hidden from people, tempting to bots. The guide (§9) asks for
          reCAPTCHA or a honeypot; this needs no third-party script or key.
          It must be display:none, not an off-screen offset: the document is
          dir="rtl", so pushing an element past the left edge overflows the
          *end* of the inline axis and gives the whole page a horizontal
          scrollbar, which it does not do in LTR. Fields inside a hidden
          container still submit. */}
      <div aria-hidden hidden>
        <label htmlFor="contact-company">لا تملأ هذا الحقل</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {feedback && (
        <p
          role="status"
          className={`rounded-xl border-2 px-4 py-3 text-right text-sm ${
            feedback.tone === "ok"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.text}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-footer-bg px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent disabled:opacity-60"
      >
        {pending ? "جارٍ الإرسال…" : "إرسال"}
      </button>
    </form>
  );
}
