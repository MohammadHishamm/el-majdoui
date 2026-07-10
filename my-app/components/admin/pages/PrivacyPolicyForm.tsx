"use client";

import { useState } from "react";
import { Box, Txt, Area, AddBtn, DelBtn, SubmitButton } from "@/components/admin/pages/kit";
import { useL } from "@/components/admin/i18n";

type Bi = { ar: string; en: string };
type Section = { title: Bi; body: Bi; bullets: { ar: string[]; en: string[] } };
type Content = Record<string, unknown> & { sections?: Section[] };

const emptyBi = (): Bi => ({ ar: "", en: "" });

// Legacy content stored plain Arabic strings / string[] bullets — lift them into {ar,en}.
function toBi(v: unknown): Bi {
  if (v && typeof v === "object") {
    const o = v as Partial<Bi>;
    return { ar: o.ar ?? "", en: o.en ?? "" };
  }
  return { ar: typeof v === "string" ? v : "", en: "" };
}

function toSection(v: unknown): Section {
  const o = (v ?? {}) as Record<string, unknown>;
  const bullets = o.bullets;
  let biBullets: { ar: string[]; en: string[] };
  if (Array.isArray(bullets)) biBullets = { ar: bullets.filter((b): b is string => typeof b === "string"), en: [] };
  else {
    const b = (bullets ?? {}) as { ar?: string[]; en?: string[] };
    biBullets = { ar: b.ar ?? [], en: b.en ?? [] };
  }
  return { title: toBi(o.title), body: toBi(o.body), bullets: biBullets };
}

export function PrivacyPolicyForm({ action, defaults, submitLabel }: { action: (f: FormData) => void; defaults: Content; submitLabel: string }) {
  const l = useL();
  const [c, setC] = useState<Content>(() => {
    const d = { ...(defaults ?? {}) };
    for (const k of ["updated", "title", "intro", "callout_title", "callout_desc", "callout_button", "org_name", "org_desc"]) d[k] = toBi(d[k]);
    d.sections = (Array.isArray(d.sections) ? d.sections : []).map(toSection);
    return d;
  });
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const bi = (k: string): Bi => toBi(c[k]);
  const setBi = (k: string, lang: "ar" | "en", v: string) => set(k, { ...bi(k), [lang]: v });
  const sections: Section[] = Array.isArray(c.sections) ? (c.sections as Section[]) : [];
  const editS = (fn: (x: Section[]) => void) => { const n = structuredClone(sections); fn(n); set("sections", n); };

  // Plain helper functions (NOT components) so inputs keep identity/focus across renders.
  const biTxt = (k: string, label: string) => (
    <div className="grid gap-3 sm:grid-cols-2">
      <Txt label={`${label} ${l("(AR)", "(عربي)")}`} value={bi(k).ar} onChange={(v) => setBi(k, "ar", v)} />
      <Txt label={`${label} ${l("(EN)", "(إنجليزي)")}`} value={bi(k).en} onChange={(v) => setBi(k, "en", v)} dir="ltr" />
    </div>
  );
  const biArea = (k: string, label: string, rows = 3) => (
    <div className="grid gap-3 sm:grid-cols-2">
      <Area label={`${label} ${l("(AR)", "(عربي)")}`} value={bi(k).ar} onChange={(v) => setBi(k, "ar", v)} rows={rows} />
      <Area label={`${label} ${l("(EN)", "(إنجليزي)")}`} value={bi(k).en} onChange={(v) => setBi(k, "en", v)} rows={rows} dir="ltr" />
    </div>
  );

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title={l("Page head", "رأس الصفحة")}>
        {biTxt("updated", l("Last updated", "آخر تحديث"))}
        {biTxt("title", l("Title", "العنوان"))}
        {biArea("intro", l("Intro", "المقدمة"))}
      </Box>

      <Box title={l("Policy sections", "أقسام السياسة")}>
        <div className="flex flex-col gap-3">
          {sections.map((sec, i) => (
            <div key={i} className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                <DelBtn onClick={() => editS((x) => x.splice(i, 1))} />
              </div>
              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Txt label={l("Section title (AR)", "عنوان القسم (عربي)")} value={sec.title.ar} onChange={(v) => editS((x) => { x[i].title.ar = v; })} hint={l("Auto-numbered on the page; also shown in the “Page contents” list.", "يُرقّم تلقائياً في الصفحة ويظهر في قائمة «محتويات الصفحة»")} />
                  <Txt label={l("Section title (EN)", "عنوان القسم (إنجليزي)")} value={sec.title.en} onChange={(v) => editS((x) => { x[i].title.en = v; })} dir="ltr" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Area label={l("Body (AR)", "النص (عربي)")} value={sec.body.ar} onChange={(v) => editS((x) => { x[i].body.ar = v; })} rows={3} />
                  <Area label={l("Body (EN)", "النص (إنجليزي)")} value={sec.body.en} onChange={(v) => editS((x) => { x[i].body.en = v; })} rows={3} dir="ltr" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Area
                    label={l("Bullets (AR, one per line — optional)", "نقاط (عربي، سطر لكل نقطة — اختياري)")}
                    value={sec.bullets.ar.join("\n")}
                    onChange={(v) => editS((x) => { x[i].bullets.ar = v.split("\n").filter((line) => line.trim() !== ""); })}
                    rows={3}
                  />
                  <Area
                    label={l("Bullets (EN, one per line — optional)", "نقاط (إنجليزي، سطر لكل نقطة — اختياري)")}
                    value={sec.bullets.en.join("\n")}
                    onChange={(v) => editS((x) => { x[i].bullets.en = v.split("\n").filter((line) => line.trim() !== ""); })}
                    rows={3}
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          ))}
          <AddBtn onClick={() => set("sections", [...sections, { title: emptyBi(), body: emptyBi(), bullets: { ar: [], en: [] } }])}>
            {l("Add section", "إضافة قسم")}
          </AddBtn>
        </div>
      </Box>

      <Box title={l("Contact callout", "بطاقة التواصل")}>
        {biTxt("callout_title", l("Callout title", "عنوان البطاقة"))}
        {biArea("callout_desc", l("Callout description", "وصف البطاقة"), 2)}
        {biTxt("callout_button", l("Button label", "نص الزر"))}
      </Box>

      <Box title={l("Sidebar", "الشريط الجانبي")}>
        {biTxt("org_name", l("Organisation name", "اسم المؤسسة"))}
        {biArea("org_desc", l("Short description", "نبذة مختصرة"), 2)}
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
