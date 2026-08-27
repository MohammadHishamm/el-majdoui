"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { NewsCard } from "@/components/news/NewsCard";
import { newsFilters, type NewsItem } from "@/lib/news";

const PAGE_SIZE = 6;

export function NewsExplorer({ items }: { items: NewsItem[] }) {
  const [active, setActive] = useState<(typeof newsFilters)[number]["id"]>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((n) => n.category === active)),
    [active, items],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const shouldScrollOnPageChange = useRef(false);

  const goToPage = (next: number) => {
    if (next === current) return;
    shouldScrollOnPageChange.current = true;
    setPage(next);
  };

  useEffect(() => {
    if (!shouldScrollOnPageChange.current) return;
    shouldScrollOnPageChange.current = false;
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  }, [current]);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap justify-start gap-3">
        {newsFilters.map((f) => {
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setActive(f.id);
                setPage(1);
              }}
              aria-pressed={isActive}
              className={`rounded-full border-[1.18px] px-6 py-[9px] text-[14px] font-medium transition-colors ${
                isActive
                  ? "border-btn-primary bg-btn-primary text-btn-primary-text"
                  : "border-panel-border bg-panel text-btn-2-text hover:bg-icon-box"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Cards grid — §2.4 separates "nothing published yet" from "no match". */}
      {items.length === 0 ? (
        <p className="mt-16 text-center text-[16px] text-body-3">
          لا يوجد محتوى منشور في هذا القسم حتى الآن.
        </p>
      ) : visible.length === 0 ? (
        <p className="mt-16 text-center text-[16px] text-body-3">
          لم نجد نتائج مطابقة. جرّب كلمة أخرى.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item, i) => (
            <FadeInUp key={item.slug} delay={i * 70}>
              <NewsCard item={item} />
            </FadeInUp>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2" dir="ltr">
          <button
            type="button"
            onClick={() => goToPage(Math.max(1, current - 1))}
            disabled={current === 1}
            aria-label="السابق"
            className="flex size-10 items-center justify-center rounded-full border border-panel-border text-btn-2-text transition-colors hover:bg-icon-box disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => goToPage(n)}
              aria-current={n === current}
              className={`size-10 rounded-full text-[14px] font-medium transition-colors ${
                n === current
                  ? "bg-btn-primary text-btn-primary-text"
                  : "border border-panel-border text-btn-2-text hover:bg-icon-box"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => goToPage(Math.min(pageCount, current + 1))}
            disabled={current === pageCount}
            aria-label="التالي"
            className="flex size-10 items-center justify-center rounded-full border border-panel-border text-btn-2-text transition-colors hover:bg-icon-box disabled:opacity-40"
          >
            <ArrowLeft className="size-4 rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
}
