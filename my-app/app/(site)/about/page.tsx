import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { T } from "@/components/ui/T";

export const metadata: Metadata = {
  title: "عن المؤسسة",
  description: "تعرف على مؤسسة المجدوعي الخيرية ورؤيتها ورسالتها وقياداتها",
};

const ABOUT_LINKS = [
  { label: "من نحن", labelEn: "Who We Are", href: "/about/who-we-are" },
  { label: "الرؤية والرسالة والقيم", labelEn: "Vision, Mission & Values", href: "/about/vision-mission" },
  { label: "الاستراتيجية", labelEn: "Strategy", href: "/about/strategy" },
  { label: "مجلس الأمناء", labelEn: "Board of Trustees", href: "/about/board" },
  { label: "القيادات التنفيذية", labelEn: "Executive Leadership", href: "/about/leadership" },
  { label: "السياسات واللوائح", labelEn: "Policies & Regulations", href: "/about/policies" },
];

export default function AboutHubPage() {
  return (
    <main dir="rtl" className="bg-surface">
      <section
        className="-mt-28 bg-footer-bg pt-40 md:pt-44"
        data-nav-surface="solid"
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-right text-[36px] font-medium leading-[1.15] text-white md:text-[44px]">
            <T ar="عن المؤسسة" en="About the Foundation" />
          </h1>
        </div>
      </section>

      <Container as="section" className="py-12">
        <ul className="grid gap-4 sm:grid-cols-2">
          {ABOUT_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl border border-panel-border bg-panel p-5 font-medium text-body-1 dark:text-heading hover:border-heading hover:text-heading"
              >
                <T ar={link.label} en={link.labelEn} />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
