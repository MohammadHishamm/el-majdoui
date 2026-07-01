import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { AlbumViewer } from "@/components/gallery/AlbumViewer";
import { VideoViewer } from "@/components/gallery/VideoViewer";
import { isEmbedUrl } from "@/lib/gallery";
import { getGalleryAlbumBySlug, getRelatedGalleryItems } from "@/lib/cms/fetchers";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site/config";
import { absoluteUrl, breadcrumbJsonLd, ogImage } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

// CMS-driven content is rendered dynamically (RLS at request time).
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await getGalleryAlbumBySlug(slug);
  if (!album) return { title: "المحتوى غير موجود", robots: { index: false, follow: true } };
  const url = `/gallery/${slug}`;
  const description = album.about || album.meta || album.title;
  const share = ogImage(album.cover || album.images[0]);
  return {
    title: `${album.title} | ${siteConfig.fullName}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: album.title,
      description,
      images: [{ url: share, alt: album.title }],
    },
    twitter: { card: "summary_large_image", title: album.title, description, images: [share] },
  };
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full items-start justify-between gap-4">
      <span className="shrink-0 text-[14px] leading-[21px] text-[#6a7282]">{label}</span>
      <span className="text-left text-[14px] font-bold leading-[21px] text-[#005761]">{value}</span>
    </div>
  );
}

export default async function GalleryAlbumPage({ params }: Props) {
  const { slug } = await params;
  const album = await getGalleryAlbumBySlug(slug);
  if (!album) notFound();

  const related = await getRelatedGalleryItems(slug, 3);
  const videos = album.videos.filter(Boolean).slice(0, 4);
  const isVideo = album.type === "video" && videos.length > 0;
  // Guard the image viewer against non-image URLs (e.g. a video link pasted into an image slot).
  const albumImages = album.images.filter((src) => src && !isEmbedUrl(src));

  const imageCount = album.type === "album" ? albumImages.length : 0;
  const meta = [
    album.date && { key: "date", label: "التاريخ", value: album.date },
    imageCount > 0 && { key: "count", label: "عدد الصور", value: `${imageCount} صورة` },
    album.location && { key: "location", label: "الموقع", value: album.location },
    album.photographer && { key: "photographer", label: "المصور", value: album.photographer },
    album.section && { key: "section", label: "القسم", value: album.section },
  ].filter(Boolean) as { key: string; label: string; value: string }[];

  const breadcrumb = breadcrumbJsonLd([
    { name: "الرئيسية", path: "/" },
    { name: "معرض الصور والفيديو", path: "/gallery" },
    { name: album.title, path: `/gallery/${album.slug}` },
  ]);
  const mediaLd = {
    "@context": "https://schema.org",
    "@type": isVideo ? "VideoObject" : "ImageGallery",
    name: album.title,
    description: album.about || album.meta || album.title,
    inLanguage: "ar",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/gallery/${album.slug}`) },
    ...(isVideo
      ? { thumbnailUrl: [absoluteUrl(ogImage(album.cover))], contentUrl: album.videoUrl }
      : { image: album.images.map((i) => absoluteUrl(ogImage(i))) }),
  };

  return (
    <main dir="rtl" className="bg-white" data-nav-surface="light">
      <JsonLd data={[mediaLd, breadcrumb]} />

      {/* Header */}
      <section className="-mt-28 bg-white pt-40 md:pt-44">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <nav className="flex flex-wrap items-center gap-2 text-[13px] text-text-muted" aria-label="مسار التنقل">
              <Link href="/gallery" className="transition-colors hover:text-[#005761]">
                معرض الصور والفيديو
              </Link>
              <span aria-hidden>/</span>
              <span className="text-[#374151]">{album.title}</span>
            </nav>
            <h1 className="mt-4 text-right text-[30px] font-medium leading-[38px] text-[#005761] md:text-[36px] md:leading-[44px]">
              {album.title}
            </h1>
            {album.meta && <p className="mt-2 text-right text-[15px] text-[#6a7282]">{album.meta}</p>}
            <div className="mt-8 h-px w-full bg-gray-200" />
          </FadeInUp>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white pb-20 pt-8 md:pb-28">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 sm:px-6 lg:px-8">
          {/* Media */}
          <FadeInUp className="min-w-0">
            {isVideo ? (
              <VideoViewer title={album.title} videos={videos} poster={album.cover || undefined} />
            ) : (
              <AlbumViewer title={album.title} images={albumImages} />
            )}
          </FadeInUp>

          {/* About + details — below images */}
          {(meta.length > 0 || album.about) && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[656fr_424fr] lg:items-start lg:gap-10">
              {album.about && (
                <FadeInUp>
                  <div className="w-full">
                    <h2 className="text-right text-[22px] font-bold leading-[33px] text-[#005761]">عن الألبوم</h2>
                    <p className="mt-4 whitespace-pre-line text-right text-[16px] leading-[30.4px] text-[#364153]">
                      {album.about}
                    </p>
                  </div>
                </FadeInUp>
              )}

              {meta.length > 0 && (
                <FadeInUp>
                  <div className="w-full rounded-[16px] bg-[#e8f1f2] p-6">
                    <h2 className="text-right text-[16px] font-bold leading-[24px] text-[#005761]">معلومات الألبوم</h2>
                    <div className="mt-4 flex w-full flex-col gap-3">
                      {meta.map((m) => (
                        <DetailRow key={m.key} label={m.label} value={m.value} />
                      ))}
                    </div>
                  </div>
                </FadeInUp>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-[#f7fafa] py-16 md:py-20">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <FadeInUp>
              <h2 className="mb-8 text-right text-[24px] font-medium text-[#005761] md:text-[28px]">
                محتوى ذو صلة
              </h2>
            </FadeInUp>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <FadeInUp key={item.id} delay={i * 80}>
                  <Link
                    href={`/gallery/${item.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[12px] border-[1.18px] border-[#f3f4f6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                  >
                    <div className="relative aspect-[355/222] w-full overflow-hidden">
                      <Image
                        src={item.thumb}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 90vw, 355px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 p-5 text-right">
                      <h3 className="line-clamp-2 break-words text-[16px] font-bold leading-[24px] text-[#005761]">
                        {item.title}
                      </h3>
                      <p className="line-clamp-1 break-words text-[13px] leading-[19.5px] text-[#6a7282]">{item.meta}</p>
                    </div>
                  </Link>
                </FadeInUp>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
