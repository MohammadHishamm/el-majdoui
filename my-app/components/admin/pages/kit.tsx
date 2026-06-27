"use client";

import { Plus, Trash2 } from "lucide-react";
import { SubmitButton } from "@/components/admin/fields";

export const inp = "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border p-5">
      <legend className="px-1 text-sm font-semibold text-muted-foreground">{title}</legend>
      <div className="mt-2 grid gap-4">{children}</div>
    </fieldset>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export function Txt({ label, value, onChange, dir = "rtl" }: { label: string; value: string; onChange: (v: string) => void; dir?: "rtl" | "ltr" }) {
  return (
    <Field label={label}>
      <input className={inp} dir={dir} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function Area({ label, value, onChange, rows = 3, dir = "rtl" }: { label: string; value: string; onChange: (v: string) => void; rows?: number; dir?: "rtl" | "ltr" }) {
  return (
    <Field label={label}>
      <textarea className={`${inp} resize-y`} dir={dir} rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function AddBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex w-fit items-center gap-1 rounded-md border px-3 py-2 text-sm hover:bg-accent">
      <Plus className="size-4" /> {children}
    </button>
  );
}

export function DelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="text-destructive" aria-label="remove">
      <Trash2 className="size-4" />
    </button>
  );
}

export { SubmitButton };
