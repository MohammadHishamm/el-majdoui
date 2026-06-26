"use client";

import { useState } from "react";
import Image from "next/image";

const DIR = "/images/news-and-announces";

export function NewsActions({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* unavailable */
    }
  };

  const onPrint = () => window.print();

  const chip =
    "flex size-10 items-center justify-center rounded-full border border-[#e5e7eb] transition-colors hover:bg-[#f0f7f8]";

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={() => setSaved((s) => !s)} aria-pressed={saved} aria-label="حفظ" className={`${chip} ${saved ? "bg-[#e8f1f2]" : ""}`}>
        <Image src={`${DIR}/save-icon.svg`} alt="" width={16} height={16} aria-hidden />
      </button>
      <button type="button" onClick={onPrint} aria-label="طباعة" className={chip}>
        <Image src={`${DIR}/print-icon.svg`} alt="" width={16} height={16} aria-hidden />
      </button>
      <button
        type="button"
        onClick={onShare}
        className="inline-flex items-center gap-2 rounded-full bg-[#005761] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#00444c]"
      >
        <Image src={`${DIR}/share-icon.svg`} alt="" width={16} height={16} aria-hidden className="[filter:brightness(0)_invert(1)]" />
        {copied ? "تم نسخ الرابط" : "مشاركة الخبر"}
      </button>
    </div>
  );
}
