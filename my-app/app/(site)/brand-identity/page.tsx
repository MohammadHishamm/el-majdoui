import type { Metadata } from "next";
import Image from "next/image";
import { FadeInUp } from "@/components/ui/fade-in-up";
import { ColorSwatches } from "@/components/brand/ColorSwatches";

export const metadata: Metadata = {
  title: "الهوية البصرية | مؤسسة المجدوعي الخيرية",
  description:
    "دليلك الشامل لاستخدام عناصر الهوية البصرية لمؤسسة المجدوعي الخيرية وتطبيقاتها المعتمدة.",
};

const DOWNLOAD_ICON = "/images/identity/download-icon.svg";

type LogoCard = {
  image: string;
  label: string;
  variant: "light" | "dark";
  links: { text: string; href: string }[];
};

const LOGO_CARDS: LogoCard[] = [
  {
    // الإصدار الأساسي — light, appears on the right in RTL
    image: "/images/identity/right-card.png",
    label: "الإصدار الأساسي · للخلفيات الفاتحة",
    variant: "light",
    links: [
      { text: "تحميل SVG (للطباعة)", href: "/images/identity/logo-primary.svg" },
      { text: "تحميل PNG (للمواقع والـ UI)", href: "/images/identity/right-card.png" },
    ],
  },
  {
    // الإصدار المعكوس — dark, appears on the left in RTL
    image: "/images/identity/left-card.png",
    label: "الإصدار المعكوس · للخلفيات الداكنة",
    variant: "dark",
    links: [
      { text: "تحميل SVG المعكوس", href: "/images/identity/logo-reversed.svg" },
      { text: "تحميل PNG المعكوس", href: "/images/identity/left-card.png" },
    ],
  },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-8 text-right text-[24px] font-bold leading-[33px] text-[#005761]">
      {children}
    </h2>
  );
}

export default function BrandIdentityPage() {
  return (
    <main dir="rtl" className="bg-white" data-nav-surface="light">
      {/* Header (negative margin keeps the sticky navbar solid on load) */}
      <section className="-mt-28 bg-white pt-40 md:pt-44">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-text-muted">
              المركز الإعلامي
            </p>
            <h1 className="mt-4 text-right text-[36px] font-medium leading-[40px] text-[#005761] md:text-[40px]">
              الهوية البصرية
            </h1>
            <p className="mt-5 max-w-3xl text-right text-[16px] leading-[29px] text-text-medium">
              دليلك الشامل لاستخدام عناصر الهوية البصرية لمؤسسة المجدوعي الخيرية،
              وتطبيقاتها المعتمدة في التغطيات الإعلامية.
            </p>
            <div className="mt-8 h-px w-full bg-gray-200" />
          </FadeInUp>
        </div>
      </section>

      {/* PDF guide banner */}
      <section className="bg-white pt-10">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <div className="flex flex-col items-stretch gap-6 rounded-[12px] bg-[#005761] px-6 py-7 text-right md:flex-row-reverse md:items-center md:justify-between md:px-9 md:py-8">
              <div>
                <h3 className="text-[18px] font-bold leading-[27px] text-white">
                  تحميل دليل الهوية البصرية كاملاً (إصدار V2)
                </h3>
                <p className="mt-1 text-[14px] leading-[21px] text-white/90">
                  ملف PDF يحتوي على معايير الاستخدام الخطية والبصرية.
                </p>
              </div>
              <a
                href="/brand/almajdouie-visual-identity-v2.pdf"
                download
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-[20px] bg-white px-6 py-3 text-[15px] font-bold text-[#005761] transition-colors hover:bg-white/90 md:self-auto"
              >
                <Image src={DOWNLOAD_ICON} alt="" width={20} height={20} aria-hidden />
                تحميل الدليل كاملاً PDF
              </a>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Official logo & usages */}
      <section className="bg-white pt-16" aria-labelledby="logos-heading">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading>
              <span id="logos-heading">الشعار الرسمي واستخداماته</span>
            </SectionHeading>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {LOGO_CARDS.map((card) => (
                <div key={card.label} className="flex flex-col">
                  <div
                    className={`flex h-[279.995px] shrink-0 items-center justify-center self-stretch rounded-[0_120px_0_0] ${
                      card.variant === "dark" ? "bg-[#0A1F2D]" : "bg-[#F9FAFB]"
                    }`}
                  >
                    <Image
                      src={card.image}
                      alt={card.label}
                      width={400}
                      height={160}
                      sizes="(max-width: 1024px) 80vw, 400px"
                      className="max-h-[180px] w-auto object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-3 px-5 pb-5 pt-5">
                    <p className="text-right text-[14px] font-bold leading-[21px] text-[#005761]">
                      {card.label}
                    </p>
                    <div className="flex flex-wrap justify-start gap-2">
                      {card.links.map((link) => (
                        <a
                          key={link.text}
                          href={link.href}
                          download
                          className="inline-flex items-center gap-1.5 rounded-full border-[1.18px] border-[#e5e7eb] px-3 py-[9px] text-[12px] font-bold text-[#005761] transition-colors hover:bg-[#f0f7f8]"
                        >
                          <Image src={DOWNLOAD_ICON} alt="" width={14} height={14} aria-hidden />
                          {link.text}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Approved colors */}
      <section className="bg-white py-16 md:py-20" aria-labelledby="colors-heading">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <SectionHeading>
              <span id="colors-heading">الألوان المعتمدة</span>
            </SectionHeading>
            <ColorSwatches />
          </FadeInUp>
        </div>
      </section>
    </main>
  );
}
