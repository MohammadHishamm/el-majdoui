"use client";

import { TextField, Toggle, SubmitButton } from "@/components/admin/fields";
import { FileField } from "@/components/admin/file-field";
import { useAdminT } from "@/components/admin/i18n";

export type ReportValues = {
  title_ar?: string;
  title_en?: string;
  period_ar?: string;
  period_en?: string;
  file?: string;
  sort_order?: number;
  published?: boolean;
};

export function ReportForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: ReportValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;
  return (
    <form action={action} className="grid max-w-2xl gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="title_ar" label={f.titleAr} defaultValue={d.title_ar ?? ""} dir="rtl" required />
        <TextField name="title_en" label={f.titleEn} defaultValue={d.title_en ?? ""} dir="ltr" />
        <TextField name="period_ar" label={f.periodAr} defaultValue={d.period_ar ?? ""} dir="rtl" placeholder="عام 2025" />
        <TextField name="period_en" label={f.periodEn} defaultValue={d.period_en ?? ""} dir="ltr" />
      </div>
      <FileField name="file" label={f.file} defaultValue={d.file ?? ""} folder="reports" accept=".pdf" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="sort_order" label={f.sortOrder} defaultValue={String(d.sort_order ?? 0)} dir="ltr" type="number" />
        <div className="flex items-end">
          <Toggle name="published" label={f.published} defaultChecked={d.published ?? true} />
        </div>
      </div>
      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
