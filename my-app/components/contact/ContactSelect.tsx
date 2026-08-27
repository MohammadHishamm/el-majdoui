"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export const CONTACT_FIELD =
  "h-[46px] w-full rounded-lg border-2 border-[#d1ddd9] bg-panel px-4 text-sm text-body-1 outline-none transition-colors placeholder:text-body-3/70 focus:border-icon dark:border-panel-border";

export type ContactSelectOption = { value: string; label: string };

/** Custom select — native lists can't be styled to match the contact forms. */
export function ContactSelect({
  name,
  options,
  placeholder,
  required,
  id,
  rtl = true,
  emptyLabel,
}: {
  name: string;
  options: ContactSelectOption[];
  placeholder: string;
  required?: boolean;
  id: string;
  rtl?: boolean;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const display = selected ? selected.label : placeholder;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const pick = (next: string) => {
    setValue(next);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <input type="hidden" name={name} value={value} required={required} />

      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`${CONTACT_FIELD} flex w-full cursor-pointer items-center text-right ${rtl ? "pl-10" : "pr-10"} ${open ? "border-icon" : ""} ${value ? "text-body-1" : "text-body-3/70"}`}
      >
        <span className="min-w-0 flex-1 truncate">{display}</span>
      </button>

      <ChevronDown
        className={`pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-body-3 transition-transform ${open ? "rotate-180" : ""} ${rtl ? "left-4" : "right-4"}`}
        aria-hidden
      />

      {open && (
        <ul
          role="listbox"
          aria-labelledby={id}
          className="absolute top-[calc(100%+6px)] z-50 max-h-60 w-full overflow-auto rounded-lg border-2 border-[#d1ddd9] bg-panel py-1 shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:border-panel-border"
        >
          {!required && (
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value === ""}
                onClick={() => pick("")}
                className={`w-full px-4 py-2.5 text-right text-[13px] transition-colors hover:bg-icon-box ${value === "" ? "bg-icon-box/70 font-medium text-[#005761] dark:text-heading" : "text-body-3"}`}
              >
                {emptyLabel ?? (rtl ? "بدون تحديد" : "No selection")}
              </button>
            </li>
          )}
          {options.map((o) => {
            const active = value === o.value;
            return (
              <li key={o.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => pick(o.value)}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-right text-[13px] transition-colors hover:bg-icon-box ${
                    active
                      ? "bg-icon-box font-medium text-[#005761] dark:text-heading"
                      : "text-body-1"
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {active && (
                    <Check className="size-3.5 shrink-0 text-[#005761] dark:text-heading" aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
