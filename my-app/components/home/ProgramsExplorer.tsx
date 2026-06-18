"use client";

import Link from "next/link";
import { useState } from "react";

type Initiative = {
  title: string;
  desc: string;
  href: string;
};

type Panel = {
  id: string;
  name: string;
  bg: string;
  initiatives: Initiative[];
};

const PANELS: Panel[] = [
  {
    id: "empowerment",
    name: "المحتاج",
    bg: "#80A5E0",
    initiatives: [
      {
        title: "مبادرة تضمين",
        desc: "توظيف مستفيدي الضمان الاجتماعي القادرين على العمل",
        href: "/programs/tadmeen",
      },
      {
        title: "برنامج كفالة",
        desc: "رعاية ودعم الأيتام والضعفاء",
        href: "/programs/kafala",
      },
      {
        title: "مبادرة الإطعام",
        desc: "توزيع وجبات الطعام للمحتاجين",
        href: "/programs/feeding",
      },
    ],
  },
  {
    id: "mosques",
    name: "مساجد المجدوعي",
    bg: "#00B5C2",
    initiatives: [
      {
        title: "مبادرة عمارة",
        desc: "منظومة متكاملة لإنشاء وتشغيل وصيانة المساجد",
        href: "/programs/imaara",
      },
      {
        title: "مبادرة منارة",
        desc: "برامج تعليمية واجتماعية لقاصدي المساجد",
        href: "/programs/manara",
      },
      {
        title: "مبادرة رسالة",
        desc: "استقطاب الأكفاء وتطوير مهارات منسوبي المساجد",
        href: "/programs/risala",
      },
    ],
  },
  {
    id: "partners",
    name: "شركاء التنفيذ",
    bg: "#005761",
    initiatives: [
      {
        title: "مبادرة تطوير",
        desc: "تطوير شركاء المؤسسة ليمتلكوا القدرات للتغيير",
        href: "/programs/tatweer",
      },
      {
        title: "برنامج الشراكات",
        desc: "بناء شراكات استراتيجية مع الجمعيات الأهلية",
        href: "/programs/partnerships",
      },
      {
        title: "مبادرة تمكين",
        desc: "رفع جاهزية الكيانات غير الربحية الشريكة",
        href: "/programs/tamkeen",
      },
    ],
  },
];

export function ProgramsExplorer() {
  const [activeId, setActiveId] = useState("empowerment");

  return (
    <section
      className="bg-white py-16 md:py-24"
      data-nav-surface="light"
      aria-labelledby="programs-explorer-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-10 text-center">
          <h2
            id="programs-explorer-heading"
            className="text-3xl font-bold text-text-dark md:text-4xl"
          >
            المجالات والمبادرات
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-text-light">
            استكشف مبادرات المؤسسة ضمن مجالات التركيز الثلاثة
          </p>
        </div>

        {/* Accordion panels */}
        <div className="flex h-[480px] gap-2 overflow-hidden rounded-2xl md:h-[520px]">
          {PANELS.map((panel) => {
            const isActive = panel.id === activeId;
            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => setActiveId(panel.id)}
                className="relative flex shrink-0 flex-col overflow-hidden rounded-2xl text-right text-white transition-all duration-500 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                style={{
                  backgroundColor: panel.bg,
                  flex: isActive ? "1 1 60%" : "0 0 80px",
                  minWidth: isActive ? undefined : "80px",
                }}
                aria-expanded={isActive}
                aria-label={panel.name}
              >
                {isActive ? (
                  <div className="flex h-full flex-col p-8 md:p-10">
                    <h3 className="text-2xl font-bold md:text-3xl">{panel.name}</h3>
                    <p className="mt-2 text-sm text-white/80">
                      مبادرات وبرامج {panel.name}
                    </p>

                    <ul className="mt-8 flex flex-1 flex-col gap-3">
                      {panel.initiatives.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="group flex items-center justify-between rounded-xl bg-white/15 px-5 py-4 transition-colors hover:bg-white/25"
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
                              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 rtl:rotate-180">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </span>
                            <div className="flex-1 pe-4">
                              <p className="font-bold">{item.title}</p>
                              <p className="mt-0.5 text-xs text-white/75">{item.desc}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-between py-8">
                    <span
                      className="whitespace-nowrap text-sm font-bold"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      {panel.name}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Instruction */}
        <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm text-text-muted">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-accent" aria-hidden>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
          </svg>
          اضغط على المجال لاستكشاف مبادراته، ثم اضغط على المبادرة لعرض المسارات
        </p>
      </div>
    </section>
  );
}
