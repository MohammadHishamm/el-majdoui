"use client";

import { TextField, TextArea, SelectField, Toggle, SubmitButton } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { useAdminT } from "@/components/admin/i18n";

export type NewsFormValues = {
  slug?: string;
  category?: string;
  home_featured?: boolean;
  title_ar?: string;
  title_en?: string;
  excerpt_ar?: string;
  excerpt_en?: string;
  kicker?: string | null;
  date?: string;
  source?: string | null;
  read_time?: string | null;
  image?: string;
  caption?: string | null;
  lead?: string | null;
  body?: string[] | null;
  axes?: { heading?: string; items?: string[] } | null;
  quote?: string | null;
  after_quote?: string | null;
  tags?: string[] | null;
  related?: string[] | null;
  featured?: boolean;
  published?: boolean;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border p-5">
      <legend className="px-1 text-sm font-semibold text-muted-foreground">{title}</legend>
      <div className="mt-2 grid gap-4">{children}</div>
    </fieldset>
  );
}

export function NewsForm({
  action,
  defaults = {},
  submitLabel = "Save article",
}: {
  action: (formData: FormData) => void;
  defaults?: NewsFormValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;
  const CATEGORIES = [
    { value: "institution", label: t.news.catInstitution },
    { value: "announcements", label: t.news.catAnnouncements },
    { value: "partnerships", label: t.news.catPartnerships },
  ];
  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <Section title={f.secHeadline}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="title_ar" label={f.titleAr} defaultValue={d.title_ar ?? ""} dir="rtl" required />
          <TextField name="title_en" label={f.titleEn} defaultValue={d.title_en ?? ""} dir="ltr" />
          <TextArea name="excerpt_ar" label={f.excerptAr} defaultValue={d.excerpt_ar ?? ""} dir="rtl" rows={3} />
          <TextArea name="excerpt_en" label={f.excerptEn} defaultValue={d.excerpt_en ?? ""} dir="ltr" rows={3} />
        </div>
      </Section>

      <Section title={f.secMeta}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="slug" label={f.slug} defaultValue={d.slug ?? ""} dir="ltr" required placeholder="kafalat-al-aytam" />
          <SelectField name="category" label={t.common.category} defaultValue={d.category ?? "institution"} options={CATEGORIES} />
          <TextField name="date" label={f.displayDate} defaultValue={d.date ?? ""} dir="rtl" placeholder="08 يونيو 2026" />
          <TextField name="read_time" label={f.readTime} defaultValue={d.read_time ?? ""} dir="rtl" placeholder="4 دقائق" />
          <TextField name="kicker" label={f.kicker} defaultValue={d.kicker ?? ""} dir="rtl" placeholder="إعلان رسمي" />
          <TextField name="source" label={f.source} defaultValue={d.source ?? ""} dir="rtl" placeholder="المكتب الإعلامي" />
        </div>
      </Section>

      <Section title={f.secCover}>
        <ImageField name="image" label={f.secCover} defaultValue={d.image ?? ""} folder="news" />
        <TextField name="caption" label={f.caption} defaultValue={d.caption ?? ""} dir="rtl" />
      </Section>

      <Section title={f.secBody}>
        <TextArea name="lead" label={f.lead} defaultValue={d.lead ?? ""} dir="rtl" rows={3} />
        <TextArea
          name="body"
          label={f.bodyParagraphs}
          defaultValue={(d.body ?? []).join("\n")}
          dir="rtl"
          rows={8}
          hint={f.onePerLine}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="axes_heading" label={f.axesHeading} defaultValue={d.axes?.heading ?? ""} dir="rtl" />
          <TextArea
            name="axes_items"
            label={f.axesItems}
            defaultValue={(d.axes?.items ?? []).join("\n")}
            dir="rtl"
            rows={3}
            hint={f.onePerLineItems}
          />
        </div>
        <TextArea name="quote" label={f.quote} defaultValue={d.quote ?? ""} dir="rtl" rows={2} />
        <TextArea name="after_quote" label={f.afterQuote} defaultValue={d.after_quote ?? ""} dir="rtl" rows={2} />
      </Section>

      <Section title={f.secTags}>
        <TextField name="tags" label={f.tags} defaultValue={(d.tags ?? []).join(", ")} dir="rtl" hint={f.commaSeparated} />
        <TextField
          name="related"
          label={f.relatedSlugs}
          defaultValue={(d.related ?? []).join(", ")}
          dir="ltr"
          placeholder="slug-one, slug-two"
        />
      </Section>

      <div className="flex flex-wrap items-center gap-6">
        <Toggle name="home_featured" label={f.showOnHome} defaultChecked={d.home_featured} />
        <Toggle name="featured" label={f.featuredHome} defaultChecked={d.featured} />
        <Toggle name="published" label={f.published} defaultChecked={d.published ?? true} />
      </div>

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
