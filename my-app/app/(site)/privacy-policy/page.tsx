import type { Metadata } from "next";
import { getPageContent } from "@/lib/cms/fetchers";
import { PrivacyView, type Bi, type PrivacyContent, type PrivacySection } from "@/components/privacy/PrivacyView";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | مؤسسة المجدوعي الخيرية",
  description:
    "سياسة الخصوصية وحماية البيانات في مؤسسة المجدوعي الخيرية — كيف نجمع بياناتك ونستخدمها ونحميها.",
  alternates: { canonical: "/privacy-policy" },
};

export const dynamic = "force-dynamic";

const FALLBACK: PrivacyContent = {
  updated: { ar: "آخر تحديث: يوليو 2026", en: "Last updated: July 2026" },
  title: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  intro: {
    ar: "نحن في مؤسسة المجدوعي الخيرية نلتزم بحماية خصوصية بياناتك والتعامل معها بشفافية تامة وفق أعلى المعايير الأمنية واللوائح التنظيمية.",
    en: "At Almajdouie Charitable Foundation, we are committed to protecting the privacy of your data and handling it with full transparency, in line with the highest security standards and regulatory requirements.",
  },
  sections: [
    {
      title: { ar: "البيانات التي نجمعها", en: "Data We Collect" },
      body: {
        ar: "نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند استخدام الموقع، مثل:",
        en: "We collect the information you provide to us directly when using the website, such as:",
      },
      bullets: {
        ar: [
          "البيانات الشخصية (الاسم، البريد الإلكتروني، رقم الجوال) عند التقديم على الوظائف أو طلب الدعم.",
          "بيانات تصفح الموقع (عنوان الـ IP، نوع المتصفح، وسلوك التصفح).",
        ],
        en: [
          "Personal data (name, email, mobile number) when applying for jobs or requesting support.",
          "Website browsing data (IP address, browser type, and browsing behavior).",
        ],
      },
    },
    {
      title: { ar: "كيف نستخدم بياناتك", en: "How We Use Your Data" },
      body: {
        ar: "نستخدم البيانات التي نجمعها لعدة أغراض تشمل: تحسين أداء الموقع وخدماتنا الرقمية، معالجة طلبات التوظيف، والتواصل معك للرد على الاستفسارات.",
        en: "We use the data we collect for several purposes, including improving the performance of the website and our digital services, processing job applications, and communicating with you to respond to inquiries.",
      },
      bullets: { ar: [], en: [] },
    },
    {
      title: { ar: "حماية وأمن المعلومات", en: "Information Security & Protection" },
      body: {
        ar: "نطبق إجراءات أمنية تقنية وإدارية صارمة لحماية بياناتك من الوصول غير المصرح به، أو التعديل، أو الإفشاء. تشمل هذه الإجراءات: التشفير، التحقق الثنائي، وسياسات الوصول المقيّد.",
        en: "We apply strict technical and administrative security measures to protect your data from unauthorized access, alteration, or disclosure. These measures include encryption, two-factor authentication, and restricted-access policies.",
      },
      bullets: { ar: [], en: [] },
    },
    {
      title: { ar: "ملفات تعريف الارتباط (Cookies)", en: "Cookies" },
      body: {
        ar: "نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل سلوك الزوار. يمكنك التحكم في إعدادات ملفات الارتباط من خلال متصفحك في أي وقت.",
        en: "We use cookies to improve the browsing experience and analyze visitor behavior. You can control cookie settings through your browser at any time.",
      },
      bullets: { ar: [], en: [] },
    },
    {
      title: { ar: "حقوق المستخدم والاتصال بنا", en: "User Rights & Contacting Us" },
      body: {
        ar: "يحق لك في أي وقت طلب الاطلاع على بياناتك الشخصية أو تعديلها أو حذفها. للتواصل مع مسؤول حماية البيانات، يرجى مراسلتنا عبر البريد الإلكتروني أو نموذج الاتصال.",
        en: "You have the right at any time to request access to, correction of, or deletion of your personal data. To contact the data protection officer, please reach us via email or the contact form.",
      },
      bullets: { ar: [], en: [] },
    },
  ],
  calloutTitle: { ar: "لديك استفسار حول الخصوصية؟", en: "Have a question about privacy?" },
  calloutDesc: {
    ar: "إذا كان لديك أي أسئلة حول سياسة الخصوصية الخاصة بنا، يمكنك مراسلتنا في أي وقت.",
    en: "If you have any questions about our privacy policy, you can contact us at any time.",
  },
  calloutButton: { ar: "تواصل معنا", en: "Contact us" },
  orgName: { ar: "مؤسسة المجدوعي الخيرية", en: "Almajdouie Charitable Foundation" },
  orgDesc: {
    ar: "مؤسسة مانحة تسعى لتمكين المجتمع من خلال مبادرات نوعية ومستدامة.",
    en: "A philanthropic foundation seeking to empower the community through impactful, sustainable initiatives.",
  },
};

// Accepts both the bilingual shape ({ar,en}) and the legacy plain-Arabic strings.
function toBi(v: unknown, fb: Bi): Bi {
  if (v && typeof v === "object") {
    const o = v as Partial<Bi>;
    if (o.ar || o.en) return { ar: o.ar ?? "", en: o.en ?? "" };
    return fb;
  }
  if (typeof v === "string" && v) return { ar: v, en: "" };
  return fb;
}

function toSection(v: unknown): PrivacySection | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const title = toBi(o.title, { ar: "", en: "" });
  if (!title.ar && !title.en) return null;
  let bullets: PrivacySection["bullets"] = { ar: [], en: [] };
  if (Array.isArray(o.bullets)) bullets = { ar: o.bullets.filter((b): b is string => typeof b === "string"), en: [] };
  else if (o.bullets && typeof o.bullets === "object") {
    const b = o.bullets as { ar?: string[]; en?: string[] };
    bullets = { ar: b.ar ?? [], en: b.en ?? [] };
  }
  return { title, body: toBi(o.body, { ar: "", en: "" }), bullets };
}

export default async function PrivacyPolicyPage() {
  const raw = await getPageContent("privacy-policy");

  const sections = Array.isArray(raw.sections)
    ? raw.sections.map(toSection).filter((s): s is PrivacySection => s !== null)
    : [];

  const content: PrivacyContent = {
    updated: toBi(raw.updated, FALLBACK.updated),
    title: toBi(raw.title, FALLBACK.title),
    intro: toBi(raw.intro, FALLBACK.intro),
    sections: sections.length ? sections : FALLBACK.sections,
    calloutTitle: toBi(raw.callout_title, FALLBACK.calloutTitle),
    calloutDesc: toBi(raw.callout_desc, FALLBACK.calloutDesc),
    calloutButton: toBi(raw.callout_button, FALLBACK.calloutButton),
    orgName: toBi(raw.org_name, FALLBACK.orgName),
    orgDesc: toBi(raw.org_desc, FALLBACK.orgDesc),
  };

  return <PrivacyView content={content} />;
}
