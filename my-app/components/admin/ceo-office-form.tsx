"use client";

import { useState } from "react";
import { TextField, TextArea, SubmitButton } from "@/components/admin/fields";
import { InlineUpload } from "@/components/admin/inline-upload";
import { useL } from "@/components/admin/i18n";

/** Single-record form for the مكتب المدير التنفيذي section on /about/board. */
export function CeoOfficeForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: Record<string, unknown>;
  submitLabel?: string;
}) {
  const l = useL();
  const v = (k: string) => String(defaults[k] ?? "");
  const [photo, setPhoto] = useState(v("photo"));

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="photo" value={photo} />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="heading_ar" label={l("Section heading (AR)", "عنوان القسم (عربي)")} defaultValue={v("heading_ar")} dir="rtl" />
        <TextField name="heading_en" label={l("Section heading (EN)", "عنوان القسم (إنجليزي)")} defaultValue={v("heading_en")} dir="ltr" />
        <TextField name="name_ar" label={l("Name (AR)", "الاسم (عربي)")} defaultValue={v("name_ar")} dir="rtl" />
        <TextField name="name_en" label={l("Name (EN)", "الاسم (إنجليزي)")} defaultValue={v("name_en")} dir="ltr" />
        <TextField name="role_ar" label={l("Role (AR)", "المسمى (عربي)")} defaultValue={v("role_ar")} dir="rtl" />
        <TextField name="role_en" label={l("Role (EN)", "المسمى (إنجليزي)")} defaultValue={v("role_en")} dir="ltr" />
      </div>
      <TextArea name="bio_ar" label={l("Bio (AR)", "نبذة (عربي)")} defaultValue={v("bio_ar")} dir="rtl" rows={2} />
      <TextArea name="bio_en" label={l("Bio (EN)", "نبذة (إنجليزي)")} defaultValue={v("bio_en")} dir="ltr" rows={2} />

      <InlineUpload
        value={photo}
        onChange={setPhoto}
        folder="board"
        label={l("Photo", "الصورة")}
        recommendedSize="400 × 400 px"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField name="phone_label_ar" label={l("Phone label (AR)", "وصف الهاتف (عربي)")} defaultValue={v("phone_label_ar")} dir="rtl" />
        <TextField name="phone_label_en" label={l("Phone label (EN)", "وصف الهاتف (إنجليزي)")} defaultValue={v("phone_label_en")} dir="ltr" />
        <TextField name="phone_value" label={l("Phone", "الهاتف")} defaultValue={v("phone_value")} dir="rtl" />
        <TextField name="email_label_ar" label={l("Email label (AR)", "وصف البريد (عربي)")} defaultValue={v("email_label_ar")} dir="rtl" />
        <TextField name="email_label_en" label={l("Email label (EN)", "وصف البريد (إنجليزي)")} defaultValue={v("email_label_en")} dir="ltr" />
        <TextField name="email_value" label={l("Email", "البريد")} defaultValue={v("email_value")} dir="ltr" />
        <TextField name="hours_label_ar" label={l("Hours label (AR)", "وصف الساعات (عربي)")} defaultValue={v("hours_label_ar")} dir="rtl" />
        <TextField name="hours_label_en" label={l("Hours label (EN)", "وصف الساعات (إنجليزي)")} defaultValue={v("hours_label_en")} dir="ltr" />
        <TextField name="hours_value_ar" label={l("Hours (AR)", "الساعات (عربي)")} defaultValue={v("hours_value_ar")} dir="rtl" />
        <TextField name="hours_value_en" label={l("Hours (EN)", "الساعات (إنجليزي)")} defaultValue={v("hours_value_en")} dir="ltr" />
        <TextField name="cta_label_ar" label={l("Button (AR)", "الزر (عربي)")} defaultValue={v("cta_label_ar")} dir="rtl" />
        <TextField name="cta_label_en" label={l("Button (EN)", "الزر (إنجليزي)")} defaultValue={v("cta_label_en")} dir="ltr" />
        <TextField name="cta_href" label={l("Button link", "رابط الزر")} defaultValue={v("cta_href")} dir="ltr" placeholder="/contact" />
      </div>

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
