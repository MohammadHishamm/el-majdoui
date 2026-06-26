"use client";

import { TextField, SelectField, Toggle, SubmitButton } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { useAdminT } from "@/components/admin/i18n";

export type GalleryValues = {
  type?: string;
  title_ar?: string;
  title_en?: string;
  meta_ar?: string;
  meta_en?: string;
  thumb?: string;
  cover?: string;
  video_url?: string | null;
  sort_order?: number;
  published?: boolean;
};

export function GalleryForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: GalleryValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;
  const TYPES = [
    { value: "album", label: f.typeAlbum },
    { value: "video", label: f.typeVideo },
  ];
  return (
    <form action={action} className="grid max-w-2xl gap-4">
      <SelectField name="type" label={t.common.type} defaultValue={d.type ?? "album"} options={TYPES} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="title_ar" label={f.titleAr} defaultValue={d.title_ar ?? ""} dir="rtl" required />
        <TextField name="title_en" label={f.titleEn} defaultValue={d.title_en ?? ""} dir="ltr" />
        <TextField name="meta_ar" label={f.metaAr} defaultValue={d.meta_ar ?? ""} dir="rtl" placeholder="12 صورة · يونيو 2026" />
        <TextField name="meta_en" label={f.metaEn} defaultValue={d.meta_en ?? ""} dir="ltr" />
      </div>
      <ImageField name="thumb" label={f.thumbnail} defaultValue={d.thumb ?? ""} folder="gallery" />
      <ImageField name="cover" label={f.cover} defaultValue={d.cover ?? ""} folder="gallery" />
      <TextField
        name="video_url"
        label={f.videoUrl}
        defaultValue={d.video_url ?? ""}
        dir="ltr"
        placeholder="https://youtube.com/watch?v=..."
      />
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
