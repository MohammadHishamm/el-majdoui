"use client";

import { useState } from "react";
import { Box, Txt, Area, AddBtn, DelBtn, SubmitButton } from "@/components/admin/pages/kit";
import { InlineUpload } from "@/components/admin/inline-upload";

type Value = { title: string; description: string; icon: string };
type Content = Record<string, unknown> & { values?: Value[] };

export function VisionMissionForm({ action, defaults, submitLabel }: { action: (f: FormData) => void; defaults: Content; submitLabel: string }) {
  const [c, setC] = useState<Content>(defaults ?? {});
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const str = (k: string) => (c[k] as string) ?? "";
  const values: Value[] = Array.isArray(c.values) ? (c.values as Value[]) : [];
  const editV = (fn: (x: Value[]) => void) => { const n = structuredClone(values); fn(n); set("values", n); };

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title="Hero & headings">
        <InlineUpload value={str("hero_image")} onChange={(u) => set("hero_image", u)} folder="pages" label="Hero image" />
        <Txt label="Title" value={str("title")} onChange={(v) => set("title", v)} />
      </Box>

      <Box title="Vision & Mission">
        <div className="grid gap-3 sm:grid-cols-2">
          <Txt label="Vision heading" value={str("vision_heading")} onChange={(v) => set("vision_heading", v)} />
          <Txt label="Mission heading" value={str("mission_heading")} onChange={(v) => set("mission_heading", v)} />
        </div>
        <Area label="Vision text" value={str("vision_text")} onChange={(v) => set("vision_text", v)} />
        <Area label="Mission text" value={str("mission_text")} onChange={(v) => set("mission_text", v)} />
        <InlineUpload value={str("vision_image")} onChange={(u) => set("vision_image", u)} folder="pages" label="Vision image" />
      </Box>

      <Box title="Institutional values">
        <InlineUpload value={str("values_bg_image")} onChange={(u) => set("values_bg_image", u)} folder="pages" label="Values background image" />
        <Txt label="Values heading" value={str("values_heading")} onChange={(v) => set("values_heading", v)} />
        <div className="flex flex-col gap-3">
          {values.map((v, i) => (
            <div key={i} className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                <DelBtn onClick={() => editV((x) => x.splice(i, 1))} />
              </div>
              <Txt label="Title" value={v.title} onChange={(val) => editV((x) => { x[i].title = val; })} />
              <Area label="Description" value={v.description} onChange={(val) => editV((x) => { x[i].description = val; })} rows={2} />
              <div className="mt-2"><InlineUpload value={v.icon} onChange={(u) => editV((x) => { x[i].icon = u; })} folder="pages" label="Icon" /></div>
            </div>
          ))}
          <AddBtn onClick={() => set("values", [...values, { title: "", description: "", icon: "" }])}>Add value</AddBtn>
        </div>
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
