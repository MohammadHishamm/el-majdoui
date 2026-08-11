"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Map as MapLibreMap, Marker, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { MosqueData } from "@/lib/cms/fetchers";
import { applyBrandMapStyle } from "@/lib/map/brand-style";
import styles from "./MosquesMapSection.module.css";

const ALL = "__all__";
/** Figma shows three mosque rows per page in the list panel. */
const PER_PAGE = 3;
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;

/** Roughly centres the Kingdom until the first fitBounds lands. */
const FALLBACK_CENTER: [number, number] = [45.0, 24.0];

const arabicNumber = (n: number) => n.toLocaleString("ar-EG");

const ELLIPSIS = "…";

/**
 * Page buttons for the pagination row, with runs of hidden pages collapsed to
 * an ellipsis. First and last are always reachable; the window widens at
 * whichever end the current page sits on, so the row keeps a stable width.
 */
function buildPageList(current: number, pageCount: number): (number | typeof ELLIPSIS)[] {
  if (pageCount <= 6) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, 4, ELLIPSIS, pageCount];
  if (current >= pageCount - 2) {
    return [1, ELLIPSIS, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  }
  return [1, ELLIPSIS, current - 1, current, current + 1, ELLIPSIS, pageCount];
}

type Props = {
  heading: string;
  intro: string;
  mosques: MosqueData[];
};

