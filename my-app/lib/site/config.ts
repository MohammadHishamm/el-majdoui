export const siteConfig = {
  name: "المجدوعي الخيرية",
  fullName: "مؤسسة علي بن إبراهيم المجدوعي وعائلته الخيرية",
  nameEn: "Almajdouie Foundation",
  description: "مؤسسة مانحة تُسهم في تحسين جودة الحياة الاقتصادية للمحتاج والعناية بمساجد المجدوعي.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://almajdouie.org",
  grantPortalUrl: process.env.NEXT_PUBLIC_GRANT_PORTAL_URL ?? "#",
  grantPortalLabel: "بوابة المنح",
  locale: "ar-SA",
  contact: {
    phone: "+966 234 11 98989",
    fax: "+966 XX XXX XXXX",
    email: "info@almajdouie.org",
    address: "المملكة العربية السعودية، المنطقة الشرقية، الدمام",
    addressEn: "Kingdom of Saudi Arabia, Eastern Province, Dammam",
    workingHours: "من الأحد إلى الخميس – من 8:00 ص حتى 4:00 م",
    workingHoursEn: "Sunday to Thursday – 8:00 AM to 4:00 PM",
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
  labelEn?: string;
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
    labelEn: "About Us",
    href: "/about",
    children: [
      { label: "من نحن", labelEn: "Who We Are", href: "/about/who-we-are" },
      { label: "الرؤية والرسالة والقيم", labelEn: "Vision, Mission & Values", href: "/about/vision-mission" },
      { label: "الاستراتيجية", labelEn: "Strategy", href: "/about/strategy" },
      {
        label: "مجلس الأمناء والقيادات",
        labelEn: "Board of Trustees & Leadership",
        href: "/about/board",
      },
      { label: "السياسات واللوائح", labelEn: "Policies & Regulations", href: "/about/policies" },
    ],
  },
  {
    label: "مجالات التركيز",
    labelEn: "Focus Areas",
    href: "/focus-areas",
    children: [
      {
        label: "التمكين الاقتصادي (المحتاج)",
        labelEn: "Economic Empowerment (The Needy)",
        href: "/focus-areas/empowerment",
      },
      { label: "مساجد المجدوعي", labelEn: "Almajdouie Mosques", href: "/focus-areas/mosques" },
      { label: "شركاء التنفيذ", labelEn: "Implementation Partners", href: "/focus-areas/partners-development" },
    ],
  },
  { label: "البرامج والمبادرات", labelEn: "Programs & Initiatives", href: "/programs" },
  {
    label: "المركز الإعلامي",
    labelEn: "Media Center",
    href: "/news",
    children: [
      { label: "الأخبار والإعلانات", labelEn: "News & Announcements", href: "/news" },
      {
        label: "معرض الصور والفيديو",
        labelEn: "Photo & Video Gallery",
        href: "/gallery",
      },
      { label: "التقارير والوثائق", labelEn: "Reports & Documents", href: "/reports" },
      { label: "الهوية البصرية", labelEn: "Visual Identity", href: "/brand-identity" },
    ],
  },
  { label: "التوظيف", labelEn: "Careers", href: "/careers" },
  { label: "اتصل بنا", labelEn: "Contact Us", href: "/#contact" },
];

export const footerNavigation = {
  focus: [
    { label: "المحتاج", labelEn: "The Needy", href: "/focus-areas/empowerment" },
    { label: "مساجد المجدوعي", labelEn: "Almajdouie Mosques", href: "/focus-areas/mosques" },
    { label: "شركاء التنفيذ", labelEn: "Implementation Partners", href: "/focus-areas/partners-development" },
  ],
  media: [
    { label: "الأخبار", labelEn: "News", href: "/news" },
    { label: "معرض الصور", labelEn: "Photo Gallery", href: "/gallery" },
    { label: "التقارير", labelEn: "Reports", href: "/reports" },
  ],
  about: [
    { label: "من نحن", labelEn: "Who We Are", href: "/about/who-we-are" },
    { label: "مجلس الأمناء", labelEn: "Board of Trustees", href: "/about/board" },
    { label: "السياسات واللوائح", labelEn: "Policies & Regulations", href: "/about/policies" },
  ],
  legal: [
    { label: "سياسة الخصوصية", labelEn: "Privacy Policy", href: "/privacy-policy" },
    { label: "خريطة الموقع", labelEn: "Sitemap", href: "/sitemap" },
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
