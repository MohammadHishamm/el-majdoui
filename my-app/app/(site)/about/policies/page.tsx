import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { T } from "@/components/ui/T";
import { PoliciesList } from "@/components/about/PoliciesList";
import { getPolicies, getPageContent } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  alternates: { canonical: "/about/policies" },
  title: "السياسات واللوائح",
  description:
    "وثائق الحوكمة المنشورة في مؤسسة المجدوعي الخيرية، من لوائح تنظيمية وسياسات وأدلة.",
};

export const dynamic = "force-dynamic";

export default async function PoliciesPage() {
  const [policies, content] = await Promise.all([
    getPolicies(),
    getPageContent("policies"),
  ]);
  const intro = (content.intro as string) ?? "";
  return (
    <main dir="rtl" className="bg-surface">
      {/* ── Header ── (negative margin keeps the sticky navbar solid on load) */}
      <section className="-mt-28 bg-surface pt-40 md:pt-44" data-nav-surface="light">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-body-3">
              <T ar="عن المؤسسة" en="About the foundation" />
            </p>
            <h1 className="mt-4 text-right text-[36px] font-medium leading-[40px] text-heading">
              <T ar="السياسات واللوائح" en="Policies & Regulations" />
            </h1>
            {intro && (
              <p className="mt-6 max-w-4xl text-right text-[17px] leading-[32px] text-body-2">
                {intro}
              </p>
            )}
            <div className="mt-8 h-px w-full bg-panel-border" />
          </FadeInUp>
        </div>
      </section>

      {/* ── Filters + downloadable list ── */}
      <FadeInUp>
        <section className="bg-surface pb-20 pt-8 md:pb-28" aria-label="قائمة السياسات واللوائح">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <PoliciesList items={policies} />
          </div>
        </section>
      </FadeInUp>
    </main>
  );
}
