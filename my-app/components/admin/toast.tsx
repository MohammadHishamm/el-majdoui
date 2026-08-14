"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, TriangleAlert } from "lucide-react";

/**
 * Minimal toast for the admin.
 *
 * Hand-rolled rather than pulling in a toast library: the admin needs one
 * transient "saved" confirmation, and a dependency plus its own theming layer
 * would be more surface than the feature. Colours come straight from the app's
 * palette so it reads as part of the dashboard.
 */

type Tone = "success" | "error";
type Toast = { id: number; message: string; tone: Tone };

const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {});

/** `const toast = useToast(); toast("تم الحفظ بنجاح")` */
export const useToast = () => useContext(ToastContext);

const VISIBLE_MS = 2600;

/* Light: the brand dark green with white text.
   Dark: the admin dark theme's own accent surface — a deep green-teal with
   pale text. Note this can't use `bg-primary`, because --primary flips to
   bright cyan under .admin-theme.dark, which would blow out as a fill. */
const TONE_STYLE: Record<Tone, string> = {
  success:
    "bg-[#005761] text-white dark:bg-[#16333a] dark:text-[#bfeef3] dark:ring-1 dark:ring-[#2d9896]/50",
  error:
    "bg-[#8f2f2f] text-white dark:bg-[#3a1c1c] dark:text-[#fecaca] dark:ring-1 dark:ring-[#f87171]/40",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const show = useCallback((message: string, tone: Tone = "success") => {
    const id = (seq.current += 1);
    setToasts((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      VISIBLE_MS,
    );
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}

      {/* Bottom-centred so it needs no RTL/LTR handling, and above the sidebar.
          aria-live announces it without stealing focus from the control the
          user just operated. */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((t) => {
          const Icon = t.tone === "success" ? CheckCircle2 : TriangleAlert;
          return (
            <div
              key={t.id}
              role="status"
              className={`admin-toast pointer-events-auto flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-medium shadow-[0_8px_24px_rgba(0,0,0,0.18)] ${TONE_STYLE[t.tone]}`}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
