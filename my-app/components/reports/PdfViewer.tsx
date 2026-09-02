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
  PanelLeft,
} from "lucide-react";
import type { Report } from "@/lib/reports";

const BASE_SCALE = 1.35; // render scale at 100%
const ZOOM_STEPS = [0.5, 0.65, 0.8, 1, 1.25, 1.5, 1.75, 2];
// How far outside the viewport a page is still worth drawing. Roughly one
// screen either way, so scrolling at a normal pace never shows a blank page.
const RENDER_MARGIN = "800px 0px";

type PdfDoc = { numPages: number; getPage: (n: number) => Promise<unknown> };
type PageRatio = { w: number; h: number };

export function PdfViewer({ report, onClose }: { report: Report; onClose: () => void }) {
  const pdfRef = useRef<PdfDoc | null>(null);

  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Every page is laid out in one continuous column, the way a PDF reader
  // behaves. Unscaled page dimensions are read once at load so each slot can be
  // sized before it is drawn — the scrollbar is then correct immediately
  // instead of growing as pages render.
  const [ratios, setRatios] = useState<PageRatio[]>([]);

  const areaRef = useRef<HTMLDivElement>(null);
  const pageElsRef = useRef<(HTMLDivElement | null)[]>([]);
  const canvasElsRef = useRef<(HTMLCanvasElement | null)[]>([]);
  // page number → the zoom it was drawn at, so a zoom change invalidates it.
  const drawnRef = useRef<Map<number, number>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tasksRef = useRef<Map<number, any>>(new Map());
  // The rendered scale depends on the container, not just the zoom: on a phone
  // a page at BASE_SCALE is far wider than the screen, so 100% means fit-to-
  // width there and the chosen zoom multiplies that.
  const [areaWidth, setAreaWidth] = useState(0);

  // Widest page decides the fit so every page lines up on the same left edge.
  const widestPage = ratios.reduce((max, r) => Math.max(max, r.w), 0);
  // Matches the container padding: p-4 (16px a side) below sm, p-8 above it.
  const gutter = areaWidth >= 640 ? 64 : 32;
  const fitScale =
    areaWidth && widestPage ? (areaWidth - gutter) / widestPage : BASE_SCALE;
  // Never blow a page up past the desktop scale just because the window is
  // wide; only shrink it when the screen cannot fit it.
  const baseScale = Math.min(BASE_SCALE, fitScale);
  const scale = zoom * baseScale;

  const [showThumbs, setShowThumbs] = useState(true);
  const [thumbs, setThumbs] = useState<string[]>([]);
  const thumbsDoneRef = useRef<Set<number>>(new Set());
  const activeThumbRef = useRef<HTMLLIElement>(null);

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

  // Load the document (remounted per report via `key`)
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
          // Draw glyphs from the embedded font outlines instead of the browser
          // font engine — fixes mangled letter spacing on embedded-font PDFs.
          disableFontFace: true,
        });
        const pdf = (await loadingTask.promise) as unknown as PdfDoc;
        if (cancelled) return;
        pdfRef.current = pdf;

        const sizes: PageRatio[] = [];
        for (let n = 1; n <= pdf.numPages; n++) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pageObj: any = await pdf.getPage(n);
          if (cancelled) return;
          const vp = pageObj.getViewport({ scale: 1 });
          sizes.push({ w: vp.width, h: vp.height });
        }
        if (cancelled) return;

        setRatios(sizes);
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

  const drawPage = useCallback(async (n: number, atScale: number) => {
    const pdf = pdfRef.current;
    const canvas = canvasElsRef.current[n - 1];
    if (!pdf || !canvas) return;

    if (drawnRef.current.get(n) === atScale) return;
    drawnRef.current.set(n, atScale);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageObj: any = await pdf.getPage(n);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const outputScale = window.devicePixelRatio || 1;
    const viewport = pageObj.getViewport({ scale: atScale * outputScale });
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    tasksRef.current.get(n)?.cancel();
    const task = pageObj.render({ canvasContext: ctx, viewport });
    tasksRef.current.set(n, task);
    try {
      await task.promise;
    } catch {
      // Cancelled because the page scrolled away or the zoom changed; drop the
      // record so it will be drawn again next time it is needed.
      drawnRef.current.delete(n);
    }
  }, []);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const measure = () => setAreaWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [status]);

  // Draw pages as they approach the viewport, and release the ones far from it
  // so a long report does not hold dozens of full-size canvases in memory.
  useEffect(() => {
    if (status !== "ready" || !numPages) return;
    const root = areaRef.current;
    if (!root) return;

    // A new scale invalidates every drawing; reconnecting re-fires the entries
    // so whatever is on screen is redrawn at the new size.
    drawnRef.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const n = Number((entry.target as HTMLElement).dataset.page);
          if (!n) continue;
          if (entry.isIntersecting) {
            void drawPage(n, scale);
          } else {
            tasksRef.current.get(n)?.cancel();
            tasksRef.current.delete(n);
            drawnRef.current.delete(n);
            const canvas = canvasElsRef.current[n - 1];
            if (canvas) {
              canvas.width = 0;
              canvas.height = 0;
            }
          }
        }
      },
      { root, rootMargin: RENDER_MARGIN },
    );

    pageElsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [status, numPages, scale, drawPage]);

  // Re-draw whenever the effective scale changes — zooming, resizing or a
  // phone rotating — keeping the reader on the page they were on.
  useEffect(() => {
    if (status !== "ready") return;
    const el = pageElsRef.current[page - 1];
    const area = areaRef.current;
    if (el && area) area.scrollTop = el.offsetTop - 16;
    // `page` is intentionally omitted: this runs on zoom changes only, and
    // reads the current page to hold position rather than reacting to it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, areaWidth, status]);

  // The page counter follows the scroll position: whichever page covers the
  // upper third of the viewport is the one being read.
  useEffect(() => {
    const area = areaRef.current;
    if (!area || status !== "ready") return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const mark = area.scrollTop + area.clientHeight * 0.35;
        let current = 1;
        for (let n = 1; n <= numPages; n++) {
          const el = pageElsRef.current[n - 1];
          if (!el) break;
          if (el.offsetTop <= mark) current = n;
          else break;
        }
        setPage(current);
      });
    };

    area.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      area.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [status, numPages]);

  const goToPage = useCallback((n: number) => {
    const area = areaRef.current;
    const el = pageElsRef.current[n - 1];
    if (!area || !el) return;
    area.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
  }, []);

  // Thumbnails are drawn one page at a time in the background, and only when
  // the panel is actually open — a 38-page report would otherwise do all that
  // work for a reader who never opens it.
  useEffect(() => {
    if (!showThumbs || status !== "ready" || !pdfRef.current) return;
    let cancelled = false;

    (async () => {
      const pdf = pdfRef.current;
      if (!pdf) return;
      for (let n = 1; n <= pdf.numPages; n++) {
        if (cancelled) return;
        if (thumbsDoneRef.current.has(n)) continue;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageObj: any = await pdf.getPage(n);
        const base = pageObj.getViewport({ scale: 1 });
        const viewport = pageObj.getViewport({ scale: 132 / base.width });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        try {
          await pageObj.render({ canvasContext: ctx, viewport }).promise;
        } catch {
          return; /* document closed mid-render */
        }
        if (cancelled) return;

        thumbsDoneRef.current.add(n);
        const url = canvas.toDataURL("image/jpeg", 0.72);
        setThumbs((prev) => {
          const next = [...prev];
          next[n - 1] = url;
          return next;
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [showThumbs, status, numPages]);

  // Keep the panel on the page being read, however the reader got there.
  // "nearest" scrolls only the panel, and only when it is off-screen.
  useEffect(() => {
    if (!showThumbs) return;
    activeThumbRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [page, showThumbs, numPages]);

  // PageUp/PageDown/Home/End jump between pages. The arrows and space are left
  // to the browser, which scrolls the column exactly as it would any document.
  useEffect(() => {
    if (status !== "ready") return;

    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "PageDown":
          e.preventDefault();
          goToPage(Math.min(numPages, page + 1));
          break;
        case "PageUp":
          e.preventDefault();
          goToPage(Math.max(1, page - 1));
          break;
        case "Home":
          e.preventDefault();
          goToPage(1);
          break;
        case "End":
          e.preventDefault();
          goToPage(numPages);
          break;
        default:
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [status, numPages, page, goToPage]);

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

  const chip =
    "flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20";


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
          <button
            type="button"
            onClick={() => setShowThumbs((v) => !v)}
            aria-label={showThumbs ? "إخفاء لوحة الصفحات" : "إظهار لوحة الصفحات"}
            aria-pressed={showThumbs}
            title={showThumbs ? "إخفاء لوحة الصفحات" : "إظهار لوحة الصفحات"}
            className={`${chip} hidden md:flex ${showThumbs ? "bg-white/25" : ""}`}
          >
            <PanelLeft className="size-4" />
          </button>
          <button type="button" onClick={print} aria-label="طباعة" className={chip}>
            <Printer className="size-4" />
          </button>
          <button type="button" onClick={onClose} aria-label="إغلاق" className={chip}>
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Page thumbnails. dir="ltr" puts the panel on the physical left, the
            side every PDF reader uses, regardless of the RTL shell. */}
        {showThumbs && (
          <aside
            dir="ltr"
            className="hidden w-[164px] shrink-0 overflow-y-auto border-e border-white/10 bg-[#071823] p-3 md:block"
            aria-label="صفحات المستند"
          >
            <ul className="flex flex-col gap-3">
              {Array.from({ length: numPages || 0 }, (_, i) => i + 1).map((n) => (
                <li key={n} ref={n === page ? activeThumbRef : null}>
                  <button
                    type="button"
                    onClick={() => goToPage(n)}
                    aria-current={n === page}
                    className={`w-full overflow-hidden rounded-[4px] border-2 transition-colors ${
                      n === page ? "border-[#00b5c2]" : "border-transparent hover:border-white/30"
                    }`}
                  >
                    {thumbs[n - 1] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbs[n - 1]} alt="" className="block w-full bg-white" />
                    ) : (
                      <span className="block aspect-[1/1.41] w-full animate-pulse bg-white/10" />
                    )}
                  </button>
                  <span className="mt-1 block text-center text-[11px] text-white/50">{n}</span>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div ref={areaRef} tabIndex={0} className="flex-1 overflow-auto bg-[#0a1f2d] p-4 outline-none sm:p-8">
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

          {status === "ready" && (
            <div className="flex flex-col items-center gap-4">
              {ratios.map((r, i) => (
                <div
                  key={i}
                  data-page={i + 1}
                  ref={(el) => {
                    pageElsRef.current[i] = el;
                  }}
                  style={{ width: r.w * scale, height: r.h * scale }}
                  className="relative shrink-0 overflow-hidden rounded-[6px] bg-white shadow-2xl"
                >
                  <canvas
                    ref={(el) => {
                      canvasElsRef.current[i] = el;
                    }}
                    className="block h-full w-full"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar — page nav + zoom */}
      <div className="flex shrink-0 items-center justify-between bg-[#0a1f2d] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage(Math.max(1, page - 1))}
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
            onClick={() => goToPage(Math.min(numPages, page + 1))}
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
