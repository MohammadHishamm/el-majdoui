"use client";

import { useFormStatus } from "react-dom";

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

export function TextField({
  name,
  label,
  defaultValue = "",
  placeholder,
  required,
  dir,
  type = "text",
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  dir?: "rtl" | "ltr";
  type?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        dir={dir}
        className={inputCls}
      />
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function TextArea({
  name,
  label,
  defaultValue = "",
  placeholder,
  rows = 4,
  dir,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  dir?: "rtl" | "ltr";
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        dir={dir}
        className={`${inputCls} resize-y`}
      />
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export function SelectField({
  name,
  label,
  defaultValue,
  value,
  onChange,
  options,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  /** When provided (with onChange), the select is controlled. */
  value?: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const controlled = value !== undefined && onChange !== undefined;
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      <select
        name={name}
        className={inputCls}
        {...(controlled
          ? { value, onChange: (e) => onChange(e.target.value) }
          : { defaultValue })}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Toggle({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="size-4 accent-primary"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

export function SubmitButton({ label = "Save" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
