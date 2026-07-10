"use client";

import { useState } from "react";
import { Box, Txt, Area, AddBtn, DelBtn, SubmitButton } from "@/components/admin/pages/kit";

type Section = { title: string; body: string; bullets: string[] };
type Content = Record<string, unknown> & { sections?: Section[] };

export function PrivacyPolicyForm({ action, defaults, submitLabel }: { action: (f: FormData) => void; defaults: Content; submitLabel: string }) {
  const [c, setC] = useState<Content>(defaults ?? {});
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const str = (k: string) => (c[k] as string) ?? "";
  const sections: Section[] = Array.isArray(c.sections) ? (c.sections as Section[]) : [];
  const editS = (fn: (x: Section[]) => void) => { const n = structuredClone(sections); fn(n); set("sections", n); };

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title="Page head">
        <Txt label="Last updated" value={str("updated")} onChange={(v) => set("updated", v)} hint="مثال: آخر تحديث: يوليو 2026" />
        <Txt label="Title" value={str("title")} onChange={(v) => set("title", v)} />
        <Area label="Intro" value={str("intro")} onChange={(v) => set("intro", v)} rows={3} />
      </Box>

      <Box title="Policy sections">
        <div className="flex flex-col gap-3">
          {sections.map((sec, i) => (
            <div key={i} className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                <DelBtn onClick={() => editS((x) => x.splice(i, 1))} />
              </div>
              <Txt label="Section title" value={sec.title} onChange={(v) => editS((x) => { x[i].title = v; })} hint="يُرقّم تلقائياً في الصفحة ويظهر في قائمة «محتويات الصفحة»" />
              <Area label="Body" value={sec.body} onChange={(v) => editS((x) => { x[i].body = v; })} rows={3} />
              <Area
                label="Bullets (one per line — optional)"
                value={(sec.bullets ?? []).join("\n")}
                onChange={(v) => editS((x) => { x[i].bullets = v.split("\n").filter((l) => l.trim() !== ""); })}
                rows={3}
              />
            </div>
          ))}
          <AddBtn onClick={() => set("sections", [...sections, { title: "", body: "", bullets: [] }])}>Add section</AddBtn>
        </div>
      </Box>

      <Box title="Contact callout">
        <Txt label="Callout title" value={str("callout_title")} onChange={(v) => set("callout_title", v)} />
        <Area label="Callout description" value={str("callout_desc")} onChange={(v) => set("callout_desc", v)} rows={2} />
        <Txt label="Button label" value={str("callout_button")} onChange={(v) => set("callout_button", v)} />
      </Box>

      <Box title="Sidebar">
        <Txt label="Organisation name" value={str("org_name")} onChange={(v) => set("org_name", v)} />
        <Area label="Short description" value={str("org_desc")} onChange={(v) => set("org_desc", v)} rows={2} />
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
