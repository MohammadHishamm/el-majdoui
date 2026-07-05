import Image from "next/image";

/**
 * Header utility icon files (served from public/images).
 * Update these paths if you replace the SVG assets.
 */
export const HEADER_ICON_PATHS = {
  search: "/images/search-icon.svg",
  moon: "/images/moon-logo.svg",
  localize: "/images/localize-icon.svg",
} as const;

type IconProps = {
  className?: string;
};

const iconClass = "h-4 w-4 shrink-0";

export function SearchIcon({ className = iconClass }: IconProps) {
  return (
    <Image
      src={HEADER_ICON_PATHS.search}
      alt=""
      width={16}
      height={16}
      className={className}
      aria-hidden
    />
  );
}

export function MoonIcon({ className = iconClass }: IconProps) {
  return (
    <Image
      src={HEADER_ICON_PATHS.moon}
      alt=""
      width={16}
      height={16}
      className={className}
      aria-hidden
    />
  );
}

/** Inline glyphs for the theme toggle — use currentColor so they inherit the header text color. */
export function MoonGlyph({ className = iconClass }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SunGlyph({ className = iconClass }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function LocalizeIcon({ className = iconClass }: IconProps) {
  return (
    <Image
      src={HEADER_ICON_PATHS.localize}
      alt=""
      width={16}
      height={16}
      className={className}
      aria-hidden
    />
  );
}
