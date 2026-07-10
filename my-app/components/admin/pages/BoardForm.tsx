"use client";

import { useState } from "react";
import { Box, Txt, Area, SubmitButton } from "@/components/admin/pages/kit";
import { InlineUpload } from "@/components/admin/inline-upload";
import { useL } from "@/components/admin/i18n";

type Content = Record<string, unknown>;

export function BoardForm({ action, defaults, submitLabel }: { action: (f: FormData) => void; defaults: Content; submitLabel: string }) {
  const l = useL();
  const [c, setC] = useState<Content>(defaults ?? {});
  const set = (k: string, v: unknown) => setC((p) => ({ ...p, [k]: v }));
  const str = (k: string) => (c[k] as string) ?? "";

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="content" value={JSON.stringify(c)} />

      <Box title={l("Chairman of the Board of Trustees", "رئيس مجلس الأمناء")}>
        <Txt label={l("Eyebrow", "السطر التمهيدي")} value={str("eyebrow")} onChange={(v) => set("eyebrow", v)} />
        <Txt label={l("Name", "الاسم")} value={str("name")} onChange={(v) => set("name", v)} />
        <Txt label={l("Position", "المنصب")} value={str("position")} onChange={(v) => set("position", v)} />
        <Area label={l("Quote", "الاقتباس")} value={str("quote")} onChange={(v) => set("quote", v)} rows={3} />
        <InlineUpload value={str("photo")} onChange={(u) => set("photo", u)} folder="board" label={l("Portrait photo", "الصورة الشخصية")} recommendedSize="650 × 812 px (4:5 portrait)" hint={l("Head-and-shoulders portrait; the top-right corner is rounded on the site.", "صورة شخصية للرأس والكتفين؛ تُعرض بزاوية علوية يمنى دائرية في الموقع.")} />
      </Box>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
