"use client";

import { TextField, TextArea, Toggle, SubmitButton } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { useAdminT } from "@/components/admin/i18n";

export type HeroSlideValues = {
  title_ar?: string;
  title_en?: string;
  excerpt_ar?: string;
  excerpt_en?: string;
  image?: string;
  category?: string | null;
  href?: string | null;
  sort_order?: number;
  published?: boolean;
};

export function HeroSlideForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: HeroSlideValues;
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
      </div>
      <TextArea name="excerpt_ar" label={f.excerptAr} defaultValue={d.excerpt_ar ?? ""} dir="rtl" rows={2} />
      <TextArea name="excerpt_en" label={f.excerptEn} defaultValue={d.excerpt_en ?? ""} dir="ltr" rows={2} />
      <ImageField name="image" label={f.slideImage} defaultValue={d.image ?? ""} folder="hero" />
      <div className="grid gap-4 sm:grid-cols-3">
        <TextField name="category" label={t.common.category} defaultValue={d.category ?? ""} dir="rtl" />
        <TextField name="href" label={f.href} defaultValue={d.href ?? ""} dir="ltr" placeholder="/programs" />
        <TextField name="sort_order" label={f.sortOrder} defaultValue={String(d.sort_order ?? 0)} dir="ltr" type="number" />
      </div>
      <Toggle name="published" label={f.published} defaultChecked={d.published ?? true} />
      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
