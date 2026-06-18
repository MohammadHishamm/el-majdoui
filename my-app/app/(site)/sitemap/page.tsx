import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { focusAreas, mainNavigation } from "@/lib/site/config";

export const metadata: Metadata = {
  title: "خريطة الموقع",
  robots: { index: true, follow: true },
};

const STATIC_PAGES = [
  ...mainNavigation.map((n) => ({ label: n.label, href: n.href })),
  ...mainNavigation.flatMap((n) => n.children ?? []),
  { label: "سياسة الخصوصية", href: "/privacy-policy" },
];

export default function HtmlSitemapPage() {
  return (
    <>
      <PageHeader title="خريطة الموقع" />
      <Container as="main" className="py-12">
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-bold">الصفحات الرئيسية</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {STATIC_PAGES.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="text-primary hover:text-accent">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="mb-4 text-lg font-bold">مجالات التركيز</h2>
          <ul className="space-y-2">
            {focusAreas.map((area) => (
              <li key={area.slug}>
                <Link
                  href={`/focus-areas/${area.slug}`}
                  className="text-primary hover:text-accent"
                >
                  {area.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
