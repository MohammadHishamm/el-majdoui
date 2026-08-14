import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, Phone, Send } from "lucide-react";
import { T } from "@/components/ui/T";

type Content = Record<string, unknown>;

const s = (c: Content, k: string) => String(c[k] ?? "");

/**
 * مكتب المدير التنفيذي — a singleton section, so its copy comes from the
 * `ceo-office` page_content row rather than a table.
 */
export function CeoOffice({ content }: { content: Content }) {
  const name = s(content, "name_ar");
  if (!name) return null;

  const photo = s(content, "photo");
  const ctaHref = s(content, "cta_href") || "/contact";

  const rows = [
    {
      Icon: Phone,
      label: s(content, "phone_label_ar"),
      labelEn: s(content, "phone_label_en"),
      value: s(content, "phone_value"),
      valueEn: s(content, "phone_value"),
    },
    {
      Icon: Mail,
      label: s(content, "email_label_ar"),
      labelEn: s(content, "email_label_en"),
      value: s(content, "email_value"),
      valueEn: s(content, "email_value"),
    },
    {
      Icon: Clock,
      label: s(content, "hours_label_ar"),
      labelEn: s(content, "hours_label_en"),
      value: s(content, "hours_value_ar"),
      valueEn: s(content, "hours_value_en"),
    },
  ].filter((r) => r.value);

  return (
    <section className="bg-surface pb-16 md:pb-20" data-nav-surface="light">
      <div className="mx-auto w-full max-w-[1280px] px-6">
        <h2 className="text-2xl font-black text-heading md:text-[34px]">
          <T ar={s(content, "heading_ar")} en={s(content, "heading_en") || s(content, "heading_ar")} />
        </h2>

        <div className="mt-8 grid gap-8 rounded-2xl bg-panel p-6 shadow-[0_10px_15px_rgba(0,0,0,0.05)] md:p-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Person — first, so RTL puts it on the right as in the design. */}
          <div className="flex flex-col gap-4">
            {photo && (
              <span className="relative size-[120px] overflow-hidden rounded-2xl bg-icon-box">
                <Image src={photo} alt="" fill sizes="120px" style={{ objectFit: "cover" }} />
              </span>
            )}
            <p className="text-xl font-bold text-heading">
              <T ar={name} en={s(content, "name_en") || name} />
            </p>
            <p className="text-sm font-bold text-body-1 dark:text-heading">
              <T ar={s(content, "role_ar")} en={s(content, "role_en") || s(content, "role_ar")} />
            </p>
            <p className="max-w-[396px] text-[13px] leading-[23.4px] text-body-4">
              <T ar={s(content, "bio_ar")} en={s(content, "bio_en") || s(content, "bio_ar")} />
            </p>
          </div>

          {/* Contact rows */}
          <div className="flex flex-col">
            {rows.map(({ Icon, label, labelEn, value, valueEn }, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 py-5 ${
                  i < rows.length - 1 ? "border-b border-panel-border" : ""
                }`}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-icon-box text-icon">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] text-body-3">
                    <T ar={label} en={labelEn || label} />
                  </span>
                  {/* Phone/email are Latin-ish and must not be reordered by the
                      RTL bidi algorithm, so they are isolated. */}
                  <span className="mt-1 block break-words text-[15px] font-bold text-heading">
                    <bdi>
                      <T ar={value} en={valueEn || value} />
                    </bdi>
                  </span>
                </span>
              </div>
            ))}

            <div className="pt-6">
              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 rounded-[20px] bg-btn-primary px-7 py-3.5 text-[15px] font-bold text-btn-primary-text transition-opacity hover:opacity-90"
              >
                <Send className="size-4" aria-hidden />
                <T
                  ar={s(content, "cta_label_ar")}
                  en={s(content, "cta_label_en") || s(content, "cta_label_ar")}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
