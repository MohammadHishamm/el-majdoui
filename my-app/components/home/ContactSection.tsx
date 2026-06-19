"use client";

import Image from "next/image";
import { siteConfig } from "@/lib/site/config";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

const fieldClass =
  "w-full rounded-2xl border border-text-dark/15 bg-white px-4 py-3 text-base text-text-dark outline-none transition-colors placeholder:text-text-muted/50 focus:border-accent";

const labelClass = "mb-2 block text-right text-base font-medium text-text-dark";

export function ContactSection() {
  const { locale } = useLocale();
  const t = translations[locale].contact;

  const contactRows = [
    { label: t.addressLabel, value: locale === "en" ? siteConfig.contact.addressEn : siteConfig.contact.address, ltr: false },
    { label: t.phoneLabel, value: siteConfig.contact.phone, ltr: true },
    { label: t.emailLabel, value: siteConfig.contact.email, ltr: true },
    { label: t.hoursLabel, value: locale === "en" ? siteConfig.contact.workingHoursEn : siteConfig.contact.workingHours, ltr: false },
  ];

  return (
    <section
      className="bg-white py-16 md:py-24"
      data-nav-surface="light"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="grid gap-8 border border-text-dark/15 md:grid-cols-2 md:gap-0 md:overflow-hidden md:rounded-2xl">
          {/* Form — right in RTL */}
          <form
            className="flex flex-col gap-6 rounded-2xl bg-white p-8 md:rounded-none md:p-12"
            action="/contact"
            method="post"
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
            <button
              type="submit"
              className="self-start rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent"
            >
              {t.submitBtn}
            </button>
          </form>

          {/* Info card — left in RTL */}
          <div className="relative flex min-h-[420px] items-center overflow-hidden rounded-2xl bg-primary py-10 pe-10 ps-8 text-white md:rounded-none md:rounded-tr-[100px] md:py-14 md:pe-14 md:ps-10">
            {/* Decorative vector — right in RTL */}
            <div className="relative me-6 shrink-0 self-center md:me-10">
              <Image
                src="/images/figma/sections/Vector.png"
                alt=""
                width={112}
                height={280}
                className="h-[220px] w-auto object-contain md:h-[280px]"
                aria-hidden
              />
            </div>

            {/* Contact details */}
            <div className="flex-1 text-right">
              <h2
                id="contact-heading"
                className="text-[28px] font-bold leading-snug text-white md:text-[36px]"
              >
                {t.heading}
              </h2>

              <div className="mt-10 space-y-6">
                {contactRows.map((row) => (
                  <p key={row.label} className="text-base leading-8 md:text-[17px]">
                    <span className="font-medium text-accent underline decoration-accent/60 underline-offset-4">
                      {row.label}:
                    </span>{" "}
                    <span
                      className="font-normal text-white"
                      dir={row.ltr ? "ltr" : undefined}
                    >
                      {row.value}
                    </span>
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
