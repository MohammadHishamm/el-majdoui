"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ExpandFade } from "@/components/ui/expand-fade";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";
import "./programs-panel.css";

type BilingualText = { ar: string; en: string };

type Path = {
  id: string;
  title: BilingualText;
  desc: BilingualText;
  href: string;
};

type Initiative = {
  id: string;
  title: BilingualText;
  desc: BilingualText;
  paths: Path[];
};

type Panel = {
  id: string;
  name: BilingualText;
  bg: string;
  desc: BilingualText;
  initiatives: Initiative[];
};

const DEFAULT_PANELS: Panel[] = [
  {
    id: "empowerment",
    name: { ar: "المحتاج", en: "The Needy" },
    bg: "#80A5E0",
    desc: {
      ar: "برامج المحتاج تهدف إلى تمكين الأسر المحتاجة اقتصادياً واجتماعياً عبر التدريب والتأهيل وتوفير فرص العمل المستدامة.",
      en: "The Needy programs aim to empower needy families economically and socially through training, rehabilitation, and providing sustainable job opportunities.",
    },
    initiatives: [
      {
        id: "tadmeen",
        title: { ar: "مبادرة تضمين", en: "Tadmeen Initiative" },
        desc: {
          ar: "توظيف مستفيدي الضمان الاجتماعي والأُسر الأشمل ذات القدرات المهنية القادرة على العمل",
          en: "Employment of social security beneficiaries and comprehensive families with professional capabilities able to work",
        },
        paths: [
          {
            id: "vocational",
            title: { ar: "التأهيل المهني", en: "Vocational Training" },
            desc: {
              ar: "برامج تدريبية متخصصة تؤهل المستفيدين لسوق العمل.",
              en: "Specialized training programs that qualify beneficiaries for the job market.",
            },
            href: "/programs/tadmeen/vocational",
          },
          {
            id: "employment",
            title: { ar: "التشغيل والتوظيف", en: "Employment & Job Placement" },
            desc: {
              ar: "ربط المؤهلين بفرص عمل مستدامة لدى جهات التوظيف.",
              en: "Connecting qualified individuals with sustainable job opportunities at employment agencies.",
            },
            href: "/programs/tadmeen/employment",
          },
          {
            id: "entrepreneurship",
            title: { ar: "ريادة الأعمال", en: "Entrepreneurship" },
            desc: {
              ar: "دعم المستفيدين لإطلاق مشاريعهم الصغيرة والمتوسطة.",
              en: "Supporting beneficiaries in launching their small and medium enterprises.",
            },
            href: "/programs/tadmeen/entrepreneurship",
          },
        ],
      },
      {
        id: "kafala",
        title: { ar: "برنامج الكفالة", en: "Kafala Program" },
        desc: {
          ar: "رعاية ودعم الأيتام والأسر المتعففة",
          en: "Care and support for orphans and modest families",
        },
        paths: [
          {
            id: "orphans",
            title: { ar: "كفالة الأيتام", en: "Orphan Sponsorship" },
            desc: {
              ar: "كفالة شهرية مستدامة للأطفال الأيتام في المملكة.",
              en: "Sustainable monthly sponsorship for orphaned children in the Kingdom.",
            },
            href: "/programs/kafala/orphans",
          },
          {
            id: "families",
            title: { ar: "كفالة الأسر", en: "Family Sponsorship" },
            desc: {
              ar: "دعم الأسر المتعففة باحتياجاتها الأساسية.",
              en: "Supporting modest families with their basic needs.",
            },
            href: "/programs/kafala/families",
          },
        ],
      },
      {
        id: "feeding",
        title: { ar: "مبادرة الإطعام", en: "Feeding Initiative" },
        desc: {
          ar: "توفير الغذاء للمحتاجين عبر برامج مستدامة",
          en: "Providing food for those in need through sustainable programs",
        },
        paths: [
          {
            id: "baskets",
            title: { ar: "سلال غذائية", en: "Food Baskets" },
            desc: {
              ar: "توزيع سلال غذائية شهرية للأسر المحتاجة.",
              en: "Distributing monthly food baskets to needy families.",
            },
            href: "/programs/feeding/baskets",
          },
          {
            id: "meals",
            title: { ar: "وجبات جاهزة", en: "Ready Meals" },
            desc: {
              ar: "توفير وجبات يومية للمستفيدين في مواقع العمل والتدريب.",
              en: "Providing daily meals for beneficiaries at work and training sites.",
            },
            href: "/programs/feeding/meals",
          },
        ],
      },
    ],
  },
  {
    id: "mosques",
    name: { ar: "مساجد المجدوعي", en: "Almajdouie Mosques" },
    bg: "#00B5C2",
    desc: {
      ar: "تطوير وتجهيز مساجد حديثة لتكون منارات للعبادة والعلم وخدمة المجتمع بأحدث المعايير.",
      en: "Developing and equipping modern mosques to be beacons of worship, knowledge, and community service with the latest standards.",
    },
    initiatives: [
      {
        id: "building",
        title: { ar: "بناء المساجد", en: "Mosque Construction" },
        desc: {
          ar: "إنشاء مساجد نموذجية متكاملة المرافق في مختلف مناطق المملكة.",
          en: "Building exemplary mosques with integrated facilities across various regions of the Kingdom.",
        },
        paths: [
          {
            id: "design",
            title: { ar: "التصميم المعماري", en: "Architectural Design" },
            desc: {
              ar: "تصاميم معمارية مستوحاة من الطابع الإسلامي الأصيل.",
              en: "Architectural designs inspired by authentic Islamic heritage.",
            },
            href: "/programs/mosques/design",
          },
          {
            id: "construction",
            title: { ar: "التنفيذ والتشييد", en: "Implementation & Construction" },
            desc: {
              ar: "تنفيذ المشاريع بأعلى معايير الجودة والاستدامة.",
              en: "Executing projects with the highest standards of quality and sustainability.",
            },
            href: "/programs/mosques/construction",
          },
        ],
      },
      {
        id: "maintenance",
        title: { ar: "صيانة وتطوير", en: "Maintenance & Development" },
        desc: {
          ar: "صيانة وتأهيل المساجد القائمة لضمان استمرارية رسالتها.",
          en: "Maintaining and rehabilitating existing mosques to ensure continuity of their mission.",
        },
        paths: [
          {
            id: "periodic",
            title: { ar: "الصيانة الدورية", en: "Periodic Maintenance" },
            desc: {
              ar: "برامج صيانة دورية شاملة للمساجد التابعة.",
              en: "Comprehensive periodic maintenance programs for affiliated mosques.",
            },
            href: "/programs/mosques/periodic",
          },
          {
            id: "technical",
            title: { ar: "التطوير التقني", en: "Technical Development" },
            desc: {
              ar: "تجهيز المساجد بأحدث الأنظمة الصوتية والإضاءة.",
              en: "Equipping mosques with the latest audio and lighting systems.",
            },
            href: "/programs/mosques/technical",
          },
        ],
      },
      {
        id: "imams",
        title: { ar: "تأهيل الأئمة", en: "Imam Training" },
        desc: {
          ar: "تدريب وتأهيل الأئمة والخطباء وفق أحدث المناهج العلمية.",
          en: "Training and qualifying imams and preachers according to the latest scientific curricula.",
        },
        paths: [
          {
            id: "training",
            title: { ar: "برامج تدريبية", en: "Training Programs" },
            desc: {
              ar: "برامج متخصصة في علوم القرآن والخطابة.",
              en: "Specialized programs in Quranic sciences and oratory.",
            },
            href: "/programs/mosques/training",
          },
        ],
      },
    ],
  },
  {
    id: "partners",
    name: { ar: "شركاء التنفيذ", en: "Implementation Partners" },
    bg: "#005761",
    desc: {
      ar: "بناء قدرات الشركاء التنفيذيين وتمكينهم من تقديم حلول مبتكرة تخدم المجتمع.",
      en: "Building the capacity of implementation partners and enabling them to provide innovative solutions that serve society.",
    },
    initiatives: [
      {
        id: "capacity",
        title: { ar: "بناء القدرات", en: "Capacity Building" },
        desc: {
          ar: "برامج تدريبية لرفع كفاءة الجمعيات الخيرية والمؤسسات غير الربحية.",
          en: "Training programs to enhance the efficiency of charitable associations and non-profit institutions.",
        },
        paths: [
          {
            id: "governance",
            title: { ar: "الحوكمة المؤسسية", en: "Institutional Governance" },
            desc: {
              ar: "تطوير أنظمة الحوكمة والامتثال في الجمعيات.",
              en: "Developing governance and compliance systems in associations.",
            },
            href: "/programs/partners/governance",
          },
          {
            id: "finance",
            title: { ar: "الإدارة المالية", en: "Financial Management" },
            desc: {
              ar: "تأهيل الكوادر في الإدارة المالية والاستدامة.",
              en: "Qualifying cadres in financial management and sustainability.",
            },
            href: "/programs/partners/finance",
          },
        ],
      },
      {
        id: "grants",
        title: { ar: "بوابة المنح", en: "Grants Gateway" },
        desc: {
          ar: "منح تمويلية مخصصة للمشاريع المجتمعية ذات الأثر العالي.",
          en: "Dedicated funding grants for high-impact community projects.",
        },
        paths: [
          {
            id: "projects",
            title: { ar: "منح المشاريع", en: "Project Grants" },
            desc: {
              ar: "تمويل المشاريع النوعية وفق معايير الأثر الاجتماعي.",
              en: "Funding quality projects according to social impact criteria.",
            },
            href: "/programs/partners/projects",
          },
          {
            id: "operations",
            title: { ar: "منح التشغيل", en: "Operational Grants" },
            desc: {
              ar: "دعم التكاليف التشغيلية للجمعيات الناشئة.",
              en: "Supporting operational costs for emerging associations.",
            },
            href: "/programs/partners/operations",
          },
        ],
      },
      {
        id: "network",
        title: { ar: "شبكة الشركاء", en: "Partners Network" },
        desc: {
          ar: "منصة تفاعلية لتبادل الخبرات بين الجمعيات والمؤسسات.",
          en: "An interactive platform for sharing expertise among associations and institutions.",
        },
        paths: [
          {
            id: "forum",
            title: { ar: "الملتقى السنوي", en: "Annual Forum" },
            desc: {
              ar: "ملتقى سنوي يجمع شركاء التنفيذ لاستعراض الإنجازات.",
              en: "An annual forum bringing together implementation partners to showcase achievements.",
            },
            href: "/programs/partners/forum",
          },
        ],
      },
    ],
  },
];

