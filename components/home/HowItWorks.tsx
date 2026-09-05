import { ClipboardList, CreditCard, PenLine, Mail } from "lucide-react";

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
    title: "Complete Your Diagnostic",
    description:
      "Right after payment, take the assessment directly on our site.",
    icon: PenLine,
  },
  {
    number: 4,
    title: "Get Your Report",
    description:
      "Receive your personalised Cambridge report by email within 24-48 hours.",
    icon: Mail,
  },
] as const;

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-alt px-5 py-10 sm:px-6 sm:py-14 md:py-16"
    >
      <div className="mx-auto max-w-6xl">

        <h2 className="heading-lg text-center">
          How It Works
        </h2>

        <div className="relative mt-8 sm:mt-10">

          {/* Desktop line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-9 hidden h-0.5 bg-navy-200 md:block"
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
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-navy-200 bg-white shadow-sm sm:h-[70px] sm:w-[70px]">
                    <Icon
                      className="h-6 w-6 text-gold-500 sm:h-7 sm:w-7"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Number */}
                  <span className="mt-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 font-body text-[11px] font-semibold text-white">
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
