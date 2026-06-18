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
