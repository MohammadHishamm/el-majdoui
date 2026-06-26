"use client";

import { TextField, SelectField, Toggle, SubmitButton } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { useAdminT } from "@/components/admin/i18n";

export type TeamValues = {
  type?: string;
  name_ar?: string;
  name_en?: string;
  role_ar?: string;
  role_en?: string;
  image?: string | null;
  sort_order?: number;
  published?: boolean;
};

export function TeamForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: TeamValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;
  const TYPES = [
    { value: "board", label: t.team.typeBoard },
    { value: "leadership", label: t.team.typeLeadership },
  ];
  return (
    <form action={action} className="grid max-w-2xl gap-4">
      <SelectField name="type" label={f.memberType} defaultValue={d.type ?? "board"} options={TYPES} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name_ar" label={f.nameAr} defaultValue={d.name_ar ?? ""} dir="rtl" required />
        <TextField name="name_en" label={f.nameEn} defaultValue={d.name_en ?? ""} dir="ltr" />
        <TextField name="role_ar" label={f.roleAr} defaultValue={d.role_ar ?? ""} dir="rtl" />
        <TextField name="role_en" label={f.roleEn} defaultValue={d.role_en ?? ""} dir="ltr" />
      </div>
      <ImageField name="image" label={f.image} defaultValue={d.image ?? ""} folder="team" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="sort_order" label={f.sortOrder} defaultValue={String(d.sort_order ?? 0)} dir="ltr" type="number" />
        <div className="flex items-end"><Toggle name="published" label={f.published} defaultChecked={d.published ?? true} /></div>
      </div>
      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
