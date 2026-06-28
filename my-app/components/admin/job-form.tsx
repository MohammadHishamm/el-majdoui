"use client";

import { TextField, TextArea, Toggle, SubmitButton } from "@/components/admin/fields";
import { useAdminT } from "@/components/admin/i18n";

export type JobValues = {
  slug?: string;
  title_ar?: string;
  title_en?: string;
  summary_ar?: string;
  summary_en?: string;
  department?: string | null;
  location?: string | null;
  type?: string | null;
  experience?: string | null;
  education?: string | null;
  deadline?: string | null;
  posted?: string | null;
  responsibilities?: string[] | null;
  qualifications?: string[] | null;
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

export function JobForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: JobValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;
  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <Section title={f.secJobMain}>
        <TextField name="slug" label={f.slug} defaultValue={d.slug ?? ""} dir="ltr" required placeholder="grants-specialist" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="title_ar" label={f.titleAr} defaultValue={d.title_ar ?? ""} dir="rtl" required />
          <TextField name="title_en" label={f.titleEn} defaultValue={d.title_en ?? ""} dir="ltr" />
          <TextArea name="summary_ar" label={f.summaryAr} defaultValue={d.summary_ar ?? ""} dir="rtl" rows={3} />
          <TextArea name="summary_en" label={f.summaryEn} defaultValue={d.summary_en ?? ""} dir="ltr" rows={3} />
        </div>
      </Section>

      <Section title={f.secJobMeta}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="department" label={f.department} defaultValue={d.department ?? ""} dir="rtl" />
          <TextField name="location" label={f.location} defaultValue={d.location ?? ""} dir="rtl" />
          <TextField name="type" label={f.jobType} defaultValue={d.type ?? ""} dir="rtl" placeholder="دوام كامل" />
          <TextField name="experience" label={f.experience} defaultValue={d.experience ?? ""} dir="rtl" />
          <TextField name="education" label={f.education} defaultValue={d.education ?? ""} dir="rtl" />
          <TextField name="deadline" label={f.deadline} defaultValue={d.deadline ?? ""} dir="rtl" placeholder="30 يونيو 2026" />
          <TextField name="posted" label={f.posted} defaultValue={d.posted ?? ""} dir="rtl" />
        </div>
      </Section>

      <Section title={f.secJobLists}>
        <TextArea name="responsibilities" label={f.responsibilities} defaultValue={(d.responsibilities ?? []).join("\n")} dir="rtl" rows={5} hint={f.onePerLineItems} />
        <TextArea name="qualifications" label={f.qualifications} defaultValue={(d.qualifications ?? []).join("\n")} dir="rtl" rows={5} hint={f.onePerLineItems} />
      </Section>

      <Toggle name="published" label={f.published} defaultChecked={d.published ?? true} />

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
