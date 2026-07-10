"use client";

import { TextField, TextArea, Toggle, SubmitButton } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { FocusAreaDetailFields } from "@/components/admin/focus-area-detail-form";
import { useAdminT } from "@/components/admin/i18n";

type ProgramOption = { slug: string; title: string };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border p-5">
      <legend className="px-1 text-sm font-semibold text-muted-foreground">{title}</legend>
      <div className="mt-2 grid gap-4">{children}</div>
    </fieldset>
  );
}

/**
 * Combined "new focus area" form: the admin authors the full detail page first,
 * then the card that appears on the home page. All image inputs are required so
 * a focus area is never published without its imagery.
 */
export function FocusAreaCreateForm({
  action,
  programOptions = [],
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  programOptions?: ProgramOption[];
  submitLabel?: string;
}) {
  const { t } = useAdminT();
  const f = t.form;

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <Section title={t.focus.detailHeading}>
        <TextField name="slug" label={f.slug} dir="ltr" required placeholder="empowerment" />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="name_ar" label={f.nameAr} dir="rtl" required />
          <TextField name="name_en" label={f.nameEn} dir="ltr" />
        </div>
        <TextArea name="short_desc_ar" label={f.descAr} dir="rtl" rows={3} />
        <TextArea name="short_desc_en" label={f.descEn} dir="ltr" rows={3} />
      </Section>

      <FocusAreaDetailFields programOptions={programOptions} />

      <Section title={t.focus.cardHeading}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="bg_color" label={f.bgColor} defaultValue="#005761" dir="ltr" />
          <TextField name="btn_text_color" label={f.btnTextColor} defaultValue="#005761" dir="ltr" />
        </div>
        <ImageField name="icon" label={f.icon} folder="focus-areas" required />
        <ImageField name="watermark" label={f.watermark} folder="focus-areas" required />
        <Toggle name="published" label={f.published} defaultChecked />
      </Section>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
