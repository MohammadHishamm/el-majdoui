"use client";

import { useState } from "react";
import Image from "next/image";

const COLORS = [
  { name: "اللون الأساسي للمؤسسة", hex: "#005761" },
  { name: "اللون الثانوي", hex: "#00B5C2" },
  { name: "اللون المساند", hex: "#80A5E0" },
  { name: "الرمادي الناعم", hex: "#E5E7EB" },
];

export function ColorSwatches() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {COLORS.map((color) => (
        <div
          key={color.hex}
          className="overflow-hidden rounded-[16px] border-[1.18px] border-[#f3f4f6] bg-white"
        >
          <div className="h-[140px] w-full" style={{ backgroundColor: color.hex }} />
          <div className="flex flex-col gap-2 p-4">
            <p className="text-right text-[12px] leading-[18px] text-[#6a7282]">{color.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-bold leading-[22.5px] text-[#005761]">
                {color.hex}
              </span>
              <button
                type="button"
                onClick={() => copy(color.hex)}
                aria-label={`نسخ كود اللون ${color.hex}`}
                className="grid size-8 place-items-center rounded-[8px] bg-[#f9fafb] transition-colors hover:bg-[#e8f1f2]"
              >
                {copied === color.hex ? (
                  <span className="text-[11px] font-bold text-[#005761]">✓</span>
                ) : (
                  <Image
                    src="/images/identity/copy-icon.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
