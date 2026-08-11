"use client";

import { TextField, TextArea, SubmitButton } from "@/components/admin/fields";
import { useL } from "@/components/admin/i18n";

type Content = Record<string, unknown>;

/** Heading + intro paragraph above the mosque map on /focus-areas/mosques. */
export function MosquesMapContentForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (f: FormData) => void;
  defaults: Content;
  submitLabel: string;
}) {
  const l = useL();
  const str = (k: string) => (defaults?.[k] as string) ?? "";

  return (
    <form action={action} className="grid gap-4">
      <TextField
        name="heading_ar"
        label={l("Section heading (AR)", "عنوان القسم (عربي)")}
        defaultValue={str("heading_ar")}
        dir="rtl"
        required
      />
      <TextArea
        name="intro_ar"
        label={l("Section intro (AR)", "نص القسم (عربي)")}
        defaultValue={str("intro_ar")}
        dir="rtl"
        rows={3}
      />
      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
