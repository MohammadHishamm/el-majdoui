"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { galleryFilters, galleryItems, type GalleryItem } from "@/lib/gallery";

const PLAY_ICON = "/images/Galley-of-images/play-icon.svg";

function PlayBadge({ size = "lg" }: { size?: "lg" | "sm" }) {
  const dim = size === "lg" ? "size-16" : "size-12";
  return (
    <span
      className={`grid ${dim} place-items-center rounded-full border-[1.18px] border-white/50 bg-white/30 backdrop-blur-sm`}
    >
      <Image src={PLAY_ICON} alt="" width={size === "lg" ? 28 : 22} height={size === "lg" ? 28 : 22} aria-hidden />
    </span>
  );
}

function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <article className="flex w-full shrink-0 flex-col overflow-hidden rounded-[12px] border-[1.18px] border-[#f3f4f6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]">
      <div className="relative aspect-[355/222] w-full overflow-hidden">
        <Image
          src={item.thumb}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 90vw, 355px"
          className="object-cover"
        />
        {item.type === "video" && (
          <div className="absolute inset-0 grid place-items-center bg-black/40">
            <PlayBadge />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-5 text-right">
        <h3 className="text-[16px] font-bold leading-[24px] text-[#005761]">{item.title}</h3>
        <p className="text-[13px] leading-[19.5px] text-[#6a7282]">{item.meta}</p>
      </div>
    </article>
  );
}

export function GalleryExplorer() {
  const [filter, setFilter] = useState<(typeof galleryFilters)[number]["id"]>("all");
  const [featured, setFeatured] = useState(0);
  const rowRef = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => (filter === "all" ? galleryItems : galleryItems.filter((i) => i.type === filter)),
    [filter],
  );

  const count = items.length;
  const current = count ? items[featured % count] : null;

  const go = (dir: 1 | -1) => setFeatured((f) => (count ? (f + dir + count) % count : 0));
  const select = (id: (typeof galleryFilters)[number]["id"]) => {
    setFilter(id);
    setFeatured(0);
  };
  const scrollRow = (dir: 1 | -1) =>
    rowRef.current?.scrollBy({ left: dir * (rowRef.current.clientWidth * 0.8), behavior: "smooth" });

  const arrowChip =
    "flex size-11 items-center justify-center rounded-full bg-white/80 text-[#005761] shadow-md transition-colors hover:bg-white";

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap justify-start gap-3">
        {galleryFilters.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => select(f.id)}
              aria-pressed={active}
              className={`rounded-full border-[1.18px] px-6 py-[10px] text-[14px] font-medium transition-colors ${
                active
                  ? "border-[#005761] bg-[#005761] text-white"
                  : "border-[#e5e7eb] bg-white text-[#005761] hover:bg-[#f0f7f8]"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Featured carousel */}
      {current && (
        <FadeInUp>
          <div className="relative mt-8 aspect-[1120/620] w-full overflow-hidden rounded-[16px] sm:aspect-[1120/578]">
            <Image
              src={current.cover}
              alt={current.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1120px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {current.type === "video" && (
              <div className="absolute inset-0 grid place-items-center">
                <PlayBadge />
              </div>
            )}

            {/* Title overlay — bottom right */}
            <div className="absolute inset-x-0 bottom-0 p-6 text-right sm:p-10">
              <h2 className="text-[22px] font-bold leading-[1.3] text-white sm:text-[26px]">
                {current.title}
              </h2>
              <p className="mt-1 text-[14px] text-white/85 sm:text-[15px]">{current.meta}</p>
            </div>

            {/* Prev / next arrows */}
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="السابق"
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${arrowChip}`}
                >
                  <ChevronRight className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="التالي"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${arrowChip}`}
                >
                  <ChevronLeft className="size-5" />
                </button>
              </>
            )}
          </div>
        </FadeInUp>
      )}

      {/* Cards row */}
      <div className="relative mt-8">
        {count > 3 && (
          <button
            type="button"
            onClick={() => scrollRow(-1)}
            aria-label="عرض المزيد"
            className="absolute -right-2 top-[40%] z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#005761] text-white shadow-md transition-colors hover:bg-[#00444c] lg:flex"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
        <div
          ref={rowRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, i) => (
            <FadeInUp key={item.id} delay={i * 80}>
              <GalleryCard item={item} />
            </FadeInUp>
          ))}
        </div>
        {count === 0 && (
          <p className="py-12 text-center text-text-muted">لا يوجد محتوى في هذا التصنيف.</p>
        )}
      </div>
    </div>
  );
}