const CONTAINER_WIDTH = 1232;
const CONTAINER_HEIGHT = 760;

const COLLAPSED_TITLE_STYLE = {
  top: 256.02,
  left: 14.44,
  width: 131,
  height: 66,
  fontSize: 30,
  lineHeight: "36px",
  fontWeight: 700,
} as const;

function ArrowIcon({ className, direction = "left" }: { className?: string; direction?: "left" | "right" }) {
  if (direction === "right") {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
        <path
          fillRule="evenodd"
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CollapsedArrowButton() {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
      <ArrowIcon className="h-4 w-4" />
    </span>
  );
}

function CircleArrowButton({
  direction = "left",
  expanded = false,
}: {
  direction?: "left" | "right";
  expanded?: boolean;
}) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-out ${
        expanded ? "rotate-90" : "rotate-0"
      }`}
    >
      <ArrowIcon className="h-4 w-4" direction={direction} />
    </span>
  );
}

type ProgramsTranslation = {
  heading: string;
  subheading: string;
  viewPanelPrefix: string;
  pathDetails: string;
  hint: string;
  pathsWithin: string;
  initiativesIn: string;
};

type MobilePanelContentProps = {
  panel: Panel;
  activeInitiativeId: string | null;
  onInitiativeToggle: (id: string) => void;
  isArabic: boolean;
  locale: "ar" | "en";
  t: ProgramsTranslation;
  footerText: string;
};

function MobilePanelContent({
  panel,
  activeInitiativeId,
  onInitiativeToggle,
  isArabic,
  locale,
  t,
  footerText,
}: MobilePanelContentProps) {
  return (
    <div
      className="flex flex-col p-6 text-white"
      style={{ backgroundColor: panel.bg }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className={isArabic ? "text-right" : "text-left"}>
        <h3 className="line-clamp-2 break-words text-xl font-bold">{panel.name[locale]}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-7 text-white/85">{panel.desc[locale]}</p>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {panel.initiatives.map((initiative) => {
          const isExpanded = activeInitiativeId === initiative.id;

          return (
            <li key={initiative.id}>
              <button
                type="button"
                onClick={() => onInitiativeToggle(initiative.id)}
                className={`flex w-full items-center gap-4 rounded-2xl px-4 py-4 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${
                  isArabic ? "text-right" : "text-left"
                } ${isExpanded ? "bg-white/20" : "bg-white/15 hover:bg-white/20"}`}
                aria-expanded={isExpanded}
              >
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 break-words font-bold text-sm">{initiative.title[locale]}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-6 text-white/75">
                    {initiative.desc[locale]}
                  </p>
                </div>
                <CircleArrowButton direction={isArabic ? "left" : "right"} expanded={isExpanded} />
              </button>

              <ExpandFade open={isExpanded}>
                <div className="flex flex-col gap-3">
                  {initiative.paths.map((path, index) => (
                    <article
                      key={path.id}
                      className={`expand-path-card flex flex-col rounded-2xl bg-white p-5 text-text-dark ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                      style={{ animationDelay: `${120 + index * 90}ms` }}
                    >
                      <div className="flex items-center justify-start gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: panel.bg }}
                          aria-hidden
                        />
                        <h4 className="line-clamp-2 break-words font-bold text-sm">{path.title[locale]}</h4>
                      </div>
                      <p className="mt-2 flex-1 text-sm leading-7 text-text-light">
                        {path.desc[locale]}
                      </p>
                      <Link
                        href={path.href}
                        className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold leading-none transition-opacity hover:opacity-80 ${
                          isArabic ? "self-end" : "self-start"
                        }`}
                        style={{ color: panel.bg }}
                      >
                        {t.pathDetails}
                        <ArrowIcon
                          className="block h-4 w-4 shrink-0"
                          direction={isArabic ? "left" : "right"}
                        />
                      </Link>
                    </article>
                  ))}
                </div>
              </ExpandFade>
            </li>
          );
        })}
      </ul>

      <p className={`mt-5 line-clamp-2 break-words text-xs text-white/70 ${isArabic ? "self-end" : "self-start"}`}>
        {footerText}
      </p>
    </div>
  );
}

function DesktopPanelContent({
  panel,
  activeInitiativeId,
  onInitiativeToggle,
  isArabic,
  locale,
  t,
  footerText,
}: MobilePanelContentProps) {
  return (
    <>
      <div className={isArabic ? "text-right" : "text-left"}>
        <h3 className="line-clamp-2 break-words text-2xl font-bold md:text-3xl">{panel.name[locale]}</h3>
        <p className="mt-2 line-clamp-3 max-w-2xl text-sm leading-7 text-white/85">{panel.desc[locale]}</p>
      </div>

      <ul className="mt-6 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden pe-1">
        {panel.initiatives.map((initiative) => {
          const isExpanded = activeInitiativeId === initiative.id;

          return (
            <li key={initiative.id}>
              <button
                type="button"
                onClick={() => onInitiativeToggle(initiative.id)}
                className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 ${
                  isArabic ? "text-right" : "text-left"
                } ${isExpanded ? "bg-white/20" : "bg-white/15 hover:bg-white/20"}`}
                aria-expanded={isExpanded}
              >
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 break-words font-bold">{initiative.title[locale]}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-6 text-white/75">
                    {initiative.desc[locale]}
                  </p>
                </div>
                <CircleArrowButton direction={isArabic ? "left" : "right"} expanded={isExpanded} />
              </button>

              <ExpandFade open={isExpanded}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {initiative.paths.map((path, index) => (
                    <article
                      key={path.id}
                      className={`expand-path-card flex flex-col rounded-2xl bg-white p-5 text-text-dark ${
                        isArabic ? "text-right" : "text-left"
                      }`}
                      style={{ animationDelay: `${120 + index * 90}ms` }}
                    >
                      <div className="flex items-center justify-start gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: panel.bg }}
                          aria-hidden
                        />
                        <h4 className="line-clamp-2 break-words font-bold">{path.title[locale]}</h4>
                      </div>
                      <p className="mt-2 flex-1 text-sm leading-7 text-text-light">
                        {path.desc[locale]}
                      </p>
                      <Link
                        href={path.href}
                        className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold leading-none transition-opacity hover:opacity-80 ${
                          isArabic ? "self-end" : "self-start"
                        }`}
                        style={{ color: panel.bg }}
                      >
                        {t.pathDetails}
                        <ArrowIcon
                          className="block h-4 w-4 shrink-0"
                          direction={isArabic ? "left" : "right"}
                        />
                      </Link>
                    </article>
                  ))}
                </div>
              </ExpandFade>
            </li>
          );
        })}
      </ul>

      <p className={`mt-auto line-clamp-2 break-words text-xs text-white/70 ${isArabic ? "self-end" : "self-start"}`}>
        {footerText}
      </p>
    </>
  );
}

function CollapsedPanelFace({
  panel,
  locale,
  viewPanelPrefix,
  isActive,
  onSelect,
}: {
  panel: Panel;
  locale: "ar" | "en";
  viewPanelPrefix: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="program-panel-collapsed-view"
      aria-expanded={isActive}
      aria-hidden={isActive}
      tabIndex={isActive ? -1 : 0}
      aria-label={`${viewPanelPrefix} ${panel.name[locale]}`}
    >
      {panel.id === "partners" && (
        <Image
          src="/images/figma/sections/program-2.svg"
          alt=""
          width={100}
          height={160}
          className="pointer-events-none absolute select-none"
          style={{
            top: 20.02,
            left: 32.36,
            width: 100.15263366699219,
            height: 160,
            opacity: 0.4,
          }}
          aria-hidden
        />
      )}

      {panel.id === "mosques" && (
        <Image
          src="/images/figma/sections/program-1.svg"
          alt=""
          width={139}
          height={138}
          className="pointer-events-none absolute select-none"
          style={{
            top: 528.02,
            left: 11.94,
            width: 139,
            height: 138,
            opacity: 1,
            transformOrigin: "center center",
          }}
          aria-hidden
        />
      )}

      <span
        className="absolute flex items-center justify-center overflow-hidden text-center font-bold"
        style={COLLAPSED_TITLE_STYLE}
        dir="rtl"
      >
        <span className="line-clamp-2 break-words">{panel.name[locale]}</span>
      </span>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <CollapsedArrowButton />
      </div>
    </button>
  );
}

export function ProgramsExplorer({ panels }: { panels?: Panel[] } = {}) {
  const PANELS = panels && panels.length ? panels : DEFAULT_PANELS;
  const [activePanelId, setActivePanelId] = useState(PANELS[0]?.id ?? "empowerment");
  const [activeInitiativeId, setActiveInitiativeId] = useState<string | null>(null);
  const { locale } = useLocale();
  const t = translations[locale].programs;
  const isArabic = locale === "ar";

  const activePanel = PANELS.find((p) => p.id === activePanelId) ?? PANELS[0];
  const activeInitiative = activePanel.initiatives.find((i) => i.id === activeInitiativeId);

  const handlePanelChange = (panelId: string) => {
    setActivePanelId(panelId);
    setActiveInitiativeId(null);
  };

  const handleInitiativeToggle = (initiativeId: string) => {
    setActiveInitiativeId((current) => (current === initiativeId ? null : initiativeId));
  };

  const footerText = activeInitiative
    ? `${activeInitiative.paths.length} ${t.pathsWithin} ${activeInitiative.title[locale]}`
    : `${activePanel.initiatives.length} ${t.initiativesIn} ${activePanel.name[locale]}`;

  return (
    <section
      className="bg-white pt-6 pb-16 md:pt-8 md:pb-24"
      data-nav-surface="light"
      aria-labelledby="programs-explorer-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className={`mb-10 ${isArabic ? "text-right" : "text-left"}`}>
          <h2
            id="programs-explorer-heading"
            className="text-3xl font-bold text-text-dark md:text-4xl"
          >
            {t.heading}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-text-light">
            {t.subheading}
          </p>
        </div>

        {/* ── Mobile layout (< md) ── */}
        <div className="md:hidden overflow-hidden rounded-bl-[40px] shadow-sm">
          {/* Tab bar */}
          <div className="flex" dir="ltr" role="tablist">
            {PANELS.map((panel) => {
              const isActive = panel.id === activePanelId;
              return (
                <button
                  key={panel.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handlePanelChange(panel.id)}
                  className="min-w-0 flex-1 truncate px-2 py-3 text-center text-xs font-bold text-white transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                  style={{
                    backgroundColor: panel.bg,
                    opacity: isActive ? 1 : 0.55,
                    borderBottom: isActive ? "3px solid rgba(255,255,255,0.7)" : "3px solid transparent",
                  }}
                  title={panel.name[locale]}
                >
                  {panel.name[locale]}
                </button>
              );
            })}
          </div>

          {/* Active panel content */}
          <MobilePanelContent
            panel={activePanel}
            activeInitiativeId={activeInitiativeId}
            onInitiativeToggle={handleInitiativeToggle}
            isArabic={isArabic}
            locale={locale}
            t={t}
            footerText={footerText}
          />
        </div>

        {/* ── Desktop layout (≥ md) ── */}
        <div className="hidden md:block mx-auto max-w-full overflow-hidden">
          <div
            className="program-panels-track mx-auto overflow-hidden rounded-bl-[50px] shadow-sm"
            style={{
              width: CONTAINER_WIDTH,
              maxWidth: "100%",
              height: CONTAINER_HEIGHT,
            }}
            dir="ltr"
          >
            {PANELS.map((panel) => {
              const isActive = panel.id === activePanelId;

              return (
                <div
                  key={panel.id}
                  className={`program-panel text-white${isActive ? " is-active" : ""}`}
                  style={{ backgroundColor: panel.bg, height: CONTAINER_HEIGHT }}
                >
                  <CollapsedPanelFace
                    panel={panel}
                    locale={locale}
                    viewPanelPrefix={t.viewPanelPrefix}
                    isActive={isActive}
                    onSelect={() => handlePanelChange(panel.id)}
                  />

                  <div
                    className={`program-panel-expanded-view p-8 md:p-10${isActive ? " is-visible" : ""}`}
                    style={{ backgroundColor: panel.bg }}
                    dir={isArabic ? "rtl" : "ltr"}
                    aria-hidden={!isActive}
                  >
                    <DesktopPanelContent
                      panel={panel}
                      activeInitiativeId={isActive ? activeInitiativeId : null}
                      onInitiativeToggle={handleInitiativeToggle}
                      isArabic={isArabic}
                      locale={locale}
                      t={t}
                      footerText={
                        isActive
                          ? footerText
                          : `${panel.initiatives.length} ${t.initiativesIn} ${panel.name[locale]}`
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p
          className="mx-auto mt-6 max-w-3xl text-center text-sm leading-7 text-text-muted"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <span className="md:hidden">
            {t.hint}
            <Image
              src="/images/figma/sections/arrow-left.svg"
              alt=""
              width={16}
              height={16}
              className={`ms-1.5 inline-block h-4 w-4 align-[-2px] ${isArabic ? "" : "rotate-180"}`}
              aria-hidden
            />
          </span>
          <span className="hidden items-center justify-center gap-2 md:inline-flex">
            <span>{t.hint}</span>
            <Image
              src="/images/figma/sections/arrow-left.svg"
              alt=""
              width={16}
              height={16}
              className={`shrink-0 ${isArabic ? "" : "rotate-180"}`}
              aria-hidden
            />
          </span>
        </p>
      </div>
    </section>
  );
}
