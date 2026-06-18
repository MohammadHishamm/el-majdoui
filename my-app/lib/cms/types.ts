/** CMS content types — aligned with website brief content model */

export type NewsCategory = "أخبار" | "إعلان" | "تقرير" | "فعالية";

export type News = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  category: NewsCategory;
  tags?: string[];
  author?: string;
  relatedNewsIds?: string[];
  attachments?: string[];
};

export type InitiativeStatus = "نشطة" | "قادمة" | "منتهية" | "موسمية";

export type Initiative = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  cardImage: string;
  focusAreaSlug: string;
  targetAudience: string[];
  status: InitiativeStatus;
  objectives?: string[];
  locations?: string[];
  applyLink?: string;
  ctaText?: string;
  isFeatured?: boolean;
};

export type FocusArea = {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  icon?: string;
  color?: string;
  order: number;
};

export type ImpactKPI = {
  id: string;
  label: string;
  value: number;
  unit?: string;
  year: string;
  icon?: string;
  source?: string;
};

export type LeaderType = "مجلس أمناء" | "تنفيذية" | "قيادات";

export type Leader = {
  id: string;
  name: string;
  position: string;
  type: LeaderType;
  photo: string;
  shortBio: string;
  fullBio?: string;
  email?: string;
  order: number;
};

export type ReportType = "سنوي" | "أثر" | "أدلة" | "دراسات";

export type Report = {
  id: string;
  title: string;
  type: ReportType;
  year: string;
  description?: string;
  coverImage?: string;
  pdfFile: string;
};

export type JobStatus = "مفتوحة" | "مغلقة";
export type JobType = "دوام كامل" | "جزئي" | "عن بُعد";
export type ApplyMethod = "نموذج داخلي" | "رابط خارجي";

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  description: string;
  requirements: string;
  deadline: string;
  status: JobStatus;
  applyMethod: ApplyMethod;
  applyLinkOrForm: string;
};

export type GalleryAlbum = {
  id: string;
  name: string;
  coverImage: string;
  eventDate: string;
  initiativeSlug?: string;
  images: string[];
};

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
  description?: string;
  date: string;
  category?: string;
};

export type Policy = {
  id: string;
  name: string;
  type: string;
  description?: string;
  pdfFile: string;
  issuedAt: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  category?: string;
  tags?: string[];
  href: string;
};

export type SiteSettings = {
  aboutShort: string;
  aboutTitle: string;
  leadershipQuote?: {
    quote: string;
    name: string;
    position: string;
    photo?: string;
    href?: string;
  };
  licenseNumber?: string;
  foundedYear?: string;
  geographicScope?: string;
};
