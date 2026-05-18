import { ClipboardList, CreditCard, Mail, FileText } from "lucide-react";
import clsx from "clsx";

const STEPS = [
  {
    number: 1,
    title: "Choose Your Diagnostic",
    description:
      "Select the Cambridge skill you want assessed.",
    icon: ClipboardList,
  },
  {
    number: 2,
    title: "Complete Payment",
    description:
      "Pay securely with PayPal. No subscriptions.",
    icon: CreditCard,
  },
  {
    number: 3,
    title: "Receive & Submit",
    description:
      "Your exam arrives by email. Complete it and submit your answers.",
    icon: Mail,
  },
  {
    number: 4,
    title: "Get Your Report",
    description:
      "Receive clear Cambridge-focused feedback and next steps.",
    icon: FileText,
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-alt px-5 py-16 sm:px-6 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl">

        <h2 className="heading-lg text-center">
          How It Works
        </h2>

        <div className="relative mt-10 sm:mt-14">

          {/* Desktop line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-10 hidden h-0.5 bg-navy-200 md:block"
          />

          <div className="grid gap-8 sm:gap-10 md:grid-cols-4 md:gap-6">

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
                      "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-navy-200 bg-white shadow-sm sm:h-20 sm:w-20"
                    )}
                  >
                    <Icon
                      className="h-6 w-6 text-gold-500 sm:h-8 sm:w-8"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Number */}
                  <span className="mt-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 font-body text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-xs">
                    {step.number}
                  </span>

                  {/* Title */}
                  <h3 className="heading-sm mt-3 !text-base sm:!text-lg">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-navy-600">
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