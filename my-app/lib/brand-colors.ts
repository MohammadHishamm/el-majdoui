/**
 * The three brand tile colors map to CSS variables that darken in dark mode
 * (see --brand-* in globals.css). Use this ONLY for large surface fills
 * (focus-area / program panel backgrounds) — small accents (dots, link text)
 * should keep the raw brand hex so they stay vivid on the dark cards.
 *
 * Unknown colors (e.g. custom CMS values) fall through unchanged.
 */
const BRAND_BG_VAR: Record<string, string> = {
  "#80a5e0": "var(--brand-blue)",
  "#00b5c2": "var(--brand-cyan)",
  "#005761": "var(--brand-teal)",
};

export function brandPanelBg(hex: string): string {
  return BRAND_BG_VAR[hex.trim().toLowerCase()] ?? hex;
}
