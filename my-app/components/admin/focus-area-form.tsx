"use client";

import { TextField, TextArea, Toggle, SubmitButton } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { useAdminT } from "@/components/admin/i18n";

export type FocusAreaValues = {
  slug?: string;
  name_ar?: string;
  name_en?: string;
  short_desc_ar?: string;
  short_desc_en?: string;
  bg_color?: string;
  btn_text_color?: string;
  icon?: string | null;
  watermark?: string | null;
  sort_order?: number;
  published?: boolean;
};

export function FocusAreaForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: FocusAreaValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;
  return (
    <form action={action} className="grid max-w-2xl gap-4">
      <TextField name="slug" label={f.slug} defaultValue={d.slug ?? ""} dir="ltr" required placeholder="empowerment" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="name_ar" label={f.nameAr} defaultValue={d.name_ar ?? ""} dir="rtl" required />
        <TextField name="name_en" label={f.nameEn} defaultValue={d.name_en ?? ""} dir="ltr" />
      </div>
      <TextArea name="short_desc_ar" label={f.descAr} defaultValue={d.short_desc_ar ?? ""} dir="rtl" rows={3} />
      <TextArea name="short_desc_en" label={f.descEn} defaultValue={d.short_desc_en ?? ""} dir="ltr" rows={3} />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField name="bg_color" label={f.bgColor} defaultValue={d.bg_color ?? "#005761"} dir="ltr" />
        <TextField name="btn_text_color" label={f.btnTextColor} defaultValue={d.btn_text_color ?? "#005761"} dir="ltr" />
      </div>
      <ImageField name="icon" label={f.icon} defaultValue={d.icon ?? ""} folder="focus-areas" />
      <ImageField name="watermark" label={f.watermark} defaultValue={d.watermark ?? ""} folder="focus-areas" />
      <Toggle name="published" label={f.published} defaultChecked={d.published ?? true} />
      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
