export type GalleryType = "album" | "video";

export const galleryFilters: { id: "all" | GalleryType; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "album", label: "ألبومات الصور" },
  { id: "video", label: "مكتبة الفيديو" },
];

export type GalleryItem = {
  id: string;
  type: GalleryType;
  title: string;
  /** e.g. "12 صورة · يونيو 2026" or "مدة 3:42 · مايو 2026" */
  meta: string;
  /** Card thumbnail */
  thumb: string;
  /** Large featured image */
  cover: string;
};

const DIR = "/images/Galley-of-images";

// Display order is right-to-left (first item appears on the right in RTL).
export const galleryItems: GalleryItem[] = [
  {
    id: "partners-meetup-3",
    type: "album",
    title: "ألبوم ملتقى الشركاء الثالث",
    meta: "12 صورة · يونيو 2026",
    thumb: `${DIR}/image-3.png`,
    cover: `${DIR}/big-image.png`,
  },
  {
    id: "tadmin-video",
    type: "video",
    title: "فيديو توثيقي لبرنامج تضمين",
    meta: "مدة 3:42 · مايو 2026",
    thumb: `${DIR}/image-2.jpg`,
    cover: `${DIR}/image-2.jpg`,
  },
  {
    id: "jami-baha-opening",
    type: "album",
    title: "افتتاح جامع المجدوعي في الباحة",
    meta: "24 صورة · مايو 2026",
    thumb: `${DIR}/image-1.jpg`,
    cover: `${DIR}/image-1.jpg`,
  },
];
