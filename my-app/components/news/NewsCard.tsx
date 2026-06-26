import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { newsCategoryLabel, type NewsItem } from "@/lib/news";

export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border-[1.18px] border-[#f3f4f6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_12px_24px_rgba(0,87,97,0.08)]"
    >
      <div className="relative aspect-[355/222] w-full overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 90vw, 355px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 text-right">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[12px] text-[#6a7282]">
            <CalendarDays className="size-3.5" />
            {item.date}
          </span>
          <span className="rounded-full bg-[#005761] px-3 py-1 text-[11px] font-medium text-white">
            {newsCategoryLabel(item.category)}
          </span>
        </div>
        <h3 className="mt-4 line-clamp-2 text-[18px] font-bold leading-[27px] text-[#005761]">
          {item.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-[14px] leading-[23.8px] text-[#4a5565]">
          {item.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 self-end text-[14px] font-bold text-[#005761]">
          التفاصيل
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
