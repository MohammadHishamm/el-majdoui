import { Briefcase, Building2, Landmark, Users, type LucideIcon } from "lucide-react";

/**
 * Shared shape for الهيكل التنظيمي والمستويات الإدارية, used by the public page
 * and the admin form so both agree on the icon set and the people shape.
 */

export type OrgPerson = {
  name_ar: string;
  name_en: string;
  /** Unused for `members` (the plain chips) — kept so one editor covers both. */
  role_ar: string;
  role_en: string;
};

export type OrgLevel = {
  id: string;
  level_no: number;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  description_ar: string;
  description_en: string;
  icon: string;
  bg_color: string;
  leaders: OrgPerson[];
  members_label_ar: string;
  members_label_en: string;
  members: OrgPerson[];
  published: boolean;
};

/**
 * The design's four glyphs, all of which turned out to be lucide icons the app
 * already bundles — so levels reference them by name instead of storing image
 * files. Adding an option here makes it selectable in the admin.
 */
export const ORG_ICONS: Record<string, LucideIcon> = {
  landmark: Landmark,
  users: Users,
  briefcase: Briefcase,
  "building-2": Building2,
};

export const ORG_ICON_NAMES = Object.keys(ORG_ICONS);

/** Falls back rather than rendering nothing if a row holds an unknown name. */
export function orgIcon(name: string): LucideIcon {
  return ORG_ICONS[name] ?? Landmark;
}

/** The four tile colours from the design; offered as presets in the admin. */
export const ORG_COLOR_PRESETS = ["#005761", "#00B5C2", "#80A5E0", "#0A1F2D"];

const empty = (): OrgPerson => ({ name_ar: "", name_en: "", role_ar: "", role_en: "" });

/** Tolerates rows written before a field existed, or hand-edited jsonb. */
export function normalizePeople(raw: unknown): OrgPerson[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p) => {
    const o = (p ?? {}) as Partial<OrgPerson>;
    return {
      ...empty(),
      ...o,
      name_ar: String(o.name_ar ?? ""),
      name_en: String(o.name_en ?? ""),
      role_ar: String(o.role_ar ?? ""),
      role_en: String(o.role_en ?? ""),
    };
  });
}
