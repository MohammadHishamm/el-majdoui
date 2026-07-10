"use client";

import { useState } from "react";
import { Box, Txt, Area, AddBtn, DelBtn, SubmitButton, inp } from "@/components/admin/pages/kit";
import { InlineUpload } from "@/components/admin/inline-upload";
import { useL } from "@/components/admin/i18n";

type Info = { label: string; value: string; icon?: string };
type Advantage = { title: string; description: string; icon: string };
type Content = Record<string, unknown>;

export function WhoWeAreForm({ action, defaults, submitLabel }: { action: (f: FormData) => void; defaults: Content; submitLabel: string }) {
  const l = useL();
  const [c, setC] = useState<Content>(defaults ?? {});
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const str = (k: string) => (c[k] as string) ?? "";
  const paragraphs: string[] = Array.isArray(c.paragraphs) ? (c.paragraphs as string[]) : [];
  const info: Info[] = Array.isArray(c.info) ? (c.info as Info[]) : [];
  const advantages: Advantage[] = Array.isArray(c.advantages) ? (c.advantages as Advantage[]) : [];
  const editP = (fn: (x: string[]) => void) => { const n = [...paragraphs]; fn(n); set("paragraphs", n); };
  const editI = (fn: (x: Info[]) => void) => { const n = structuredClone(info); fn(n); set("info", n); };
  const editA = (fn: (x: Advantage[]) => void) => { const n = structuredClone(advantages); fn(n); set("advantages", n); };

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title={l("Hero", "الترويسة")}>
        <InlineUpload value={str("hero_image")} onChange={(u) => set("hero_image", u)} folder="pages" label={l("Hero image", "صورة الترويسة")} />
        <Txt label={l("Title", "العنوان")} value={str("title")} onChange={(v) => set("title", v)} />
        <Txt label={l("Subtitle", "العنوان الفرعي")} value={str("subtitle")} onChange={(v) => set("subtitle", v)} />
      </Box>

      <Box title={l("Intro paragraphs", "فقرات المقدمة")}>
        {paragraphs.map((p, i) => (
          <div key={i} className="flex items-start gap-2">
            <textarea className={`${inp} resize-y`} dir="rtl" rows={3} value={p} onChange={(e) => editP((x) => { x[i] = e.target.value; })} />
            <DelBtn onClick={() => editP((x) => x.splice(i, 1))} />
          </div>
        ))}
        <AddBtn onClick={() => set("paragraphs", [...paragraphs, ""])}>{l("Add paragraph", "إضافة فقرة")}</AddBtn>
      </Box>

      <Box title={l("Info card rows", "صفوف بطاقة المعلومات")}>
        {info.map((row, i) => (
          <div key={i} className="rounded-lg border bg-muted/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
              <DelBtn onClick={() => editI((x) => x.splice(i, 1))} />
            </div>
            <Txt label={l("Label", "التسمية")} value={row.label} onChange={(v) => editI((x) => { x[i].label = v; })} />
            <Txt label={l("Value", "القيمة")} value={row.value} onChange={(v) => editI((x) => { x[i].value = v; })} />
            <div className="mt-2"><InlineUpload value={row.icon ?? ""} onChange={(u) => editI((x) => { x[i].icon = u; })} folder="pages" label={l("Icon (optional)", "الأيقونة (اختياري)")} /></div>
          </div>
        ))}
        <AddBtn onClick={() => set("info", [...info, { label: "", value: "", icon: "" }])}>{l("Add row", "إضافة صف")}</AddBtn>
      </Box>

      <Box title={l("Competitive advantages", "المزايا التنافسية")}>
        <Txt label={l("Heading", "العنوان")} value={str("advantages_heading")} onChange={(v) => set("advantages_heading", v)} />
        {advantages.map((a, i) => (
          <div key={i} className="rounded-lg border bg-muted/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
              <DelBtn onClick={() => editA((x) => x.splice(i, 1))} />
            </div>
            <Txt label={l("Title", "العنوان")} value={a.title} onChange={(v) => editA((x) => { x[i].title = v; })} />
            <Area label={l("Description", "الوصف")} value={a.description} onChange={(v) => editA((x) => { x[i].description = v; })} rows={2} />
            <div className="mt-2"><InlineUpload value={a.icon} onChange={(u) => editA((x) => { x[i].icon = u; })} folder="pages" label={l("Icon", "الأيقونة")} /></div>
          </div>
        ))}
        <AddBtn onClick={() => set("advantages", [...advantages, { title: "", description: "", icon: "" }])}>{l("Add advantage", "إضافة ميزة")}</AddBtn>
      </Box>

      <Box title={l("Quote banner", "شريط الاقتباس")}>
        <Area label={l("Quote", "الاقتباس")} value={str("quote")} onChange={(v) => set("quote", v)} rows={2} />
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
