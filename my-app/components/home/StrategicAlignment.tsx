"use client";

import { useState, type ReactNode } from "react";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

type BilingualText = { ar: string; en: string };

type AlignmentCard = {
  name: BilingualText;
  nationalText: BilingualText;
  sdgColors: string[];
  icon: ReactNode;
};

type Tab = {
  id: string;
  label: BilingualText;
  cards: AlignmentCard[];
};

const TABS: Tab[] = [
  {
    id: "empowerment",
    label: { ar: "تمكين المحتاج", en: "Empowering the Needy" },
    cards: [
      {
        name: { ar: "تضمين", en: "Tadmeen" },
        nationalText: {
          ar: "تمكين اقتصادي مستدام — برنامج تنمية القدرات البشرية",
          en: "Sustainable Economic Empowerment — Human Capacity Development Program",
        },
        sdgColors: ["#E5243B", "#C5192D", "#DDA63A"],
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8 text-primary">
            <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M6 28c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        name: { ar: "تفريج كربة", en: "Relief of Hardship" },
        nationalText: {
          ar: "حماية الاحتياجات شاملة — برنامج التحول الوطني",
          en: "Comprehensive Needs Protection — National Transformation Program",
        },
        sdgColors: ["#E5243B", "#C5192D"],
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8 text-primary">
            <path d="M16 26s-10-6.5-10-13a6 6 0 0112 0c0 6.5-10 13-10 13z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        name: { ar: "استجابة", en: "Response" },
        nationalText: {
          ar: "الاستجابة السريعة والفعالة — برنامج جودة الحياة",
          en: "Fast and Effective Response — Quality of Life Program",
        },
        sdgColors: ["#E5243B", "#3F7E44", "#C5192D"],
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8 text-primary">
            <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M16 10v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "mosques",
    label: { ar: "مساجد المجدوعي", en: "Almajdouie Mosques" },
    cards: [
      {
        name: { ar: "عمارة", en: "Construction" },
        nationalText: {
          ar: "تعزيز القيم الإسلامية — برنامج جودة الحياة",
          en: "Promoting Islamic Values — Quality of Life Program",
        },
        sdgColors: ["#4C9F38", "#3F7E44"],
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8 text-primary">
            <path d="M16 4l10 8v16H6V12L16 4z" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        name: { ar: "منارة", en: "Beacon" },
        nationalText: {
          ar: "تمكين اقتصادي مستدام — برنامج تنمية القدرات البشرية",
          en: "Sustainable Economic Empowerment — Human Capacity Development Program",
        },
        sdgColors: ["#E5243B", "#DDA63A"],
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8 text-primary">
            <path d="M16 6v20M10 12h12M10 20h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "partners",
    label: { ar: "شركاء التنفيذ", en: "Implementation Partners" },
    cards: [
      {
        name: { ar: "تطوير", en: "Development" },
        nationalText: {
          ar: "شراكات فاعلة — برنامج التحول الوطني",
          en: "Effective Partnerships — National Transformation Program",
        },
        sdgColors: ["#19486A", "#0A97D9"],
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8 text-primary">
            <circle cx="10" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="22" cy="16" r="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14 16h4" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "internal",
    label: { ar: "ممكنات داخلية", en: "Internal Enablers" },
    cards: [
      {
        name: { ar: "حوكمة", en: "Governance" },
        nationalText: {
          ar: "شفافية ومساءلة — برنامج التحول الوطني",
          en: "Transparency and Accountability — National Transformation Program",
        },
        sdgColors: ["#19486A"],
        icon: (
          <svg viewBox="0 0 32 32" fill="none" className="h-8 w-8 text-primary">
            <rect x="6" y="8" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 14h8M12 18h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ],
  },
];

const SDG_MAP: Record<string, number> = {
  "#E5243B": 1,
  "#DDA63A": 2,
  "#4C9F38": 3,
  "#C5192D": 4,
  "#FF3A21": 5,
  "#26BDE2": 6,
  "#FCC30B": 7,
  "#A21942": 8,
  "#FD6925": 9,
  "#DD1367": 10,
  "#FD9D24": 11,
  "#BF8B2E": 12,
  "#3F7E44": 13,
  "#0A97D9": 14,
  "#56C02B": 15,
  "#00689D": 16,
  "#19486A": 17,
};

function SdgBadge({ color, sdgGoalLabel }: { color: string; sdgGoalLabel: string }) {
  const goal = SDG_MAP[color.toUpperCase()] ?? SDG_MAP[color];
  return (
    <span
      className="inline-flex h-11 w-11 flex-col items-center justify-center rounded-lg text-white"
      style={{ backgroundColor: color }}
      title={goal ? `SDG ${goal}` : undefined}
      aria-label={goal ? `${sdgGoalLabel} ${goal}` : undefined}
    >
      <span className="text-[9px] font-bold leading-none opacity-80">SDG</span>
      <span className="text-base font-black leading-tight">{goal ?? "?"}</span>
    </span>
  );
}

export function StrategicAlignment() {
  const [activeTab, setActiveTab] = useState("empowerment");
  const { locale } = useLocale();
  const t = translations[locale].strategic;

  const tab = TABS.find((tb) => tb.id === activeTab) ?? TABS[0];

  return (
    <section
      className="bg-bg-light py-16 md:py-24"
      data-nav-surface="light"
      aria-labelledby="alignment-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="mb-10 text-center">
          <h2
            id="alignment-heading"
            className="text-3xl font-bold text-text-dark md:text-4xl"
          >
            {t.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base leading-8 text-text-light">
            {t.subheading}
          </p>
        </div>

        {/* Tab pills */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {TABS.map((tb) => (
            <button
              key={tb.id}
              type="button"
              onClick={() => setActiveTab(tb.id)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                activeTab === tb.id
                  ? "bg-primary text-white"
                  : "bg-white text-text-dark ring-1 ring-bg-alt hover:bg-bg-alt"
              }`}
            >
              {tb.label[locale]}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {tab.cards.map((card) => (
            <div
              key={card.name.ar}
              className="flex flex-col gap-6 rounded-2xl bg-white p-6 ring-1 ring-bg-alt md:flex-row md:items-center md:gap-8 md:p-8"
            >
              {/* Initiative icon + name */}
              <div className="flex shrink-0 flex-col items-center gap-2 text-center md:w-28">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-alt">
                  {card.icon}
                </div>
                <span className="text-sm font-bold text-primary">{card.name[locale]}</span>
              </div>

              {/* National alignment */}
              <div className="flex flex-1 items-center gap-4 text-right">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-bold text-primary">٢٠٣٠</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-muted">{t.nationalAlignment}</p>
                  <p className="mt-1 text-sm leading-7 text-text-dark">{card.nationalText[locale]}</p>
                </div>
              </div>

              {/* SDGs */}
              <div className="shrink-0 text-right md:w-48">
                <p className="mb-3 text-xs font-semibold text-text-muted">{t.sdgLabel}</p>
                <div className="flex gap-2 justify-end">
                  {card.sdgColors.map((color, i) => (
                    <SdgBadge key={i} color={color} sdgGoalLabel={t.sdgGoalLabel} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
