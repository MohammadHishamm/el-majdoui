"use client";

import { useState } from "react";
import Image from "next/image";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { reports, type Report } from "@/lib/reports";
import { PdfViewer } from "@/components/reports/PdfViewer";

const ICON = {
  document: "/images/taqareer/document-icon.svg",
  preview: "/images/taqareer/investigate-icon.svg",
  download: "/images/taqareer/download-icon.svg",
};

const fontRayat = "var(--font-itf-rayat), sans-serif";

function Row({ report, onPreview }: { report: Report; onPreview: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-6 lg:grid lg:grid-cols-[1fr_1fr_auto] lg:gap-6">
      {/* Doc icon (right) + title */}
      <div className="flex min-w-0 flex-1 items-center justify-start gap-3 lg:justify-self-stretch">
        <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-[#e8f1f2]">
          <Image src={ICON.document} alt="" width={18} height={18} aria-hidden />
        </span>
        <h3
          className="min-w-0 flex-1 truncate text-right font-bold text-[#005761]"
          style={{ fontFamily: fontRayat, fontSize: 16, lineHeight: "24px" }}
        >
          {report.title}
        </h3>
      </div>

      {/* Period — centered */}
      <p
        className="hidden shrink-0 text-center text-[13px] leading-[19.5px] text-[#6a7282] lg:block lg:justify-self-center"
        style={{ fontFamily: fontRayat }}
      >
        {report.period}
      </p>

      {/* Actions — معاينة left, تحميل right in RTL */}
      <div className="flex shrink-0 items-center gap-2 lg:justify-self-end">
        <a
          href={report.file}
          download
          dir="ltr"
          className="inline-flex items-center gap-2 rounded-full border-[1.18px] border-[#005761] px-[17px] py-[9px] text-[13px] font-medium leading-[19.5px] text-[#005761] transition-colors hover:bg-[#f0f7f8]"
          style={{ fontFamily: fontRayat }}
        >
          <Image
            src={ICON.download}
            alt=""
            width={16}
            height={16}
            aria-hidden
            className="relative -top-px shrink-0"
          />
          تحميل
        </a>
        <button
          type="button"
          onClick={onPreview}
          dir="ltr"
          className="inline-flex items-center gap-2 rounded-full border-[1.18px] border-[#e5e7eb] px-[17px] py-[9px] text-[13px] font-medium leading-[19.5px] text-[#005761] transition-colors hover:bg-[#f0f7f8]"
          style={{ fontFamily: fontRayat }}
        >
          <Image src={ICON.preview} alt="" width={16} height={16} aria-hidden className="shrink-0" />
          معاينة
        </button>
      </div>
    </div>
  );
}

export function ReportsList() {
  const [active, setActive] = useState<Report | null>(null);

  return (
    <>
      <div className="divide-y divide-[#e5e7eb] overflow-hidden rounded-[16px] border border-[#eef0f2] bg-white">
        {reports.map((report, i) => (
          <FadeInUp key={report.id} delay={i * 80} duration={500}>
            <Row report={report} onPreview={() => setActive(report)} />
          </FadeInUp>
        ))}
      </div>

      {active && <PdfViewer key={active.id} report={active} onClose={() => setActive(null)} />}
    </>
  );
}
