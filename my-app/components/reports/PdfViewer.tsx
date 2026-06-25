"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  Printer,
  Download,
  FileText,
  ChevronRight,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { Report } from "@/lib/reports";

const BASE_SCALE = 1.35; // render scale at 100%
const ZOOM_STEPS = [0.5, 0.65, 0.8, 1, 1.25, 1.5, 1.75, 2];

type PdfDoc = { numPages: number; getPage: (n: number) => Promise<unknown> };

export function PdfViewer({ report, onClose }: { report: Report; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<PdfDoc | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderTaskRef = useRef<any>(null);

  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Lock body scroll + close on Escape
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Load the document (the viewer is remounted per report via `key`, so
  // initial state already reflects a fresh "loading" on page 1)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        const loadingTask = pdfjs.getDocument({
          url: report.file,
          standardFontDataUrl: "/standard_fonts/",
          cMapUrl: "/cmaps/",
          cMapPacked: true,
        });
        const pdf = (await loadingTask.promise) as unknown as PdfDoc;
        if (cancelled) return;
        pdfRef.current = pdf;
        setNumPages(pdf.numPages);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      pdfRef.current = null;
    };
  }, [report.file]);

  // Render the current page whenever page/zoom change
  useEffect(() => {
    if (status !== "ready" || !pdfRef.current) return;
    let cancelled = false;

    (async () => {
      const pdf = pdfRef.current;
      if (!pdf) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageObj: any = await pdf.getPage(page);
      if (cancelled) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const outputScale = window.devicePixelRatio || 1;
      const scale = zoom * BASE_SCALE;
      const viewport = pageObj.getViewport({ scale: scale * outputScale });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / outputScale)}px`;
      canvas.style.height = `${Math.floor(viewport.height / outputScale)}px`;

      if (renderTaskRef.current) renderTaskRef.current.cancel();
      const task = pageObj.render({
        canvasContext: ctx,
        viewport,
      });
      renderTaskRef.current = task;
      try {
        await task.promise;
      } catch {
        /* render cancelled — ignore */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status, page, zoom]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(numPages || 1, p + 1));
  const zoomOut = () =>
    setZoom((z) => ZOOM_STEPS[Math.max(0, ZOOM_STEPS.indexOf(z) - 1)] ?? z);
  const zoomIn = () =>
    setZoom((z) => ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, ZOOM_STEPS.indexOf(z) + 1)] ?? z);

  const print = useCallback(() => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "-9999px";
    iframe.src = report.file;
    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch {
        window.open(report.file, "_blank");
      }
    };
    document.body.appendChild(iframe);
    setTimeout(() => iframe.remove(), 60000);
  }, [report.file]);

  const chip = "flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-[100] flex flex-col bg-[#0a1f2d]"
      role="dialog"
      aria-modal="true"
      aria-label={`معاينة: ${report.title}`}
    >
      {/* Top bar — title right, actions left in RTL */}
      <div className="flex shrink-0 items-center justify-between bg-[#0a1f2d] px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center justify-start gap-3">
          <span className="hidden size-10 shrink-0 items-center justify-center rounded-[10px] bg-white/10 text-white sm:flex">
            <FileText className="size-5" />
          </span>
          <div className="min-w-0 text-right">
            <p className="truncate text-[15px] font-bold text-white">{report.title}</p>
            <p className="text-[12px] text-white/60">{report.period}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={report.file}
            download
            dir="ltr"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[13px] text-white transition-colors hover:bg-white/20"
          >
            <Download className="relative -top-px size-4 shrink-0" />
            تحميل
          </a>
          <button type="button" onClick={print} aria-label="طباعة" className={chip}>
            <Printer className="size-4" />
          </button>
          <button type="button" onClick={onClose} aria-label="إغلاق" className={chip}>
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* PDF page area */}
      <div className="flex-1 overflow-auto bg-[#0a1f2d] p-4 sm:p-8">
        {status === "loading" && (
          <p className="mt-20 text-center text-white/70">جارٍ تحميل الملف…</p>
        )}
        {status === "error" && (
          <div className="mt-20 text-center text-white/80">
            <p>تعذّر فتح الملف.</p>
            <a href={report.file} download className="mt-3 inline-block text-[#00b5c2] underline">
              تحميل الملف بدلاً من ذلك
            </a>
          </div>
        )}
        <div className={status === "ready" ? "flex justify-center" : "hidden"}>
          <canvas ref={canvasRef} className="h-auto max-w-none rounded-[6px] bg-white shadow-2xl" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex shrink-0 items-center justify-between bg-[#0a1f2d] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={page <= 1}
            aria-label="الصفحة السابقة"
            className={`${chip} disabled:opacity-40`}
          >
            <ChevronRight className="size-5" />
          </button>
          <span className="min-w-[88px] text-center text-[13px] text-white">
            صفحة {page} من {numPages || "—"}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={numPages > 0 && page >= numPages}
            aria-label="الصفحة التالية"
            className={`${chip} disabled:opacity-40`}
          >
            <ChevronLeft className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= ZOOM_STEPS[0]}
            aria-label="تصغير"
            className={`${chip} disabled:opacity-40`}
          >
            <ZoomOut className="size-4" />
          </button>
          <span className="min-w-[48px] text-center text-[13px] text-white">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= ZOOM_STEPS[ZOOM_STEPS.length - 1]}
            aria-label="تكبير"
            className={`${chip} disabled:opacity-40`}
          >
            <ZoomIn className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
