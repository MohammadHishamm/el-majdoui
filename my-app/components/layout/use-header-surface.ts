import { useEffect, useState, type RefObject } from "react";
import { usePathname } from "next/navigation";

const NAV_SURFACE = "data-nav-surface";

function parseRgb(color: string): [number, number, number] | null {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return null;
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function isLightBackground(color: string): boolean {
  const rgb = parseRgb(color);
  if (!rgb) return false;
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.75;
}

/**
 * Detects whether the sticky header is over a light page surface.
 * Sections can declare `data-nav-surface="light" | "solid" | "dark"`.
 * `light` and `solid` apply the solid header background; only `dark` keeps it transparent.
 */
export function useHeaderOverLight(headerRef: RefObject<HTMLElement | null>) {
  const [overLight, setOverLight] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const update = () => {
      const header = headerRef.current;
      if (!header) return;

      const rect = header.getBoundingClientRect();
      const x = window.innerWidth / 2;
      const y = rect.top + rect.height / 2;

      const stack = document.elementsFromPoint(x, y);
      const behind = stack.find((el) => !header.contains(el));
      if (!behind) return;

      const footerHost = behind.closest("footer") as HTMLElement | null;
      if (footerHost) {
        setOverLight((prev) => (prev === true ? prev : true));
        return;
      }

      const surfaceHost = behind.closest(`[${NAV_SURFACE}]`) as HTMLElement | null;
      if (surfaceHost) {
        const surface = surfaceHost.getAttribute(NAV_SURFACE);
        const next = surface === "light" || surface === "solid";
        setOverLight((prev) => (prev === next ? prev : next));
        return;
      }

      const section = behind.closest("section, main") as HTMLElement | null;
      if (section) {
        const next = isLightBackground(getComputedStyle(section).backgroundColor);
        setOverLight((prev) => (prev === next ? prev : next));
        return;
      }

      const next = isLightBackground(getComputedStyle(document.body).backgroundColor);
      setOverLight((prev) => (prev === next ? prev : next));
    };

    update();
    // Re-measure after the newly navigated page paints (route change has no
    // scroll/resize event to trigger an update otherwise).
    const raf = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headerRef, pathname]);

  return overLight;
}

export const HEADER_SOLID_BG = "rgba(10,31,45,0.93)";
