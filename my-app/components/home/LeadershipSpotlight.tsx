import Image from "next/image";

export function LeadershipSpotlight() {
  return (
    <section
      className="bg-white py-20 md:py-28"
      data-nav-surface="light"
      aria-labelledby="leadership-heading"
    >
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <div className="flex flex-col items-center gap-12 md:flex-row md:items-center md:gap-16 lg:gap-20">
          {/* Quote — right in RTL */}
          <div className="flex-1 text-right">
            <span
              className="mb-6 block font-serif text-5xl leading-none text-accent select-none"
              aria-hidden
            >
              ❝
            </span>

            <blockquote
              id="leadership-heading"
              className="text-xl font-medium leading-10 text-text-dark md:text-[22px]"
            >
              نؤمن بأن الإحسان الحقيقي هو ذلك الذي يُمكّن المحتاج من الاعتماد على نفسه، ويبني
              مستقبلاً مستداماً له ولأسرته، ويُعمّر بيوت الله لتكون منارات للعلم والإيمان.
            </blockquote>

            <footer className="mt-8">
              <p className="text-2xl font-bold text-primary md:text-[28px]">
                الشيخ علي بن إبراهيم المجدوعي
              </p>
              <p className="mt-2 text-base text-text-muted">رئيس مجلس الأمناء</p>
            </footer>
          </div>

          {/* Portrait — left in RTL */}
          <div className="relative shrink-0">
            <div className="relative h-[340px] w-[280px] overflow-hidden rounded-tl-[80px] rounded-br-[80px] md:h-[400px] md:w-[320px]">
              <Image
                src="/images/figma/sections/leadership.jpg"
                alt="الشيخ علي بن إبراهيم المجدوعي"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 280px, 320px"
                priority
              />
            </div>

            {/* Decorative tile */}
            <div className="absolute -bottom-5 -start-5 flex h-[72px] w-[72px] items-center justify-center rounded-2xl bg-primary p-3 shadow-lg">
              <Image
                src="/images/figma/sections/First.png"
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 invert"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
