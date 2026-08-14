import { BarChart3, Check, FileText, Users, type LucideIcon } from "lucide-react";

/** Shared shape for the committee + CEO-office sections on /about/board. */

export type CommitteeMember = {
  name_ar: string;
  name_en: string;
  role_ar: string;
  role_en: string;
  /**
   * A portrait, or an .svg logo. An svg is rendered contained on a brand fill
   * rather than cropped — that's how the design shows the grants secretariat
   * entry, which stands for a team rather than a person.
   */
  image: string;
};

export type CommitteeDuty = { text_ar: string; text_en: string; icon: string };

export type BoardCommittee = {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  members: CommitteeMember[];
  duties: CommitteeDuty[];
  published: boolean;
};

/** The design's duty glyphs, named as such in Figma and bundled already. */
export const DUTY_ICONS: Record<string, LucideIcon> = {
  "file-text": FileText,
  check: Check,
  "bar-chart-2": BarChart3,
  users: Users,
};

export const DUTY_ICON_NAMES = Object.keys(DUTY_ICONS);

export function dutyIcon(name: string): LucideIcon {
  return DUTY_ICONS[name] ?? FileText;
}

export const isLogo = (image: string) => image.toLowerCase().endsWith(".svg");

export function normalizeMembers(raw: unknown): CommitteeMember[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((m) => {
    const o = (m ?? {}) as Partial<CommitteeMember>;
    return {
      name_ar: String(o.name_ar ?? ""),
      name_en: String(o.name_en ?? ""),
      role_ar: String(o.role_ar ?? ""),
      role_en: String(o.role_en ?? ""),
      image: String(o.image ?? ""),
    };
  });
}

export function normalizeDuties(raw: unknown): CommitteeDuty[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((d) => {
    const o = (d ?? {}) as Partial<CommitteeDuty>;
    return {
      text_ar: String(o.text_ar ?? ""),
      text_en: String(o.text_en ?? ""),
      icon: String(o.icon ?? "file-text"),
    };
  });
}
