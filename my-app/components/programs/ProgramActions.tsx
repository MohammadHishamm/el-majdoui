"use client";

import { useState } from "react";
import Image from "next/image";

export function ProgramActions({ title }: { title: string }) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
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
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex items-center justify-start gap-3">
      <button
        type="button"
        onClick={onShare}
        className="inline-flex items-center gap-2 rounded-[20px] border-[1.18px] border-[#e5e7eb] px-5 py-[11px] text-[14px] font-medium text-[#005761] transition-colors hover:bg-[#f0f7f8]"
      >
        <Image src="/images/program-cards/share-icon.svg" alt="" width={16} height={16} aria-hidden />
        {copied ? "تم نسخ الرابط" : "مشاركة"}
      </button>
      <button
        type="button"
        onClick={() => setSaved((s) => !s)}
        aria-pressed={saved}
        aria-label={saved ? "إزالة من المحفوظات" : "حفظ المبادرة"}
        className={`flex size-11 items-center justify-center rounded-full border-[1.18px] transition-colors ${
          saved ? "border-[#005761] bg-[#e8f1f2]" : "border-[#e5e7eb] hover:bg-[#f0f7f8]"
        }`}
      >
        <Image src="/images/program-cards/save-icon.svg" alt="" width={16} height={16} aria-hidden />
      </button>
    </div>
  );
}
