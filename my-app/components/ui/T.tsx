"use client";

import { useLocale } from "@/lib/i18n/context";

/**
 * Renders a bilingual static UI label (not CMS content) in the active locale.
 * A client leaf so it works inside server components:
 *   <h2><T ar="الأكثر قراءة" en="Most Read" /></h2>
 * For string contexts (aria-label, alt, title) read `useLocale()` in a client component instead.
 */
export function T({ ar, en }: { ar: string; en: string }) {
  const { locale } = useLocale();
  return <>{locale === "en" ? en : ar}</>;
}
