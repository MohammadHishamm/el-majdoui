export type GalleryType = "album" | "video";

export const galleryFilters: { id: "all" | GalleryType; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "album", label: "ألبومات الصور" },
  { id: "video", label: "مكتبة الفيديو" },
];

export type GalleryItem = {
  id: string;
  type: GalleryType;
  /** URL slug for the album detail page (/gallery/[slug]). */
  slug: string;
  title: string;
  /** e.g. "12 صورة · يونيو 2026" or "مدة 3:42 · مايو 2026" */
  meta: string;
  /** Card thumbnail */
  thumb: string;
  /** Large featured image */
  cover: string;
  /** External video URL (for type === "video"). */
  videoUrl?: string | null;
};

/** Full album detail for /gallery/[slug]. */
export type GalleryAlbum = {
  id: string;
  slug: string;
  type: GalleryType;
  title: string;
  meta: string;
  cover: string;
  /** Album photos (carousel + thumbnails). Falls back to [cover] when empty. */
  images: string[];
  date: string;
  location: string;
  photographer: string;
  section: string;
  about: string;
  /** One or more videos (for type === "video"): uploaded files or YouTube/Vimeo links. */
  videos: string[];
  videoUrl?: string | null;
};

/** True for YouTube/Vimeo links (rendered via iframe rather than a native <video> tag). */
export function isEmbedUrl(url: string): boolean {
  return /(youtube\.com|youtu\.be|vimeo\.com)/i.test(url);
}

/** Convert a YouTube/Vimeo URL to an embeddable src; return the raw URL otherwise. */
export function videoEmbedSrc(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
    if (host.endsWith("vimeo.com")) return `https://player.vimeo.com/video/${u.pathname.split("/").filter(Boolean).pop()}`;
    return url;
  } catch {
    return url;
  }
}

const DIR = "/images/Galley-of-images";

// Display order is right-to-left (first item appears on the right in RTL).
export const galleryItems: GalleryItem[] = [
  {
    id: "partners-meetup-3",
    slug: "partners-meetup-3",
    type: "album",
    title: "ألبوم ملتقى الشركاء الثالث",
    meta: "12 صورة · يونيو 2026",
    thumb: `${DIR}/image-3.png`,
    cover: `${DIR}/big-image.png`,
  },
  {
    id: "tadmin-video",
    slug: "tadmin-video",
    type: "video",
    title: "فيديو توثيقي لبرنامج تضمين",
    meta: "مدة 3:42 · مايو 2026",
    thumb: `${DIR}/image-2.jpg`,
    cover: `${DIR}/image-2.jpg`,
  },
  {
    id: "jami-baha-opening",
    slug: "jami-baha-opening",
    type: "album",
    title: "افتتاح جامع المجدوعي في الباحة",
    meta: "24 صورة · مايو 2026",
    thumb: `${DIR}/image-1.jpg`,
    cover: `${DIR}/image-1.jpg`,
  },
];
