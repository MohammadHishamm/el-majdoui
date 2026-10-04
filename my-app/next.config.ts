import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Lets `next dev` see Cloudflare bindings (e.g. the Images binding) via
// getCloudflareContext(). Guarded explicitly: this config is also built by
// Vercel (staging), and the hook's own "am I in next dev" check is a
// heuristic rather than a NODE_ENV test.
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}

// Allow next/image to optimise images uploaded to Supabase Storage (public bucket).
const supabaseHostname = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ibcnfufiyrnkfgxjkanr.supabase.co",
    ).hostname;
  } catch {
    return "ibcnfufiyrnkfgxjkanr.supabase.co";
  }
})();

// The previous site (replaced 2026-09-20) used numeric-id URLs that Google had
// indexed - 117 of its 120 archived pages would otherwise 404 here. Old ids
// cannot be mapped one-to-one to the new slugs, so each old section 301s to its
// closest new section. `:id(\d+)` keeps these from ever matching new slugs.
const LEGACY_REDIRECTS = [
  { source: "/news/:id(\\d+)", destination: "/news" },
  { source: "/media", destination: "/gallery" },
  { source: "/media/:id(\\d+)", destination: "/gallery" },
  { source: "/video", destination: "/videos" },
  { source: "/video/:id(\\d+)", destination: "/videos" },
  { source: "/pages/:id(\\d+)", destination: "/about" },
  { source: "/management2", destination: "/about/board" },
  { source: "/management2/:id(\\d+)", destination: "/about/board" },
  { source: "/projects", destination: "/programs" },
  { source: "/projects/:id(\\d+)", destination: "/programs" },
  { source: "/sys/:id(\\d+)", destination: "/" },
];

// Production is Cloudflare Workers (master) on www.almajdouie.org; Vercel (main)
// is staging on its *.vercel.app URL. Both rules match on the request host, not
// on which platform built the app, so they stay correct during the move.
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Vercel's domain settings used to send the bare domain to www; on Workers
      // the app has to do it.
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "almajdouie.org" }],
        destination: "https://www.almajdouie.org/:path*",
        permanent: true,
      },
      ...LEGACY_REDIRECTS.map((r) => ({ ...r, permanent: true })),
    ];
  },
  async headers() {
    return [
      {
        // Keep the staging copy out of search results so it never competes with
        // the real site.
        source: "/:path*",
        has: [{ type: "host" as const, value: "(?<host>.+)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
