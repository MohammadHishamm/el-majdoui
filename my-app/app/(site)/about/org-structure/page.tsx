import type { Metadata } from "next";
import { T } from "@/components/ui/T";
import { getOrgLevels, getPageContent } from "@/lib/cms/fetchers";
import { OrgStructure } from "@/components/about/OrgStructure";

export const metadata: Metadata = {
  alternates: { canonical: "/about/org-structure" },
  title: "الهيكل التنظيمي",
  description:
    "المستويات الإدارية والمجالس واللجان والأقسام في مؤسسة المجدوعي الخيرية.",
};

// CMS-driven content is rendered dynamically (cookies/RLS at request time).
export const dynamic = "force-dynamic";

export default async function OrgStructurePage() {
  const [levels, content] = await Promise.all([
    getOrgLevels(),
    getPageContent("org-structure"),
  ]);
  const intro = (content.intro as string) ?? "";
  // ⚠ The approved org chart (image or SVG) is still with Communications; the
  // guide asks for it above the groups, so nothing renders until it arrives.
  const chartImage = (content.chart_image as string) ?? "";

  return (
    <div className="bg-surface" data-nav-surface="light">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:py-16">
        <p className="text-[13px] text-body-3">
          <T ar="عن المؤسسة" en="About us" />
        </p>
        <h1 className="mt-3 text-3xl font-bold text-heading md:text-[40px] md:leading-[1.15]">
          <T ar="الهيكل التنظيمي والمستويات الإدارية" en="Organizational structure & administrative levels" />
        </h1>
        {intro && (
          <p className="mt-4 max-w-4xl text-sm leading-7 text-body-3 md:text-base">{intro}</p>
        )}

        <hr className="mt-8 border-panel-border" />

        {chartImage && (
          <div className="mt-8 overflow-x-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={chartImage} alt="الهيكل التنظيمي للمؤسسة" className="mx-auto h-auto max-w-full" />
          </div>
        )}

        <div className="mt-8">
          <OrgStructure levels={levels} />
        </div>
      </div>
    </div>
  );
}
