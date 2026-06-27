"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { TextField, TextArea, SubmitButton } from "@/components/admin/fields";
import { useAdminT } from "@/components/admin/i18n";

type Bi = { ar: string; en: string };
type Path = { id: string; title: Bi; desc: Bi; href: string };
type Initiative = { id: string; title: Bi; desc: Bi; paths: Path[] };

export type PanelValues = {
  slug?: string;
  name_ar?: string;
  name_en?: string;
  desc_ar?: string;
  desc_en?: string;
  bg_color?: string;
  initiatives?: Initiative[];
};

const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";
const uid = () => Math.random().toString(36).slice(2, 9);

export function PanelForm({
  action,
  defaults = {},
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: PanelValues;
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;
  const p = t.panels;
  const [inits, setInits] = useState<Initiative[]>(d.initiatives ?? []);

  const edit = (fn: (draft: Initiative[]) => void) =>
    setInits((prev) => {
      const next = structuredClone(prev) as Initiative[];
      fn(next);
      return next;
    });

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="initiatives" value={JSON.stringify(inits)} />

      <fieldset className="rounded-xl border p-5">
        <legend className="px-1 text-sm font-semibold text-muted-foreground">{p.panelText}</legend>
        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <TextField name="name_ar" label={f.nameAr} defaultValue={d.name_ar ?? ""} dir="rtl" required />
          <TextField name="name_en" label={f.nameEn} defaultValue={d.name_en ?? ""} dir="ltr" />
          <TextArea name="desc_ar" label={f.descAr} defaultValue={d.desc_ar ?? ""} dir="rtl" rows={2} />
          <TextArea name="desc_en" label={f.descEn} defaultValue={d.desc_en ?? ""} dir="ltr" rows={2} />
          <TextField name="bg_color" label={f.bgColor} defaultValue={d.bg_color ?? "#005761"} dir="ltr" />
        </div>
      </fieldset>

      <fieldset className="rounded-xl border p-5">
        <legend className="px-1 text-sm font-semibold text-muted-foreground">{p.initiatives}</legend>
        <div className="mt-2 flex flex-col gap-5">
          {inits.map((it, i) => (
            <div key={it.id} className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{p.initiativeTitle} #{i + 1}</span>
                <button type="button" onClick={() => edit((dr) => { dr.splice(i, 1); })} className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5">
                  <Trash2 className="size-3.5" /> {p.remove}
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={inp} dir="rtl" placeholder={`${f.titleAr}`} value={it.title.ar} onChange={(e) => edit((dr) => { dr[i].title.ar = e.target.value; })} />
                <input className={inp} dir="ltr" placeholder={`${f.titleEn}`} value={it.title.en} onChange={(e) => edit((dr) => { dr[i].title.en = e.target.value; })} />
                <input className={inp} dir="rtl" placeholder={`${f.descAr}`} value={it.desc.ar} onChange={(e) => edit((dr) => { dr[i].desc.ar = e.target.value; })} />
                <input className={inp} dir="ltr" placeholder={`${f.descEn}`} value={it.desc.en} onChange={(e) => edit((dr) => { dr[i].desc.en = e.target.value; })} />
              </div>

              <div className="mt-3 flex flex-col gap-2 border-s-2 ps-3">
                {it.paths.map((pa, j) => (
                  <div key={pa.id} className="grid items-center gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                    <input className={inp} dir="rtl" placeholder={`${p.pathTitle} (AR)`} value={pa.title.ar} onChange={(e) => edit((dr) => { dr[i].paths[j].title.ar = e.target.value; })} />
                    <input className={inp} dir="ltr" placeholder={`${p.pathTitle} (EN)`} value={pa.title.en} onChange={(e) => edit((dr) => { dr[i].paths[j].title.en = e.target.value; })} />
                    <input className={inp} dir="ltr" placeholder="href (/programs/...)" value={pa.href} onChange={(e) => edit((dr) => { dr[i].paths[j].href = e.target.value; })} />
                    <button type="button" onClick={() => edit((dr) => { dr[i].paths.splice(j, 1); })} className="grid size-8 place-items-center rounded-md border border-destructive/40 text-destructive hover:bg-destructive/5">
                      <Trash2 className="size-3.5" />
                    </button>
                    <div className="grid gap-2 sm:col-span-4 sm:grid-cols-2">
                      <input className={inp} dir="rtl" placeholder={`${f.descAr}`} value={pa.desc.ar} onChange={(e) => edit((dr) => { dr[i].paths[j].desc.ar = e.target.value; })} />
                      <input className={inp} dir="ltr" placeholder={`${f.descEn}`} value={pa.desc.en} onChange={(e) => edit((dr) => { dr[i].paths[j].desc.en = e.target.value; })} />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => edit((dr) => { dr[i].paths.push({ id: uid(), title: { ar: "", en: "" }, desc: { ar: "", en: "" }, href: "" }); })} className="inline-flex w-fit items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-accent">
                  <Plus className="size-3.5" /> {p.addPath}
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setInits((prev) => [...prev, { id: uid(), title: { ar: "", en: "" }, desc: { ar: "", en: "" }, paths: [] }])} className="inline-flex w-fit items-center gap-1.5 rounded-md border px-3 py-2 text-sm hover:bg-accent">
            <Plus className="size-4" /> {p.addInitiative}
          </button>
        </div>
      </fieldset>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
