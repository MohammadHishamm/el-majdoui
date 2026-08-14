import type { Metadata } from "next";
import { T } from "@/components/ui/T";
import { getOrgLevels } from "@/lib/cms/fetchers";
import { OrgStructure } from "@/components/about/OrgStructure";

export const metadata: Metadata = {
  title: "الهيكل التنظيمي والمستويات الإدارية",
  description:
    "مستويات الحوكمة والتنفيذ في مؤسسة المجدوعي الخيرية، من مجلس الأمناء إلى الإدارات التشغيلية.",
};

export default async function OrgStructurePage() {
  const levels = await getOrgLevels();

  return (
    <div className="bg-surface" data-nav-surface="light">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:py-16">
        <p className="text-[13px] text-body-3">
          <T ar="عن المؤسسة" en="About us" />
        </p>
        <h1 className="mt-3 text-3xl font-bold text-heading md:text-[40px] md:leading-[1.15]">
          <T ar="الهيكل التنظيمي والمستويات الإدارية" en="Organizational structure & administrative levels" />
        </h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-body-3 md:text-base">
          <T
            ar="يتكون الهيكل الإداري لمؤسسة المجدوعي الخيرية من مستويات حوكمة وتنفيذ متكاملة، تبدأ من مجلس الأمناء ليرسم التوجهات الاستراتيجية، وصولاً إلى الأمانة العامة والإدارة التنفيذية لتسيير المشاريع والعمليات اليومية."
            en="Almajdouie Foundation's administrative structure spans complementary levels of governance and delivery — from the Board of Trustees setting strategic direction, through to the General Secretariat and executive management running projects and day-to-day operations."
          />
        </p>

        <hr className="mt-8 border-panel-border" />

        <div className="mt-8">
          <OrgStructure levels={levels} />
        </div>
      </div>
    </div>
  );
}
