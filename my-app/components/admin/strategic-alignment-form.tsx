"use client";

import { useState } from "react";
import { Box, Txt, Area, AddBtn, DelBtn, SubmitButton } from "@/components/admin/pages/kit";
import { InlineUpload } from "@/components/admin/inline-upload";
import { useL } from "@/components/admin/i18n";

type Bi = { ar: string; en: string };
type Tab = { label: Bi; left: string; right: string };
type Content = {
  background?: string;
  heading?: Bi;
  subheading?: Bi;
  tabs?: Tab[];
};

const emptyBi = (): Bi => ({ ar: "", en: "" });

export function StrategicAlignmentForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (f: FormData) => void;
  defaults: Content;
  submitLabel: string;
}) {
  const l = useL();
  const [c, setC] = useState<Content>(defaults ?? {});
  const heading = c.heading ?? emptyBi();
  const subheading = c.subheading ?? emptyBi();
  const tabs: Tab[] = Array.isArray(c.tabs) ? c.tabs : [];

  const set = (patch: Partial<Content>) => setC((p) => ({ ...p, ...patch }));
  const editTabs = (fn: (x: Tab[]) => void) => {
    const n = structuredClone(tabs);
    fn(n);
    set({ tabs: n });
  };

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title={l("Section background & heading", "خلفية القسم وعنوانه")}>
        <InlineUpload
          value={c.background ?? ""}
          onChange={(u) => set({ background: u })}
          folder="strategic-alignment"
          label={l("Background image", "صورة الخلفية")}
          recommendedSize="1920 × 1080 px (16:9)"
          hint={l(
            "Full-width photo behind the whole section. Use a dark-ish image so the white title stays readable.",
            "صورة بعرض كامل خلف القسم بأكمله. استخدم صورة داكنة ليبقى العنوان الأبيض مقروءاً."
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Txt label={l("Heading (AR)", "العنوان (عربي)")} value={heading.ar} onChange={(v) => set({ heading: { ...heading, ar: v } })} />
          <Txt label={l("Heading (EN)", "العنوان (إنجليزي)")} value={heading.en} onChange={(v) => set({ heading: { ...heading, en: v } })} dir="ltr" />
        </div>
        <Area label={l("Subheading (AR)", "العنوان الفرعي (عربي)")} value={subheading.ar} onChange={(v) => set({ subheading: { ...subheading, ar: v } })} rows={2} />
        <Area label={l("Subheading (EN)", "العنوان الفرعي (إنجليزي)")} value={subheading.en} onChange={(v) => set({ subheading: { ...subheading, en: v } })} rows={2} dir="ltr" />
      </Box>

      <Box title={l("Tabs", "التبويبات")}>
        <p className="text-xs text-muted-foreground">
          {l(
            "Each tab has a label and two images shown side by side (right & left of the card). Add as many as you like — the public tab bar scrolls horizontally when they overflow.",
            "لكل تبويب تسمية وصورتان تُعرضان جنباً إلى جنب (يمين ويسار البطاقة). أضف ما تشاء — شريط التبويبات في الموقع يتمرر أفقياً عند الازدحام."
          )}
        </p>
        <p className="rounded-md bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
          ↕ <span className="font-medium text-foreground/80">{l("Order matters:", "الترتيب مهم:")}</span>{" "}
          {l(
            "tabs appear in this exact order — Tab #1 is the first/active one on the site. Use the ↑ / ↓ buttons to move a tab earlier or later.",
            "تظهر التبويبات بهذا الترتيب — التبويب #1 هو الأول/النشط في الموقع. استخدم زرّي ↑ / ↓ لتقديم تبويب أو تأخيره."
          )}
        </p>
        {tabs.map((tb, i) => (
          <div key={i} className="rounded-lg border bg-muted/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">{l("Tab", "تبويب")} #{i + 1}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => editTabs((x) => { [x[i - 1], x[i]] = [x[i], x[i - 1]]; })}
                  className="rounded border px-2 py-1 text-xs disabled:opacity-40"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={i === tabs.length - 1}
                  onClick={() => editTabs((x) => { [x[i + 1], x[i]] = [x[i], x[i + 1]]; })}
                  className="rounded border px-2 py-1 text-xs disabled:opacity-40"
                  aria-label="Move down"
                >
                  ↓
                </button>
                <DelBtn onClick={() => editTabs((x) => x.splice(i, 1))} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Txt label={l("Label (AR)", "التسمية (عربي)")} value={tb.label?.ar ?? ""} onChange={(v) => editTabs((x) => { x[i].label = { ...(x[i].label ?? emptyBi()), ar: v }; })} />
              <Txt label={l("Label (EN)", "التسمية (إنجليزي)")} value={tb.label?.en ?? ""} onChange={(v) => editTabs((x) => { x[i].label = { ...(x[i].label ?? emptyBi()), en: v }; })} dir="ltr" />
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="mb-1 block text-[11px] text-muted-foreground">{l("Right image (SDG side)", "الصورة اليمنى (جهة أهداف التنمية)")}</span>
                <InlineUpload
                  value={tb.right ?? ""}
                  onChange={(u) => editTabs((x) => { x[i].right = u; })}
                  folder="strategic-alignment"
                  label={l("Right image", "الصورة اليمنى")}
                  recommendedSize="966 × 542 px (16:9)"
                  hint={l("Shown on the right half of the white card (e.g. the SDG goals panel).", "تظهر في النصف الأيمن من البطاقة البيضاء (مثل لوحة أهداف التنمية المستدامة).")}
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] text-muted-foreground">{l("Left image (Vision side)", "الصورة اليسرى (جهة رؤية 2030)")}</span>
                <InlineUpload
                  value={tb.left ?? ""}
                  onChange={(u) => editTabs((x) => { x[i].left = u; })}
                  folder="strategic-alignment"
                  label={l("Left image", "الصورة اليسرى")}
                  recommendedSize="966 × 542 px (16:9)"
                  hint={l("Shown on the left half of the white card (e.g. the Vision 2030 panel).", "تظهر في النصف الأيسر من البطاقة البيضاء (مثل لوحة رؤية 2030).")}
                />
              </div>
            </div>
          </div>
        ))}
        <AddBtn onClick={() => set({ tabs: [...tabs, { label: emptyBi(), left: "", right: "" }] })}>{l("Add tab", "إضافة تبويب")}</AddBtn>
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
