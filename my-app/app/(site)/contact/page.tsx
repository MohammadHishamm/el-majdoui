import type { Metadata } from "next";
import { T } from "@/components/ui/T";
import { ContactChannelForm } from "@/components/contact/ContactChannelForm";
import { ContactGuidelines } from "@/components/contact/ContactGuidelines";

export const metadata: Metadata = {
  title: "اتصل بنا — قناة الشكاوى والمقترحات",
  description:
    "قناة الشكاوى والمقترحات لمؤسسة المجدوعي الخيرية — أرسل مقترحاً أو شكوى أو استفساراً عاماً.",
};

/**
 * قناة الشكاوى والمقترحات.
 *
 * Distinct from the short contact form on the landing page, which stays where
 * it is: this one is a three-step intake that changes shape per message type
 * and issues a tracking id. The navbar's "اتصل بنا" points here.
 */
export default function ContactPage() {
  return (
    <div className="bg-surface" data-nav-surface="light">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:py-16">
        <p className="text-[13px] text-body-3">
          <T ar="اتصل بنا · قناة الشكاوى والمقترحات" en="Contact us · Complaints & suggestions" />
        </p>
        <h1 className="mt-3 text-3xl font-bold text-heading md:text-[40px] md:leading-[1.15]">
          <T ar="يسعدنا تواصلك ورأيك يهمنا" en="We're glad to hear from you" />
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-body-3 md:text-base">
          <T
            ar="نرحب بجميع ملاحظاتك، استفساراتك، ومقترحاتك لضمان تقديم أعلى مستويات الجودة والشفافية."
            en="We welcome your notes, questions and suggestions so we can keep quality and transparency high."
          />
        </p>

        <hr className="mt-8 border-panel-border" />

        {/* Guidelines rail on the right in RTL; form on the left. On mobile, form stays on top. */}
        <div className="mt-8 flex flex-col items-stretch gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Pinned beside the form: the form is long, and the guidance —
              response time, confidentiality, the support number — is what the
              reader may want at any point while filling it in. Sticky only at
              lg, since below that the rail sits under the form and pinning it
              would do nothing. top-32 clears the sticky h-28 site header, and
              the max-height keeps the card's own bottom reachable on short
              viewports instead of stranding it off-screen. */}
          <div className="order-2 w-full min-w-0 lg:order-1 lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:w-[370px] lg:shrink-0 lg:overflow-y-auto">
            <ContactGuidelines />
          </div>
          <div className="order-1 w-full min-w-0 lg:order-2 lg:w-[820px] lg:shrink-0">
            <ContactChannelForm />
          </div>
        </div>
      </div>
    </div>
  );
}
