"use client";

import { useState } from "react";
import { Box, Txt, Area, SubmitButton } from "@/components/admin/pages/kit";
import { InlineUpload } from "@/components/admin/inline-upload";

type Content = Record<string, unknown>;

export function BoardForm({ action, defaults, submitLabel }: { action: (f: FormData) => void; defaults: Content; submitLabel: string }) {
  const [c, setC] = useState<Content>(defaults ?? {});
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const str = (k: string) => (c[k] as string) ?? "";

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title="رئيس مجلس الأمناء">
        <Txt label="Eyebrow" value={str("eyebrow")} onChange={(v) => set("eyebrow", v)} />
        <Txt label="Name" value={str("name")} onChange={(v) => set("name", v)} />
        <Txt label="Position" value={str("position")} onChange={(v) => set("position", v)} />
        <Area label="Quote" value={str("quote")} onChange={(v) => set("quote", v)} rows={3} />
        <InlineUpload value={str("photo")} onChange={(u) => set("photo", u)} folder="board" label="Portrait photo" />
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
