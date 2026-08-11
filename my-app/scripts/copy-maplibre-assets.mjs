/**
 * Copies MapLibre's runtime assets into public/maplibre/.
 *
 * MapLibre v6 splits the tile-parsing web worker into its own module and
 * resolves it from `import.meta.url`:
 *
 *   function () { let e = import.meta.url;
 *                 if (!/^https?:/.test(e)) return ``; ... }
 *
 * Under Turbopack `import.meta.url` is not an http(s) URL, so that returns an
 * empty string, no worker starts, and the map renders its background with zero
 * features. We serve the worker ourselves and point the library at it with
 * `setWorkerUrl`. The worker imports ./maplibre-gl-shared.mjs by relative path,
 * so both files have to land in the same directory.
 *
 * The RTL text shaper (Arabic labels) is vendored here too, to keep the map
 * free of any external CDN request.
 *
 * Runs on postinstall so upgrading maplibre-gl can't leave a stale worker
 * behind — a mismatched worker and main bundle fail in confusing ways.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "public", "maplibre");

const files = [
  ["maplibre-gl", "dist/maplibre-gl-worker.mjs"],
  ["maplibre-gl", "dist/maplibre-gl-shared.mjs"],
  ["@mapbox/mapbox-gl-rtl-text", "dist/mapbox-gl-rtl-text.js"],
];

mkdirSync(dest, { recursive: true });

for (const [pkg, file] of files) {
  const from = join(root, "node_modules", pkg, file);
  const to = join(dest, file.split("/").pop());
  try {
    copyFileSync(from, to);
  } catch (err) {
    // Don't fail the whole install — the map degrades to its fallback message.
    console.warn(`[maplibre] could not copy ${pkg}/${file}: ${err.message}`);
  }
}
