import { ClipboardList, CreditCard, Mail, FileText } from "lucide-react";
import clsx from "clsx";

const STEPS = [
  {
    number: 1,
    title: "Choose Your Diagnostic",
    description:
      "Select the Cambridge exam skill you want assessed — Writing or Use of English.",
    icon: ClipboardList,
  },
  {
    number: 2,
    title: "Complete Payment",
    description:
      "Secure payment via PayPal. No subscriptions — simply choose the diagnostic you need.",
    icon: CreditCard,
  },
  {
    number: 3,
    title: "Receive & Complete Your Exam",
    description:
      "Your assigned exam will be delivered by email. Complete it carefully and submit your answers using the corresponding form.",
    icon: Mail,
  },
  {
    number: 4,
    title: "Receive Your Diagnostic Report",
    description:
      "Get detailed, Cambridge-focused feedback with clear strengths, priorities, and next steps for improvement.",
    icon: FileText,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-alt section-padding">
      <div className="mx-auto max-w-6xl">

        <h2 className="heading-lg text-center">
          How It Works
        </h2>

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

                  {/* Icon */}
                  <div
                    className={clsx(
                      "relative z-10 flex h-20 w-20 items-center justify-center rounded-full",
                      "border-2 border-navy-200 bg-white shadow-sm"
                    )}
                  >
                    <Icon
                      className="h-8 w-8 text-gold-500"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Number */}
                  <span className="mt-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-navy-900 font-body text-xs font-semibold text-white">
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="heading-sm mt-3 !text-lg">
                    {step.title}
                  </h3>

                  {/* Description */}
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