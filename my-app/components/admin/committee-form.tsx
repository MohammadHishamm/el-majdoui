"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { TextField, TextArea, Toggle, SubmitButton } from "@/components/admin/fields";
import { InlineUpload } from "@/components/admin/inline-upload";
import { useL } from "@/components/admin/i18n";
import { ArrayReorder, moveInArray } from "@/components/admin/array-reorder";
import {
  DUTY_ICON_NAMES,
  dutyIcon,
  type CommitteeDuty,
  type CommitteeMember,
} from "@/lib/site/board-committees";

export type CommitteeValues = {
  slug?: string;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  members?: CommitteeMember[];
  duties?: CommitteeDuty[];
  published?: boolean;
};

const inp =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border p-5">
      <legend className="px-1 text-sm font-semibold text-muted-foreground">{title}</legend>
      <div className="mt-2 grid gap-4">{children}</div>
    </fieldset>
  );
}

const blankMember = (): CommitteeMember => ({
  name_ar: "", name_en: "", role_ar: "", role_en: "", image: "",
});
const blankDuty = (): CommitteeDuty => ({ text_ar: "", text_en: "", icon: "file-text" });

export function CommitteeForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: CommitteeValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const l = useL();
  const [members, setMembers] = useState<CommitteeMember[]>(d.members ?? []);
  const [duties, setDuties] = useState<CommitteeDuty[]>(d.duties ?? []);

  const editM = (fn: (draft: CommitteeMember[]) => void) => {
    const next = structuredClone(members);
    fn(next);
    setMembers(next);
  };
  const editD = (fn: (draft: CommitteeDuty[]) => void) => {
    const next = structuredClone(duties);
    fn(next);
    setDuties(next);
  };

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="members" value={JSON.stringify(members)} />
      <input type="hidden" name="duties" value={JSON.stringify(duties)} />

      <Section title={l("Committee", "اللجنة")}>
        <TextField
          name="slug"
          label={l("Slug", "المعرّف")}
          defaultValue={d.slug ?? ""}
          dir="ltr"
          required
          placeholder="executive-committee"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="title_ar" label={l("Title (AR)", "العنوان (عربي)")} defaultValue={d.title_ar ?? ""} dir="rtl" required />
          <TextField name="title_en" label={l("Title (EN)", "العنوان (إنجليزي)")} defaultValue={d.title_en ?? ""} dir="ltr" />
        </div>
        <TextArea name="description_ar" label={l("Description (AR)", "الوصف (عربي)")} defaultValue={d.description_ar ?? ""} dir="rtl" rows={2} />
        <TextArea name="description_en" label={l("Description (EN)", "الوصف (إنجليزي)")} defaultValue={d.description_en ?? ""} dir="ltr" rows={2} />
      </Section>

      <Section title={l("Members", "الأعضاء")}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {l(
              "Upload a square photo. An SVG logo is shown on a brand tile instead of a portrait — use it for a team entry.",
              "ارفع صورة مربعة. شعار SVG يظهر على خلفية بلون الهوية بدلاً من صورة شخصية — استخدمه للفرق.",
            )}
          </span>
          <button
            type="button"
            onClick={() => editM((m) => void m.push(blankMember()))}
            className="inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
          >
            <Plus className="size-3.5" /> {l("Add", "إضافة")}
          </button>
        </div>

        {members.length === 0 ? (
          <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
            {l("No members yet.", "لا يوجد أعضاء بعد.")}
          </p>
        ) : (
          members.map((m, i) => (
            <div key={i} className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                {/* Order here decides the left-to-right order of the member
                    row on /about/board. */}
                <ArrayReorder
                  index={i}
                  total={members.length}
                  onMove={(from, to) => setMembers((prev) => moveInArray(prev, from, to))}
                />
                <button
                  type="button"
                  onClick={() => editM((dr) => void dr.splice(i, 1))}
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5"
                >
                  <Trash2 className="size-3.5" /> {l("Remove", "حذف")}
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <input className={inp} dir="rtl" placeholder={l("Name (AR)", "الاسم (عربي)")}
                  value={m.name_ar} onChange={(e) => editM((dr) => void (dr[i].name_ar = e.target.value))} />
                <input className={inp} dir="ltr" placeholder={l("Name (EN)", "الاسم (إنجليزي)")}
                  value={m.name_en} onChange={(e) => editM((dr) => void (dr[i].name_en = e.target.value))} />
                <input className={inp} dir="rtl" placeholder={l("Role (AR)", "الصفة (عربي)")}
                  value={m.role_ar} onChange={(e) => editM((dr) => void (dr[i].role_ar = e.target.value))} />
                <input className={inp} dir="ltr" placeholder={l("Role (EN)", "الصفة (إنجليزي)")}
                  value={m.role_en} onChange={(e) => editM((dr) => void (dr[i].role_en = e.target.value))} />
              </div>
              <div className="mt-3">
                <InlineUpload
                  value={m.image}
                  onChange={(url) => editM((dr) => void (dr[i].image = url))}
                  folder="board"
                  label={l("Photo", "الصورة")}
                  recommendedSize="400 × 400 px"
                />
              </div>
            </div>
          ))
        )}
      </Section>

      <Section title={l("Duties & responsibilities", "المهام والمسؤوليات")}>
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => editD((dr) => void dr.push(blankDuty()))}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
          >
            <Plus className="size-3.5" /> {l("Add", "إضافة")}
          </button>
        </div>

        {duties.length === 0 ? (
          <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
            {l("No duties yet.", "لا توجد مهام بعد.")}
          </p>
        ) : (
          duties.map((duty, i) => (
            <div key={i} className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                {/* Duties fill the two-column grid in this order. */}
                <ArrayReorder
                  index={i}
                  total={duties.length}
                  onMove={(from, to) => setDuties((prev) => moveInArray(prev, from, to))}
                />
                <button
                  type="button"
                  onClick={() => editD((dr) => void dr.splice(i, 1))}
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5"
                >
                  <Trash2 className="size-3.5" /> {l("Remove", "حذف")}
                </button>
              </div>
              <div className="grid gap-2">
                <input className={inp} dir="rtl" placeholder={l("Text (AR)", "النص (عربي)")}
                  value={duty.text_ar} onChange={(e) => editD((dr) => void (dr[i].text_ar = e.target.value))} />
                <input className={inp} dir="ltr" placeholder={l("Text (EN)", "النص (إنجليزي)")}
                  value={duty.text_en} onChange={(e) => editD((dr) => void (dr[i].text_en = e.target.value))} />
              </div>
              {/* Icons are picked from the set the page can render, not typed. */}
              <div className="mt-2 flex flex-wrap gap-2">
                {DUTY_ICON_NAMES.map((n) => {
                  const Icon = dutyIcon(n);
                  const on = duty.icon === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      title={n}
                      onClick={() => editD((dr) => void (dr[i].icon = n))}
                      aria-pressed={on}
                      className={`grid size-9 place-items-center rounded-lg border transition-colors ${
                        on ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent"
                      }`}
                    >
                      <Icon className="size-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </Section>

      <Toggle name="published" label={l("Published", "منشور")} defaultChecked={d.published ?? true} />

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
