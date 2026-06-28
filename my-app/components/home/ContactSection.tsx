"use client";

import { useEffect, useActionState } from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/site/config";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";
import { submitContactMessage, type ContactState } from "@/components/home/contact-actions";

const initialContactState: ContactState = { ok: false, error: null };

const fieldClass =
  "w-full rounded-2xl border border-text-dark/15 bg-white px-4 py-3 text-base text-text-dark outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent";

const labelClass = "mb-2 block text-right text-base font-medium text-text-dark";

export function ContactSection() {
  const { locale } = useLocale();
  const t = translations[locale].contact;
  const isArabic = locale === "ar";
  const textAlign = isArabic ? "text-right" : "text-left";
  const [state, formAction, pending] = useActionState(submitContactMessage, initialContactState);

  const feedback = state.ok
    ? { tone: "ok", text: isArabic ? "تم إرسال رسالتك بنجاح. سنتواصل معك قريباً." : "Your message has been sent. We'll be in touch soon." }
    : state.error === "missing"
      ? { tone: "err", text: isArabic ? "يرجى تعبئة الحقول المطلوبة." : "Please fill in the required fields." }
      : state.error
        ? { tone: "err", text: isArabic ? "تعذّر الإرسال. يرجى المحاولة مرة أخرى." : "Could not send. Please try again." }
        : null;

  useEffect(() => {
    if (window.location.hash !== "#contact") return;
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const contactRows = [
    { label: t.addressLabel, value: locale === "en" ? siteConfig.contact.addressEn : siteConfig.contact.address, ltr: false },
    { label: t.phoneLabel, value: siteConfig.contact.phone, ltr: true },
    { label: t.emailLabel, value: siteConfig.contact.email, ltr: true },
    { label: t.hoursLabel, value: locale === "en" ? siteConfig.contact.workingHoursEn : siteConfig.contact.workingHours, ltr: false },
  ];

  return (
    <section
      id="contact"
      className="scroll-mt-28 bg-white py-16 md:py-24"
      data-nav-surface="light"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="grid gap-8 border border-text-dark/15 md:grid-cols-2 md:gap-0 md:overflow-hidden md:rounded-2xl">
          {/* Form — right in RTL */}
          <form
            className="flex flex-col gap-6 rounded-2xl bg-white p-8 md:rounded-none md:p-12"
            action={formAction}
          >
            <div>
              <label htmlFor="contact-name" className={labelClass}>
                {t.fullNameLabel}
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                className={`${fieldClass} text-right`}
                placeholder={t.fullNamePlaceholder}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>
                {t.emailFieldLabel}
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                className={`${fieldClass} text-right`}
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className={labelClass}>
                {t.phoneFieldLabel}
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                className={`${fieldClass} text-right`}
                placeholder="05XXXXXXXX"
                dir="ltr"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className={labelClass}>
                {t.messageLabel}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                required
                className={`${fieldClass} resize-none text-right`}
                placeholder={t.messagePlaceholder}
              />
            </div>
            {feedback && (
              <p
                role="status"
                className={`rounded-xl px-4 py-3 text-sm ${
                  feedback.tone === "ok"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                } ${textAlign}`}
              >
                {feedback.text}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="self-start rounded-full bg-footer-bg px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent disabled:opacity-60"
            >
              {pending ? (isArabic ? "جارٍ الإرسال…" : "Sending…") : t.submitBtn}
            </button>
          </form>

          {/* Info card — left in RTL */}
          <div className="relative flex min-h-[420px] items-center overflow-hidden rounded-2xl bg-footer-bg py-10 pe-10 ps-8 text-white md:rounded-none md:rounded-tr-[100px] md:py-14 md:pe-14 md:ps-10">
            {/* Logo — right in RTL */}
            <div className="relative me-2 shrink-0 self-center md:me-4">
              <Image
                src="/images/home/contact-us-form-logo.jpg"
                alt=""
                width={112}
                height={280}
                className="h-[250px] w-auto object-contain md:h-[260px]"
                aria-hidden
              />
            </div>

            {/* Contact details */}
            <div className={`flex-1 ${textAlign}`} dir={isArabic ? "rtl" : "ltr"}>
              <h2
                id="contact-heading"
                className="text-[28px] font-bold leading-snug text-white md:text-[36px]"
              >
                {t.heading}
              </h2>

              <div className={`mt-10 ${textAlign}`}>
                {contactRows.map((row) => (
                  <p
                    key={row.label}
                    className="text-sm font-medium leading-[40px] tracking-normal text-white"
                  >
                    <span className="text-accent underline decoration-accent/60 underline-offset-4">
                      {row.label}:
                    </span>{" "}
                    <span dir={row.ltr ? "ltr" : undefined}>{row.value}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
