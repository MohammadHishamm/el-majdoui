"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { TextField, TextArea, Toggle, SubmitButton } from "@/components/admin/fields";
import { useL } from "@/components/admin/i18n";
import {
  ORG_COLOR_PRESETS,
  ORG_ICON_NAMES,
  orgIcon,
  type OrgPerson,
} from "@/lib/site/org-levels";

export type OrgLevelValues = {
  level_no?: number;
  title_ar?: string;
  title_en?: string;
  subtitle_ar?: string;
  subtitle_en?: string;
  description_ar?: string;
  description_en?: string;
  icon?: string;
  bg_color?: string;
  leaders?: OrgPerson[];
  members_label_ar?: string;
  members_label_en?: string;
  members?: OrgPerson[];
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

const blank = (): OrgPerson => ({ name_ar: "", name_en: "", role_ar: "", role_en: "" });

/**
 * Repeatable people editor, posted as a JSON string in a hidden input — the
 * same approach panel-form.tsx uses for its nested initiatives.
 *
 * `withRole` is off for the plain member chips, which the design shows as
 * names only.
 */
function PeopleEditor({
  name,
  label,
  value,
  onChange,
  withRole,
  l,
}: {
  name: string;
  label: string;
  value: OrgPerson[];
  onChange: (next: OrgPerson[]) => void;
  withRole: boolean;
  l: (en: string, ar: string) => string;
}) {
  const edit = (fn: (draft: OrgPerson[]) => void) => {
    const next = structuredClone(value);
    fn(next);
    onChange(next);
  };

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(value)} />
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <button
          type="button"
          onClick={() => edit((d) => void d.push(blank()))}
          className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent"
        >
          <Plus className="size-3.5" /> {l("Add", "إضافة")}
        </button>
      </div>

      {value.length === 0 ? (
        <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
          {l("None yet.", "لا يوجد بعد.")}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {value.map((p, i) => (
            <div key={i} className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                <button
                  type="button"
                  onClick={() => edit((d) => void d.splice(i, 1))}
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5"
                >
                  <Trash2 className="size-3.5" /> {l("Remove", "حذف")}
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  className={inp}
                  dir="rtl"
                  placeholder={l("Name (AR)", "الاسم (عربي)")}
                  value={p.name_ar}
                  onChange={(e) => edit((d) => void (d[i].name_ar = e.target.value))}
                />
                <input
                  className={inp}
                  dir="ltr"
                  placeholder={l("Name (EN)", "الاسم (إنجليزي)")}
                  value={p.name_en}
                  onChange={(e) => edit((d) => void (d[i].name_en = e.target.value))}
                />
                {withRole && (
                  <>
                    <input
                      className={inp}
                      dir="rtl"
                      placeholder={l("Role (AR)", "الصفة (عربي)")}
                      value={p.role_ar}
                      onChange={(e) => edit((d) => void (d[i].role_ar = e.target.value))}
                    />
                    <input
                      className={inp}
                      dir="ltr"
                      placeholder={l("Role (EN)", "الصفة (إنجليزي)")}
                      value={p.role_en}
                      onChange={(e) => edit((d) => void (d[i].role_en = e.target.value))}
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function OrgLevelForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: OrgLevelValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const l = useL();
  const [icon, setIcon] = useState(d.icon ?? "landmark");
  const [color, setColor] = useState(d.bg_color ?? "#005761");
  const [leaders, setLeaders] = useState<OrgPerson[]>(d.leaders ?? []);
  const [members, setMembers] = useState<OrgPerson[]>(d.members ?? []);

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="icon" value={icon} />
      <input type="hidden" name="bg_color" value={color} />

      <Section title={l("Level", "المستوى")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="level_no"
            label={l("Level number", "رقم المستوى")}
            defaultValue={d.level_no != null ? String(d.level_no) : ""}
            dir="ltr"
            required
            placeholder="1"
            hint={l(
              "Shown in the tile badge, and sets the order of the tiles.",
              "يظهر في شارة البطاقة، ويحدد ترتيب البطاقات.",
            )}
          />
          <TextField
            name="title_ar"
            label={l("Title (AR)", "العنوان (عربي)")}
            defaultValue={d.title_ar ?? ""}
            dir="rtl"
            required
            placeholder="المستوى الأول"
          />
          <TextField
            name="title_en"
            label={l("Title (EN)", "العنوان (إنجليزي)")}
            defaultValue={d.title_en ?? ""}
            dir="ltr"
          />
          <TextField
            name="subtitle_ar"
            label={l("Subtitle (AR)", "الوصف المختصر (عربي)")}
            defaultValue={d.subtitle_ar ?? ""}
            dir="rtl"
            required
            hint={l(
              "Appears on the tile and as the heading of the level's panel.",
              "يظهر على البطاقة وكعنوان للوحة المستوى.",
            )}
          />
          <TextField
            name="subtitle_en"
            label={l("Subtitle (EN)", "الوصف المختصر (إنجليزي)")}
            defaultValue={d.subtitle_en ?? ""}
            dir="ltr"
          />
        </div>
        <TextArea
          name="description_ar"
          label={l("Description (AR)", "الوصف (عربي)")}
          defaultValue={d.description_ar ?? ""}
          dir="rtl"
          rows={3}
        />
        <TextArea
          name="description_en"
          label={l("Description (EN)", "الوصف (إنجليزي)")}
          defaultValue={d.description_en ?? ""}
          dir="ltr"
          rows={3}
        />
      </Section>

      <Section title={l("Appearance", "المظهر")}>
        {/* Icons are picked from a fixed set rather than typed, since only
            these four are bundled for the page to render. */}
        <div>
          <span className="mb-2 block text-sm font-medium">{l("Icon", "الأيقونة")}</span>
          <div className="flex flex-wrap gap-2">
            {ORG_ICON_NAMES.map((n) => {
              const Icon = orgIcon(n);
              const on = n === icon;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setIcon(n)}
                  aria-pressed={on}
                  title={n}
                  className={`grid size-11 place-items-center rounded-lg border transition-colors ${
                    on ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent"
                  }`}
                >
                  <Icon className="size-5" />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium">
            {l("Tile colour", "لون البطاقة")}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {ORG_COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={c === color}
                title={c}
                className={`size-9 rounded-lg border-2 transition-transform ${
                  c === color ? "border-primary scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              className={`${inp} w-32`}
              dir="ltr"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label={l("Tile colour", "لون البطاقة")}
            />
          </div>
        </div>
      </Section>

      <Section title={l("Leadership cards", "بطاقات القيادة")}>
        <PeopleEditor
          name="leaders"
          label={l("Named roles (chair, deputy, …)", "الأسماء والصفات (الرئيس، النائب، …)")}
          value={leaders}
          onChange={setLeaders}
          withRole
          l={l}
        />
      </Section>

      <Section title={l("Members list", "قائمة الأعضاء")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            name="members_label_ar"
            label={l("List heading (AR)", "عنوان القائمة (عربي)")}
            defaultValue={d.members_label_ar ?? ""}
            dir="rtl"
            placeholder="أعضاء المجلس"
          />
          <TextField
            name="members_label_en"
            label={l("List heading (EN)", "عنوان القائمة (إنجليزي)")}
            defaultValue={d.members_label_en ?? ""}
            dir="ltr"
          />
        </div>
        <PeopleEditor
          name="members"
          label={l("Members (names only)", "الأعضاء (الأسماء فقط)")}
          value={members}
          onChange={setMembers}
          withRole={false}
          l={l}
        />
      </Section>

      <Toggle name="published" label={l("Published", "منشور")} defaultChecked={d.published ?? true} />

      <div>
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
