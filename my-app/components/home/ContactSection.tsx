import Image from "next/image";
import { siteConfig } from "@/lib/site/config";

export function ContactSection() {
  return (
    <section
      className="bg-white py-16 md:py-24"
      data-nav-surface="light"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="grid gap-8 md:grid-cols-2 md:gap-0 md:overflow-hidden md:rounded-2xl md:ring-1 md:ring-bg-alt">
          {/* Info card */}
          <div className="relative flex flex-col justify-center rounded-2xl bg-primary p-10 text-white md:rounded-none md:rounded-tr-[64px] md:p-12">
            <h2 id="contact-heading" className="text-2xl font-bold md:text-3xl">
              يسعدنا تواصلكم معنا
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-8 text-white/80">
              نرحب باستفساراتكم واقتراحاتكم. فريقنا جاهز للرد على جميع رسائلكم في أقرب وقت.
            </p>

            <div className="mt-8 space-y-4 text-sm">
              <p className="flex items-center gap-3">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-accent" aria-hidden>
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {siteConfig.contact.phone}
              </p>
              <p className="flex items-center gap-3">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-accent" aria-hidden>
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {siteConfig.contact.email}
              </p>
              <p className="flex items-center gap-3">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 shrink-0 text-accent" aria-hidden>
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {siteConfig.contact.address}
              </p>
            </div>

            {/* Decorative pattern */}
            <div className="absolute bottom-6 end-6 opacity-20">
              <Image
                src="/images/figma/sections/First.png"
                alt=""
                width={80}
                height={80}
                className="h-20 w-20 invert"
                aria-hidden
              />
            </div>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5 rounded-2xl bg-white p-8 md:rounded-none md:p-12" action="/contact" method="post">
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-right text-sm font-medium text-text-dark">
                الاسم الكامل
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                className="w-full rounded-2xl border border-bg-alt bg-white px-4 py-3 text-right text-sm text-text-dark outline-none transition-colors focus:border-accent"
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-2 block text-right text-sm font-medium text-text-dark">
                البريد الإلكتروني
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                className="w-full rounded-2xl border border-bg-alt bg-white px-4 py-3 text-right text-sm text-text-dark outline-none transition-colors focus:border-accent"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
            <div>
              <label htmlFor="contact-phone" className="mb-2 block text-right text-sm font-medium text-text-dark">
                رقم الجوال
              </label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                className="w-full rounded-2xl border border-bg-alt bg-white px-4 py-3 text-right text-sm text-text-dark outline-none transition-colors focus:border-accent"
                placeholder="05XXXXXXXX"
                dir="ltr"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-2 block text-right text-sm font-medium text-text-dark">
                نص الرسالة
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={4}
                required
                className="w-full resize-none rounded-2xl border border-bg-alt bg-white px-4 py-3 text-right text-sm text-text-dark outline-none transition-colors focus:border-accent"
                placeholder="اكتب رسالتك هنا..."
              />
            </div>
            <button
              type="submit"
              className="self-end rounded-full bg-primary px-10 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
