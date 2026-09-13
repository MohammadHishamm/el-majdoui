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

const nextConfig: NextConfig = {
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
