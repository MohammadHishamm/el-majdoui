/**
 * Recolours a hosted MapTiler basemap into the مساجد المجدوعي palette and
 * switches every label to Arabic.
 *
 * We load a stock MapTiler style rather than hand-authoring ~200 OpenMapTiles
 * layers, then walk the loaded layer list and repaint by category. Layer ids
 * differ between styles and change between style versions, so every match is a
 * substring heuristic and every write is wrapped — an unrecognised layer keeps
 * its stock colour instead of throwing.
 */

import type { Map as MapLibreMap } from "maplibre-gl";

/** Warm sand ground, muted greens and soft water — matches the design comp. */
export const MAP_PALETTE = {
  land: "#f2ece1",
  landAlt: "#eee6d8",
  water: "#cddce4",
  green: "#dbe7d3",
  building: "#e7ddcd",
  road: "#ffffff",
  roadCasing: "#e3d9c8",
  boundary: "#c9bda9",
  text: "#6f6455",
  textHalo: "#fbf8f2",
} as const;

/** Label text in Arabic, falling back through latin to the raw name. */
const ARABIC_LABEL = [
  "coalesce",
  ["get", "name:ar"],
  ["get", "name_ar"],
  ["get", "name:latin"],
  ["get", "name"],
];

/** MapLibre types the setters against a union of known property names; we
    address them dynamically, so this narrow view keeps the casts in one place. */
type LooseMap = {
  setPaintProperty: (layer: string, prop: string, value: unknown) => void;
  setLayoutProperty: (layer: string, prop: string, value: unknown) => void;
};

const has = (haystack: string, needles: string[]) =>
  needles.some((n) => haystack.includes(n));

export function applyBrandMapStyle(styledMap: MapLibreMap) {
  const map = styledMap as unknown as LooseMap;
  const layers = styledMap.getStyle()?.layers ?? [];

  for (const layer of layers) {
    const id = layer.id.toLowerCase();
    // Each write is independent — one unsupported property must not stop the rest.
    const set = (prop: string, value: unknown) => {
      try {
        map.setPaintProperty(layer.id, prop, value);
      } catch {
        /* layer doesn't support this paint property — leave it stock */
      }
    };

    if (layer.type === "background") {
      set("background-color", MAP_PALETTE.land);
      continue;
    }

    if (layer.type === "fill") {
      if (has(id, ["water", "ocean", "sea", "river", "lake"])) {
        set("fill-color", MAP_PALETTE.water);
      } else if (has(id, ["park", "forest", "wood", "grass", "scrub", "protected", "golf", "pitch", "cemetery"])) {
        set("fill-color", MAP_PALETTE.green);
      } else if (has(id, ["building"])) {
        set("fill-color", MAP_PALETTE.building);
      } else if (has(id, ["sand", "desert", "residential", "landuse", "landcover", "earth"])) {
        set("fill-color", MAP_PALETTE.landAlt);
      }
      continue;
    }

    if (layer.type === "line") {
      if (has(id, ["water", "river", "stream", "canal"])) {
        set("line-color", MAP_PALETTE.water);
      } else if (has(id, ["boundary", "admin"])) {
        set("line-color", MAP_PALETTE.boundary);
      } else if (has(id, ["casing", "outline"])) {
        set("line-color", MAP_PALETTE.roadCasing);
      } else if (has(id, ["road", "highway", "street", "bridge", "tunnel", "transport"])) {
        set("line-color", MAP_PALETTE.road);
      }
      continue;
    }

    if (layer.type === "symbol") {
      set("text-color", MAP_PALETTE.text);
      set("text-halo-color", MAP_PALETTE.textHalo);
      set("text-halo-width", 1.4);
      // Only relabel layers that already draw text, so icon-only layers
      // (shields, POI markers) aren't given captions they never had.
      if (layer.layout?.["text-field"] !== undefined) {
        try {
          map.setLayoutProperty(layer.id, "text-field", ARABIC_LABEL);
        } catch {
          /* expression rejected by this layer — keep the stock label */
        }
      }
    }
  }
}