export default function MosquesMapSection({ heading, intro, mosques }: Props) {
  const [region, setRegion] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(mosques[0]?.id ?? null);
  const [popupNode, setPopupNode] = useState<HTMLDivElement | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);
  // Markers live in state, not a ref: building them is async, so the effect
  // that styles the active pin has to wait for them to actually exist.
  const [markers, setMarkers] = useState<{ id: string; marker: Marker }[]>([]);

  /** Distinct regions in sort order — the filter pills are content-driven. */
  const regions = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const m of mosques) {
      if (m.region && !seen.has(m.region)) {
        seen.add(m.region);
        out.push(m.region);
      }
    }
    return out;
  }, [mosques]);

  const filtered = useMemo(
    () => (region === ALL ? mosques : mosques.filter((m) => m.region === region)),
    [mosques, region],
  );

  /* Derived, not stored: when a filter hides the selected mosque we fall back
     to the first visible one without having to correct state in an effect. */
  const active = useMemo(
    () => filtered.find((m) => m.id === activeId) ?? filtered[0] ?? null,
    [filtered, activeId],
  );

  /* Clamped rather than reset in an effect, so a shrinking filter can never
     strand the list on a page that no longer exists. */
  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const pageItems = useMemo(
    () => filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE),
    [filtered, current],
  );

  /** Page buttons with gaps collapsed to an ellipsis: 1 2 3 4 … 10. */
  const pageList = useMemo(() => buildPageList(current, pageCount), [current, pageCount]);

  /* ---- Create the map once ---- */
  useEffect(() => {
    if (!MAPTILER_KEY || !containerRef.current || mapRef.current) return;
    let cancelled = false;

    // Dynamic import keeps ~200KB of WebGL renderer out of the page bundle
    // and off the server, where `window` doesn't exist.
    (async () => {
      const maplibregl = await import("maplibre-gl");
      if (cancelled || !containerRef.current) return;

      // v6 resolves its tile-parsing worker from `import.meta.url`, which
      // Turbopack rewrites to a non-http value — the lookup then yields an
      // empty URL and the map paints its background with no features at all.
      // public/maplibre/ is populated by scripts/copy-maplibre-assets.mjs.
      maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

      // Arabic needs the RTL shaper. It's global and throws if set twice, so
      // only the first mount installs it.
      if (maplibregl.getRTLTextPluginStatus() === "unavailable") {
        try {
          await maplibregl.setRTLTextPlugin("/maplibre/mapbox-gl-rtl-text.js", true);
        } catch {
          /* already installed by another instance — labels still shape fine */
        }
      }

      const map = new maplibregl.Map({
        container: containerRef.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
        center: FALLBACK_CENTER,
        zoom: 4.2,
        attributionControl: { compact: true },
      });
      mapRef.current = map;

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
      map.scrollZoom.disable(); // page scroll must not be hijacked by the map

      const node = document.createElement("div");
      popupRef.current = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        anchor: "bottom",
        offset: 46,
        maxWidth: "260px",
        // Defaults to true, which focuses the popup on open — the browser then
        // scrolls it into view and the page jumps to the top of the map on
        // every selection. Selection is driven by the list, so we keep focus.
        focusAfterOpen: false,
      }).setDOMContent(node);

      map.on("load", () => {
        if (cancelled) return;
        applyBrandMapStyle(map);
        setPopupNode(node);
      });
    })();

    return () => {
      cancelled = true;
      popupRef.current?.remove();
      popupRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  /* ---- Rebuild pins whenever the visible set changes ---- */
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !popupNode) return;
    let cancelled = false;
    // Each run owns the markers it created and tears them down on cleanup,
    // so the state updater below stays free of side effects.
    let created: { id: string; marker: Marker }[] = [];

    (async () => {
      const maplibregl = await import("maplibre-gl");
      if (cancelled || !mapRef.current) return;

      const next = filtered.map((mosque) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = styles.pin;
        el.setAttribute("aria-label", mosque.name);
        el.innerHTML = `<span class="${styles.pinHead}"><span class="${styles.pinIcon}"></span></span><span class="${styles.pinTail}"></span>`;
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          setActiveId(mosque.id);
        });

        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([mosque.lng, mosque.lat])
          .addTo(map);
        return { id: mosque.id, marker };
      });
      created = next;
      setMarkers(next);

      // Frame the filtered set. A single result still needs a real box, so we
      // let fitBounds collapse and cap it with maxZoom.
      if (filtered.length) {
        const bounds = new maplibregl.LngLatBounds();
        filtered.forEach((m) => bounds.extend([m.lng, m.lat]));
        map.fitBounds(bounds, {
          padding: { top: 70, bottom: 70, left: 70, right: 70 },
          maxZoom: 11,
          duration: 700,
        });
      }
    })();

    return () => {
      cancelled = true;
      created.forEach(({ marker }) => marker.remove());
    };
  }, [filtered, popupNode]);

  /* ---- Reflect the active mosque onto the pins and the popup ---- */
  useEffect(() => {
    markers.forEach(({ id, marker }) => {
      marker.getElement().classList.toggle(styles.pinActive, id === active?.id);
    });

    const map = mapRef.current;
    const popup = popupRef.current;
    if (!map || !popup) return;

    if (!active) {
      popup.remove();
      return;
    }
    popup.setLngLat([active.lng, active.lat]).addTo(map);
  }, [active, markers]);

  /** Selecting from the list also recentres the map on that mosque. */
  const selectMosque = useCallback((mosque: MosqueData) => {
    setActiveId(mosque.id);
    mapRef.current?.flyTo({ center: [mosque.lng, mosque.lat], zoom: 12, duration: 900 });
  }, []);

  return (
    <section className={styles.section} aria-labelledby="mosques-map-heading">
      <div className={styles.row}>
        <div className={styles.listCol}>
          <div className={styles.header}>
            <h2 id="mosques-map-heading" className={styles.title}>
              {heading}
            </h2>
            {intro && <p className={styles.intro}>{intro}</p>}
          </div>

          {regions.length > 1 && (
            <div className={styles.filterRow} role="group" aria-label="تصفية حسب المنطقة">
              <button
                type="button"
                onClick={() => {
                  setRegion(ALL);
                  setPage(1);
                }}
                aria-pressed={region === ALL}
                className={`${styles.pill} ${region === ALL ? styles.pillActive : ""}`}
              >
                الكل
              </button>
              {regions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRegion(r);
                    setPage(1);
                  }}
                  aria-pressed={region === r}
                  className={`${styles.pill} ${region === r ? styles.pillActive : ""}`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          <div className={styles.cards}>
            {filtered.length === 0 ? (
              <p className={styles.empty}>لا توجد جوامع في هذه المنطقة.</p>
            ) : (
              pageItems.map((mosque) => (
                <button
                  key={mosque.id}
                  type="button"
                  onClick={() => selectMosque(mosque)}
                  aria-current={mosque.id === active?.id}
                  className={`${styles.card} ${mosque.id === active?.id ? styles.cardActive : ""}`}
                >
                  {/* Thumbnail first: the row is RTL, so the first child sits
                      on the right, as in the design. */}
                  {mosque.image && (
                    <span className={styles.thumb}>
                      <Image
                        src={mosque.image}
                        alt=""
                        fill
                        sizes="72px"
                        style={{ objectFit: "cover" }}
                      />
                    </span>
                  )}
                  <span className={styles.cardBody}>
                    <span className={styles.cardTitle}>{mosque.name}</span>
                    {mosque.district && (
                      <span className={styles.cardDistrict}>{mosque.district}</span>
                    )}
                  </span>
                </button>
              ))
            )}
          </div>

          {pageCount > 1 && (
            /* Laid out LTR so the numbers ascend left-to-right, matching the
               pagination on the news and programs pages. */
            <nav className={styles.pagination} dir="ltr" aria-label="تصفّح الجوامع">
              <button
                type="button"
                onClick={() => setPage(current - 1)}
                disabled={current === 1}
                className={styles.pageBtn}
              >
                <ChevronLeft className={styles.pageIcon} aria-hidden />
                السابق
              </button>

              {pageList.map((entry, i) =>
                entry === ELLIPSIS ? (
                  <span key={`gap-${i}`} className={styles.pageGap} aria-hidden>
                    {ELLIPSIS}
                  </span>
                ) : (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => setPage(entry)}
                    aria-label={`صفحة ${entry}`}
                    aria-current={entry === current ? "page" : undefined}
                    className={`${styles.pageNum} ${entry === current ? styles.pageNumActive : ""}`}
                  >
                    {entry}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => setPage(current + 1)}
                disabled={current === pageCount}
                className={styles.pageBtn}
              >
                التالي
                <ChevronRight className={styles.pageIcon} aria-hidden />
              </button>
            </nav>
          )}
        </div>

        <div className={styles.mapCol}>
          {MAPTILER_KEY ? (
            <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
          ) : (
            <p className={styles.mapFallback}>
              الخريطة غير متاحة حالياً — لم يتم ضبط مفتاح خدمة الخرائط.
            </p>
          )}
        </div>
      </div>

      {/* The popup card lives inside MapLibre's DOM, portalled so it stays JSX. */}
      {popupNode &&
        active &&
        createPortal(
          <div className={styles.popup}>
            {active.image && (
              <span className={styles.popupImage}>
                <Image src={active.image} alt="" fill sizes="260px" style={{ objectFit: "cover" }} />
              </span>
            )}
            <div className={styles.popupContent}>
              <div className={styles.popupHeader}>
                <p className={styles.popupTitle}>{active.name}</p>
                {active.district && <p className={styles.popupDistrict}>{active.district}</p>}
              </div>
              <div className={styles.popupSpecs}>
                <a
                  className={styles.mapsLink}
                  href={active.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  فتح في الخرائط
                </a>
                {active.capacity ? (
                  <span className={styles.popupCapacity}>
                    يتسع لـ {arabicNumber(active.capacity)} مصلٍ
                  </span>
                ) : null}
              </div>
            </div>
          </div>,
          popupNode,
        )}
    </section>
  );
}
