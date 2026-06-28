import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "عن المؤسسة",
  description: "تعرف على مؤسسة المجدوعي الخيرية ورؤيتها ورسالتها وقياداتها",
};

const ABOUT_LINKS = [
  { label: "من نحن", href: "/about/who-we-are" },
  { label: "الرؤية والرسالة والقيم", href: "/about/vision-mission" },
  { label: "الاستراتيجية", href: "/about/strategy" },
  { label: "مجلس الأمناء", href: "/about/board" },
  { label: "القيادات التنفيذية", href: "/about/leadership" },
  { label: "السياسات واللوائح", href: "/about/policies" },
];

export default function AboutHubPage() {
  return (
    <main dir="rtl" className="bg-white">
      <section
        className="-mt-28 bg-footer-bg pt-40 md:pt-44"
        data-nav-surface="solid"
      >
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <h1 className="text-right text-[36px] font-medium leading-[1.15] text-white md:text-[44px]">
            عن المؤسسة
          </h1>
        </div>
      </section>

      <Container as="section" className="py-12">
        <ul className="grid gap-4 sm:grid-cols-2">
          {ABOUT_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-xl border border-bg-alt bg-white p-5 font-medium text-text-dark hover:border-primary hover:text-primary"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
