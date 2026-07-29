"use client";

import { useState } from "react";
import { Box, Txt, Area, AddBtn, DelBtn, SubmitButton, inp } from "@/components/admin/pages/kit";
import { InlineUpload } from "@/components/admin/inline-upload";
import { useL } from "@/components/admin/i18n";

type LogoLink = { text: string; href: string };
type LogoCard = { image: string; label: string; variant: string; links: LogoLink[] };
type Color = { name: string; hex: string };
type Content = Record<string, unknown>;

/** Keys of the مؤسسة tab are unprefixed; the مساجد tab mirrors them under `mosques_`. */
type Prefix = "" | "mosques_";

export function BrandIdentityForm({ action, defaults, submitLabel }: { action: (f: FormData) => void; defaults: Content; submitLabel: string }) {
  const l = useL();
  const [c, setC] = useState<Content>(defaults ?? {});
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const str = (k: string) => (c[k] as string) ?? "";
  const arr = <T,>(k: string): T[] => (Array.isArray(c[k]) ? (c[k] as T[]) : []);
  const edit = <T,>(k: string, fn: (x: T[]) => void) => { const n = structuredClone(arr<T>(k)); fn(n); set(k, n); };

  /* Rendered as plain function calls, not JSX elements — a nested component type
     would be a fresh identity every render and blow away input focus on each keystroke. */
  const logosBox = (p: Prefix, title: string) => {
    const key = `${p}logos`;
    const logos = arr<LogoCard>(key);
    const editL = (fn: (x: LogoCard[]) => void) => edit<LogoCard>(key, fn);
    return (
      <Box title={title}>
        <Txt label={l("Heading", "العنوان")} value={str(`${p}logos_heading`)} onChange={(v) => set(`${p}logos_heading`, v)} />
        {logos.map((card, i) => (
          <div key={i} className="rounded-lg border bg-muted/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
              <DelBtn onClick={() => editL((x) => x.splice(i, 1))} />
            </div>
            <Txt label={l("Label", "التسمية")} value={card.label} onChange={(v) => editL((x) => { x[i].label = v; })} />
            <label className="mt-2 flex flex-col gap-1">
              <span className="text-[11px] text-muted-foreground">{l("Variant", "النسخة")}</span>
              <select className={inp} value={card.variant} onChange={(e) => editL((x) => { x[i].variant = e.target.value; })}>
                <option value="light">light (الخلفيات الفاتحة)</option>
                <option value="dark">dark (الخلفيات الداكنة)</option>
              </select>
            </label>
            <div className="mt-2"><InlineUpload value={card.image} onChange={(u) => editL((x) => { x[i].image = u; })} folder="brand" label={l("Logo image", "صورة الشعار")} /></div>
            <div className="mt-2 flex flex-col gap-2 border-s-2 ps-3">
              <span className="text-[11px] text-muted-foreground">{l("Download links", "روابط التحميل")}</span>
              {/* A link with no href is hidden on the public page — so an SVG slot can
                  sit here empty until the vector file is uploaded. */}
              {(card.links ?? []).map((lk, j) => (
                <div key={j} className="grid items-center gap-2 sm:grid-cols-[1fr_auto_auto]">
                  <input className={inp} dir="rtl" placeholder="text" value={lk.text} onChange={(e) => editL((x) => { x[i].links[j].text = e.target.value; })} />
                  <InlineUpload
                    value={lk.href}
                    onChange={(u) => editL((x) => { x[i].links[j].href = u; })}
                    folder="brand"
                    accept=".svg,.png,.jpg,.jpeg,.webp,.pdf"
                    label={l("Download file", "ملف التحميل")}
                  />
                  <DelBtn onClick={() => editL((x) => x[i].links.splice(j, 1))} />
                </div>
              ))}
              <AddBtn onClick={() => editL((x) => { x[i].links = [...(x[i].links ?? []), { text: "", href: "" }]; })}>{l("Add link", "إضافة رابط")}</AddBtn>
            </div>
          </div>
        ))}
        <AddBtn onClick={() => set(key, [...logos, { image: "", label: "", variant: "light", links: [] }])}>{l("Add logo card", "إضافة بطاقة شعار")}</AddBtn>
      </Box>
    );
  };

  const colorsBox = (p: Prefix, title: string, seed: string) => {
    const key = `${p}colors`;
    const colors = arr<Color>(key);
    const editC = (fn: (x: Color[]) => void) => edit<Color>(key, fn);
    return (
      <Box title={title}>
        <Txt label={l("Heading", "العنوان")} value={str(`${p}colors_heading`)} onChange={(v) => set(`${p}colors_heading`, v)} />
        {colors.map((col, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/30 p-3">
            <span className="size-9 shrink-0 rounded border" style={{ backgroundColor: col.hex }} />
            <label className="flex flex-1 flex-col gap-1"><span className="text-[11px] text-muted-foreground">{l("Name", "الاسم")}</span>
              <input className={inp} dir="rtl" value={col.name} onChange={(e) => editC((x) => { x[i].name = e.target.value; })} />
            </label>
            <label className="flex w-32 flex-col gap-1"><span className="text-[11px] text-muted-foreground">Hex</span>
              <input className={inp} dir="ltr" value={col.hex} onChange={(e) => editC((x) => { x[i].hex = e.target.value; })} />
            </label>
            <DelBtn onClick={() => editC((x) => x.splice(i, 1))} />
          </div>
        ))}
        <AddBtn onClick={() => set(key, [...colors, { name: "", hex: seed }])}>{l("Add color", "إضافة لون")}</AddBtn>
      </Box>
    );
  };

  const pdfBox = (p: Prefix, title: string) => (
    <Box title={title}>
      <Txt label={l("PDF title", "عنوان الدليل")} value={str(`${p}pdf_title`)} onChange={(v) => set(`${p}pdf_title`, v)} />
      <Txt label={l("PDF subtitle", "العنوان الفرعي للدليل")} value={str(`${p}pdf_subtitle`)} onChange={(v) => set(`${p}pdf_subtitle`, v)} />
      <InlineUpload value={str(`${p}pdf_file`)} onChange={(u) => set(`${p}pdf_file`, u)} folder="brand" label={l("Guide PDF", "ملف الدليل PDF")} accept=".pdf" />
    </Box>
  );

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title={l("Header", "الترويسة")}>
        <Txt label={l("Eyebrow", "السطر التمهيدي")} value={str("eyebrow")} onChange={(v) => set("eyebrow", v)} />
        <Txt label={l("Title", "العنوان")} value={str("title")} onChange={(v) => set("title", v)} />
        <Area label={l("Intro", "المقدمة")} value={str("intro")} onChange={(v) => set("intro", v)} rows={2} />
      </Box>

      <Box title={l("Guide tabs", "تبويبات دليل الهوية")}>
        <Txt label={l("Tabs heading", "عنوان التبويبات")} value={str("tabs_heading")} onChange={(v) => set("tabs_heading", v)} />
        <Txt label={l("Tab 1 label", "اسم التبويب الأول")} value={str("tab_label")} onChange={(v) => set("tab_label", v)} />
        <Txt label={l("Tab 2 label", "اسم التبويب الثاني")} value={str("mosques_tab_label")} onChange={(v) => set("mosques_tab_label", v)} />
      </Box>

      {pdfBox("", l("Foundation — guide PDF banner", "المؤسسة — شريط دليل الهوية (PDF)"))}
      {logosBox("", l("Foundation — official logos", "المؤسسة — الشعارات الرسمية"))}
      {colorsBox("", l("Foundation — approved colors", "المؤسسة — الألوان المعتمدة"), "#005761")}

      {pdfBox("mosques_", l("Mosques — guide PDF banner", "مساجد المجدوعي — شريط دليل الهوية (PDF)"))}
      {logosBox("mosques_", l("Mosques — official logos", "مساجد المجدوعي — الشعارات الرسمية"))}
      {colorsBox("mosques_", l("Mosques — approved colors", "مساجد المجدوعي — الألوان المعتمدة"), "#883C4E")}

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
