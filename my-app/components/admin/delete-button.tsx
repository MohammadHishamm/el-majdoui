"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { useAdminT } from "@/components/admin/i18n";

/**
 * Delete control with a localized "are you sure?" confirmation dialog.
 * Wraps a bound server action in a form and only submits it after the user confirms.
 */
export function DeleteButton({
  action,
  label,
  className,
  confirmTitle,
  confirmBody,
}: {
  action: (formData: FormData) => void;
  label?: string;
  className?: string;
  confirmTitle?: string;
  confirmBody?: string;
}) {
  const { t, locale } = useAdminT();
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const btnClass =
    className ??
    "inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-xs text-destructive hover:bg-destructive/5";

  return (
    <>
      <form ref={formRef} action={action} className="contents">
        <button type="button" onClick={() => setOpen(true)} className={btnClass}>
          <Trash2 className="size-3.5 shrink-0" /> {label ?? t.common.delete}
        </button>
      </form>

      {open && (
        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex w-full max-w-2xl flex-col rounded-xl border border-border bg-card p-8 text-start shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                <Trash2 className="size-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-foreground">
                  {confirmTitle ?? t.common.confirmDeleteTitle}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {confirmBody ?? t.common.confirmDeleteBody}
                </p>
              </div>
            </div>
            <div className="mt-10 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium leading-none hover:bg-accent"
              >
                <span className="leading-none translate-y-[3px]">{t.common.cancel}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  formRef.current?.requestSubmit();
                }}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-destructive px-4 py-2 text-sm font-medium leading-none text-white hover:bg-destructive/90"
              >
                <Trash2 className="size-4 shrink-0" />
                <span className="leading-none translate-y-[3px]">{t.common.delete}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
