import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { getPageContent } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  title: "من نحن | مؤسسة المجدوعي الخيرية",
  description: "مؤسسة أهلية تسعى لتعظيم أثر المنح لتنمية المحتاج بإحسان",
};

export const dynamic = "force-dynamic";

type InfoItem = { label: string; value: string; icon?: string };
type Advantage = { title: string; description: string; icon: string };

const FALLBACK = {
  hero_image: "/images/who-we-are/Hero.png",
  title: "من نحن",
  subtitle: "مؤسسة أهلية تسعى لتعظيم أثر المنح وتنمية المحتاج بإحسان",
  paragraphs: [
    "أسست مؤسسة المجدوعي الخيرية انطلاقاً من إيمان المؤسسين بأهمية العطاء المجتمعي وتنمية المحتاج بإحسان. وهي مؤسسة أهلية مصرّح بها من المركز الوطني لتنمية القطاع غير الربحي، تقدم المنح المالي للأفراد والمنظمات غير الهادفة للربح.",
    "تسعى المؤسسة لتعظيم أثر المنح ابتغاءً للأجر عبر تنمية المحتاج بإحسان، وتعمل على رفع القدرات الاقتصادية للمحتاجين، وتقديم الدعم المباشر والميسّر للأفراد، وتطوير منظومة العمل بمساجد المجدوعي، وبناء شراكات فاعلة مع مختلف القطاعات.",
  ],
  info: [
    { label: "الاسم الرسمي للمؤسسة", value: "مؤسسة علي بن إبراهيم المجدوعي وعائلته الخيرية", icon: "" },
    { label: "الترخيص", value: "رقم الترخيص الرسمي: 143", icon: "/images/who-we-are/document.svg" },
    { label: "الجهة المشرفة", value: "تحت إشراف: المركز الوطني لتنمية القطاع غير الربحي", icon: "" },
    { label: "النطاق الجغرافي", value: "المنطقة الشرقية / منطقة الباحة", icon: "/images/who-we-are/location.svg" },
  ] as InfoItem[],
  advantages_heading: "ميزاتنا التنافسية",
  advantages: [
    { title: "الخبرة المعرفية", description: "تتميز المؤسسة بخبرتها المعرفية العميقة والممتدة في مجال دعم وتنمية المحتاج وتوجيه المنح بفاعلية.", icon: "/images/who-we-are/book.svg" },
    { title: "شخصية المؤسس", description: "ارتباط المؤسسة الوثيق بشخصية مؤسسها وعطائه المستمر وتواضعه وقربه من الفئات المستهدفة.", icon: "/images/who-we-are/heart.svg" },
  ] as Advantage[],
  quote: "تعظيم أثر المنح ابتغاءً للأجر عبر تنمية المحتاج بإحسان",
};

function InfoRow({ label, value, icon }: InfoItem) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-start gap-1.5">
        {icon ? <Image src={icon} alt="" width={24} height={24} className="h-6 w-6 shrink-0" aria-hidden /> : null}
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      <div className="text-right text-[16px] font-bold leading-6 text-[#005761]">{value}</div>
    </div>
  );
}

function AdvantageCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex min-h-0 w-full flex-col rounded-[20px] border-[1.18px] border-bg-alt bg-white p-6 sm:p-8 lg:h-[239px]">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-alt">
        {icon && <Image src={icon} alt="" width={28} height={28} aria-hidden />}
      </div>
      <h3 className="mb-3 text-[20px] font-bold leading-[30px] text-[#005761]">{title}</h3>
      <p className="text-base leading-relaxed text-text-light">{description}</p>
    </div>
  );
}

export default async function WhoWeArePage() {
  const raw = await getPageContent("who-we-are");
  const s = (k: keyof typeof FALLBACK) => (typeof raw[k] === "string" && raw[k] ? (raw[k] as string) : (FALLBACK[k] as string));
  const paragraphs = Array.isArray(raw.paragraphs) && raw.paragraphs.length ? (raw.paragraphs as string[]) : FALLBACK.paragraphs;
  const info = Array.isArray(raw.info) && raw.info.length ? (raw.info as InfoItem[]) : FALLBACK.info;
  const advantages = Array.isArray(raw.advantages) && raw.advantages.length ? (raw.advantages as Advantage[]) : FALLBACK.advantages;

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
      <FadeInUp><section className="bg-white py-10 sm:py-[51px]">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:min-h-[332px] lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            <div className="w-full space-y-6 text-right sm:space-y-8 lg:w-[653px]">
              {paragraphs.map((p, i) => (
                <div key={i} className="text-[18px] font-normal leading-[32.4px] text-text-medium">{p}</div>
              ))}
            </div>
            <div className="w-full shrink-0 lg:w-[419px]">
              <div className="flex flex-col gap-6 rounded-2xl bg-bg-alt px-5 py-7 sm:px-7 sm:py-8 lg:h-[332px] lg:justify-center lg:gap-6">
                {info.map((row, i) => (
                  <InfoRow key={i} label={row.label} value={row.value} icon={row.icon} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section></FadeInUp>

      {/* ── Competitive Advantages ── */}
      <FadeInUp><section className="bg-bg-light py-16 md:py-24" aria-labelledby="advantages-heading">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <h2 id="advantages-heading" className="mb-10 text-right text-[36px] font-medium leading-[40px] text-[#005761] lg:mb-[102px]">
            {s("advantages_heading")}
          </h2>
          <div className="grid w-full max-w-[1120px] grid-cols-1 gap-6 md:grid-cols-2">
            {advantages.map((a, i) => (
              <AdvantageCard key={i} icon={a.icon} title={a.title} description={a.description} />
            ))}
          </div>
        </div>
      </section></FadeInUp>

      {/* ── Quote Banner ── */}
      <FadeInUp><section className="relative min-h-[200px] overflow-hidden bg-white py-14 sm:min-h-[260px] sm:py-16 lg:h-[328px] lg:overflow-visible lg:py-0">
        <span aria-hidden className="pointer-events-none absolute top-5 right-2 select-none text-right font-black leading-none text-[#00B5C226] text-[clamp(80px,22vw,140px)] lg:top-[-30px] lg:right-[170px] lg:w-[152px] lg:text-[220px] lg:leading-[320px]">
          {'"'}
        </span>
        <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
          <blockquote className="relative top-[-5px] m-0 max-w-[783px] text-center text-[clamp(22px,5vw,40px)] font-medium leading-[1.25] tracking-normal text-[#005761] lg:text-[40px] lg:leading-[40px]">
            {s("quote")}
          </blockquote>
        </div>
      </section></FadeInUp>
    </main>
  );
}
