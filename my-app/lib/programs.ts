/**
 * The foundation runs fourteen approved initiatives: ten strategic ones, each
 * tied to a focus area, and four enabling ones that support the foundation
 * internally. /programs filters by focus area (content guide §6.1).
 */
export type ProgramCategoryId = "empowerment" | "mosques" | "partners" | "enabling";

export type ProgramType = "strategic" | "enabling";

export type ProgramStatus = "active" | "paused" | "closed";

// Labels are the guide's terms verbatim — «تمكين المحتاج», never «المحتاج» or
// «التمكين الاقتصادي» (§0, rule 6: one term per concept).
const CATEGORY_LABEL: Record<ProgramCategoryId, string> = {
  empowerment: "تمكين المحتاج",
  mosques: "مساجد المجدوعي",
  partners: "شركاء التنفيذ",
  enabling: "مبادرات تمكينية",
};

const TYPE_LABEL: Record<ProgramType, string> = {
  strategic: "استراتيجية",
  enabling: "تمكينية",
};

export const programFilters: { id: "all" | ProgramCategoryId; label: string }[] = [
  { id: "all", label: "جميع المبادرات" },
  { id: "empowerment", label: CATEGORY_LABEL.empowerment },
  { id: "mosques", label: CATEGORY_LABEL.mosques },
  { id: "partners", label: CATEGORY_LABEL.partners },
  { id: "enabling", label: CATEGORY_LABEL.enabling },
];

export type ProgramStage = { title: string; desc: string };
export type ProgramInfo = {
  launchYear: string;
  scope: string;
  beneficiaries: string;
  sector: string;
};

export type Program = {
  slug: string;
  title: string;
  category: ProgramCategoryId;
  type: ProgramType;
  status: ProgramStatus;
  /** Short text shown on the listing card. */
  shortDesc: string;
  /** Longer hero paragraph on the detail page. */
  heroDesc: string;
  image: string;
  about: string;
  /** مسارات المبادرة. */
  tracks: string[];
  /** من برامجها. */
  subPrograms: string[];
  objectives: string[];
  stages: ProgramStage[];
  targetGroups: string[];
  quote: { text: string; author: string };
  partners: string[];
  info: ProgramInfo;
  /** Slugs of related programs shown at the bottom of the detail page. */
  related: string[];
};

export function getCategoryLabel(category: ProgramCategoryId): string {
  return CATEGORY_LABEL[category] ?? "";
}

export function getTypeLabel(type: ProgramType): string {
  return TYPE_LABEL[type] ?? "";
}
