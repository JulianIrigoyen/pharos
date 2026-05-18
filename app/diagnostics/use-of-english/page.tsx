import Link from "next/link";
import {
  Check,
  ClipboardList,
  CreditCard,
  Mail,
  FileText,
  Award,
} from "lucide-react";

const STEPS = [
  {
    title: "Pay",
    description: "Complete payment.",
    icon: CreditCard,
  },
  {
    title: "Email",
    description: "Send receipt.",
    icon: Mail,
  },
  {
    title: "Paper",
    description: "Receive exam.",
    icon: ClipboardList,
  },
  {
    title: "Submit",
    description: "Upload answers.",
    icon: FileText,
  },
  {
    title: "Feedback",
    description: "Receive report.",
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
                  $8
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


      {/* ACTIONS */}
      <section className="mx-auto max-w-xl px-4 pb-16 text-center sm:px-6">

        <a
          href="YOUR_PAYPAL_LINK_HERE"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gold-500 px-6 text-sm font-medium text-white transition-colors hover:bg-gold-600 sm:w-56"
        >
          Pay with PayPal
        </a>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <p className="text-sm leading-relaxed text-navy-700">
            After payment, email your receipt, full name, and exam level to:
          </p>

          <p className="mt-3 text-base font-medium text-navy-900 sm:text-lg">
            pharosenglishlab@gmail.com
          </p>

        </div>

        <h3 className="mt-10 font-body text-2xl font-semibold text-navy-900">
          Submit Answers
        </h3>

        <p className="mt-2 text-sm text-navy-600">
          Choose your exam level and upload your answers.
        </p>

        <div className="mt-5 flex flex-col items-center gap-3">

          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSeFIiWLRWTaqgg1GwnUYevOHAl1WE7EM1pXnfH8tNq8RiOtfg/viewform?usp=header"
            target="_blank"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-navy-900 px-6 text-sm text-white transition-colors hover:bg-navy-800 sm:w-56"
          >
            B2 First
          </Link>

          <Link
            href="https://docs.google.com/forms/d/e/1FAIpQLSfQD54FjKso0BVPmQGjuBrEbGP7R9tc9JzBQe8uLhCrYU-MPA/viewform?usp=header"
            target="_blank"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-navy-900 px-6 text-sm text-white transition-colors hover:bg-navy-800 sm:w-56"
          >
            C1 Advanced
          </Link>

        </div>

      </section>

    </main>
  );
}