"use client";

import { useState } from "react";
import { Box, Txt, Area, AddBtn, DelBtn, SubmitButton, inp } from "@/components/admin/pages/kit";

type Perspective = { id?: string; title: string; description: string; bg: string; objectives: string[]; invertedNumberBadge?: boolean };
type Content = Record<string, unknown>;

export function StrategyForm({ action, defaults, submitLabel }: { action: (f: FormData) => void; defaults: Content; submitLabel: string }) {
  const [c, setC] = useState<Content>(defaults ?? {});
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const str = (k: string) => (c[k] as string) ?? "";
  const persp: Perspective[] = Array.isArray(c.perspectives) ? (c.perspectives as Perspective[]) : [];
  const editX = (fn: (x: Perspective[]) => void) => { const n = structuredClone(persp); fn(n); set("perspectives", n); };

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title="Header">
        <Txt label="Eyebrow" value={str("eyebrow")} onChange={(v) => set("eyebrow", v)} />
        <Txt label="Title" value={str("title")} onChange={(v) => set("title", v)} />
        <Area label="Intro" value={str("intro")} onChange={(v) => set("intro", v)} rows={3} />
      </Box>

      <Box title="BSC perspectives (4 cards)">
        {persp.map((p, i) => (
          <div key={i} className="rounded-lg border bg-muted/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
              <DelBtn onClick={() => editX((x) => x.splice(i, 1))} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Txt label="Title" value={p.title} onChange={(v) => editX((x) => { x[i].title = v; })} />
              <Txt label="Background color" value={p.bg} onChange={(v) => editX((x) => { x[i].bg = v; })} dir="ltr" />
            </div>
            <Area label="Description" value={p.description} onChange={(v) => editX((x) => { x[i].description = v; })} rows={2} />
            <div className="mt-2 flex flex-col gap-2 border-s-2 ps-3">
              <span className="text-[11px] text-muted-foreground">Objectives</span>
              {(p.objectives ?? []).map((o, j) => (
                <div key={j} className="flex items-center gap-2">
                  <input className={inp} dir="rtl" value={o} onChange={(e) => editX((x) => { x[i].objectives[j] = e.target.value; })} />
                  <DelBtn onClick={() => editX((x) => x[i].objectives.splice(j, 1))} />
                </div>
              ))}
              <AddBtn onClick={() => editX((x) => { x[i].objectives = [...(x[i].objectives ?? []), ""]; })}>Add objective</AddBtn>
            </div>
          </div>
        ))}
        <AddBtn onClick={() => set("perspectives", [...persp, { title: "", description: "", bg: "#005761", objectives: [] }])}>Add perspective</AddBtn>
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
