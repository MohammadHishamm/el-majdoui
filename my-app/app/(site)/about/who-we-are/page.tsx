import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { getPageContent } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  alternates: { canonical: "/about/who-we-are" },
  title: "من نحن",
  description:
    "نشأة مؤسسة المجدوعي الخيرية ونطاق عملها ونموذجها كمؤسسة مانحة تعمل بالشراكة مع جهات تنفيذية مؤهلة.",
};

export const dynamic = "force-dynamic";

type InfoItem = { label: string; value: string; icon?: string };
type Advantage = { title: string; description: string; icon: string };
type Section = { heading: string; body: string };
type TargetGroup = { title: string; description: string };

const FALLBACK = {
  hero_image: "/images/who-we-are/Hero.png",
  title: "من نحن",
  subtitle: "مؤسسة مانحة، لا منفِّذة",
  // The guide (§4.2) gives four headed blocks. The first carries no heading —
  // the hero subtitle above it is its heading.
  sections: [
    { heading: "", body: "مؤسسة علي بن إبراهيم المجدوعي وعائلته الخيرية مؤسسة مانحة تعمل على تحسين جودة الحياة الاقتصادية للمحتاج، والعناية بمساجد المجدوعي لتكون معمّرة ونموذجية ومنارة للعلم، بالشراكة مع جهات تنفيذية مؤهلة، وبحلول مبتكرة تسهّل تقديم المنح وتزيد أثرها." },
    { heading: "النشأة", body: "بدأ عطاء الشيخ علي بن إبراهيم بن صالح المجدوعي فرديًا قبل عقود، حرصًا على نمائه واستدامته، ثم تأسست المؤسسة عام 1435هـ بترخيص من وزارة الموارد البشرية والتنمية الاجتماعية برقم (143)، لتكون مؤسسة مانحة تدعم البرامج والمشاريع الخيرية النوعية الأكثر أثرًا والأعمّ نفعًا، مع العناية بعمارة بيوت الله وخدمة قاصديها." },
    { heading: "كيف نعمل", body: "المؤسسة جهة مانحة تعمل منصةً تنسيقية: تستقطب الموارد والخبرات وتوجّهها نحو المشاريع ذات الأثر الأعمق، وتصمّم الأطر التنفيذية، وتربط بين الشركاء والممولين والمستفيدين في مسار واحد. ولا يقتصر دورها على تقديم المنح، بل تؤهّل شركاء التنفيذ وترفع جاهزيتهم، وتقيس الأثر بمؤشرات محدّدة تُحدَّث دوريًا." },
    { heading: "الذراع التنظيمي لأوقاف أسرة المجدوعي", body: "تضطلع المؤسسة بدور تنظيمي لأوقاف أسرة المجدوعي: تستقبل الأوقاف، وتصنّفها وفق مصارفها الشرعية المعتمدة، وتتولى التنسيق والمتابعة والحوكمة لضمان أن كل وقف يصل إلى مصرفه الصحيح، وأن كل مشروع يُنفّذ بالجودة والشفافية المطلوبة. وتتوزع هذه المصارف على مسارات تشمل خدمة المحتاجين، ومشاريع الواقفين الخاصة ودعم الكيانات الشرعية، والحج والعمرة، والأضاحي والمشاريع الموسمية." },
  ] as Section[],
  target_groups_heading: "الفئات المستهدفة",
  target_groups: [
    { title: "المحتاج", description: "الفرد أو الأسرة الذين لا يجدون كفايتهم لحاجاتهم الأساسية — من سكن وغذاء ودواء — ولا يمتلكون حياة كريمة." },
    { title: "مساجد المجدوعي", description: "الجوامع والمساجد والمصليات والمدارس القرآنية التي بناها المؤسسون وأفراد أسرتهم." },
    { title: "شركاء التنفيذ", description: "الجمعيات الخيرية التي تسعى لتمكين المحتاج اقتصاديًا." },
  ] as TargetGroup[],
  info: [
    { label: "الاسم الرسمي للمؤسسة", value: "مؤسسة علي بن إبراهيم المجدوعي وعائلته الخيرية", icon: "" },
    { label: "سنة التأسيس", value: "1435هـ", icon: "" },
    { label: "الترخيص", value: "وزارة الموارد البشرية والتنمية الاجتماعية — رقم (143)", icon: "/images/who-we-are/document.svg" },
    { label: "النطاق الجغرافي", value: "المنطقة الشرقية · منطقة الباحة", icon: "/images/who-we-are/location.svg" },
  ] as InfoItem[],
  // «ميزاتنا التنافسية» and the closing quote were never in the guide, so both
  // sections are empty and render nothing until Communications supplies copy.
  advantages_heading: "",
  advantages: [] as Advantage[],
  quote: "",
};

function InfoRow({ label, value, icon }: InfoItem) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-start gap-1.5">
        {icon ? <Image src={icon} alt="" width={24} height={24} className="h-6 w-6 shrink-0" aria-hidden /> : null}
        <span className="text-sm text-body-3">{label}</span>
      </div>
      <div className="text-right text-[16px] font-bold leading-6 text-heading">{value}</div>
    </div>
  );
}

function AdvantageCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex min-h-0 w-full flex-col rounded-[20px] border-[1.18px] border-panel-border bg-panel p-6 sm:p-8 lg:h-[239px]">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-icon-box">
        {icon && <Image src={icon} alt="" width={28} height={28} aria-hidden />}
      </div>
      <h3 className="mb-3 text-[20px] font-bold leading-[30px] text-heading">{title}</h3>
      <p className="text-base leading-relaxed text-body-4">{description}</p>
    </div>
  );
}

