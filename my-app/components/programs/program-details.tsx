import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { T } from "@/components/ui/T";
import { ProgramActions } from "@/components/programs/ProgramActions";
import { getCategoryLabel, type Program } from "@/lib/programs";

const ICON = {
  check: "/images/program-cards/correct-icon.svg",
  building: "/images/program-cards/building.svg",
  calendar: "/images/program-cards/calendar.svg",
  location: "/images/program-cards/location.svg",
  people: "/images/program-cards/people.svg",
  target: "/images/program-cards/target.svg",
};

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-right text-[24px] font-bold leading-[36px] text-heading">
      {children}
    </h2>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-start gap-3 text-right">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-icon-box">
        <Image src={ICON.check} alt="" width={16} height={16} aria-hidden />
      </span>
      <span className="text-[16px] leading-[24px] text-body-1">{text}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: React.ReactNode; value: string }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-[14px] leading-[21px] text-body-3">
        <Image src={icon} alt="" width={16} height={16} aria-hidden />
        {label}
      </span>
      <span className="text-[14px] font-bold leading-[21px] text-heading">{value}</span>
    </li>
  );
}

export default function ProgramDetails({
  program,
  related = [],
}: {
  program: Program;
  related?: Program[];
}) {
  return (
    <main dir="rtl" className="bg-surface" data-nav-surface="light">
      {/* ── Hero ── */}
      <section className="-mt-28 bg-surface pt-36 md:pt-40">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <Link
              href="/programs"
              className="mb-8 inline-flex items-center gap-2 text-[14px] text-body-3 transition-colors hover:text-heading"
            >
              <ArrowLeft className="size-4" />
              <T ar="العودة إلى البرامج والمبادرات" en="Back to programs & initiatives" />
            </Link>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              {/* Text — physical right in RTL */}
              <div className="flex flex-1 flex-col">
                <span className="inline-block self-start rounded-full bg-btn-primary px-4 py-1.5 text-[12px] font-bold text-white">
                  {getCategoryLabel(program.category)}
                </span>
                <h1 className="mt-5 w-full text-right text-[34px] font-black leading-[1.15] text-heading md:text-[44px]">
                  {program.title}
                </h1>
                <p className="mt-5 w-full max-w-[640px] self-start text-right text-[18px] leading-[32.4px] text-body-4">
                  {program.heroDesc}
                </p>
                <div className="mt-6 w-full self-start">
                  <ProgramActions title={program.title} />
                </div>
              </div>

              {/* Image — physical left in RTL */}
              <div className="relative aspect-[443/332] w-full shrink-0 overflow-hidden rounded-[24px] lg:w-[443px]">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 443px"
                  className="object-cover"
                />
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* ── Body: content + sidebar ── */}
      <section className="bg-surface py-14 md:py-20">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_346px] lg:gap-10 lg:px-8">
          {/* Main content (right in RTL) */}
          <div className="order-2 lg:order-1">
            <FadeInUp>
              <SectionHeading><T ar="عن المبادرة" en="About the initiative" /></SectionHeading>
              <p className="mt-4 text-right text-[17px] leading-[32.3px] text-body-2">
                {program.about}
              </p>
            </FadeInUp>

            <FadeInUp>
              <div className="mt-12">
                <SectionHeading><T ar="أهداف المبادرة" en="Initiative objectives" /></SectionHeading>
                <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
                  {program.objectives.map((o) => (
                    <CheckItem key={o} text={o} />
                  ))}
                </div>
              </div>
            </FadeInUp>

            <FadeInUp>
              <div className="mt-12">
                <SectionHeading><T ar="مراحل تنفيذ المبادرة" en="Implementation stages" /></SectionHeading>
                <ol className="mt-6 space-y-4">
                  {program.stages.map((stage, i) => (
                    <li
                      key={stage.title}
                      className="flex items-start gap-5 rounded-[16px] border-[1.18px] border-panel-border bg-panel p-5"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-btn-primary text-[16px] font-black text-white">
                        {i + 1}
                      </span>
                      <div className="flex-1 text-right">
                        <h3 className="text-[17px] font-bold leading-[25.5px] text-heading">
                          {stage.title}
                        </h3>
                        <p className="mt-1.5 text-[15px] leading-[27px] text-body-4">
                          {stage.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </FadeInUp>

            <FadeInUp>
              <div className="mt-12">
                <SectionHeading><T ar="الفئات المستهدفة" en="Target groups" /></SectionHeading>
                <div className="mt-6 flex flex-col items-start gap-4">
                  {program.targetGroups.map((t) => (
                    <CheckItem key={t} text={t} />
                  ))}
                </div>
              </div>
            </FadeInUp>

            <FadeInUp>
              <blockquote className="mt-12 rounded-[16px] border-r-[3.5px] border-[#00b5c2] bg-icon-box py-6 pr-7 pl-6 text-right">
                <p className="text-[17px] leading-[32.3px] text-body-1">{program.quote.text}</p>
                <footer className="mt-3 text-[13px] leading-[24.7px] text-body-3">
                  {program.quote.author}
                </footer>
              </blockquote>
            </FadeInUp>

            <FadeInUp>
              <div className="mt-12">
                <SectionHeading><T ar="شركاء تنفيذ المبادرة" en="Implementation partners" /></SectionHeading>
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {program.partners.map((p) => (
                    <div
                      key={p}
                      className="flex flex-col items-center gap-3 rounded-[12px] border border-panel-border bg-panel px-4 py-6"
                    >
                      <Image src={ICON.building} alt="" width={28} height={28} aria-hidden />
                      <span className="text-[14px] text-body-4">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInUp>
          </div>

          {/* Sidebar (left in RTL) */}
          <aside className="order-1 flex flex-col gap-5 lg:order-2">
            <div className="rounded-[16px] bg-icon-box p-6">
              <h3 className="text-right text-[16px] font-bold leading-[24px] text-heading">
                <T ar="معلومات أساسية" en="Key information" />
              </h3>
              <ul className="mt-4 space-y-3">
                <InfoRow icon={ICON.calendar} label={<T ar="تاريخ الإطلاق" en="Launch date" />} value={program.info.launchYear} />
                <InfoRow icon={ICON.location} label={<T ar="نطاق العمل" en="Scope" />} value={program.info.scope} />
                <InfoRow icon={ICON.people} label={<T ar="المستفيدون" en="Beneficiaries" />} value={program.info.beneficiaries} />
                <InfoRow icon={ICON.target} label={<T ar="القطاع" en="Sector" />} value={program.info.sector} />
              </ul>
            </div>

            <div className="rounded-[16px] border-[1.18px] border-panel-border bg-panel p-6">
              <h3 className="text-right text-[16px] font-bold leading-[24px] text-heading">
                <T ar="هل ترغب بدعم المبادرة؟" en="Want to support this initiative?" />
              </h3>
              <p className="mt-3 text-right text-[14px] leading-[23.8px] text-body-4">
                <T
                  ar="تواصل مع فريق الشراكات لمعرفة آلية الدعم والمساهمة في تعظيم الأثر."
                  en="Contact the partnerships team to learn how to support and help maximize impact."
                />
              </p>
              <Link
                href="/contact"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-btn-primary px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#00444c]"
              >
                <ArrowLeft className="size-4" />
                <T ar="تواصل معنا" en="Contact us" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className="bg-surface pb-20 md:pb-28" aria-labelledby="related-heading">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <h2
                id="related-heading"
                className="mb-8 text-right text-[24px] font-bold leading-[36px] text-heading"
              >
                <T ar="مبادرات ذات صلة" en="Related initiatives" />
              </h2>
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/programs/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[20px] border border-panel-border bg-panel shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_12px_24px_rgba(0,87,97,0.08)]"
                  >
                    <div className="relative h-[200px] w-full overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 355px"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-6 text-right">
                      <span className="text-[14px] text-heading">{getCategoryLabel(p.category)}</span>
                      <h3 className="mt-2 text-[18px] font-bold leading-[24px] text-heading">
                        {p.title}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-heading">
                        <T ar="اعرف أكثر" en="Learn more" />
                        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          </div>
        </section>
      )}
    </main>
  );
}
