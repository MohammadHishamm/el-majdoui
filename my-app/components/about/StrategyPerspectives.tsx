"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";

export type Perspective = {
  id: string;
  /** بُعد — the BSC perspective name */
  title: string;
  description: string;
  /** Card background (Figma fill) */
  bg: string;
  /** الأهداف الاستراتيجية — numbered objectives revealed on expand */
  objectives: string[];
  /** Fourth card: white circle with black number */
  invertedNumberBadge?: boolean;
};

/**
 * The four Balanced Scorecard perspectives (أربعة أبعاد) shown right-to-left.
 */
const DEFAULT_PERSPECTIVES: Perspective[] = [
  {
    id: "beneficiaries",
    title: "بُعد المستفيدين",
    description:
      "يركز على تمكين المستفيدين اقتصادياً، وتطوير المساجد، وبناء قدرات شركاء التنفيذ",
    bg: "#80A5E0",
    objectives: [
      "رفع القدرات الاقتصادية للمحتاج",
      "الدعم المباشر والمُيسَّر للأفراد",
      "تطوير منظومة العمل بالمساجد",
      "تطوير جاهزية شركاء التنفيذ",
    ],
  },
  {
    id: "stakeholders",
    title: "بُعد أصحاب المصلحة",
    description:
      "يعنى بالمساهمة الفاعلة والمباشرة في تحقيق مستهدفات رؤية المملكة 2030",
    bg: "#00B5C2",
    objectives: ["الإسهام في تحقيق الرؤية الوطنية 2030"],
  },
  {
    id: "internal-operations",
    title: "بُعد العمليات الداخلية",
    description:
      "يركز على حوكمة وتطوير آليات المنح ونمذجة أعمال المؤسسة بكفاءة وابتكار",
    bg: "#005761",
    objectives: [
      "نمذجة أعمال المؤسسة",
      "تطوير حلول مبتكرة",
      "الإدارة الفاعلة للمنح",
      "تطوير منظومة اتصال مؤسسي",
    ],
  },
  {
    id: "learning-growth",
    title: "بُعد التعلّم والنمو",
    description:
      "يركز على استدامة الموارد المالية وتطوير الكوادر البشرية والبيئة الرقمية للمؤسسة",
    bg: "#000000",
    objectives: ["تطوير منظومة الموارد البشرية"],
    invertedNumberBadge: true,
  },
];

function PerspectiveCard({
  perspective,
  open,
  onToggle,
}: {
  perspective: Perspective;
  open: boolean;
  onToggle: () => void;
}) {
  const hasObjectives = perspective.objectives.length > 0;

  return (
    <div
      className="relative flex w-full max-w-[300px] flex-col rounded-tr-[20px] px-5 pb-5 pt-8 text-white sm:px-6 sm:pb-6 sm:pt-12 lg:max-w-[300px] lg:rounded-tr-[120px] lg:px-7 lg:pb-8 lg:pt-[78px]"
      style={{ backgroundColor: perspective.bg }}
    >
      <h3 className="text-right text-[20px] font-medium leading-[1.35] lg:text-[24px] lg:leading-[40px]">
        {perspective.title}
      </h3>
      <p className="mt-3 min-h-0 text-right text-[15px] font-normal leading-[26px] text-white/90 lg:mt-[15px] lg:min-h-[120px] lg:leading-[30px]">
        {perspective.description}
      </p>

      <button
        type="button"
        onClick={() => hasObjectives && onToggle()}
        aria-expanded={open}
        aria-label={open ? "إخفاء الأهداف الاستراتيجية" : "عرض الأهداف الاستراتيجية"}
        disabled={!hasObjectives}
        className="mx-auto mt-4 flex size-[52px] shrink-0 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30 disabled:cursor-default disabled:opacity-60 lg:mt-10 lg:size-[60px]"
      >
        <ChevronDown
          className={`size-7 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {hasObjectives && (
        <ul
          className={`grid gap-2 overflow-hidden transition-all duration-500 ease-out ${
            open ? "mt-4 grid-rows-[1fr] opacity-100 lg:mt-[30px]" : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <li className="min-h-0">
            <ul className="space-y-2">
              {perspective.objectives.map((objective, i) => (
                <li
                  key={objective}
                  className="flex h-[50px] items-center gap-2 rounded-[20px] bg-white/20 pl-[13px] pr-[7px]"
                >
                  <span
                    className={`grid size-[30px] shrink-0 place-items-center rounded-full ${
                      perspective.invertedNumberBadge
                        ? "bg-white text-black"
                        : "bg-[#0A1F2D] text-white"
                    }`}
                    aria-hidden
                  >
                    <span className="translate-y-[2px] text-center text-[16px] font-medium tabular-nums leading-none">
                      {i + 1}
                    </span>
                  </span>
                  <span className="flex-1 text-right text-[14px] font-bold leading-[24px]">
                    {objective}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      )}
    </div>
  );
}

export function StrategyPerspectives({ perspectives }: { perspectives?: Perspective[] } = {}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const PERSPECTIVES = perspectives && perspectives.length ? perspectives : DEFAULT_PERSPECTIVES;

  return (
    <section className="bg-white pb-20 pt-8 sm:pb-24" data-nav-surface="light" aria-label="أبعاد الاستراتيجية">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start justify-items-center gap-4 sm:grid-cols-2 sm:gap-[17px] lg:grid-cols-4">
          {PERSPECTIVES.map((perspective, i) => (
            <FadeInUp key={perspective.id} delay={i * 100} className="flex w-full justify-center">
              <PerspectiveCard
                perspective={perspective}
                open={openId === perspective.id}
                onToggle={() =>
                  setOpenId((current) =>
                    current === perspective.id ? null : perspective.id,
                  )
                }
              />
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
