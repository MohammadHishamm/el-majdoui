"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/context";

type TocItem = { id: string; label: string };

export function PrivacyToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const { locale } = useLocale();

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px" }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={locale === "en" ? "Page contents" : "محتويات الصفحة"}
      className="flex w-full flex-col gap-2 rounded-xl border border-panel-border bg-icon-box p-5"
    >
      <p className="text-xs font-bold uppercase text-body-3">
        {locale === "en" ? "Page contents" : "محتويات الصفحة"}
      </p>
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="flex h-10 items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              setActive(item.id);
            }}
          >
            <span
              className={`h-6 w-[3px] shrink-0 rounded-sm transition-colors ${isActive ? "bg-heading" : "bg-transparent"}`}
              aria-hidden
            />
            <span
              className={`flex-1 text-right text-sm transition-colors ${
                isActive ? "font-bold text-heading" : "font-medium text-body-3 hover:text-heading"
              }`}
            >
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
