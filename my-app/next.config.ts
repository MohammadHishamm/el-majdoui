import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

// Lets `next dev` see Cloudflare bindings (e.g. the Images binding) via
// getCloudflareContext(); a no-op in production where the worker owns them.
initOpenNextCloudflareForDev();

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
