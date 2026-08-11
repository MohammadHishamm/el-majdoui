"use client";

import { useState } from "react";
import { TextField, Toggle, SubmitButton } from "@/components/admin/fields";
import { InlineUpload } from "@/components/admin/inline-upload";
import { useL } from "@/components/admin/i18n";

export type MosqueValues = {
  slug?: string;
  name_ar?: string;
  name_en?: string;
  district_ar?: string;
  district_en?: string;
  region_ar?: string;
  region_en?: string;
  lat?: number | null;
  lng?: number | null;
  coords_verified?: boolean;
  capacity?: number | null;
  area_sqm?: number | null;
  image?: string;
  maps_url?: string;
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

export function MosqueForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: MosqueValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const l = useL();
  const [image, setImage] = useState(d.image ?? "");

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="image" value={image} />

      <Section title={l("Mosque", "المسجد")}>
        <TextField
          name="slug"
          label={l("Slug", "المعرّف")}
          defaultValue={d.slug ?? ""}
          dir="ltr"
          required
          placeholder="ali-al-majdouie-makkah"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="name_ar" label={l("Name (AR)", "الاسم (عربي)")} defaultValue={d.name_ar ?? ""} dir="rtl" required />
          <TextField name="name_en" label={l("Name (EN)", "الاسم (إنجليزي)")} defaultValue={d.name_en ?? ""} dir="ltr" />
          <TextField
            name="district_ar"
            label={l("District (AR)", "الحي والمدينة (عربي)")}
            defaultValue={d.district_ar ?? ""}
            dir="rtl"
            placeholder="حي البادية، الدمام"
            hint={l("Shown under the name on the card and popup.", "يظهر أسفل الاسم في البطاقة والنافذة المنبثقة.")}
          />
          <TextField name="district_en" label={l("District (EN)", "الحي والمدينة (إنجليزي)")} defaultValue={d.district_en ?? ""} dir="ltr" />
          <TextField
            name="region_ar"
            label={l("Region (AR)", "المنطقة (عربي)")}
            defaultValue={d.region_ar ?? ""}
            dir="rtl"
            required
            placeholder="المنطقة الشرقية"
            hint={l("Becomes a filter pill — reuse the exact same text across mosques in one region.", "يتحول إلى زر تصفية — استخدم النص نفسه تماماً لكل مساجد المنطقة الواحدة.")}
          />
          <TextField name="region_en" label={l("Region (EN)", "المنطقة (إنجليزي)")} defaultValue={d.region_en ?? ""} dir="ltr" />
        </div>
      </Section>

      <Section title={l("Location on the map", "الموقع على الخريطة")}>
        <p className="text-xs text-muted-foreground">
          {l(
            "In Google Maps, right-click the mosque and click the coordinates to copy them — the first number is the latitude, the second the longitude. Without both, the mosque is hidden from the map.",
            "في خرائط جوجل، انقر بزر الفأرة الأيمن على المسجد ثم انقر على الإحداثيات لنسخها — الرقم الأول هو خط العرض والثاني خط الطول. بدونهما لن يظهر المسجد على الخريطة.",
          )}
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="lat"
            label={l("Latitude", "خط العرض")}
            defaultValue={d.lat != null ? String(d.lat) : ""}
            dir="ltr"
            placeholder="21.4450"
          />
          <TextField
            name="lng"
            label={l("Longitude", "خط الطول")}
            defaultValue={d.lng != null ? String(d.lng) : ""}
            dir="ltr"
            placeholder="39.8300"
          />
        </div>
        <Toggle
          name="coords_verified"
          label={l("Coordinates verified against the real location", "تم التحقق من الإحداثيات مقابل الموقع الفعلي")}
          defaultChecked={d.coords_verified ?? false}
        />
        <TextField
          name="maps_url"
          label={l("Google Maps link", "رابط خرائط جوجل")}
          defaultValue={d.maps_url ?? ""}
          dir="ltr"
          hint={l(
            "Optional — powers the “فتح في الخرائط” button. Left empty, it falls back to a search for the coordinates.",
            "اختياري — يشغّل زر «فتح في الخرائط». إذا تُرك فارغاً يُستخدم بحث بالإحداثيات بدلاً منه.",
          )}
        />
      </Section>

      <Section title={l("Details", "التفاصيل")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="capacity"
            label={l("Capacity (worshippers)", "الطاقة الاستيعابية (عدد المصلين)")}
            defaultValue={d.capacity != null ? String(d.capacity) : ""}
            dir="ltr"
            placeholder="2300"
            hint={l("Optional — shown in the popup as “يتسع لـ …”.", "اختياري — يظهر في النافذة المنبثقة بصيغة «يتسع لـ …».")}
          />
          <TextField
            name="area_sqm"
            label={l("Area (m²)", "المساحة (م²)")}
            defaultValue={d.area_sqm != null ? String(d.area_sqm) : ""}
            dir="ltr"
            placeholder="5600"
          />
        </div>
        <InlineUpload
          value={image}
          onChange={setImage}
          folder="mosques"
          label={l("Mosque photo", "صورة المسجد")}
          recommendedSize="520 × 220 px"
          hint={l(
            "Used as the 72 × 72 thumbnail in the list and as the banner on the map popup.",
            "تُستخدم كصورة مصغّرة 72 × 72 في القائمة وكصورة علوية في نافذة الخريطة.",
          )}
        />
      </Section>

      <Toggle name="published" label={l("Published", "منشور")} defaultChecked={d.published ?? true} />

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
