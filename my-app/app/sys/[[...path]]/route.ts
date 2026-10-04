// The previous site exposed its internal /sys/... files (zlib, inflate, crc32,
// request forms) to crawlers, and Google still lists dozens of them. They have
// no counterpart here, so answer 410 Gone rather than 404: it tells Google the
// URLs were removed on purpose and drops them from the index sooner.
// /sys/<number> never reaches this handler — next.config.ts redirects it first.
function gone() {
  return new Response("Gone", {
    status: 410,
    headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
  });
}

export const GET = gone;
export const HEAD = gone;
