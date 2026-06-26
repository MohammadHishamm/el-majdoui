"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Building2, Handshake, Landmark, ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";

type BilingualText = { ar: string; en: string };

const DIR = "/images/home/featured";

// SDG goal tiles (exported as image-N.jpg)
const SDG = {
  poverty: `${DIR}/image-1.jpg`, // SDG 1
  education: `${DIR}/image-2.jpg`, // SDG 4
  decentWork: `${DIR}/image-3.jpg`, // SDG 8
  inequalities: `${DIR}/image-4.jpg`, // SDG 10
  health: `${DIR}/image-5.jpg`, // SDG 3
};

// Saudi Vision 2030 program logos
const PROGRAM = {
  humanCapacity: `${DIR}/program-1.png`, // برنامج تنمية القدرات البشرية
  nationalTransformation: `${DIR}/program-2.jpg`, // برنامج التحول الوطني 2030
  qualityOfLife: `${DIR}/program-3.jpg`, // برنامج جودة الحياة
};

function InitiativeIcon({ src }: { src: string }) {
  return <Image src={src} alt="" width={47} height={47} aria-hidden className="size-12" />;
}

type AlignmentCard = {
  name: BilingualText;
  nationalText: BilingualText;
  program: string;
  programAlt: string;
  sdg: string[];
  icon: ReactNode;
};

type Tab = { id: string; label: BilingualText; cards: AlignmentCard[] };

const TABS: Tab[] = [
  {
    id: "empowerment",
    label: { ar: "تمكين المحتاج", en: "Empowering the Needy" },
    cards: [
      {
        name: { ar: "تضمين", en: "Tadmeen" },
        nationalText: {
          ar: "تمكين اقتصادي مستدام ورفع القابلية للتوظيف عبر التدريب والتأهيل.",
          en: "Sustainable economic empowerment and raising employability through training.",
        },
        program: PROGRAM.humanCapacity,
        programAlt: "برنامج تنمية القدرات البشرية",
        sdg: [SDG.inequalities, SDG.decentWork, SDG.education, SDG.poverty],
        icon: <InitiativeIcon src={`${DIR}/people-icon.svg`} />,
      },
      {
        name: { ar: "تفريج كربة", en: "Relief of Hardship" },
        nationalText: {
          ar: "حماية اجتماعية شاملة واستقرار معيشي للأسر الأشد حاجة.",
          en: "Comprehensive social protection and stability for the neediest families.",
        },
        program: PROGRAM.nationalTransformation,
        programAlt: "برنامج التحول الوطني 2030",
        sdg: [SDG.inequalities, SDG.poverty],
        icon: <InitiativeIcon src={`${DIR}/heart-icon.svg`} />,
      },
      {
        name: { ar: "استجابة", en: "Response" },
        nationalText: {
          ar: "الاستجابة السريعة والفعالة للاحتياجات الطارئة وتحسين بيئة المستفيدين.",
          en: "Fast, effective response to urgent needs and improving beneficiaries' environment.",
        },
        program: PROGRAM.qualityOfLife,
        programAlt: "برنامج جودة الحياة",
        sdg: [SDG.inequalities, SDG.health, SDG.poverty],
        icon: <InitiativeIcon src={`${DIR}/timer-icon.svg`} />,
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
          ar: "تعزيز القيم الإسلامية وخدمة المصلين بمساجد نموذجية مستدامة.",
          en: "Promoting Islamic values and serving worshippers with sustainable model mosques.",
        },
        program: PROGRAM.qualityOfLife,
        programAlt: "برنامج جودة الحياة",
        sdg: [SDG.health, SDG.poverty],
        icon: <Building2 className="size-12 text-[#005761]" strokeWidth={1.5} />,
      },
      {
        name: { ar: "منارة", en: "Beacon" },
        nationalText: {
          ar: "إثراء المحتوى العلمي والدعوي في المساجد وبناء كوادر مؤهلة.",
          en: "Enriching scientific and outreach content in mosques and building qualified cadres.",
        },
        program: PROGRAM.humanCapacity,
        programAlt: "برنامج تنمية القدرات البشرية",
        sdg: [SDG.education, SDG.poverty],
        icon: <Landmark className="size-12 text-[#005761]" strokeWidth={1.5} />,
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
          ar: "بناء شراكات فاعلة ورفع الكفاءة التشغيلية للجمعيات الناشئة.",
          en: "Building effective partnerships and raising operational efficiency of associations.",
        },
        program: PROGRAM.nationalTransformation,
        programAlt: "برنامج التحول الوطني 2030",
        sdg: [SDG.inequalities, SDG.decentWork],
        icon: <Handshake className="size-12 text-[#005761]" strokeWidth={1.5} />,
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
          ar: "تعزيز الشفافية والمساءلة والامتثال للوائح والسياسات المعتمدة.",
          en: "Strengthening transparency, accountability and compliance with policies.",
        },
        program: PROGRAM.nationalTransformation,
        programAlt: "برنامج التحول الوطني 2030",
        sdg: [SDG.inequalities],
        icon: <ShieldCheck className="size-12 text-[#005761]" strokeWidth={1.5} />,
      },
    ],
  },
];

