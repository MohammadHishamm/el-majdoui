import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";
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
    <h2 className="text-right text-[24px] font-bold leading-[36px] text-[#005761]">
      {children}
    </h2>
  );
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-start gap-3 text-right">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#e8f1f2]">
        <Image src={ICON.check} alt="" width={16} height={16} aria-hidden />
      </span>
      <span className="text-[16px] leading-[24px] text-[#1e2939]">{text}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-[14px] leading-[21px] text-[#6a7282]">
        <Image src={icon} alt="" width={16} height={16} aria-hidden />
        {label}
      </span>
      <span className="text-[14px] font-bold leading-[21px] text-[#005761]">{value}</span>
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
    <main dir="rtl" className="bg-white" data-nav-surface="light">
      {/* ── Hero ── */}
      <section className="-mt-28 bg-white pt-36 md:pt-40">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <Link
              href="/programs"
              className="mb-8 inline-flex items-center gap-2 text-[14px] text-text-muted transition-colors hover:text-[#005761]"
            >
              <ArrowLeft className="size-4" />
              العودة إلى البرامج والمبادرات
            </Link>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              {/* Text — physical right in RTL */}
              <div className="flex flex-1 flex-col">
                <span className="inline-block self-start rounded-full bg-[#005761] px-4 py-1.5 text-[12px] font-bold text-white">
                  {getCategoryLabel(program.category)}
                </span>
                <h1 className="mt-5 w-full text-right text-[34px] font-black leading-[1.15] text-[#005761] md:text-[44px]">
                  {program.title}
                </h1>
                <p className="mt-5 w-full max-w-[640px] self-start text-right text-[18px] leading-[32.4px] text-text-light">
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
      <section className="bg-white py-14 md:py-20">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_346px] lg:gap-10 lg:px-8">
          {/* Main content (right in RTL) */}
          <div className="order-2 lg:order-1">
            <FadeInUp>
              <SectionHeading>عن المبادرة</SectionHeading>
              <p className="mt-4 text-right text-[17px] leading-[32.3px] text-[#364153]">
                {program.about}
              </p>
            </FadeInUp>

            <FadeInUp>
              <div className="mt-12">
                <SectionHeading>أهداف المبادرة</SectionHeading>
                <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
                  {program.objectives.map((o) => (
                    <CheckItem key={o} text={o} />
                  ))}
                </div>
              </div>
            </FadeInUp>

            <FadeInUp>
              <div className="mt-12">
                <SectionHeading>مراحل تنفيذ المبادرة</SectionHeading>
                <ol className="mt-6 space-y-4">
                  {program.stages.map((stage, i) => (
                    <li
                      key={stage.title}
                      className="flex items-start gap-5 rounded-[16px] border-[1.18px] border-[#f3f4f6] bg-white p-5"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-[12px] bg-[#005761] text-[16px] font-black text-white">
                        {i + 1}
                      </span>
                      <div className="flex-1 text-right">
                        <h3 className="text-[17px] font-bold leading-[25.5px] text-[#005761]">
                          {stage.title}
                        </h3>
                        <p className="mt-1.5 text-[15px] leading-[27px] text-text-light">
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
                <SectionHeading>الفئات المستهدفة</SectionHeading>
                <div className="mt-6 flex flex-col items-start gap-4">
                  {program.targetGroups.map((t) => (
                    <CheckItem key={t} text={t} />
                  ))}
                </div>
              </div>
            </FadeInUp>

            <FadeInUp>
              <blockquote className="mt-12 rounded-[16px] border-r-[3.5px] border-[#00b5c2] bg-[#f8fbfb] py-6 pr-7 pl-6 text-right">
                <p className="text-[17px] leading-[32.3px] text-[#1e2939]">{program.quote.text}</p>
                <footer className="mt-3 text-[13px] leading-[24.7px] text-[#6a7282]">
                  {program.quote.author}
                </footer>
              </blockquote>
            </FadeInUp>

            <FadeInUp>
              <div className="mt-12">
                <SectionHeading>شركاء تنفيذ المبادرة</SectionHeading>
                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {program.partners.map((p) => (
                    <div
                      key={p}
                      className="flex flex-col items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-6"
                    >
                      <Image src={ICON.building} alt="" width={28} height={28} aria-hidden />
                      <span className="text-[14px] text-text-light">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInUp>
          </div>

          {/* Sidebar (left in RTL) */}
          <aside className="order-1 flex flex-col gap-5 lg:order-2">
            <div className="rounded-[16px] bg-[#e8f1f2] p-6">
              <h3 className="text-right text-[16px] font-bold leading-[24px] text-[#005761]">
                معلومات أساسية
              </h3>
              <ul className="mt-4 space-y-3">
                <InfoRow icon={ICON.calendar} label="تاريخ الإطلاق" value={program.info.launchYear} />
                <InfoRow icon={ICON.location} label="نطاق العمل" value={program.info.scope} />
                <InfoRow icon={ICON.people} label="المستفيدون" value={program.info.beneficiaries} />
                <InfoRow icon={ICON.target} label="القطاع" value={program.info.sector} />
              </ul>
            </div>

            <div className="rounded-[16px] border-[1.18px] border-[#f3f4f6] bg-white p-6">
              <h3 className="text-right text-[16px] font-bold leading-[24px] text-[#005761]">
                هل ترغب بدعم المبادرة؟
              </h3>
              <p className="mt-3 text-right text-[14px] leading-[23.8px] text-text-light">
                تواصل مع فريق الشراكات لمعرفة آلية الدعم والمساهمة في تعظيم الأثر.
              </p>
              <Link
                href="/contact"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#005761] px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#00444c]"
              >
                <ArrowLeft className="size-4" />
                تواصل معنا
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Related ── */}
      {related.length > 0 && (
        <section className="bg-white pb-20 md:pb-28" aria-labelledby="related-heading">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <h2
                id="related-heading"
                className="mb-8 text-right text-[24px] font-bold leading-[36px] text-[#005761]"
              >
                مبادرات ذات صلة
              </h2>
              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/programs/${p.slug}`}
                    className="group flex flex-col overflow-hidden rounded-[20px] border border-[#f3f4f6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_12px_24px_rgba(0,87,97,0.08)]"
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
                      <span className="text-[14px] text-[#005761]">{getCategoryLabel(p.category)}</span>
                      <h3 className="mt-2 text-[18px] font-bold leading-[24px] text-[#005761]">
                        {p.title}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-2 text-[14px] font-medium text-[#005761]">
                        اعرف أكثر
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
