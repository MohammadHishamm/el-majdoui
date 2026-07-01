"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";

const ICON = "/images/Galley-of-images/details-page";

export function AlbumViewer({ title, images }: { title: string; images: string[] }) {
  const pics = images.length ? images : [];
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const count = pics.length;
  const current = count ? pics[active % count] : "";
  const go = (dir: 1 | -1) => setActive((a) => (count ? (a + dir + count) % count : 0));

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("انسخ الرابط", url);
    }
  }

  async function download() {
    if (!current) return;
    setDownloading(true);
    const name = `${title || "image"}-${active + 1}.jpg`.replace(/[\\/:*?"<>|]+/g, "-");
    try {
      const res = await fetch(current);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objUrl);
    } catch {
      window.open(current, "_blank", "noopener");
    } finally {
      setDownloading(false);
    }
  }

  if (!count) return null;

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-[1120/620] w-full overflow-hidden rounded-[16px] bg-muted">
        <Image
          key={current}
          src={current}
          alt={`${title} — ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1120px"
          className="object-cover"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="السابق"
              className="absolute right-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#005761] shadow-md transition-colors hover:bg-white"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="التالي"
              className="absolute left-4 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#005761] shadow-md transition-colors hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
          </>
        )}
      </div>

      {/* Counter + actions */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={share}
            className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-5 py-2.5 text-[14px] font-medium text-[#005761] transition-colors hover:bg-[#f0f7f8]"
          >
            {copied ? <Check className="size-4" /> : <Image src={`${ICON}/share-icon.svg`} alt="" width={16} height={16} aria-hidden />}
            {copied ? "تم نسخ الرابط" : "مشاركة"}
          </button>
          <button
            type="button"
            onClick={download}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-full bg-[#005761] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#00444c] disabled:opacity-60"
          >
            <Image src={`${ICON}/download-icon.svg`} alt="" width={16} height={16} aria-hidden className="[filter:brightness(0)_invert(1)]" />
            {downloading ? "جارٍ التحميل…" : "تحميل الصورة"}
          </button>
        </div>
        <span className="text-[14px] text-[#6a7282]">
          {active + 1} من {count}
        </span>
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="mt-6 grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {pics.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`صورة ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square overflow-hidden rounded-[10px] border-2 transition-all ${
                i === active ? "border-[#005761] opacity-100" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
