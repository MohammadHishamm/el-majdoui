import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPageContent } from "@/lib/cms/fetchers";
import { PrivacyToc } from "@/components/privacy/PrivacyToc";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | مؤسسة المجدوعي الخيرية",
  description:
    "سياسة الخصوصية وحماية البيانات في مؤسسة المجدوعي الخيرية — كيف نجمع بياناتك ونستخدمها ونحميها.",
  alternates: { canonical: "/privacy-policy" },
};

export const dynamic = "force-dynamic";

type PolicySection = { title: string; body: string; bullets?: string[] };

const FALLBACK = {
  updated: "آخر تحديث: يوليو 2026",
  title: "سياسة الخصوصية",
  intro:
    "نحن في مؤسسة المجدوعي الخيرية نلتزم بحماية خصوصية بياناتك والتعامل معها بشفافية تامة وفق أعلى المعايير الأمنية واللوائح التنظيمية.",
  sections: [
    {
      title: "البيانات التي نجمعها",
      body: "نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند استخدام الموقع، مثل:",
      bullets: [
        "البيانات الشخصية (الاسم، البريد الإلكتروني، رقم الجوال) عند التقديم على الوظائف أو طلب الدعم.",
        "بيانات تصفح الموقع (عنوان الـ IP، نوع المتصفح، وسلوك التصفح).",
      ],
    },
    {
      title: "كيف نستخدم بياناتك",
      body: "نستخدم البيانات التي نجمعها لعدة أغراض تشمل: تحسين أداء الموقع وخدماتنا الرقمية، معالجة طلبات التوظيف، والتواصل معك للرد على الاستفسارات.",
      bullets: [],
    },
    {
      title: "حماية وأمن المعلومات",
      body: "نطبق إجراءات أمنية تقنية وإدارية صارمة لحماية بياناتك من الوصول غير المصرح به، أو التعديل، أو الإفشاء. تشمل هذه الإجراءات: التشفير، التحقق الثنائي، وسياسات الوصول المقيّد.",
      bullets: [],
    },
    {
      title: "ملفات تعريف الارتباط (Cookies)",
      body: "نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل سلوك الزوار. يمكنك التحكم في إعدادات ملفات الارتباط من خلال متصفحك في أي وقت.",
      bullets: [],
    },
    {
      title: "حقوق المستخدم والاتصال بنا",
      body: "يحق لك في أي وقت طلب الاطلاع على بياناتك الشخصية أو تعديلها أو حذفها. للتواصل مع مسؤول حماية البيانات، يرجى مراسلتنا عبر البريد الإلكتروني أو نموذج الاتصال.",
      bullets: [],
    },
  ] as PolicySection[],
  callout_title: "لديك استفسار حول الخصوصية؟",
  callout_desc: "إذا كان لديك أي أسئلة حول سياسة الخصوصية الخاصة بنا، يمكنك مراسلتنا في أي وقت.",
  callout_button: "تواصل معنا",
  org_name: "مؤسسة المجدوعي الخيرية",
  org_desc: "مؤسسة مانحة تسعى لتمكين المجتمع من خلال مبادرات نوعية ومستدامة.",
};

export default async function PrivacyPolicyPage() {
  const raw = await getPageContent("privacy-policy");
  const s = (k: keyof typeof FALLBACK) =>
    typeof raw[k] === "string" && raw[k] ? (raw[k] as string) : (FALLBACK[k] as string);
  const sections =
    Array.isArray(raw.sections) && raw.sections.length
      ? (raw.sections as PolicySection[])
      : FALLBACK.sections;

  const tocItems = sections.map((sec, i) => ({ id: `policy-section-${i + 1}`, label: sec.title }));

  return (
    <main dir="rtl" className="-mt-28 bg-surface pt-40 md:pt-44" data-nav-surface="light">
      <div className="mx-auto w-full max-w-[1280px] px-4 pb-16 sm:px-6 md:pb-24 lg:px-20">
        {/* ── Page head ── */}
        <p className="text-sm text-body-3">{s("updated")}</p>
        <h1 className="mt-4 text-[32px] font-medium leading-tight text-heading md:text-[48px]">
          {s("title")}
        </h1>
        <div className="mt-8 h-px w-full bg-panel-border" />
        <p className="mt-8 text-lg leading-relaxed text-body-1 md:text-2xl md:leading-10">
          {s("intro")}
        </p>

        {/* ── Body: sidebar (right in RTL) + content ── */}
        <div className="mt-10 flex flex-col gap-10 md:mt-14 lg:flex-row">
          {/* ── Sidebar ── */}
          <aside className="w-full shrink-0 lg:w-[280px]">
            <div className="flex flex-col gap-6 lg:sticky lg:top-36">
              <PrivacyToc items={tocItems} />
              <div className="hidden flex-col gap-2 px-5 text-right lg:flex">
                <p className="text-lg text-body-1">{s("org_name")}</p>
                <p className="text-xs leading-normal text-body-3">{s("org_desc")}</p>
              </div>
            </div>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-10">
            {sections.map((sec, i) => (
              <section
                key={i}
                id={`policy-section-${i + 1}`}
                className="scroll-mt-36 flex flex-col gap-4"
              >
                <h2 className="text-xl font-bold text-heading">
                  {i + 1}. {sec.title}
                </h2>
                {sec.body && <p className="text-base leading-relaxed text-body-2">{sec.body}</p>}
                {Array.isArray(sec.bullets) && sec.bullets.length > 0 && (
                  <ul className="flex list-disc flex-col gap-2 ps-5 marker:text-heading">
                    {sec.bullets.map((b, j) => (
                      <li key={j} className="text-base leading-relaxed text-body-2">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* ── Support callout ── */}
            <div className="flex flex-col gap-4 rounded-xl border border-panel-border bg-surface-alt p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1 text-right">
                <p className="text-base font-bold text-heading">{s("callout_title")}</p>
                <p className="text-sm text-body-2">{s("callout_desc")}</p>
              </div>
              <Link
                href="/#contact"
                className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-btn-2-stroke px-4 py-2.5 text-sm font-bold text-btn-2-text transition-colors hover:bg-icon-box"
              >
                {s("callout_button")}
                <ArrowLeft className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
