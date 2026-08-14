"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { orgIcon, type OrgLevel, type OrgPerson } from "@/lib/site/org-levels";

/**
 * The level selector + detail panel on /about/org-structure.
 *
 * One card holds both: a row of coloured tiles across the top, and the selected
 * level's detail beneath, so switching levels swaps the lower half in place
 * rather than navigating.
 */
export function OrgStructure({ levels }: { levels: OrgLevel[] }) {
  const { locale } = useLocale();
  const ar = locale !== "en";
  const [activeNo, setActiveNo] = useState(levels[0]?.level_no ?? 1);

  if (!levels.length) return null;

  const active = levels.find((l) => l.level_no === activeNo) ?? levels[0];

  const title = (l: OrgLevel) => (ar ? l.title_ar : l.title_en || l.title_ar);
  const subtitle = (l: OrgLevel) => (ar ? l.subtitle_ar : l.subtitle_en || l.subtitle_ar);
  const personName = (p: OrgPerson) => (ar ? p.name_ar : p.name_en || p.name_ar);
  const personRole = (p: OrgPerson) => (ar ? p.role_ar : p.role_en || p.role_ar);

  const description = ar
    ? active.description_ar
    : active.description_en || active.description_ar;
  const membersLabel = ar
    ? active.members_label_ar
    : active.members_label_en || active.members_label_ar;

  /* Arabic digits for the badge, matching the numerals used elsewhere on the
     site (the mosque map's pagination does the same). */
  const num = (n: number) => (ar ? n.toLocaleString("ar-EG") : String(n));

  return (
    <div className="overflow-hidden rounded-[20px] bg-panel shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      {/* ---- Level tiles ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4" role="tablist">
        {levels.map((l) => {
          const Icon = orgIcon(l.icon);
          const isActive = l.level_no === active.level_no;
          return (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveNo(l.level_no)}
              /* Inactive tiles are dimmed rather than recoloured, which is how
                 the design distinguishes them while keeping each level's own
                 colour readable. */
              className={`flex cursor-pointer flex-col items-start p-6 text-start text-white transition-opacity ${
                isActive ? "opacity-100" : "opacity-[0.78] hover:opacity-90"
              }`}
              style={{ backgroundColor: l.bg_color }}
            >
              <span className="grid size-10 place-items-center rounded-[14px] bg-white/15 text-sm font-bold">
                {num(l.level_no)}
              </span>
              <Icon className="mt-4 size-7 shrink-0" aria-hidden />
              <span className="mt-3 text-base font-bold">{title(l)}</span>
              <span className="mt-1 text-[13px] leading-5 text-white/85">{subtitle(l)}</span>
            </button>
          );
        })}
      </div>

      {/* ---- Selected level ---- */}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3">
          <span
            className="grid size-7 shrink-0 place-items-center rounded-lg text-[12px] font-bold text-white"
            style={{ backgroundColor: active.bg_color }}
          >
            {num(active.level_no)}
          </span>
          <h2 className="text-lg font-bold text-heading">{subtitle(active)}</h2>
        </div>

        {description && (
          <p className="mt-3 text-sm leading-7 text-body-3">{description}</p>
        )}

        {active.leaders.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {active.leaders.map((p, i) => (
              <div
                key={`${p.name_ar}-${i}`}
                className="rounded-xl border border-panel-border p-4"
              >
                <p className="text-sm font-bold text-body-1 dark:text-heading">{personName(p)}</p>
                {personRole(p) && (
                  <p className="mt-1 text-[13px] text-body-3">{personRole(p)}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {active.members.length > 0 && (
          <div className="mt-6">
            {membersLabel && (
              <p className="text-[13px] font-medium text-body-1 dark:text-heading">
                {membersLabel}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-3">
              {active.members.map((p, i) => (
                <span
                  key={`${p.name_ar}-${i}`}
                  className="rounded-lg border border-panel-border px-4 py-2 text-[13px] text-body-2"
                >
                  {personName(p)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Levels 2–4 ship without detail until staff fill them in, so say so
            rather than rendering an empty panel. */}
        {!description && !active.leaders.length && !active.members.length && (
          <p className="mt-3 text-sm text-body-3">
            {ar ? "سيتم إضافة تفاصيل هذا المستوى قريباً." : "Details for this level are coming soon."}
          </p>
        )}
      </div>
    </div>
  );
}