export default async function WhoWeArePage() {
  const raw = await getPageContent("who-we-are");
  const s = (k: keyof typeof FALLBACK) => (typeof raw[k] === "string" && raw[k] ? (raw[k] as string) : (FALLBACK[k] as string));
  const sections = Array.isArray(raw.sections) && raw.sections.length ? (raw.sections as Section[]) : FALLBACK.sections;
  const targetGroups = Array.isArray(raw.target_groups) && raw.target_groups.length ? (raw.target_groups as TargetGroup[]) : FALLBACK.target_groups;
  const info = Array.isArray(raw.info) && raw.info.length ? (raw.info as InfoItem[]) : FALLBACK.info;
  const advantages = Array.isArray(raw.advantages) ? (raw.advantages as Advantage[]) : FALLBACK.advantages;

  return (
    <main dir="rtl">
      {/* ── Hero ── */}
      <section className="relative -mt-28 h-[420px] w-full overflow-hidden" data-nav-surface="dark">
        <Image src={s("hero_image")} alt="" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 pt-[143px] text-right sm:px-6 lg:px-8">
          <nav aria-label="مسار التنقل" className="mb-4 flex w-full items-center justify-start gap-2 text-[14px] font-normal leading-none text-light-blue">
            <Link href="/" className="transition-colors hover:text-white">الرئيسية</Link>
            <span aria-hidden>←</span>
            <Link href="/about" className="transition-colors hover:text-white">عن المؤسسة</Link>
          </nav>
          <h1 className="text-[64px] font-medium leading-[40px] text-white">{s("title")}</h1>
          <p className="mt-[26px] max-w-lg text-[20px] font-normal leading-none text-white/90">{s("subtitle")}</p>
        </div>
      </section>

      {/* ── Content: text + info card ── */}
      <FadeInUp><section className="bg-surface py-10 sm:py-[51px]">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:min-h-[332px] lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            <div className="w-full space-y-6 text-right sm:space-y-8 lg:w-[653px]">
              {sections.map((sec, i) => (
                <div key={i}>
                  {sec.heading && (
                    <h2 className="mb-3 text-[22px] font-bold leading-[34px] text-heading">{sec.heading}</h2>
                  )}
                  <p className="text-[18px] font-normal leading-[32.4px] text-body-2">{sec.body}</p>
                </div>
              ))}
            </div>
            <div className="w-full shrink-0 lg:w-[419px]">
              <div className="flex flex-col gap-6 rounded-2xl bg-icon-box px-5 py-7 sm:px-7 sm:py-8 lg:h-[332px] lg:justify-center lg:gap-6">
                {info.map((row, i) => (
                  <InfoRow key={i} label={row.label} value={row.value} icon={row.icon} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section></FadeInUp>

      {/* ── Target groups ── */}
      {targetGroups.length > 0 && (
        <FadeInUp><section className="bg-surface-alt py-14 md:py-20" aria-labelledby="target-groups-heading">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2 id="target-groups-heading" className="mb-8 text-right text-[30px] font-medium leading-[40px] text-heading md:text-[36px]">
              {s("target_groups_heading")}
            </h2>
            <dl className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {targetGroups.map((g, i) => (
                <div key={i} className="rounded-[20px] border-[1.18px] border-panel-border bg-panel p-6 text-right">
                  <dt className="text-[20px] font-bold leading-[30px] text-heading">{g.title}</dt>
                  <dd className="mt-3 text-[16px] leading-[28px] text-body-4">{g.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section></FadeInUp>
      )}

      {/* ── Competitive Advantages — hidden while unapproved ── */}
      {advantages.length > 0 && (
        <FadeInUp><section className="bg-surface py-16 md:py-24" aria-labelledby="advantages-heading">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <h2 id="advantages-heading" className="mb-10 text-right text-[36px] font-medium leading-[40px] text-heading lg:mb-[102px]">
            {s("advantages_heading")}
          </h2>
          <div className="grid w-full max-w-[1120px] grid-cols-1 gap-6 md:grid-cols-2">
            {advantages.map((a, i) => (
              <AdvantageCard key={i} icon={a.icon} title={a.title} description={a.description} />
            ))}
          </div>
        </div>
      </section></FadeInUp>
      )}

      {/* ── Quote Banner — hidden while unapproved ── */}
      {s("quote") && (
      <FadeInUp><section className="relative min-h-[200px] overflow-hidden bg-surface py-14 sm:min-h-[260px] sm:py-16 lg:h-[328px] lg:overflow-visible lg:py-0">
        <span aria-hidden className="pointer-events-none absolute top-5 right-2 select-none text-right font-black leading-none text-[#00B5C226] text-[clamp(80px,22vw,140px)] lg:top-[-30px] lg:right-[170px] lg:w-[152px] lg:text-[220px] lg:leading-[320px]">
          {'"'}
        </span>
        <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
          <blockquote className="relative top-[-5px] m-0 max-w-[783px] text-center text-[clamp(22px,5vw,40px)] font-medium leading-[1.25] tracking-normal text-heading lg:text-[40px] lg:leading-[40px]">
            {s("quote")}
          </blockquote>
        </div>
      </section></FadeInUp>
      )}
    </main>
  );
}
