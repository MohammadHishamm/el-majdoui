"use client";

import { useState } from "react";
import { Box, Txt, Area, AddBtn, DelBtn, SubmitButton } from "@/components/admin/pages/kit";
import { InlineUpload } from "@/components/admin/inline-upload";

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

      <Box title="Section background & heading">
        <InlineUpload
          value={c.background ?? ""}
          onChange={(u) => set({ background: u })}
          folder="strategic-alignment"
          label="Background image"
          recommendedSize="1920 × 1080 px (16:9)"
          hint="Full-width photo behind the whole section. Use a dark-ish image so the white title stays readable."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Txt label="Heading (AR)" value={heading.ar} onChange={(v) => set({ heading: { ...heading, ar: v } })} />
          <Txt label="Heading (EN)" value={heading.en} onChange={(v) => set({ heading: { ...heading, en: v } })} dir="ltr" />
        </div>
        <Area label="Subheading (AR)" value={subheading.ar} onChange={(v) => set({ subheading: { ...subheading, ar: v } })} rows={2} />
        <Area label="Subheading (EN)" value={subheading.en} onChange={(v) => set({ subheading: { ...subheading, en: v } })} rows={2} dir="ltr" />
      </Box>

      <Box title="Tabs">
        <p className="text-xs text-muted-foreground">
          Each tab has a label and two images shown side by side (right &amp; left of the card). Add as many as you like —
          the public tab bar scrolls horizontally when they overflow.
        </p>
        <p className="rounded-md bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
          ↕ <span className="font-medium text-foreground/80">Order matters:</span> tabs appear in this exact order — <span className="font-medium">Tab #1</span> is the first/active one on the site. Use the ↑ / ↓ buttons to move a tab earlier or later.
        </p>
        {tabs.map((tb, i) => (
          <div key={i} className="rounded-lg border bg-muted/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Tab #{i + 1}</span>
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
              <Txt label="Label (AR)" value={tb.label?.ar ?? ""} onChange={(v) => editTabs((x) => { x[i].label = { ...(x[i].label ?? emptyBi()), ar: v }; })} />
              <Txt label="Label (EN)" value={tb.label?.en ?? ""} onChange={(v) => editTabs((x) => { x[i].label = { ...(x[i].label ?? emptyBi()), en: v }; })} dir="ltr" />
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="mb-1 block text-[11px] text-muted-foreground">Right image (SDG side)</span>
                <InlineUpload
                  value={tb.right ?? ""}
                  onChange={(u) => editTabs((x) => { x[i].right = u; })}
                  folder="strategic-alignment"
                  label="Right image"
                  recommendedSize="966 × 542 px (16:9)"
                  hint="Shown on the right half of the white card (e.g. the SDG goals panel)."
                />
              </div>
              <div>
                <span className="mb-1 block text-[11px] text-muted-foreground">Left image (Vision side)</span>
                <InlineUpload
                  value={tb.left ?? ""}
                  onChange={(u) => editTabs((x) => { x[i].left = u; })}
                  folder="strategic-alignment"
                  label="Left image"
                  recommendedSize="966 × 542 px (16:9)"
                  hint="Shown on the left half of the white card (e.g. the Vision 2030 panel)."
                />
              </div>
            </div>
          </div>
        ))}
        <AddBtn onClick={() => set({ tabs: [...tabs, { label: emptyBi(), left: "", right: "" }] })}>Add tab</AddBtn>
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
