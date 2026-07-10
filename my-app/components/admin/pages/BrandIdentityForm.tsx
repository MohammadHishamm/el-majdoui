"use client";

import { useState } from "react";
import { Box, Txt, Area, AddBtn, DelBtn, SubmitButton, inp } from "@/components/admin/pages/kit";
import { InlineUpload } from "@/components/admin/inline-upload";
import { useL } from "@/components/admin/i18n";

type LogoLink = { text: string; href: string };
type LogoCard = { image: string; label: string; variant: string; links: LogoLink[] };
type Color = { name: string; hex: string };
type Content = Record<string, unknown>;

export function BrandIdentityForm({ action, defaults, submitLabel }: { action: (f: FormData) => void; defaults: Content; submitLabel: string }) {
  const l = useL();
  const [c, setC] = useState<Content>(defaults ?? {});
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const str = (k: string) => (c[k] as string) ?? "";
  const logos: LogoCard[] = Array.isArray(c.logos) ? (c.logos as LogoCard[]) : [];
  const colors: Color[] = Array.isArray(c.colors) ? (c.colors as Color[]) : [];
  const editL = (fn: (x: LogoCard[]) => void) => { const n = structuredClone(logos); fn(n); set("logos", n); };
  const editColors = (fn: (x: Color[]) => void) => { const n = structuredClone(colors); fn(n); set("colors", n); };

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title={l("Header", "الترويسة")}>
        <Txt label={l("Eyebrow", "السطر التمهيدي")} value={str("eyebrow")} onChange={(v) => set("eyebrow", v)} />
        <Txt label={l("Title", "العنوان")} value={str("title")} onChange={(v) => set("title", v)} />
        <Area label={l("Intro", "المقدمة")} value={str("intro")} onChange={(v) => set("intro", v)} rows={2} />
      </Box>

      <Box title={l("Guide PDF banner", "شريط دليل الهوية (PDF)")}>
        <Txt label={l("PDF title", "عنوان الدليل")} value={str("pdf_title")} onChange={(v) => set("pdf_title", v)} />
        <Txt label={l("PDF subtitle", "العنوان الفرعي للدليل")} value={str("pdf_subtitle")} onChange={(v) => set("pdf_subtitle", v)} />
        <InlineUpload value={str("pdf_file")} onChange={(u) => set("pdf_file", u)} folder="brand" label={l("Guide PDF", "ملف الدليل PDF")} accept=".pdf" />
      </Box>

      <Box title={l("Official logos", "الشعارات الرسمية")}>
        <Txt label={l("Heading", "العنوان")} value={str("logos_heading")} onChange={(v) => set("logos_heading", v)} />
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
              {(card.links ?? []).map((lk, j) => (
                <div key={j} className="grid items-center gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <input className={inp} dir="rtl" placeholder="text" value={lk.text} onChange={(e) => editL((x) => { x[i].links[j].text = e.target.value; })} />
                  <input className={inp} dir="ltr" placeholder="href" value={lk.href} onChange={(e) => editL((x) => { x[i].links[j].href = e.target.value; })} />
                  <DelBtn onClick={() => editL((x) => x[i].links.splice(j, 1))} />
                </div>
              ))}
              <AddBtn onClick={() => editL((x) => { x[i].links = [...(x[i].links ?? []), { text: "", href: "" }]; })}>{l("Add link", "إضافة رابط")}</AddBtn>
            </div>
          </div>
        ))}
        <AddBtn onClick={() => set("logos", [...logos, { image: "", label: "", variant: "light", links: [] }])}>{l("Add logo card", "إضافة بطاقة شعار")}</AddBtn>
      </Box>

      <Box title={l("Approved colors", "الألوان المعتمدة")}>
        <Txt label={l("Heading", "العنوان")} value={str("colors_heading")} onChange={(v) => set("colors_heading", v)} />
        {colors.map((col, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/30 p-3">
            <span className="size-9 shrink-0 rounded border" style={{ backgroundColor: col.hex }} />
            <label className="flex flex-1 flex-col gap-1"><span className="text-[11px] text-muted-foreground">{l("Name", "الاسم")}</span>
              <input className={inp} dir="rtl" value={col.name} onChange={(e) => editColors((x) => { x[i].name = e.target.value; })} />
            </label>
            <label className="flex w-32 flex-col gap-1"><span className="text-[11px] text-muted-foreground">Hex</span>
              <input className={inp} dir="ltr" value={col.hex} onChange={(e) => editColors((x) => { x[i].hex = e.target.value; })} />
            </label>
            <DelBtn onClick={() => editColors((x) => x.splice(i, 1))} />
          </div>
        ))}
        <AddBtn onClick={() => set("colors", [...colors, { name: "", hex: "#005761" }])}>{l("Add color", "إضافة لون")}</AddBtn>
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
