export const siteConfig = {
  name: "المجدوعي الخيرية",
  fullName: "مؤسسة علي بن إبراهيم المجدوعي وعائلته الخيرية",
  nameEn: "Almajdouie Foundation",
  description:
    "مؤسسة مانحة تُسهم في تحسين جودة الحياة الاقتصادية للمحتاج والعناية بمساجد المجدوعي، من خلال حلول مبتكرة وشراكات فاعلة ومنح ميسّر.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://almajdouie.org",
  grantPortalUrl: process.env.NEXT_PUBLIC_GRANT_PORTAL_URL ?? "#",
  grantPortalLabel: "بوابة المنح",
  locale: "ar-SA",
  contact: {
    phone: "+966 XX XXX XXXX",
    fax: "+966 XX XXX XXXX",
    email: "info@almajdouie.org",
    address: "المنطقة الشرقية، المملكة العربية السعودية",
  },
  social: {
    twitter: "#",
    linkedin: "#",
    instagram: "#",
    youtube: "#",
    whatsapp: "#",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  children?: NavItem[];
};

/*
 * Order matches the Figma design (RTL: first item = rightmost, closest to logo).
 * عن المؤسسة → مجالات التركيز → البرامج والمبادرات → المركز الإعلامي → التوظيف → اتصل بنا
 */
export const mainNavigation: NavItem[] = [
  {
    label: "عن المؤسسة",
    href: "/about",
    children: [
      { label: "من نحن", href: "/about/who-we-are" },
      { label: "الرؤية والرسالة والقيم", href: "/about/vision-mission" },
      { label: "الاستراتيجية", href: "/about/strategy" },
      { label: "مجلس الأمناء", href: "/about/board" },
      { label: "القيادات التنفيذية", href: "/about/leadership" },
      { label: "السياسات واللوائح", href: "/about/policies" },
    ],
  },
  {
    label: "مجالات التركيز",
    href: "/focus-areas",
    children: [
      { label: "المحتاج", href: "/focus-areas/empowerment" },
      { label: "مساجد المجدوعي", href: "/focus-areas/mosques" },
      { label: "شركاء التنفيذ", href: "/focus-areas/partners-development" },
    ],
  },
  { label: "البرامج والمبادرات", href: "/programs" },
  {
    label: "المركز الإعلامي",
    href: "/media-center",
    children: [
      { label: "الأخبار", href: "/news" },
      { label: "معرض الصور", href: "/gallery" },
      { label: "مكتبة الفيديو", href: "/videos" },
      { label: "التقارير", href: "/reports" },
      { label: "الهوية البصرية", href: "/brand-identity" },
    ],
  },
  { label: "التوظيف", href: "/careers" },
  { label: "اتصل بنا", href: "/contact" },
];

export const footerNavigation = {
  focus: [
    { label: "المحتاج", href: "/focus-areas/empowerment" },
    { label: "مساجد المجدوعي", href: "/focus-areas/mosques" },
    { label: "شركاء التنفيذ", href: "/focus-areas/partners-development" },
  ],
  media: [
    { label: "الأخبار", href: "/news" },
    { label: "معرض الصور", href: "/gallery" },
    { label: "التقارير", href: "/reports" },
  ],
  about: [
    { label: "من نحن", href: "/about/who-we-are" },
    { label: "مجلس الأمناء", href: "/about/board" },
    { label: "السياسات واللوائح", href: "/about/policies" },
  ],
  legal: [
    { label: "سياسة الخصوصية", href: "/privacy-policy" },
    { label: "خريطة الموقع", href: "/sitemap" },
  ],
};

export const focusAreas = [
  {
    name: "المحتاج",
    slug: "empowerment",
    color: "#005761",
    shortDesc: "تمكين اقتصادي وتفريج كربات",
  },
  {
    name: "مساجد المجدوعي",
    slug: "mosques",
    color: "#00B5C2",
    shortDesc: "عناية وتطوير ومنارة للعلم",
  },
  {
    name: "شركاء التنفيذ",
    slug: "partners-development",
    color: "#80A5E0",
    shortDesc: "بناء قدرات لإحداث الأثر",
  },
] as const;
