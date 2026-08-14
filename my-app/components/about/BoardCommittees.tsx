import Image from "next/image";
import { T } from "@/components/ui/T";
import {
  dutyIcon,
  isLogo,
  type BoardCommittee,
  type CommitteeMember,
} from "@/lib/site/board-committees";

/**
 * اللجان الرئيسية والداعمة — the committee sections on /about/board.
 *
 * Server-rendered: nothing here is interactive, so it stays out of the client
 * bundle. Arabic falls back for missing English rather than rendering blank,
 * since the source content is Arabic-first.
 */

function MemberAvatar({ m }: { m: CommitteeMember }) {
  if (!m.image) {
    return <span className="size-[72px] shrink-0 rounded-tr-[20px] bg-icon-box" aria-hidden />;
  }
  /* An svg stands in for a team rather than a person, so it's contained on the
     brand fill instead of being cropped like a portrait. */
  if (isLogo(m.image)) {
    return (
      <span className="grid size-[72px] shrink-0 place-items-center rounded-tr-[20px] bg-btn-primary p-3">
        <Image src={m.image} alt="" width={48} height={48} className="h-auto w-full object-contain" />
      </span>
    );
  }
  return (
    <span className="relative size-[72px] shrink-0 overflow-hidden rounded-tr-[20px] bg-icon-box">
      <Image src={m.image} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />
    </span>
  );
}

export function BoardCommittees({ committees }: { committees: BoardCommittee[] }) {
  if (!committees.length) return null;

  return (
    <section className="bg-surface py-12 md:py-16" data-nav-surface="light">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <h2 className="text-[28px] font-medium text-heading md:text-[40px]">
          <T ar="اللجان الرئيسية والداعمة" en="Principal & supporting committees" />
        </h2>

        <div className="mt-10 flex flex-col gap-14">
          {committees.map((c) => (
            <div key={c.id}>
              <h3 className="text-2xl font-bold text-heading md:text-[36px]">
                <T ar={c.title_ar} en={c.title_en || c.title_ar} />
              </h3>
              {c.description_ar && (
                <p className="mt-3 text-lg leading-8 text-body-4 md:text-2xl md:leading-[32px]">
                  <T ar={c.description_ar} en={c.description_en || c.description_ar} />
                </p>
              )}

              {c.members.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-6">
                  {c.members.map((m, i) => (
                    <div key={`${m.name_ar}-${i}`} className="flex flex-col gap-2.5">
                      <MemberAvatar m={m} />
                      <p className="max-w-[220px] text-sm font-bold text-body-2 dark:text-heading">
                        <T ar={m.name_ar} en={m.name_en || m.name_ar} />
                      </p>
                      {m.role_ar && (
                        <p className="text-[13px] text-body-3">
                          <T ar={m.role_ar} en={m.role_en || m.role_ar} />
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {c.duties.length > 0 && (
                <div className="mt-8">
                  <p className="text-base font-bold text-heading">
                    <T ar="المهام والمسؤوليات" en="Duties & responsibilities" />
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {c.duties.map((d, i) => {
                      const Icon = dutyIcon(d.icon);
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 rounded-2xl border border-[rgba(0,87,97,0.1)] bg-panel p-4 shadow-[0_6px_10px_rgba(0,0,0,0.04)] dark:border-panel-border"
                        >
                          <span className="grid size-8 shrink-0 place-items-center rounded-2xl bg-[rgba(0,87,97,0.08)] text-icon dark:bg-icon-box">
                            <Icon className="size-[18px]" aria-hidden />
                          </span>
                          <p className="min-w-0 flex-1 text-[15px] leading-[25.5px] text-body-2">
                            <T ar={d.text_ar} en={d.text_en || d.text_ar} />
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
