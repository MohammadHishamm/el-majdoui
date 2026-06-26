"use client";

import { TextField, Toggle, SubmitButton } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { useAdminT } from "@/components/admin/i18n";

export type KpiValues = {
  value?: number;
  suffix?: string;
  label_ar?: string;
  label_en?: string;
  year?: string | null;
  icon?: string | null;
  sort_order?: number;
  published?: boolean;
};

export function KpiForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: KpiValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;
  return (
    <form action={action} className="grid max-w-2xl gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="value" label={f.value} defaultValue={String(d.value ?? 0)} dir="ltr" type="number" required />
        <TextField name="suffix" label={f.suffix} defaultValue={d.suffix ?? ""} dir="ltr" placeholder="%" />
        <TextField name="label_ar" label={f.labelAr} defaultValue={d.label_ar ?? ""} dir="rtl" required />
        <TextField name="label_en" label={f.labelEn} defaultValue={d.label_en ?? ""} dir="ltr" />
        <TextField name="year" label={f.year} defaultValue={d.year ?? ""} dir="ltr" />
        <TextField name="sort_order" label={f.sortOrder} defaultValue={String(d.sort_order ?? 0)} dir="ltr" type="number" />
      </div>
      <ImageField name="icon" label={f.statIcon} defaultValue={d.icon ?? ""} folder="kpis" />
      <Toggle name="published" label={f.published} defaultChecked={d.published ?? true} />
      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
