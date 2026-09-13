import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default config: every page here is `force-dynamic`, so no ISR cache (R2/KV)
// is needed. Add `incrementalCache` / `queue` here if pages ever move to ISR.
export default defineCloudflareConfig({});
