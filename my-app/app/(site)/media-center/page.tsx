import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "المركز الإعلامي",
  description: "أخبار وتقارير ومعرض صور وفيديو وهوية المؤسسة البصرية",
};

const TABS = [
  { label: "الأخبار", href: "/news" },
  { label: "معرض الصور", href: "/gallery" },
  { label: "مكتبة الفيديو", href: "/videos" },
  { label: "التقارير", href: "/reports" },
  { label: "الهوية البصرية", href: "/brand-identity" },
];

export default function MediaCenterPage() {
  return (
    <>
      <PageHeader
        title="المركز الإعلامي"
        description="تابع آخر أخبار المؤسسة، التقارير، الصور، والفيديوهات."
      />
      <Container as="main" className="py-12">
        <nav className="flex flex-wrap gap-2" aria-label="أقسام المركز الإعلامي">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="rounded-lg bg-bg-alt px-4 py-2 text-sm font-medium text-text-dark hover:bg-primary hover:text-white"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <p className="mt-8 text-text-muted">محتوى المركز الإعلامي — بانتظار تصميم Figma</p>
      </Container>
    </>
  );
}
