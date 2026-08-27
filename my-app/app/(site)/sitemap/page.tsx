import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { getAllPrograms, getAllNews, getFocusAreas, getAllJobs } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  alternates: { canonical: "/sitemap" },
  title: "خريطة الموقع",
  description:
    "جميع صفحات موقع مؤسسة المجدوعي الخيرية في صفحة واحدة.",
  robots: { index: true, follow: true },
};

// Initiatives, articles and vacancies come from the database, so the listing has
// to be built per request — the guide (§10.2) requires every page to appear
// here, and the previous static list covered only 22 of them.
export const dynamic = "force-dynamic";

type Entry = { label: string; href: string };
type Group = { heading: string; entries: Entry[] };

export default async function HtmlSitemapPage() {
  const [programs, news, areas, jobs] = await Promise.all([
    getAllPrograms(),
    getAllNews(),
    getFocusAreas(),
    getAllJobs(),
  ]);

  const groups: Group[] = [
    {
      heading: "الصفحات الرئيسية",
      entries: [
        { label: "الرئيسية", href: "/" },
        { label: "عن المؤسسة", href: "/about" },
        { label: "مجالات التركيز", href: "/focus-areas" },
        { label: "البرامج والمبادرات", href: "/programs" },
        { label: "المركز الإعلامي", href: "/news" },
        { label: "التوظيف", href: "/careers" },
        { label: "اتصل بنا", href: "/contact" },
      ],
    },
    {
      heading: "عن المؤسسة",
      entries: [
        { label: "من نحن", href: "/about/who-we-are" },
        { label: "الرؤية والرسالة والقيم", href: "/about/vision-mission" },
        { label: "الاستراتيجية", href: "/about/strategy" },
        { label: "مجلس الأمناء والقيادات", href: "/about/board" },
        { label: "الهيكل التنظيمي والمستويات الإدارية", href: "/about/org-structure" },
        { label: "السياسات واللوائح", href: "/about/policies" },
      ],
    },
    {
      heading: "مجالات التركيز",
      entries: areas.map((a) => ({ label: a.name.ar, href: `/focus-areas/${a.slug}` })),
    },
    {
      heading: "البرامج والمبادرات",
      entries: programs.map((p) => ({ label: p.title, href: `/programs/${p.slug}` })),
    },
    {
      heading: "المركز الإعلامي",
      entries: [
        { label: "الأخبار والإعلانات", href: "/news" },
        { label: "معرض الصور", href: "/gallery" },
        { label: "مكتبة الفيديو", href: "/videos" },
        { label: "التقارير والوثائق", href: "/reports" },
        { label: "الهوية البصرية", href: "/brand-identity" },
      ],
    },
    {
      heading: "الأخبار المنشورة",
      entries: news.map((n) => ({ label: n.title, href: `/news/${n.slug}` })),
    },
    {
      heading: "التوظيف",
      entries: [
        { label: "الوظائف", href: "/careers" },
        ...jobs.map((j) => ({ label: j.title, href: `/careers/${j.id}` })),
      ],
    },
    {
      heading: "التواصل والصفحات المساندة",
      entries: [
        { label: "اتصل بنا", href: "/contact" },
        { label: "قناة الشكاوى والمقترحات", href: "/contact/complaints" },
        { label: "سياسة الخصوصية", href: "/privacy-policy" },
        { label: "خريطة الموقع", href: "/sitemap" },
      ],
    },
  ].filter((g) => g.entries.length > 0);

  return (
    <>
      <PageHeader title="خريطة الموقع" />
      <Container as="main" className="py-12">
        {groups.map((group) => (
          <section key={group.heading} className="mb-10">
            <h2 className="mb-4 text-lg font-bold text-heading">{group.heading}</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {group.entries.map((entry) => (
                <li key={entry.href}>
                  <Link href={entry.href} className="text-primary hover:text-accent">
                    {entry.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
