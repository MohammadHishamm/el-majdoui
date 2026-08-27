"use client";

import { TextField, TextArea, SelectField, Toggle, SubmitButton } from "@/components/admin/fields";
import { ListField, PairListField } from "@/components/admin/list-field";
import { ImageField } from "@/components/admin/image-field";
import { useAdminT } from "@/components/admin/i18n";

export type ProgramValues = {
  slug?: string;
  category?: string;
  type?: string;
  tracks?: string[] | null;
  sub_programs?: string[] | null;
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
    { value: "enabling", label: t.programs.catEnabling },
  ];
  const TYPES = [
    { value: "strategic", label: t.programs.typeStrategic },
    { value: "enabling", label: t.programs.typeEnabling },
  ];

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <Section title={f.secProgMain}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="slug" label={f.slug} defaultValue={d.slug ?? ""} dir="ltr" required placeholder="tadmin" />
          <SelectField name="category" label={t.common.category} defaultValue={d.category ?? "empowerment"} options={CATEGORIES} />
          <SelectField name="type" label={t.programs.typeLabel} defaultValue={d.type ?? "strategic"} options={TYPES} />
          <TextField name="title_ar" label={f.titleAr} defaultValue={d.title_ar ?? ""} dir="rtl" required />
          <TextField name="title_en" label={f.titleEn} defaultValue={d.title_en ?? ""} dir="ltr" />
          <TextArea name="short_desc_ar" label={f.descAr} defaultValue={d.short_desc_ar ?? ""} dir="rtl" rows={2} />
          <TextArea name="short_desc_en" label={f.descEn} defaultValue={d.short_desc_en ?? ""} dir="ltr" rows={2} />
        </div>
        <ImageField name="image" label={f.image} defaultValue={d.image ?? ""} folder="programs" />
      </Section>

      <Section title={f.secProgContent}>
        <ListField name="tracks" label={f.tracks} defaultValue={d.tracks ?? []} dir="rtl" addLabel={f.addItem} removeLabel={f.removeItem} />
        <ListField name="sub_programs" label={f.subPrograms} defaultValue={d.sub_programs ?? []} dir="rtl" addLabel={f.addItem} removeLabel={f.removeItem} />
        <TextArea name="hero_desc" label={f.heroDesc} defaultValue={d.hero_desc ?? ""} dir="rtl" rows={3} />
        <TextArea name="about" label={f.about} defaultValue={d.about ?? ""} dir="rtl" rows={4} />
        <ListField name="objectives" label={f.objectives} defaultValue={d.objectives ?? []} dir="rtl" addLabel={f.addItem} removeLabel={f.removeItem} />
        <PairListField
          name="stages"
          label={f.stages}
          defaultValue={(d.stages ?? []).map((st) => ({ title: st.title, desc: st.desc }))}
          titleLabel={f.stageTitle}
          descLabel={f.stageDesc}
          dir="rtl"
          addLabel={f.addItem}
          removeLabel={f.removeItem}
        />
        <ListField name="target_groups" label={f.targetGroups} defaultValue={d.target_groups ?? []} dir="rtl" addLabel={f.addItem} removeLabel={f.removeItem} />
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
        <ListField name="partners" label={f.partners} defaultValue={d.partners ?? []} dir="rtl" addLabel={f.addItem} removeLabel={f.removeItem} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="related" label={f.relatedSlugs} defaultValue={(d.related ?? []).join(", ")} dir="ltr" placeholder="slug-one, slug-two" />
        </div>
        <Toggle name="published" label={f.published} defaultChecked={d.published ?? true} />
      </Section>

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
