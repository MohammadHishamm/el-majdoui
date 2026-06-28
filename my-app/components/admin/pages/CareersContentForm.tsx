"use client";

import { useState } from "react";
import { Box, Txt, Area, AddBtn, DelBtn, SubmitButton, inp } from "@/components/admin/pages/kit";
import { InlineUpload } from "@/components/admin/inline-upload";

type Reason = { title: string; desc: string; image: string; color: string };
type Content = Record<string, unknown>;

export function CareersContentForm({ action, defaults, submitLabel }: { action: (f: FormData) => void; defaults: Content; submitLabel: string }) {
  const [c, setC] = useState<Content>(defaults ?? {});
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const str = (k: string) => (c[k] as string) ?? "";
  const reasons: Reason[] = Array.isArray(c.reasons) ? (c.reasons as Reason[]) : [];
  const editR = (fn: (x: Reason[]) => void) => { const n = structuredClone(reasons); fn(n); set("reasons", n); };

  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title="رأس الصفحة">
        <Txt label="Intro title" value={str("intro_title")} onChange={(v) => set("intro_title", v)} />
        <Area label="Intro body" value={str("intro_body")} onChange={(v) => set("intro_body", v)} rows={3} />
      </Box>

      <Box title="لماذا تعمل معنا؟">
        <Txt label="Heading" value={str("reasons_heading")} onChange={(v) => set("reasons_heading", v)} />
        {reasons.map((r, i) => (
          <div key={i} className="rounded-lg border bg-muted/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
              <DelBtn onClick={() => editR((x) => x.splice(i, 1))} />
            </div>
            <Txt label="Title" value={r.title} onChange={(v) => editR((x) => { x[i].title = v; })} />
            <Area label="Description" value={r.desc} onChange={(v) => editR((x) => { x[i].desc = v; })} rows={2} />
            <div className="mt-2 flex items-end gap-3">
              <span className="size-9 shrink-0 rounded border" style={{ backgroundColor: r.color }} />
              <label className="flex w-40 flex-col gap-1"><span className="text-[11px] text-muted-foreground">Color (hex)</span>
                <input className={inp} dir="ltr" value={r.color} onChange={(e) => editR((x) => { x[i].color = e.target.value; })} />
              </label>
            </div>
            <div className="mt-2"><InlineUpload value={r.image} onChange={(u) => editR((x) => { x[i].image = u; })} folder="careers" label="Card image" /></div>
          </div>
        ))}
        <AddBtn onClick={() => set("reasons", [...reasons, { title: "", desc: "", image: "", color: "#005761" }])}>Add card</AddBtn>
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
