import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { TextField, TextArea, SubmitButton } from "@/components/admin/fields";
import { ImageField } from "@/components/admin/image-field";
import { updateSiteSettings } from "./actions";

type Settings = Record<string, string | null>;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border p-5">
      <legend className="px-1 text-sm font-semibold text-muted-foreground">{title}</legend>
      <div className="mt-2 grid gap-4">{children}</div>
    </fieldset>
  );
}

export default async function SiteSettingsPage() {
  const supabase = await createClient();
  const { t } = await getAdminT();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).single();
  const s = (data ?? {}) as Settings;
  const v = (k: string) => (s[k] ?? "") as string;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{t.settings.heading}</h1>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.loadError}
        </p>
      )}

      <form action={updateSiteSettings} className="grid max-w-3xl gap-6">
        <Section title={t.form.secAbout}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="about_title_ar" label={t.form.aboutTitleAr} defaultValue={v("about_title_ar")} dir="rtl" />
            <TextField name="about_title_en" label={t.form.aboutTitleEn} defaultValue={v("about_title_en")} dir="ltr" />
          </div>
          <TextArea name="about_body_ar" label={t.form.aboutBodyAr} defaultValue={v("about_body_ar")} dir="rtl" rows={4} />
          <TextArea name="about_body_en" label={t.form.aboutBodyEn} defaultValue={v("about_body_en")} dir="ltr" rows={4} />
        </Section>

        <Section title={t.form.secLeadership}>
          <TextArea name="leadership_quote_ar" label={t.form.quoteAr} defaultValue={v("leadership_quote_ar")} dir="rtl" rows={3} />
          <TextArea name="leadership_quote_en" label={t.form.quoteEn} defaultValue={v("leadership_quote_en")} dir="ltr" rows={3} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="leadership_name_ar" label={t.form.nameAr} defaultValue={v("leadership_name_ar")} dir="rtl" />
            <TextField name="leadership_name_en" label={t.form.nameEn} defaultValue={v("leadership_name_en")} dir="ltr" />
            <TextField name="leadership_position_ar" label={t.form.posAr} defaultValue={v("leadership_position_ar")} dir="rtl" />
            <TextField name="leadership_position_en" label={t.form.posEn} defaultValue={v("leadership_position_en")} dir="ltr" />
          </div>
          <ImageField name="leadership_photo" label={t.form.photo} defaultValue={v("leadership_photo")} folder="leadership" />
        </Section>

        <Section title={t.form.secFacts}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="founded_year" label={t.form.foundedYear} defaultValue={v("founded_year")} dir="ltr" />
            <TextField name="license_no" label={t.form.licenseNo} defaultValue={v("license_no")} dir="ltr" />
            <TextField name="contact_email" label={t.form.contactEmail} defaultValue={v("contact_email")} dir="ltr" />
            <TextField name="contact_phone" label={t.form.contactPhone} defaultValue={v("contact_phone")} dir="ltr" />
            <TextField name="contact_address_ar" label={t.form.addressAr} defaultValue={v("contact_address_ar")} dir="rtl" />
            <TextField name="contact_address_en" label={t.form.addressEn} defaultValue={v("contact_address_en")} dir="ltr" />
          </div>
        </Section>

        <Section title={t.form.secSocial}>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="social_linkedin" label={t.form.socLinkedin} defaultValue={v("social_linkedin")} dir="ltr" />
            <TextField name="social_instagram" label={t.form.socInstagram} defaultValue={v("social_instagram")} dir="ltr" />
            <TextField name="social_twitter" label={t.form.socTwitter} defaultValue={v("social_twitter")} dir="ltr" />
            <TextField name="social_facebook" label={t.form.socFacebook} defaultValue={v("social_facebook")} dir="ltr" />
            <TextField name="social_snapchat" label={t.form.socSnapchat} defaultValue={v("social_snapchat")} dir="ltr" />
          </div>
        </Section>

        <div>
          <SubmitButton label={t.settings.save} />
        </div>
      </form>
    </div>
  );
}
