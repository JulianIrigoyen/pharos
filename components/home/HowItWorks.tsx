import { ClipboardList, CreditCard, PenLine, FileText } from "lucide-react";
import clsx from "clsx";

const STEPS = [
  {
    number: 1,
    title: "Choose Your Diagnostic",
    description:
      "Select the Cambridge exam skill you want assessed — Writing, Use of English, or Listening.",
    icon: ClipboardList,
  },
  {
    number: 2,
    title: "Complete Payment",
    description:
      "Quick, secure checkout via Stripe. No subscriptions — pay only for what you need.",
    icon: CreditCard,
  },
  {
    number: 3,
    title: "Submit Your Answers",
    description:
      "Complete your diagnostic task and submit your responses through our guided form.",
    icon: PenLine,
  },
  {
    number: 4,
    title: "Receive Your Report",
    description:
      "Get a detailed, Cambridge-aligned diagnostic report delivered to your inbox.",
    icon: FileText,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-alt section-padding">
      <div className="mx-auto max-w-6xl">
        <h2 className="heading-lg text-center">How It Works</h2>

        <div className="relative mt-16">
          {/* Connecting line — desktop only */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-10 hidden h-0.5 bg-navy-200 md:block"
          />

          <div className="grid gap-12 md:grid-cols-4 md:gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Number badge */}
                  <div
                    className={clsx(
                      "relative z-10 flex h-20 w-20 items-center justify-center rounded-full",
                      "border-2 border-navy-200 bg-white shadow-sm"
                    )}
                  >
                    <Icon className="h-8 w-8 text-gold-500" strokeWidth={1.5} />
                  </div>

                  <span className="mt-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 font-body text-xs font-semibold text-white">
                    {step.number}
                  </span>

                  <h3 className="heading-sm mt-3 !text-lg">{step.title}</h3>

                  <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
