import {
  Check,
  CreditCard,
  MonitorCheck,
  MailCheck,
  SearchCheck,
  Award,
} from "lucide-react";
import { PayPalCheckoutButton } from "@/components/diagnostics/PayPalCheckoutButton";
import { DIAGNOSTICS } from "@/types/diagnostic";

const PRICE =
  DIAGNOSTICS.find((d) => d.slug === "use-of-english")?.price ?? 8;

const STEPS = [
  {
    title: "Pay",
    description: "Choose your level and pay securely with PayPal.",
    icon: CreditCard,
  },
  {
    title: "Take It Online",
    description: "Your test opens right here — timed or practice mode.",
    icon: MonitorCheck,
  },
  {
    title: "Instant Receipt",
    description: "Your answer sheet is emailed to you automatically.",
    icon: MailCheck,
  },
  {
    title: "Expert Review",
    description: "Your answers are corrected and analysed in detail.",
    icon: SearchCheck,
  },
  {
    title: "Report",
    description: "Receive your full performance report.",
    icon: Award,
  },
];

export default function UseOfEnglishPage() {
  return (
    <main className="bg-slate-50">

      {/* CARD */}
      <section className="mx-auto max-w-3xl px-4 pt-10 sm:px-6 sm:pt-14">

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">

          <div className="grid items-center gap-6 md:grid-cols-[1fr_100px]">

            <div>

              <h1 className="font-body text-2xl font-semibold text-navy-900 sm:text-3xl md:text-4xl">
                Use of English Diagnostic
              </h1>

              <div className="mt-3 h-[3px] w-12 rounded bg-gold-500" />

              <p className="mt-4 text-sm leading-relaxed text-navy-700 md:text-base">
                Identify your grammar, vocabulary and transformation weaknesses.
              </p>

              <h2 className="mt-6 font-body text-xl font-semibold text-navy-900 md:text-2xl">
                What It Covers
              </h2>

              <div className="mt-4 grid gap-x-6 gap-y-2 text-sm text-navy-800 sm:grid-cols-2">

                <div className="flex items-center gap-2">
                  <Check size={14} className="text-gold-500" />
                  Open cloze
                </div>

                <div className="flex items-center gap-2">
                  <Check size={14} className="text-gold-500" />
                  Word formation
                </div>

                <div className="flex items-center gap-2">
                  <Check size={14} className="text-gold-500" />
                  Key word transformations
                </div>

                <div className="flex items-center gap-2">
                  <Check size={14} className="text-gold-500" />
                  Error analysis
                </div>

                <div className="flex items-center gap-2">
                  <Check size={14} className="text-gold-500" />
                  Strategy feedback
                </div>

              </div>

            </div>

            {/* PRICE */}
            <div className="mx-auto">

              <div className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-gold-200 bg-gold-50">

                <span className="text-2xl font-semibold text-gold-500">
                  ${PRICE}
                </span>

                <span className="text-xs tracking-wide text-gold-500">
                  USD
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* FLOW */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">

        <h2 className="mb-10 text-center font-body text-2xl font-semibold text-navy-900 sm:mb-12 sm:text-3xl">
          How It Works
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">

          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center"
              >

                {index < STEPS.length - 1 && (
                  <div className="absolute left-[58%] top-[66px] hidden h-[2px] w-full bg-navy-900 lg:block" />
                )}

                <span className="mb-3 text-xs font-medium tracking-[0.2em] text-gold-500">
                  0{index + 1}
                </span>

                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm">

                  <Icon
                    className="h-5 w-5 text-gold-500"
                    strokeWidth={1.8}
                  />

                </div>

                <h3 className="mt-4 font-body text-lg font-semibold text-navy-900">
                  {step.title}
                </h3>

                <p className="mt-1 text-xs text-navy-700">
                  {step.description}
                </p>

              </div>
            );
          })}

        </div>

      </section>


      {/* CHECKOUT */}
      <section className="mx-auto max-w-xl px-4 pb-16 sm:px-6">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <h3 className="font-body text-xl font-semibold text-navy-900">
            Start Your Diagnostic
          </h3>

          <p className="mt-2 mb-6 text-sm text-navy-600">
            Pay securely with PayPal — no PayPal account needed, cards work
            too. Right after payment, your exam opens automatically.
          </p>

          <PayPalCheckoutButton
            diagnosticType="use-of-english"
            price={PRICE}
          />

          <p className="mt-5 text-xs leading-relaxed text-navy-500">
            Tip: log in first (or create a free account) so your diagnostic
            and report appear in your dashboard. Questions? Write to{" "}
            <span className="font-medium text-navy-700">
              pharosenglishlab@gmail.com
            </span>
            .
          </p>

        </div>

      </section>

    </main>
  );
}
