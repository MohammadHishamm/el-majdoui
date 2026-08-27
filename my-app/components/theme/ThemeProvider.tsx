"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const STORAGE_KEY = "theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * The `dark` class on <html> is the single source of truth: the no-flash script
 * in the root layout sets it before first paint, and this provider reads it
 * through useSyncExternalStore instead of copying it into state from an effect.
 * A MutationObserver on the class attribute keeps every consumer in step, so a
 * theme change from anywhere — including outside React — propagates.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme =>
  document.documentElement.classList.contains("dark") ? "dark" : "light";

// The server cannot know the visitor's choice; the inline script corrects the
// class before paint and the observer then reports the real value.
const getServerSnapshot = (): Theme => "light";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Enable transitions only after the first paint, so the initial theme does
  // not animate in. Touches the DOM, sets no state.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      document.documentElement.classList.add("theme-ready"),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const apply = useCallback((next: Theme) => {
    // Mutating the class notifies the observer, which re-renders consumers.
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
  }, []);

  const toggle = useCallback(
    () => apply(document.documentElement.classList.contains("dark") ? "light" : "dark"),
    [apply],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme: apply }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
