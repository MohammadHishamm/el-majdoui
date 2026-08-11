"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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

/** Pins closer than this on screen are merged — slightly wider than a 36px
    pin, so a cluster forms just before two pins would visibly touch. */
const CLUSTER_PX = 46;
/** Street level: far enough in that grouped mosques always come apart. */
const MAX_ZOOM = 15;
/** Floor when focusing a single mosque from the list or a pin. */
const MOSQUE_ZOOM = 12;

type PinGroup = { x: number; y: number; lng: number; lat: number; items: MosqueData[] };

/**
 * Groups mosques that land within CLUSTER_PX of each other on screen.
 *
 * Screen space rather than geographic distance, because what the user needs to
 * be told is "these pins are drawn on top of each other" — which depends
 * entirely on the current zoom. Recomputed on every moveend.
 */
function groupByProximity(map: MapLibreMap, items: MosqueData[]): PinGroup[] {
  const groups: PinGroup[] = [];

  for (const mosque of items) {
    const p = map.project([mosque.lng, mosque.lat]);
    const hit = groups.find((g) => Math.hypot(g.x - p.x, g.y - p.y) < CLUSTER_PX);

    if (!hit) {
      groups.push({ x: p.x, y: p.y, lng: mosque.lng, lat: mosque.lat, items: [mosque] });
      continue;
    }

    // Re-anchor to the members' centroid so the cluster pin sits among them
    // rather than on whichever mosque happened to be first.
    hit.items.push(mosque);
    hit.lng = hit.items.reduce((sum, m) => sum + m.lng, 0) / hit.items.length;
    hit.lat = hit.items.reduce((sum, m) => sum + m.lat, 0) / hit.items.length;
    const centre = map.project([hit.lng, hit.lat]);
    hit.x = centre.x;
    hit.y = centre.y;
  }

  return groups;
}

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
  // Dismissing the card only hides it — the mosque stays selected, so its pin
  // and list row keep their highlight until something else is picked.
  const [popupClosed, setPopupClosed] = useState(false);

  // Bumped on every moveend so pins regroup for the new zoom level.
  const [viewVersion, setViewVersion] = useState(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const markersRef = useRef<{ ids: string[]; marker: Marker }[]>([]);
  // The module is cached after init so pin rebuilds are synchronous — an await
  // between removing and re-adding markers can let a frame paint without them.
  const maplibreRef = useRef<typeof import("maplibre-gl") | null>(null);

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
      maplibreRef.current = maplibregl;

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-left");
      map.scrollZoom.disable(); // page scroll must not be hijacked by the map

      // Grouping is done in screen space, so it has to be recomputed whenever
      // the camera settles. Marker positions themselves track their own
      // coordinates, so mid-gesture staleness is invisible.
      map.on("moveend", () => {
        if (!cancelled) setViewVersion((v) => v + 1);
      });

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

  /** Centre on a mosque and move closer, never pulling back out. */
  const zoomToMosque = useCallback((mosque: MosqueData) => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [mosque.lng, mosque.lat],
      zoom: Math.min(Math.max(map.getZoom() + 2, MOSQUE_ZOOM), MAX_ZOOM),
      duration: 800,
    });
  }, []);

  /** Clicking a cluster frames its members, which is what pulls them apart. */
  const expandCluster = useCallback((items: MosqueData[]) => {
    const map = mapRef.current;
    const mgl = maplibreRef.current;
    if (!map || !mgl) return;
    const bounds = new mgl.LngLatBounds();
    items.forEach((m) => bounds.extend([m.lng, m.lat]));
    map.fitBounds(bounds, { padding: 90, maxZoom: MAX_ZOOM, duration: 700 });
  }, []);

  /* ---- Frame the filtered set. Kept apart from pin building: this moves the
         camera, and a camera move feeds back into the pin effect below. ---- */
  useEffect(() => {
    const map = mapRef.current;
    const mgl = maplibreRef.current;
    if (!map || !mgl || !popupNode || !filtered.length) return;
    const bounds = new mgl.LngLatBounds();
    filtered.forEach((m) => bounds.extend([m.lng, m.lat]));
    map.fitBounds(bounds, {
      padding: { top: 70, bottom: 70, left: 70, right: 70 },
      maxZoom: 11,
      duration: 700,
    });
  }, [filtered, popupNode]);

  /* ---- Build pins, collapsing overlapping ones into a counted cluster ---- */
  useEffect(() => {
    const map = mapRef.current;
    const mgl = maplibreRef.current;
    if (!map || !mgl || !popupNode) return;

    markersRef.current = groupByProximity(map, filtered).map((group) => {
      const count = group.items.length;
      const el = document.createElement("button");
      el.type = "button";
      el.className = styles.pin;

      if (count > 1) {
        el.classList.add(styles.pinCluster);
        el.setAttribute("aria-label", `${count} جوامع في هذا الموقع — اضغط للتكبير`);
        el.innerHTML = `<span class="${styles.pinHead}"><span class="${styles.pinCount}">${count}</span></span><span class="${styles.pinTail}"></span>`;
      } else {
        el.setAttribute("aria-label", group.items[0].name);
        el.innerHTML = `<span class="${styles.pinHead}"><span class="${styles.pinIcon}"></span></span><span class="${styles.pinTail}"></span>`;
        if (group.items[0].id === active?.id) el.classList.add(styles.pinActive);
      }

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        if (count > 1) {
          expandCluster(group.items);
        } else {
          setActiveId(group.items[0].id);
          setPopupClosed(false);
          zoomToMosque(group.items[0]);
        }
      });

      return {
        ids: group.items.map((m) => m.id),
        marker: new mgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([group.lng, group.lat])
          .addTo(map),
      };
    });

    return () => {
      markersRef.current.forEach(({ marker }) => marker.remove());
      markersRef.current = [];
    };
  }, [filtered, popupNode, viewVersion, active, expandCluster, zoomToMosque]);

  /* ---- Keep the popup anchored to the active mosque ---- */
  useEffect(() => {
    const map = mapRef.current;
    const popup = popupRef.current;
    if (!map || !popup) return;

    if (!active || popupClosed) {
      popup.remove();
      return;
    }
    popup.setLngLat([active.lng, active.lat]).addTo(map);
  }, [active, popupClosed]);

  /** Selecting from the list also recentres the map on that mosque. */
  const selectMosque = useCallback(
    (mosque: MosqueData) => {
      setActiveId(mosque.id);
      setPopupClosed(false);
      zoomToMosque(mosque);
    },
    [zoomToMosque],
  );

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
                  setPopupClosed(false);
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
                    setPopupClosed(false);
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
        !popupClosed &&
        createPortal(
          <div className={`${styles.popup} ${active.image ? "" : styles.popupNoImage}`}>
            <button
              type="button"
              className={styles.popupClose}
              onClick={() => setPopupClosed(true)}
              aria-label="إغلاق"
            >
              <X className={styles.popupCloseIcon} aria-hidden />
            </button>
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
