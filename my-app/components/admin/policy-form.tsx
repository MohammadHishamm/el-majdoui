"use client";

import { TextField, SelectField, Toggle, SubmitButton } from "@/components/admin/fields";
import { FileField } from "@/components/admin/file-field";
import { useAdminT } from "@/components/admin/i18n";

export type PolicyValues = {
  title_ar?: string;
  title_en?: string;
  version?: string | null;
  category?: string;
  file?: string;
  sort_order?: number;
  published?: boolean;
};

export function PolicyForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: PolicyValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;
  const CATEGORIES = [
    { value: "basics", label: t.policies.catBasics },
    { value: "governance", label: t.policies.catGovernance },
    { value: "guides", label: t.policies.catGuides },
  ];
  return (
    <form action={action} className="grid max-w-2xl gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="title_ar" label={f.titleAr} defaultValue={d.title_ar ?? ""} dir="rtl" required />
        <TextField name="title_en" label={f.titleEn} defaultValue={d.title_en ?? ""} dir="ltr" />
        <TextField name="version" label={f.version} defaultValue={d.version ?? ""} dir="rtl" placeholder="إصدار V2 · تحديث 2026" />
        <SelectField name="category" label={f.policyCategory} defaultValue={d.category ?? "basics"} options={CATEGORIES} />
      </div>
      <FileField name="file" label={f.file} defaultValue={d.file && d.file !== "#" ? d.file : ""} folder="policies" accept=".pdf" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="sort_order" label={f.sortOrder} defaultValue={String(d.sort_order ?? 0)} dir="ltr" type="number" />
        <div className="flex items-end"><Toggle name="published" label={f.published} defaultChecked={d.published ?? true} /></div>
      </div>
      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
