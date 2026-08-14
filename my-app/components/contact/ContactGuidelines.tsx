import { Phone } from "lucide-react";
import { T } from "@/components/ui/T";

/**
 * The "إرشادات تقديم الطلب" rail beside the form: what to expect after
 * submitting, plus the support number. Static copy — it sets expectations
 * about the process rather than describing anything content-managed.
 */

const BLOCKS = [
  {
    ar: { title: "زمن الاستجابة المتوقع", body: "يتم الرد على جميع الطلبات والملاحظات خلال 2 إلى 5 أيام عمل." },
    en: {
      title: "Expected response time",
      body: "All requests and notes are answered within 2 to 5 working days.",
    },
  },
  {
    ar: {
      title: "السرية التامة",
      body: "نضمن تعامل فريق الحوكمة والمراجعة الداخلية مع جميع الشكاوى والملاحظات بأعلى درجات الخصوصية والسرية.",
    },
    en: {
      title: "Complete confidentiality",
      body: "Our governance and internal audit team handles every complaint and note with the highest degree of privacy and confidentiality.",
    },
  },
  {
    ar: {
      title: "التتبع والمتابعة",
      body: "سيتم إرسال رقم تتبع آلي (Ticket ID) عبر الرسائل النصية والبريد الإلكتروني لمتابعة حالة الطلب.",
    },
    en: {
      title: "Tracking and follow-up",
      body: "An automatic tracking number (Ticket ID) is sent by SMS and email so you can follow your request.",
    },
  },
];

const SUPPORT_PHONE = "+966 11 234 5678";

const MAIN_TITLE =
  "block self-stretch text-right text-[18px] font-black leading-[normal] text-[#005761] dark:text-heading";
const INTRO_TEXT =
  "mt-2 self-stretch text-right text-[13px] font-normal leading-[normal] text-[#6B7C80] dark:text-body-3";
const BLOCK_TITLE =
  "block self-stretch text-right text-[15px] font-bold leading-[normal] text-[#1A2E30] dark:text-heading";
const BLOCK_BODY =
  "mt-1.5 self-stretch text-right text-[13px] font-normal leading-[150%] text-[#6B7C80] dark:text-body-3";
const SUPPORT_LABEL =
  "block text-[12px] font-normal leading-[normal] text-[#6B7C80] dark:text-body-3";

export function ContactGuidelines() {
  return (
    <aside className="box-border flex w-full min-w-0 shrink-0 flex-col items-stretch gap-7 rounded-2xl bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:bg-panel">
      <div className="w-full">
        <span className={MAIN_TITLE}>
          <T ar="إرشادات تقديم الطلب" en="How your request is handled" />
        </span>
        <span className={`block ${INTRO_TEXT}`}>
          <T
            ar="نحن هنا للاستماع إليك ومساعدتك في حل أي إشكالية."
            en="We're here to listen and to help resolve any issue."
          />
        </span>
      </div>

      <div className="flex w-full flex-col gap-5">
        {BLOCKS.map((b) => (
          <div key={b.ar.title} className="w-full">
            <span className={BLOCK_TITLE}>
              <T ar={b.ar.title} en={b.en.title} />
            </span>
            <span className={`block ${BLOCK_BODY}`}>
              <T ar={b.ar.body} en={b.en.body} />
            </span>
          </div>
        ))}
      </div>

      {/* Direct line — the escape hatch for anyone who'd rather not use a form. */}
      <div className="flex w-full items-center gap-3 rounded-xl bg-icon-box p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-btn-primary text-btn-primary-text">
          <Phone className="size-4" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className={SUPPORT_LABEL}>
            <T ar="الدعم الفني المباشر" en="Direct support line" />
          </span>
          <a
            href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
            className="block text-base font-bold text-heading hover:underline"
            dir="ltr"
          >
            {SUPPORT_PHONE}
          </a>
        </span>
      </div>
    </aside>
  );
}
