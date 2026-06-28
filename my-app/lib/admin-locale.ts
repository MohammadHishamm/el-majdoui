import { cookies } from "next/headers";
import {
  ADMIN_LOCALE_COOKIE,
  ADMIN_THEME_COOKIE,
  adminDict,
  normalizeLocale,
  normalizeTheme,
  type AdminLocale,
  type AdminTheme,
} from "@/lib/admin-i18n";

/** SERVER-ONLY: read the admin locale from the cookie. */
export async function getAdminLocale(): Promise<AdminLocale> {
  const c = await cookies();
  return normalizeLocale(c.get(ADMIN_LOCALE_COOKIE)?.value);
}

/** SERVER-ONLY: read the admin color theme from the cookie. */
export async function getAdminTheme(): Promise<AdminTheme> {
  const c = await cookies();
  return normalizeTheme(c.get(ADMIN_THEME_COOKIE)?.value);
}

/** SERVER-ONLY: localized dictionary for the current admin locale. */
export async function getAdminT() {
  const locale = await getAdminLocale();
  return { locale, t: adminDict[locale] };
}
