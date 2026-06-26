"use client";

import { TextField, TextArea, SelectField, Toggle, SubmitButton } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { useAdminT } from "@/components/admin/i18n";

export type ProgramValues = {
  slug?: string;
  category?: string;
  title_ar?: string;
  title_en?: string;
  short_desc_ar?: string;
  short_desc_en?: string;
  hero_desc?: string | null;
  image?: string;
  about?: string | null;
  objectives?: string[] | null;
  stages?: { title: string; desc: string }[] | null;
  target_groups?: string[] | null;
  quote?: { text?: string; author?: string } | null;
  partners?: string[] | null;
  info?: { launchYear?: string; scope?: string; beneficiaries?: string; sector?: string } | null;
  related?: string[] | null;
  sort_order?: number;
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

export function ProgramForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: ProgramValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;
  const CATEGORIES = [
    { value: "empowerment", label: t.programs.catEmpowerment },
    { value: "mosques", label: t.programs.catMosques },
    { value: "partners", label: t.programs.catPartners },
  ];
  const stagesText = (d.stages ?? []).map((s) => `${s.title} :: ${s.desc}`).join("\n");

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <Section title={f.secProgMain}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="slug" label={f.slug} defaultValue={d.slug ?? ""} dir="ltr" required placeholder="tadmin" />
          <SelectField name="category" label={t.common.category} defaultValue={d.category ?? "empowerment"} options={CATEGORIES} />
          <TextField name="title_ar" label={f.titleAr} defaultValue={d.title_ar ?? ""} dir="rtl" required />
          <TextField name="title_en" label={f.titleEn} defaultValue={d.title_en ?? ""} dir="ltr" />
          <TextArea name="short_desc_ar" label={f.descAr} defaultValue={d.short_desc_ar ?? ""} dir="rtl" rows={2} />
          <TextArea name="short_desc_en" label={f.descEn} defaultValue={d.short_desc_en ?? ""} dir="ltr" rows={2} />
        </div>
        <ImageField name="image" label={f.image} defaultValue={d.image ?? ""} folder="programs" />
      </Section>

      <Section title={f.secProgContent}>
        <TextArea name="hero_desc" label={f.heroDesc} defaultValue={d.hero_desc ?? ""} dir="rtl" rows={3} />
        <TextArea name="about" label={f.about} defaultValue={d.about ?? ""} dir="rtl" rows={4} />
        <TextArea name="objectives" label={f.objectives} defaultValue={(d.objectives ?? []).join("\n")} dir="rtl" rows={4} hint={f.onePerLine} />
        <TextArea name="stages" label={f.stages} defaultValue={stagesText} dir="rtl" rows={4} hint={f.stagesHint} />
        <TextArea name="target_groups" label={f.targetGroups} defaultValue={(d.target_groups ?? []).join("\n")} dir="rtl" rows={3} hint={f.onePerLineItems} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextArea name="quote_text" label={f.quoteText} defaultValue={d.quote?.text ?? ""} dir="rtl" rows={2} />
          <TextField name="quote_author" label={f.quoteAuthor} defaultValue={d.quote?.author ?? ""} dir="rtl" />
        </div>
      </Section>

      <Section title={f.secProgInfo}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="launch_year" label={f.launchYear} defaultValue={d.info?.launchYear ?? ""} dir="rtl" />
          <TextField name="scope" label={f.scope} defaultValue={d.info?.scope ?? ""} dir="rtl" />
          <TextField name="beneficiaries" label={f.beneficiaries} defaultValue={d.info?.beneficiaries ?? ""} dir="rtl" />
          <TextField name="sector" label={f.sector} defaultValue={d.info?.sector ?? ""} dir="rtl" />
        </div>
        <TextArea name="partners" label={f.partners} defaultValue={(d.partners ?? []).join("\n")} dir="rtl" rows={3} hint={f.onePerLineItems} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="related" label={f.relatedSlugs} defaultValue={(d.related ?? []).join(", ")} dir="ltr" placeholder="slug-one, slug-two" />
          <TextField name="sort_order" label={f.sortOrder} defaultValue={String(d.sort_order ?? 0)} dir="ltr" type="number" />
        </div>
        <Toggle name="published" label={f.published} defaultChecked={d.published ?? true} />
      </Section>

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
