/**
 * Shared shape and copy for the قناة الشكاوى والمقترحات form on /contact.
 *
 * Imported by both the client form and the server action, so the two can never
 * disagree about which types exist, which fields a type requires, or what the
 * upload limits are — the action re-checks everything the browser checked.
 */

export const CONTACT_REQUEST_TYPES = ["suggestion", "complaint", "inquiry"] as const;
export type ContactRequestType = (typeof CONTACT_REQUEST_TYPES)[number];

export function isContactRequestType(v: unknown): v is ContactRequestType {
  return CONTACT_REQUEST_TYPES.includes(v as ContactRequestType);
}

type Bilingual = { ar: string; en: string };

type TypeConfig = {
  /** Pill label in step 1. */
  tab: Bilingual;
  /** Step-3 textarea label — the one thing that changes wording per type. */
  bodyLabel: Bilingual;
  bodyPlaceholder: Bilingual;
  /**
   * Only شكوى shows رقم المرجعية / المشروع المرتبط, and only as an optional
   * field ("إن وجد"), sitting between the tabs and step 2.
   */
  hasReference: boolean;
};

export const CONTACT_TYPE_CONFIG: Record<ContactRequestType, TypeConfig> = {
  suggestion: {
    tab: { ar: "مقترح", en: "Suggestion" },
    bodyLabel: { ar: "نص الملاحظة / مقترح", en: "Your note / suggestion" },
    bodyPlaceholder: {
      ar: "اكتب تفاصيل ملاحظتك أو مقترحك بالتفصيل...",
      en: "Describe your note or suggestion in detail…",
    },
    hasReference: false,
  },
  complaint: {
    tab: { ar: "شكوى", en: "Complaint" },
    bodyLabel: { ar: "نص الملاحظة / الشكوى", en: "Your note / complaint" },
    bodyPlaceholder: {
      ar: "اكتب تفاصيل ملاحظتك أو شكواك بالتفصيل...",
      en: "Describe your note or complaint in detail…",
    },
    hasReference: true,
  },
  inquiry: {
    tab: { ar: "استفسار عام", en: "General inquiry" },
    bodyLabel: { ar: "نص الملاحظة / استفسار عام", en: "Your note / general inquiry" },
    bodyPlaceholder: {
      ar: "اكتب تفاصيل ملاحظتك أو استفسارك بالتفصيل...",
      en: "Describe your note or inquiry in detail…",
    },
    hasReference: false,
  },
};

/**
 * NOTE — placeholder lists. The design shows only one value in each dropdown
 * ("فرد (مستفيد)" and "إدارة البرامج والمنح") with no full list anywhere, so
 * these are a reasonable first cut and are expected to be corrected by the
 * foundation. They live here so that correction is a one-file edit.
 */
export const CONTACT_CATEGORIES: Bilingual[] = [
  { ar: "فرد (مستفيد)", en: "Individual (beneficiary)" },
  { ar: "جهة حكومية", en: "Government entity" },
  { ar: "جمعية أو مؤسسة خيرية", en: "Charity or non-profit" },
  { ar: "شركة أو قطاع خاص", en: "Company or private sector" },
  { ar: "موظف بالمؤسسة", en: "Foundation employee" },
  { ar: "أخرى", en: "Other" },
];

/** Same caveat as CONTACT_CATEGORIES — sourced from the site's own sections. */
export const CONTACT_DEPARTMENTS: Bilingual[] = [
  { ar: "إدارة البرامج والمنح", en: "Programs & Grants" },
  { ar: "إدارة مساجد المجدوعي", en: "Almajdouie Mosques" },
  { ar: "إدارة التمكين الاقتصادي", en: "Economic Empowerment" },
  { ar: "إدارة الشراكات", en: "Partnerships" },
  { ar: "الحوكمة والالتزام", en: "Governance & Compliance" },
  { ar: "الإدارة التنفيذية", en: "Executive Management" },
];

/** Mirrors the bucket's own file_size_limit / allowed_mime_types in 0015. */
export const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
export const ATTACHMENT_MAX_FILES = 5;
export const ATTACHMENT_ACCEPT = ".pdf,.png,.jpg,.jpeg";
export const ATTACHMENT_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"] as const;

export type ContactAttachment = {
  /** Object key inside the private contact-attachments bucket. */
  path: string;
  name: string;
  size: number;
  mime: string;
};

/**
 * Result of a submission, shared by the action and the form's useActionState.
 *
 * Lives here rather than beside the action because that file is "use server",
 * and such a module may only export async functions — exporting the initial
 * value from it fails the build with "found object".
 */
export type ContactRequestState = {
  ok: boolean;
  /** Quoted back to the submitter as their tracking reference. */
  ticketId: string | null;
  error: "missing" | "consent" | "file" | "failed" | null;
};

export const initialContactRequestState: ContactRequestState = {
  ok: false,
  ticketId: null,
  error: null,
};
