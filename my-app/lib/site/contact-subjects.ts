/**
 * The subject dropdown on /contact. Five fixed options, fixed order — the
 * content guide (§9) lists them verbatim and forbids adding to the list.
 */
export const CONTACT_SUBJECTS = [
  "استفسار عام",
  "شراكة",
  "استفسار إعلامي",
  "توظيف",
  "أخرى",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export function isContactSubject(value: string): value is ContactSubject {
  return (CONTACT_SUBJECTS as readonly string[]).includes(value);
}
