"use client";

import { useState } from "react";
import Image from "next/image";
import { isEmbedUrl, videoEmbedSrc } from "@/lib/gallery";

const PLAY_ICON = "/images/Galley-of-images/play-icon.svg";

/** Extract a YouTube video id so we can use its poster image as a thumbnail. */
function youtubeId(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return u.pathname.slice(1) || null;
    if (host.endsWith("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const m = u.pathname.match(/\/embed\/([^/?]+)/);
      if (m) return m[1];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Featured video player: one large window plays the active video, with a strip of
 * clickable thumbnails below. Handles both uploaded files (<video>) and
 * YouTube/Vimeo links (iframe embed). Mirrors the AlbumViewer pattern for photos.
 */
export function VideoViewer({
  title,
  videos,
  poster,
}: {
  title: string;
  videos: string[];
  poster?: string;
}) {
  const list = videos.filter(Boolean);
  const [active, setActive] = useState(0);
  const [userPicked, setUserPicked] = useState(false);

  if (!list.length) return null;

  const current = list[active] ?? list[0];
  const embed = isEmbedUrl(current);
  const autoplaySrc = userPicked
    ? `${videoEmbedSrc(current)}${videoEmbedSrc(current).includes("?") ? "&" : "?"}autoplay=1`
    : videoEmbedSrc(current);

  const select = (i: number) => {
    setActive(i);
    setUserPicked(true);
  };

  return (
    <div>
      {/* Featured window */}
      <div className="relative aspect-video w-full overflow-hidden rounded-[16px] bg-black">
        {embed ? (
          <iframe
            key={current}
            src={autoplaySrc}
            title={title}
            className="absolute inset-0 size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            key={current}
            src={current}
            controls
            autoPlay={userPicked}
            playsInline
            poster={poster || undefined}
            className="absolute inset-0 size-full object-contain"
          />
        )}
      </div>

      {/* Thumbnail strip */}
      {list.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {list.map((v, i) => (
            <button
              key={`${v}-${i}`}
              type="button"
              onClick={() => select(i)}
              aria-label={`فيديو ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-video overflow-hidden rounded-[10px] border-2 transition-all ${
                i === active ? "border-[#005761] opacity-100" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              {(() => {
                const ytId = youtubeId(v);
                if (ytId) {
                  // eslint-disable-next-line @next/next/no-img-element
                  return <img src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} alt="" className="size-full object-cover" />;
                }
                if (!isEmbedUrl(v)) {
                  // #t seeks to a frame so the poster shows instead of a blank box.
                  return <video src={`${v}#t=0.5`} muted preload="metadata" className="size-full object-cover" />;
                }
                if (poster) {
                  // eslint-disable-next-line @next/next/no-img-element
                  return <img src={poster} alt="" className="size-full object-cover" />;
                }
                return <div className="size-full bg-[#0f1720]" />;
              })()}
              <span className="absolute inset-0 grid place-items-center bg-black/20">
                <span className="grid size-8 place-items-center rounded-full border border-white/50 bg-white/30 backdrop-blur-sm">
                  <Image src={PLAY_ICON} alt="" width={12} height={12} aria-hidden />
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
