"use client";

import { useState } from "react";
import { TextField, TextArea, SelectField, Toggle, SubmitButton } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { InlineUpload } from "@/components/admin/inline-upload";
import { VideoUpload } from "@/components/admin/video-field";
import { useAdminT } from "@/components/admin/i18n";

const MAX_VIDEOS = 4;

export type GalleryValues = {
  type?: string;
  slug?: string;
  title_ar?: string;
  title_en?: string;
  meta_ar?: string;
  meta_en?: string;
  thumb?: string;
  cover?: string;
  video_url?: string | null;
  videos?: string[] | null;
  images?: string[] | null;
  date_ar?: string;
  date_en?: string;
  location_ar?: string;
  location_en?: string;
  photographer_ar?: string;
  photographer_en?: string;
  section_ar?: string;
  section_en?: string;
  about_ar?: string;
  about_en?: string;
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
  const [type, setType] = useState<string>(d.type === "video" ? "video" : "album");
  const [images, setImages] = useState<string[]>(Array.isArray(d.images) ? d.images.filter(Boolean) : []);
  const [videos, setVideos] = useState<string[]>(
    Array.isArray(d.videos) && d.videos.length
      ? d.videos.filter(Boolean)
      : d.video_url
        ? [d.video_url]
        : [],
  );

  const isVideo = type === "video";

  const move = (i: number, dir: 1 | -1) =>
    setImages((prev) => {
      const n = [...prev];
      const j = i + dir;
      if (j < 0 || j >= n.length) return prev;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  const moveVideo = (i: number, dir: 1 | -1) =>
    setVideos((prev) => {
      const n = [...prev];
      const j = i + dir;
      if (j < 0 || j >= n.length) return prev;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  const TYPES = [
    { value: "album", label: f.typeAlbum },
    { value: "video", label: f.typeVideo },
  ];

  return (
    <form action={action} className="grid max-w-2xl gap-4">
      {/* Only the active type's media is submitted, so switching type can't carry the other kind over. */}
      <input type="hidden" name="images" value={JSON.stringify(isVideo ? [] : images)} />
      <input type="hidden" name="videos" value={JSON.stringify(isVideo ? videos.filter(Boolean) : [])} />

      <SelectField name="type" label={t.common.type} value={type} onChange={setType} options={TYPES} />
      <TextField name="slug" label={f.slug} defaultValue={d.slug ?? ""} dir="ltr" hint={f.galSlugHint} placeholder="partners-meetup-3" />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="title_ar" label={f.titleAr} defaultValue={d.title_ar ?? ""} dir="rtl" required />
        <TextField name="title_en" label={f.titleEn} defaultValue={d.title_en ?? ""} dir="ltr" />
        <TextField name="meta_ar" label={f.metaAr} defaultValue={d.meta_ar ?? ""} dir="rtl" placeholder="12 صورة · يونيو 2026" />
        <TextField name="meta_en" label={f.metaEn} defaultValue={d.meta_en ?? ""} dir="ltr" />
      </div>
      <ImageField name="cover" label={f.cover} defaultValue={d.cover ?? ""} folder="gallery" />

      {/* Videos — only for "Video" items (up to 4) */}
      {isVideo && (
        <fieldset className="grid gap-3 rounded-lg border p-4">
          <legend className="px-1 text-sm font-semibold">{f.galVideos}</legend>
          <p className="text-xs text-muted-foreground">{f.galVideoHint}</p>
          <div className="flex flex-col gap-2">
            {videos.map((src, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md border bg-muted/30 p-2">
                <span className="mt-1 w-6 shrink-0 text-center text-xs font-semibold text-muted-foreground">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <VideoUpload
                    value={src}
                    onChange={(u) => setVideos((prev) => prev.map((p, k) => (k === i ? u : p)))}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button type="button" disabled={i === 0} onClick={() => moveVideo(i, -1)} className="rounded border px-2 py-1 text-xs disabled:opacity-40" aria-label="Move up">↑</button>
                  <button type="button" disabled={i === videos.length - 1} onClick={() => moveVideo(i, 1)} className="rounded border px-2 py-1 text-xs disabled:opacity-40" aria-label="Move down">↓</button>
                  <button type="button" onClick={() => setVideos((prev) => prev.filter((_, k) => k !== i))} className="rounded border px-2 py-1 text-xs text-destructive hover:bg-destructive/10" aria-label="Remove">✕</button>
                </div>
              </div>
            ))}
          </div>
          {videos.length < MAX_VIDEOS && (
            <button
              type="button"
              onClick={() => setVideos((prev) => [...prev, ""])}
              className="mt-1 inline-flex w-fit items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
            >
              + {f.galVideos}
            </button>
          )}
          <p className="text-[11px] text-muted-foreground">{f.galVideosMax}</p>
        </fieldset>
      )}

      {/* Detail page fields */}
      <fieldset className="grid gap-4 rounded-lg border p-4">
        <legend className="px-1 text-sm font-semibold">{f.galDetails}</legend>

        {/* Album images — only for photo albums */}
        {!isVideo && (
          <div>
            <span className="text-sm font-medium">{f.galImages}</span>
            <p className="mb-2 mt-1 text-xs text-muted-foreground">{f.galImagesHint}</p>
            <div className="flex flex-col gap-2">
              {images.map((src, i) => (
                <div key={`${src}-${i}`} className="flex items-center gap-2 rounded-md border bg-muted/30 p-2">
                  <span className="w-6 shrink-0 text-center text-xs font-semibold text-muted-foreground">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <InlineUpload
                      value={src}
                      onChange={(u) => setImages((prev) => prev.map((p, k) => (k === i ? u : p)))}
                      folder="gallery"
                      recommendedSize="1120 × 620 px (16:9)"
                    />
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded border px-2 py-1 text-xs disabled:opacity-40" aria-label="Move up">↑</button>
                    <button type="button" disabled={i === images.length - 1} onClick={() => move(i, 1)} className="rounded border px-2 py-1 text-xs disabled:opacity-40" aria-label="Move down">↓</button>
                    <button type="button" onClick={() => setImages((prev) => prev.filter((_, k) => k !== i))} className="rounded border px-2 py-1 text-xs text-destructive hover:bg-destructive/10" aria-label="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setImages((prev) => [...prev, ""])}
              className="mt-2 inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
            >
              + {f.galImages}
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="date_ar" label={f.dateAr} defaultValue={d.date_ar ?? ""} dir="rtl" placeholder="12 يونيو 2026" />
          <TextField name="date_en" label={f.dateEn} defaultValue={d.date_en ?? ""} dir="ltr" />
          <TextField name="location_ar" label={f.locAr} defaultValue={d.location_ar ?? ""} dir="rtl" />
          <TextField name="location_en" label={f.locEn} defaultValue={d.location_en ?? ""} dir="ltr" />
          <TextField name="photographer_ar" label={f.photographerAr} defaultValue={d.photographer_ar ?? ""} dir="rtl" />
          <TextField name="photographer_en" label={f.photographerEn} defaultValue={d.photographer_en ?? ""} dir="ltr" />
          <TextField name="section_ar" label={f.galSectionAr} defaultValue={d.section_ar ?? ""} dir="rtl" />
          <TextField name="section_en" label={f.galSectionEn} defaultValue={d.section_en ?? ""} dir="ltr" />
        </div>
        <TextArea name="about_ar" label={f.aboutAr} defaultValue={d.about_ar ?? ""} dir="rtl" rows={4} />
        <TextArea name="about_en" label={f.aboutEn} defaultValue={d.about_en ?? ""} dir="ltr" rows={4} />
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
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
