import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/site/config";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "اتصل بنا",
  description:
    "بيانات التواصل مع مؤسسة المجدوعي الخيرية ونموذج الاستفسارات العامة والإعلامية والشراكات.",
};

/**
 * The general contact page (content guide §9): five fields, nothing more.
 *
 * The three-step complaints and suggestions intake — with its tracking numbers
 * and attachments — lives at /contact/complaints and is linked from here.
 *
 * The embedded map the guide asks for is deliberately absent: Communications
 * still owes the head-office coordinates, and the guide bars an approximate pin.
 */
export default function ContactPage() {
  return (
    <div className="bg-surface" data-nav-surface="light">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:py-16">
        <h1 className="text-3xl font-bold text-heading md:text-[40px] md:leading-[1.15]">
          اتصل بنا
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-body-3 md:text-base">
          نسعد بتواصلك معنا. للاستفسارات العامة والإعلامية والشراكات، يمكنك مراسلتنا عبر النموذج
          أدناه أو التواصل مباشرة على بيانات الاتصال المرفقة.
        </p>

        <hr className="mt-8 border-t-2 border-panel-border" />

        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <aside className="order-2 w-full min-w-0 lg:order-1 lg:w-[370px] lg:shrink-0">
            <div className="rounded-2xl border-2 border-[#d1ddd9] bg-panel p-6 dark:border-panel-border">
              <h2 className="text-lg font-bold text-heading">بيانات الاتصال</h2>
              <dl className="mt-5 flex flex-col gap-4 text-sm">
                <div>
                  <dt className="font-medium text-body-1 dark:text-heading">البريد الإلكتروني</dt>
                  <dd className="mt-1 text-body-3" dir="ltr">
                    <a className="hover:text-icon" href={`mailto:${siteConfig.contact.email}`}>
                      {siteConfig.contact.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-body-1 dark:text-heading">الهاتف</dt>
                  <dd className="mt-1 text-body-3" dir="ltr">
                    <a className="hover:text-icon" href={`tel:${siteConfig.contact.phone}`}>
                      {siteConfig.contact.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-body-1 dark:text-heading">العنوان</dt>
                  <dd className="mt-1 leading-7 text-body-3">{siteConfig.contact.address}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-4 rounded-2xl border-2 border-[#d1ddd9] bg-panel p-6 dark:border-panel-border">
              <h2 className="text-lg font-bold text-heading">قناة الشكاوى والمقترحات</h2>
              <p className="mt-2 text-sm leading-7 text-body-3">
                لتقديم شكوى أو مقترح ومتابعته برقم مرجعي.
              </p>
              <Link
                href="/contact/complaints"
                className="mt-4 inline-block text-sm font-medium text-heading hover:text-icon"
              >
                الانتقال إلى القناة
              </Link>
            </div>
          </aside>

          {/* flex-1 rather than a fixed width: 370 + 720 + gap exceeds the
              available space between the lg breakpoint and ~1180px, and two
              shrink-0 columns would overflow the page there. */}
          <main className="order-1 w-full min-w-0 lg:order-2 lg:flex-1">
            <ContactForm />
          </main>
        </div>
      </div>
    </div>
  );
}
