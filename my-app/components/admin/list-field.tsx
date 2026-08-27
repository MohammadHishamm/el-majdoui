"use client";

import { useId, useState } from "react";
import { Plus, X } from "lucide-react";

/**
 * Repeatable-row editors for the fields that used to be free-text areas parsed
 * "one item per line" (and "العنوان :: الوصف" for pairs).
 *
 * The wire format is unchanged: a hidden input submits the same newline-joined
 * string under the same `name`, so the server actions and their `lines()` /
 * `parseStages()` helpers keep working untouched. Only the editing experience
 * changes — the author now gets one labelled input per item, plus add/remove,
 * instead of having to remember a separator convention.
 */

const inputCls =
  "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

const rowBtnCls =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive";

const addBtnCls =
  "inline-flex items-center gap-1.5 self-start rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent";

function Shell({
  label,
  hint,
  count,
  addLabel,
  onAdd,
  children,
}: {
  label: string;
  hint?: string;
  count: number;
  addLabel: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>
      {count > 0 && <div className="flex flex-col gap-2">{children}</div>}
      <button type="button" onClick={onAdd} className={addBtnCls}>
        <Plus className="size-3.5" />
        {addLabel}
      </button>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

/** One input per item. Submits the items newline-joined under `name`. */
export function ListField({
  name,
  label,
  defaultValue = [],
  dir,
  hint,
  placeholder,
  addLabel = "إضافة عنصر",
  removeLabel = "حذف",
}: {
  name: string;
  label: string;
  defaultValue?: string[];
  dir?: "rtl" | "ltr";
  hint?: string;
  placeholder?: string;
  addLabel?: string;
  removeLabel?: string;
}) {
  const uid = useId();
  const [items, setItems] = useState<string[]>(defaultValue);

  const update = (i: number, value: string) =>
    setItems((prev) => prev.map((item, idx) => (idx === i ? value : item)));
  const remove = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <Shell
      label={label}
      hint={hint}
      count={items.length}
      addLabel={addLabel}
      onAdd={() => setItems((prev) => [...prev, ""])}
    >
      {items.map((item, i) => (
        <div key={`${uid}-${i}`} className="flex items-center gap-2">
          <input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            dir={dir}
            placeholder={placeholder}
            className={inputCls}
            aria-label={`${label} ${i + 1}`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className={rowBtnCls}
            aria-label={`${removeLabel} ${i + 1}`}
            title={removeLabel}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      {/* Blank rows are dropped here as well as server-side, so an author who
          adds a row and changes their mind does not create an empty item. */}
      <input
        type="hidden"
        name={name}
        value={items.map((s) => s.trim()).filter(Boolean).join("\n")}
      />
    </Shell>
  );
}

/** Title + description side by side. Submits "title :: desc" per line. */
export function PairListField({
  name,
  label,
  defaultValue = [],
  titleLabel,
  descLabel,
  dir,
  hint,
  addLabel = "إضافة عنصر",
  removeLabel = "حذف",
}: {
  name: string;
  label: string;
  defaultValue?: { title: string; desc: string }[];
  titleLabel: string;
  descLabel: string;
  dir?: "rtl" | "ltr";
  hint?: string;
  addLabel?: string;
  removeLabel?: string;
}) {
  const uid = useId();
  const [rows, setRows] = useState(defaultValue);

  const update = (i: number, key: "title" | "desc", value: string) =>
    setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));
  const remove = (i: number) => setRows((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <Shell
      label={label}
      hint={hint}
      count={rows.length}
      addLabel={addLabel}
      onAdd={() => setRows((prev) => [...prev, { title: "", desc: "" }])}
    >
      {rows.map((row, i) => (
        <div key={`${uid}-${i}`} className="flex items-start gap-2">
          <div className="grid flex-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <input
              value={row.title}
              onChange={(e) => update(i, "title", e.target.value)}
              dir={dir}
              placeholder={titleLabel}
              className={inputCls}
              aria-label={`${titleLabel} ${i + 1}`}
            />
            <input
              value={row.desc}
              onChange={(e) => update(i, "desc", e.target.value)}
              dir={dir}
              placeholder={descLabel}
              className={inputCls}
              aria-label={`${descLabel} ${i + 1}`}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className={rowBtnCls}
            aria-label={`${removeLabel} ${i + 1}`}
            title={removeLabel}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      {/* A row needs a title to mean anything; "::" stays the separator so the
          existing parseStages() on the server is unaffected. */}
      <input
        type="hidden"
        name={name}
        value={rows
          .map((r) => ({ title: r.title.trim(), desc: r.desc.trim() }))
          .filter((r) => r.title || r.desc)
          .map((r) => `${r.title} :: ${r.desc}`)
          .join("\n")}
      />
    </Shell>
  );
}
