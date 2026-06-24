import type { Metadata } from "next";
import Image from "next/image";
import { FadeInUp } from "@/components/ui/fade-in-up";

export const metadata: Metadata = {
  title: "مجلس الأمناء والقيادات | مؤسسة المجدوعي الخيرية",
  description:
    "مجلس أمناء مؤسسة المجدوعي الخيرية وقياداتها التنفيذية برئاسة الشيخ علي بن إبراهيم المجدوعي.",
};

const CLONE = "/images/leaders-group/clone-sheikh.jpg";

const BOARD_MEMBERS = Array.from({ length: 6 }, (_, i) => ({
  id: `member-${i + 1}`,
  name: "الأستاذ/ عبدالعزيز بن علي المجدوعي",
  role: "عضو مجلس الأمناء",
  image: CLONE,
}));

const LEADERSHIP = [
  { id: "sg-1", name: "الأستاذ/ —", role: "الأمين العام للمؤسسة" },
  { id: "sg-2", name: "الأستاذ/ —", role: "الأمين العام للمؤسسة" },
  { id: "mosques", name: "الأستاذ/ —", role: "مدير إدارة المساجد والبرامج" },
  {
    id: "governance",
    name: "الأستاذ/ —",
    role: "مدير إدارة الخدمات المساندة والحوكمة",
  },
];

function BoardCard({
  name,
  role,
  image,
}: {
  name: string;
  role: string;
  image: string;
}) {
  return (
    <article className="flex w-full max-w-[300px] flex-col">
      <div className="relative aspect-[300/350] w-full overflow-hidden rounded-bl-[80px]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 90vw, 300px"
        />
      </div>
      <div className="rounded-[12px] border-[1.18px] border-[#f3f4f6] bg-white p-5 text-right shadow-[0_1px_1.5px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.03)]">
        <h3 className="text-right text-[18px] font-bold leading-[25px] text-[#005761]">
          {name}
        </h3>
        <p className="mt-3 text-right text-[14px] leading-[21px] text-[#6a7282]">
          {role}
        </p>
      </div>
    </article>
  );
}

function LeadershipCard({ name, role }: { name: string; role: string }) {
  return (
    <article className="flex w-full max-w-[265px] flex-col items-end rounded-[12px] border-[1.18px] border-[#f3f4f6] bg-white p-[17px] text-right shadow-[0_1px_1.5px_rgba(0,0,0,0.04),0_4px_6px_rgba(0,0,0,0.03)]">
      <div className="relative aspect-square w-full overflow-hidden rounded-bl-[69px]">
        <Image
          src={CLONE}
          alt={name}
          fill
          className="object-cover object-top"
          sizes="(max-width: 1024px) 45vw, 231px"
        />
      </div>
      <h3 className="mt-3 w-full text-right text-[16px] font-bold leading-[22px] text-[#005761]">
        {name}
      </h3>
      <p className="mt-2 w-full text-right text-[13px] leading-[19.5px] text-[#6a7282]">
        {role}
      </p>
    </article>
  );
}

export default function BoardPage() {
  return (
    <main dir="rtl" className="bg-white">
      {/* ── Header ── (negative margin keeps the sticky navbar solid on load) */}
      <section className="-mt-28 bg-white pt-40 md:pt-44" data-nav-surface="light">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <FadeInUp>
            <p className="text-right text-[14px] font-medium leading-none text-text-muted">
              عن المؤسسة
            </p>
            <h1 className="mt-4 text-right text-[36px] font-medium leading-[40px] text-[#005761]">
              مجلس الأمناء والقيادات
            </h1>
            <div className="mt-8 h-px w-full bg-gray-200" />
          </FadeInUp>
        </div>
      </section>

      {/* ── Chairman ── */}
      <FadeInUp>
        <section className="bg-white py-12 md:py-16" aria-label="رئيس مجلس الأمناء">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <div className="flex min-h-[487px] flex-col items-center justify-center gap-8 rounded-[20px] bg-white p-10 lg:flex-row">
              {/* Portrait — RTL start (physical right) */}
              <div className="relative aspect-[325/406] w-full max-w-[325px] shrink-0 overflow-hidden rounded-tr-[120px]">
                <Image
                  src="/images/leaders-group/main-sheikh.jpg"
                  alt="الشيخ علي بن إبراهيم المجدوعي"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 90vw, 325px"
                />
              </div>

              {/* Text — RTL end (physical left), right-aligned */}
              <div className="flex w-full flex-col items-start gap-4 text-right lg:max-w-[683px]">
                <p
                  className="w-full text-right text-[#005761]"
                  style={{ fontSize: 14, fontWeight: 700, lineHeight: "21px" }}
                >
                  رئيس مجلس الأمناء
                </p>
                <h2
                  className="w-full text-right text-[#005761]"
                  style={{ fontSize: 28, fontWeight: 900, lineHeight: "33.6px" }}
                >
                  الشيخ علي بن إبراهيم المجدوعي
                </h2>
                <div
                  className="w-full text-right text-[#4A5565]"
                  style={{ fontSize: 18, fontWeight: 400, lineHeight: "27px" }}
                >
                  رئيس مجلس الأمناء — مؤسس المؤسسة
                </div>
                <div className="my-1 h-px w-16 bg-[rgba(0,87,97,0.3)]" />
                <div
                  className="w-full max-w-[673px] text-right text-[#364153]"
                  style={{ fontSize: 24, fontWeight: 400, lineHeight: "28.8px" }}
                >
                  &quot;تؤمن المؤسسة بأن الإحسان الحقيقي هو ذلك الذي يُمكّن المحتاج من
                  الاعتماد على نفسه، ويبني مستقبلاً مستداماً له ولأسرته.&quot;
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInUp>

      {/* ── Board members ── */}
      <FadeInUp>
        <section className="bg-white py-12 md:py-16" aria-labelledby="board-members-heading">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2
              id="board-members-heading"
              className="mb-10 text-right text-[32px] font-bold leading-[36px] text-[#005761]"
            >
              أعضاء مجلس الأمناء
            </h2>
            <div className="grid grid-cols-1 justify-items-center gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {BOARD_MEMBERS.map((member) => (
                <BoardCard key={member.id} {...member} />
              ))}
            </div>
          </div>
        </section>
      </FadeInUp>

      {/* ── Executive leadership ── */}
      <FadeInUp>
        <section
          id="leadership"
          className="scroll-mt-32 bg-white pb-20 pt-8 md:pb-28"
          aria-labelledby="leadership-heading"
        >
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <h2
              id="leadership-heading"
              className="mb-10 text-right text-[32px] font-bold leading-[36px] text-[#005761]"
            >
              القيادة التنفيذية
            </h2>
            <div className="grid grid-cols-2 justify-items-center gap-5 lg:grid-cols-4 lg:gap-6">
              {LEADERSHIP.map((leader) => (
                <LeadershipCard key={leader.id} name={leader.name} role={leader.role} />
              ))}
            </div>
          </div>
        </section>
      </FadeInUp>
    </main>
  );
}