const NATIONAL_LABEL: BilingualText = { ar: "المواءمة الوطنية:", en: "National Alignment:" };
const SDG_LABEL: BilingualText = { ar: "أهداف التنمية المستدامة:", en: "Sustainable Development Goals:" };

export function StrategicAlignment() {
  const [activeTab, setActiveTab] = useState("empowerment");
  const { locale } = useLocale();
  const t = translations[locale].strategic;
  const tab = TABS.find((tb) => tb.id === activeTab) ?? TABS[0];

  return (
    <section className="bg-white py-16 md:py-20" data-nav-surface="light" aria-labelledby="alignment-heading">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2 id="alignment-heading" className="text-[28px] font-medium leading-[1.2] text-text-dark md:text-[36px]">
            {t.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-[16px] leading-[28px] text-text-light md:text-[18px]">
            {t.subheading}
          </p>
        </div>

        {/* Segmented tabs */}
        <div className="mx-auto mt-8 flex w-full max-w-[768px] gap-2 rounded-[20px] bg-[#f3f4f6] p-2">
          {TABS.map((tb) => {
            const active = activeTab === tb.id;
            return (
              <button
                key={tb.id}
                type="button"
                onClick={() => setActiveTab(tb.id)}
                aria-pressed={active}
                className={`flex-1 rounded-[16px] px-2 py-3 text-[14px] font-bold transition-colors sm:text-[16px] ${
                  active ? "bg-[#005761] text-white" : "text-[#374151] hover:bg-white/60"
                }`}
              >
                {tb.label[locale]}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="mt-10 flex flex-col gap-6">
          {tab.cards.map((card) => (
            <div
              key={card.name.ar}
              className="flex flex-col items-stretch gap-6 rounded-[12px] border border-[#bfc8c8] bg-white p-6 shadow-[0_4px_10px_rgba(0,51,52,0.04)] lg:flex-row lg:items-center lg:gap-8 lg:p-8"
            >
              {/* Initiative icon box (right in RTL) */}
              <div className="flex h-[180px] w-full shrink-0 flex-col items-center justify-center gap-3 rounded-[16px] border border-[#d2e4e6] bg-[#f0f7f8] p-6 lg:h-[192px] lg:w-[291px]">
                {card.icon}
                <span className="text-[20px] font-bold text-[#005761]">{card.name[locale]}</span>
              </div>

              {/* National alignment + program logo (middle) */}
              <div className="flex flex-1 flex-col gap-3 text-right">
                <h3 className="text-[20px] font-bold leading-[28px] text-text-dark">
                  {NATIONAL_LABEL[locale]}
                </h3>
                <p className="text-[16px] leading-[26px] text-text-light">{card.nationalText[locale]}</p>
                <div className="relative mt-2 h-[62px] w-[188px] self-start">
                  <Image
                    src={card.program}
                    alt={card.programAlt}
                    fill
                    unoptimized
                    className="object-contain object-right"
                    sizes="188px"
                  />
                </div>
              </div>

              {/* SDG tiles (left in RTL) */}
              <div className="shrink-0 text-right lg:w-[368px]">
                <p className="mb-3 text-[14px] text-[#3f4849]">{SDG_LABEL[locale]}</p>
                <div className="flex flex-wrap justify-start gap-2">
                  {card.sdg.map((src, i) => (
                    <span key={i} className="relative size-[72px] shrink-0 overflow-hidden rounded-[4px] lg:size-20">
                      <Image src={src} alt="" fill className="object-cover" sizes="80px" aria-hidden />
                    </span>
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
