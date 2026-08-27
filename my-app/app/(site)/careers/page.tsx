import type { Metadata } from "next";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { CareersExplorer } from "@/components/careers/CareersExplorer";
import { getAllJobs, getPageContent } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "التوظيف",
  description:
    "الشواغر المتاحة في مؤسسة المجدوعي الخيرية وطريقة التقديم عليها.",
};

export const dynamic = "force-dynamic";

type ReasonCard = { title: string; desc: string; image: string; color: string };

export default async function CareersPage() {
  const [jobs, c] = await Promise.all([getAllJobs(), getPageContent("careers")]);
  const introTitle = (c.intro_title as string) || "اعمل معنا";
  const introBody =
    (c.intro_body as string) ||
    "نبحث عن كفاءات تشاركنا الإيمان بأن العطاء حين يُقاس يصبح أكثر عدلًا وأقرب للاستدامة. وحين تتوفر شواغر، تُنشر في هذه الصفحة بتفاصيلها وطريقة التقديم.";
  // §8 gives the exact wording for the state where nothing is open.
  const emptyTitle = (c.empty_title as string) || "لا توجد وظائف متاحة حاليًا";
  const emptyBody =
    (c.empty_body as string) ||
    "يمكنك متابعة هذه الصفحة أو حساباتنا في وسائل التواصل للاطلاع على الشواغر الجديدة عند الإعلان عنها.";
  const reasonsHeading = (c.reasons_heading as string) || "لماذا تعمل معنا؟";
  const reasons = Array.isArray(c.reasons) ? (c.reasons as ReasonCard[]) : undefined;

  return (
    <main dir="rtl" className="bg-surface" data-nav-surface="light">
      <section className="-mt-28 bg-surface pt-40 md:pt-44">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <h1 className="text-right text-[36px] font-medium leading-[1.15] text-heading md:text-[40px]">
              {introTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-right text-[18px] leading-[32px] text-body-2">
              {introBody}
            </p>
            <div className="mt-8 h-px w-full bg-panel-border" />
          </FadeInUp>
        </div>
      </section>

      <section className="bg-surface pb-20 pt-12 md:pb-28" aria-label="الفرص الوظيفية">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <CareersExplorer
            jobs={jobs}
            reasonsHeading={reasonsHeading}
            reasons={reasons}
            emptyTitle={emptyTitle}
            emptyBody={emptyBody}
          />
        </div>
      </section>
    </main>
  );
}
