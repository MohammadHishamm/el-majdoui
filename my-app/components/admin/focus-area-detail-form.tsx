"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { TextField, TextArea, SubmitButton } from "@/components/admin/fields";
import { InlineUpload } from "@/components/admin/inline-upload";
import { useAdminT } from "@/components/admin/i18n";

type Slide = { label_ar: string; label_en: string; image_right: string; image_left: string };
type StatItem = { value: number; suffix: string; label_ar: string; label_en: string };
type ProgramItem = { slug: string; tag_ar: string; tag_en: string };
type ProgramOption = { slug: string; title: string };

export type DetailValues = {
  slug?: string;
  detail_title_ar?: string;
  detail_title_en?: string;
  detail_intro_ar?: string;
  detail_intro_en?: string;
  carousel?: { heading?: { ar?: string; en?: string }; slides?: Slide[] };
  stats?: { image?: string; items?: StatItem[] };
  detail_programs?: { heading?: { ar?: string; en?: string }; items?: ProgramItem[] };
};

const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border p-5">
      <legend className="px-1 text-sm font-semibold text-muted-foreground">{title}</legend>
      <div className="mt-2 grid gap-4">{children}</div>
    </fieldset>
  );
}

export function FocusAreaDetailForm({
  action,
  defaults = {},
  programOptions = [],
  submitLabel = "Save",
}: {
  action: (formData: FormData) => void;
  defaults?: DetailValues;
  programOptions?: ProgramOption[];
  submitLabel?: string;
}) {
  const d = defaults;
  const { t } = useAdminT();
  const f = t.form;

  const [slides, setSlides] = useState<Slide[]>(d.carousel?.slides ?? []);
  const [stats, setStats] = useState<StatItem[]>(d.stats?.items ?? []);
  const [statsImage, setStatsImage] = useState(d.stats?.image ?? "");
  const [items, setItems] = useState<ProgramItem[]>(d.detail_programs?.items ?? []);

  const editS = (fn: (x: Slide[]) => void) => setSlides((p) => { const n = structuredClone(p); fn(n); return n; });
  const editT = (fn: (x: StatItem[]) => void) => setStats((p) => { const n = structuredClone(p); fn(n); return n; });
  const editI = (fn: (x: ProgramItem[]) => void) => setItems((p) => { const n = structuredClone(p); fn(n); return n; });

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      <input type="hidden" name="slides" value={JSON.stringify(slides)} />
      <input type="hidden" name="stats_items" value={JSON.stringify(stats)} />
      <input type="hidden" name="stats_image" value={statsImage} />
      <input type="hidden" name="program_items" value={JSON.stringify(items)} />

      <Section title={f.secDetailIntro}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="detail_title_ar" label={f.titleAr} defaultValue={d.detail_title_ar ?? ""} dir="rtl" required />
          <TextField name="detail_title_en" label={f.titleEn} defaultValue={d.detail_title_en ?? ""} dir="ltr" />
        </div>
        <TextArea name="detail_intro_ar" label={f.detailIntro} defaultValue={d.detail_intro_ar ?? ""} dir="rtl" rows={3} />
      </Section>

      <Section title={f.secCarousel}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="carousel_heading_ar" label={f.carouselHeading} defaultValue={d.carousel?.heading?.ar ?? ""} dir="rtl" />
          <TextField name="carousel_heading_en" label={`${f.carouselHeading} (EN)`} defaultValue={d.carousel?.heading?.en ?? ""} dir="ltr" />
        </div>
        <div className="flex flex-col gap-3">
          {slides.map((s, i) => (
            <div key={i} className="rounded-lg border bg-muted/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{f.slideLabel} #{i + 1}</span>
                <button type="button" onClick={() => editS((x) => { x.splice(i, 1); })} className="text-destructive"><Trash2 className="size-4" /></button>
              </div>
              <input className={inp} dir="rtl" placeholder={f.slideLabel} value={s.label_ar} onChange={(e) => editS((x) => { x[i].label_ar = e.target.value; })} />
              <div className="mt-2 flex flex-wrap gap-4">
                <InlineUpload value={s.image_right} onChange={(u) => editS((x) => { x[i].image_right = u; })} folder="focus-detail" label={f.imageRight} />
                <InlineUpload value={s.image_left} onChange={(u) => editS((x) => { x[i].image_left = u; })} folder="focus-detail" label={f.imageLeft} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setSlides((p) => [...p, { label_ar: "", label_en: "", image_right: "", image_left: "" }])} className="inline-flex w-fit items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent">
            <Plus className="size-4" /> {f.addSlide}
          </button>
        </div>
      </Section>

      <Section title={f.secStats}>
        <InlineUpload value={statsImage} onChange={setStatsImage} folder="focus-detail" label={f.statsImage} />
        <div className="flex flex-col gap-3">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/30 p-3">
              <label className="flex flex-col gap-1"><span className="text-[11px] text-muted-foreground">{f.statValue}</span>
                <input className={`${inp} w-28`} dir="ltr" type="number" value={s.value} onChange={(e) => editT((x) => { x[i].value = Number(e.target.value) || 0; })} />
              </label>
              <label className="flex flex-col gap-1"><span className="text-[11px] text-muted-foreground">{f.suffix}</span>
                <input className={`${inp} w-20`} dir="ltr" value={s.suffix} onChange={(e) => editT((x) => { x[i].suffix = e.target.value; })} />
              </label>
              <label className="flex flex-1 flex-col gap-1"><span className="text-[11px] text-muted-foreground">{f.statLabel}</span>
                <input className={inp} dir="rtl" value={s.label_ar} onChange={(e) => editT((x) => { x[i].label_ar = e.target.value; })} />
              </label>
              <button type="button" onClick={() => editT((x) => { x.splice(i, 1); })} className="mb-2 text-destructive"><Trash2 className="size-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => setStats((p) => [...p, { value: 0, suffix: "", label_ar: "", label_en: "" }])} className="inline-flex w-fit items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent">
            <Plus className="size-4" /> {f.addStat}
          </button>
        </div>
      </Section>

      <Section title={f.secProgs}>
        <p className="text-xs text-muted-foreground">{f.pickProgramsHint}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField name="programs_heading_ar" label={f.programsHeading} defaultValue={d.detail_programs?.heading?.ar ?? ""} dir="rtl" />
          <TextField name="programs_heading_en" label={`${f.programsHeading} (EN)`} defaultValue={d.detail_programs?.heading?.en ?? ""} dir="ltr" />
        </div>
        <div className="flex flex-col gap-3">
          {items.map((it, i) => (
            <div key={i} className="flex flex-wrap items-end gap-3 rounded-lg border bg-muted/30 p-3">
              <label className="flex flex-1 flex-col gap-1">
                <span className="text-[11px] text-muted-foreground">{f.pickProgram}</span>
                <select className={inp} dir="rtl" value={it.slug} onChange={(e) => editI((x) => { x[i].slug = e.target.value; })}>
                  <option value="">—</option>
                  {programOptions.map((o) => (
                    <option key={o.slug} value={o.slug}>{o.title}</option>
                  ))}
                </select>
              </label>
              <label className="flex w-40 flex-col gap-1">
                <span className="text-[11px] text-muted-foreground">{f.cardTag}</span>
                <input className={inp} dir="rtl" value={it.tag_ar} onChange={(e) => editI((x) => { x[i].tag_ar = e.target.value; })} />
              </label>
              <button type="button" onClick={() => editI((x) => { x.splice(i, 1); })} className="mb-2 text-destructive"><Trash2 className="size-4" /></button>
            </div>
          ))}
          <button type="button" onClick={() => setItems((p) => [...p, { slug: "", tag_ar: "", tag_en: "" }])} className="inline-flex w-fit items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent">
            <Plus className="size-4" /> {f.addProgram}
          </button>
        </div>
      </Section>

      <div><SubmitButton label={submitLabel} /></div>
    </form>
  );
}
