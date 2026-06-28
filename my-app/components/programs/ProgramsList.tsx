"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { programFilters, getCategoryLabel, type Program } from "@/lib/programs";

const PAGE_SIZE = 6;

export function ProgramsList({ items }: { items: Program[] }) {
  const [active, setActive] = useState<(typeof programFilters)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim();
    return items.filter((p) => {
      const matchesCat = active === "all" || p.category === active;
      const matchesQuery = q === "" || p.title.includes(q) || p.shortDesc.includes(q);
      return matchesCat && matchesQuery;
    });
  }, [active, query, items]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const reset = (fn: () => void) => {
    fn();
    setPage(1);
  };

  return (
    <div>
      {/* Search + category filters */}
      <div className="flex flex-col gap-4 lg:flex-row-reverse lg:items-center lg:justify-between">
        <div className="flex flex-wrap justify-start gap-3">
          {programFilters.map((f) => {
            const isActive = active === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => reset(() => setActive(f.id))}
                aria-pressed={isActive}
                className={`rounded-full border-[1.18px] px-6 py-[10px] text-[14px] font-medium transition-colors ${
                  isActive
                    ? "border-[#005761] bg-[#005761] text-white"
                    : "border-[#e5e7eb] bg-white text-[#005761] hover:bg-[#f0f7f8]"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-[320px]">
          <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => reset(() => setQuery(e.target.value))}
            placeholder="ابحث عن مبادرة معينة..."
            aria-label="ابحث عن مبادرة"
            className="w-full rounded-full border border-[#e5e7eb] bg-white py-[11px] pr-11 pl-4 text-right text-[14px] text-text-dark placeholder:text-text-muted focus:border-[#005761] focus:outline-none"
          />
        </div>
      </div>

      {/* Cards grid */}
      {visible.length === 0 ? (
        <p className="mt-16 text-center text-[16px] text-text-muted">
          لا توجد مبادرات مطابقة لبحثك.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <FadeInUp key={p.slug} delay={i * 80}>
              <Link
                href={`/programs/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#f3f4f6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_12px_24px_rgba(0,87,97,0.08)]"
              >
                <div className="relative h-[200px] w-full overflow-hidden border-b border-[#f3f4f6]">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 355px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <span className="absolute right-6 top-4 rounded-full bg-[#005761] px-3 py-1 text-[13px] font-bold text-white shadow-sm">
                    {getCategoryLabel(p.category)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 text-right">
                  <h3 className="line-clamp-2 break-words text-[20px] font-bold leading-[28px] text-[#005761]">
                    {p.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 break-words text-[15px] leading-[25.5px] text-text-light">
                    {p.shortDesc}
                  </p>

                  <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-[#005761]">
                    اعرف أكثر عن المبادرة
                    <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeInUp>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2" dir="ltr">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={current === 1}
            aria-label="السابق"
            className="flex size-9 items-center justify-center rounded-full border border-[#e5e7eb] text-[#005761] transition-colors hover:bg-[#f0f7f8] disabled:opacity-40"
          >
            <ArrowLeft className="size-4 rotate-180" />
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === current}
              className={`size-9 rounded-full text-[14px] font-medium transition-colors ${
                n === current
                  ? "bg-[#005761] text-white"
                  : "border border-[#e5e7eb] text-[#005761] hover:bg-[#f0f7f8]"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
            disabled={current === pageCount}
            aria-label="التالي"
            className="flex size-9 items-center justify-center rounded-full border border-[#e5e7eb] text-[#005761] transition-colors hover:bg-[#f0f7f8] disabled:opacity-40"
          >
            <ArrowLeft className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
