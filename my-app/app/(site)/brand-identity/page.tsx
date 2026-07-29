import type { Metadata } from "next";
import { BrandIdentityView } from "@/components/brand/BrandIdentityView";
import type { BrandGuide, Color, LogoCard } from "@/components/brand/BrandGuideTabs";
import { getPageContent } from "@/lib/cms/fetchers";

export const metadata: Metadata = {
  title: "الهوية البصرية | مؤسسة المجدوعي الخيرية",
  description:
    "دليلك الشامل لاستخدام عناصر الهوية البصرية لمؤسسة المجدوعي الخيرية وتطبيقاتها المعتمدة.",
};

export const dynamic = "force-dynamic";

const FALLBACK = {
  eyebrow: "المركز الإعلامي",
  title: "الهوية البصرية",
  intro: "دليلك الشامل لاستخدام عناصر الهوية البصرية لمؤسسة المجدوعي الخيرية، وتطبيقاتها المعتمدة في التغطيات الإعلامية.",
  tabs_heading: "دليل الهوية",

  /* مؤسسة المجدوعي الخيرية */
  tab_label: "مؤسسة المجدوعي الخيرية",
  pdf_title: "تحميل دليل الهوية البصرية كاملاً (إصدار V2)",
  pdf_subtitle: "ملف PDF يحتوي على معايير الاستخدام الخطية والبصرية.",
  pdf_file: "/brand/almajdouie-visual-identity-v2.pdf",
  logos_heading: "الشعار الرسمي واستخداماته",
  colors_heading: "الألوان المعتمدة",
  logos: [
    { image: "/images/identity/right-card.png", label: "الإصدار الأساسي · للخلفيات الفاتحة", variant: "light", links: [{ text: "تحميل SVG (للطباعة)", href: "/images/identity/logo-primary.svg" }, { text: "تحميل PNG (للمواقع والـ UI)", href: "/images/identity/right-card.png" }] },
    { image: "/images/identity/left-card.png", label: "الإصدار المعكوس · للخلفيات الداكنة", variant: "dark", links: [{ text: "تحميل SVG المعكوس", href: "/images/identity/logo-reversed.svg" }, { text: "تحميل PNG المعكوس", href: "/images/identity/left-card.png" }] },
  ] as LogoCard[],

  /* مساجد المجدوعي */
  mosques_tab_label: "مساجد المجدوعي",
  mosques_pdf_title: "تحميل دليل الهوية البصرية كاملاً (إصدار V2)",
  mosques_pdf_subtitle: "ملف PDF يحتوي على معايير الاستخدام الخطية والبصرية.",
  mosques_pdf_file: "/brand/almajdouie-mosques-visual-identity-v2.pdf",
  mosques_logos_heading: "الشعار الرسمي واستخداماته",
  mosques_colors_heading: "الألوان المعتمدة",
  /* أي رابط بدون href لا يظهر في الصفحة */
  mosques_logos: [
    { image: "/images/identity/mosques-logo-primary.png", label: "الإصدار الأساسي · للخلفيات الفاتحة", variant: "light", links: [{ text: "تحميل SVG (للمطابع)", href: "/images/identity/primary-svg-mosque.svg" }, { text: "تحميل PNG (للمواقع والـ UI)", href: "/images/identity/mosques-logo-primary.png" }] },
    { image: "/images/identity/mosques-logo-reversed.png", label: "الإصدار المعكوس · للخلفيات الداكنة", variant: "dark", links: [{ text: "تحميل SVG المعكوس", href: "/images/identity/reveres-svg-mosque.svg" }, { text: "تحميل PNG المعكوس", href: "/images/identity/mosques-logo-reversed.png" }] },
  ] as LogoCard[],
  mosques_colors: [
    { name: "اللون الأساسي للمؤسسة", hex: "#883C4E" },
    { name: "اللون الثانوي", hex: "#AA946F" },
    { name: "اللون المساند", hex: "#BC6851" },
    { name: "الرمادي الناعم", hex: "#000000" },
  ] as Color[],
};

export default async function BrandIdentityPage() {
  const raw = await getPageContent("brand-identity");
  const s = (k: keyof typeof FALLBACK) => (typeof raw[k] === "string" && raw[k] ? (raw[k] as string) : (FALLBACK[k] as string));
  const list = <T,>(k: string, fallback?: T[]) =>
    (Array.isArray(raw[k]) && (raw[k] as T[]).length ? (raw[k] as T[]) : fallback);

  const guides: BrandGuide[] = [
    {
      key: "foundation",
      tab_label: s("tab_label"),
      pdf_title: s("pdf_title"),
      pdf_subtitle: s("pdf_subtitle"),
      pdf_file: s("pdf_file"),
      logos_heading: s("logos_heading"),
      colors_heading: s("colors_heading"),
      logos: list<LogoCard>("logos", FALLBACK.logos)!,
      colors: list<Color>("colors"),
    },
    {
      key: "mosques",
      tab_label: s("mosques_tab_label"),
      pdf_title: s("mosques_pdf_title"),
      pdf_subtitle: s("mosques_pdf_subtitle"),
      pdf_file: s("mosques_pdf_file"),
      logos_heading: s("mosques_logos_heading"),
      colors_heading: s("mosques_colors_heading"),
      logos: list<LogoCard>("mosques_logos", FALLBACK.mosques_logos)!,
      colors: list<Color>("mosques_colors", FALLBACK.mosques_colors),
    },
  ];

  return (
    <main dir="rtl" className="bg-surface" data-nav-surface="light">
      <BrandIdentityView
        eyebrow={s("eyebrow")}
        title={s("title")}
        intro={s("intro")}
        tabsHeading={s("tabs_heading")}
        guides={guides}
      />
    </main>
  );
}
