import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "عن المؤسسة",
  description:
    "مؤسسة مانحة تأسست عام 1435هـ لتسهم في بناء منهجية مستدامة للعمل الخيري في المملكة العربية السعودية.",
};

/**
 * The six cards, their order and their one-line descriptions are set by the
 * content guide (§4.1). The previous list linked to /about/leadership — a
 * redirect — and omitted the org-structure page entirely.
 */
const ABOUT_LINKS = [
  {
    label: "من نحن",
    desc: "نشأة المؤسسة ونطاق عملها ونموذجها في العمل.",
    href: "/about/who-we-are",
  },
  {
    label: "الرؤية والرسالة والقيم",
    desc: "ما نسعى إليه، وما نقوم به، وما نلتزم به.",
    href: "/about/vision-mission",
  },
  {
    label: "الاستراتيجية",
    desc: "الخطة الاستراتيجية 2024–2027م واتجاهاتها وأهدافها.",
    href: "/about/strategy",
  },
  {
    label: "مجلس الأمناء والقيادات",
    desc: "من يحكم المؤسسة ومن يديرها.",
    href: "/about/board",
  },
  {
    label: "الهيكل التنظيمي والمستويات الإدارية",
    desc: "بنية العمل والإدارات واللجان.",
    href: "/about/org-structure",
  },
  {
    label: "السياسات واللوائح",
    desc: "وثائق الحوكمة المنشورة.",
    href: "/about/policies",
  },
];

export default function AboutHubPage() {
  return (
    <main dir="rtl" className="bg-surface">
      <section className="-mt-28 bg-footer-bg pt-40 md:pt-44" data-nav-surface="solid">
        <div className="mx-auto w-full max-w-[1280px] px-4 pb-12 sm:px-6 lg:px-8">
          <h1 className="text-right text-[36px] font-medium leading-[1.15] text-white md:text-[44px]">
            عن المؤسسة
          </h1>
          <p className="mt-5 max-w-3xl text-right text-[17px] leading-[32px] text-white/80">
            مؤسسة مانحة تأسست عام 1435هـ لتسهم في بناء منهجية مستدامة للعمل الخيري في المملكة
            العربية السعودية. نعمل على تحسين جودة الحياة الاقتصادية للمحتاج، والعناية بمساجد
            المجدوعي لتكون معمّرة ونموذجية ومنارة للعلم، بالشراكة مع جهات تنفيذية مؤهلة.
          </p>
        </div>
      </section>

      <Container as="section" className="py-12 md:py-16">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex h-full flex-col rounded-xl border border-panel-border bg-panel p-6 transition-colors hover:border-heading"
              >
                <h2 className="text-right text-[19px] font-bold leading-[30px] text-body-1 dark:text-heading">
                  {link.label}
                </h2>
                <p className="mt-2 text-right text-[15px] leading-[27px] text-body-3">
                  {link.desc}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
