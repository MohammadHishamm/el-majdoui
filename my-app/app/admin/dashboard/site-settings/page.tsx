import { createClient } from "@/lib/supabase/server";
import { getAdminT } from "@/lib/admin-locale";
import { TextField, Toggle, SubmitButton } from "@/components/admin/fields";
import { updateSiteSettings } from "./actions";

type Settings = Record<string, string | boolean | null>;

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
  const b = (k: string) => s[k] !== false; // show flags default to ON

  const socials: { key: string; label: string }[] = [
    { key: "linkedin", label: t.form.socLinkedin },
    { key: "instagram", label: t.form.socInstagram },
    { key: "twitter", label: t.form.socTwitter },
    { key: "facebook", label: t.form.socFacebook },
    { key: "snapchat", label: t.form.socSnapchat },
    { key: "youtube", label: t.form.socYoutube },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">{t.settings.heading}</h1>

      {error && (
        <p className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
          {t.common.loadError}
        </p>
      )}

      <form action={updateSiteSettings} className="grid max-w-3xl gap-6">
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
          <p className="text-xs text-muted-foreground">{t.form.socialHint}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {socials.map((soc) => (
              <div key={soc.key} className="flex flex-col gap-2 rounded-lg border p-3">
                <TextField
                  name={`social_${soc.key}`}
                  label={soc.label}
                  defaultValue={v(`social_${soc.key}`)}
                  dir="ltr"
                  hint={t.form.socUrlHint}
                />
                <Toggle name={`social_${soc.key}_show`} label={t.form.socShow} defaultChecked={b(`social_${soc.key}_show`)} />
              </div>
            ))}
          </div>
        </Section>

        <div>
          <SubmitButton label={t.settings.save} />
        </div>
      </form>
    </div>
  );
}
