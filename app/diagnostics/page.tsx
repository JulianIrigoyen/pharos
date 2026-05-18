import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { DIAGNOSTICS } from "@/types/diagnostic";

export default function DiagnosticsPage() {
  return (
    <main className="section-alt min-h-screen">

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">

        <h1 className="heading-lg text-center">
          Diagnostics
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-center font-body text-base leading-relaxed text-navy-600 sm:text-lg">
          Choose the Cambridge skill you want to measure and receive focused feedback
          designed to show you what is working, what is holding you back, and what
          to improve next.
        </p>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
          {DIAGNOSTICS.map((diagnostic) => (
            <Link
              key={diagnostic.slug}
              href={`/diagnostics/${diagnostic.slug}`}
              className="card flex h-full flex-col p-6 sm:p-8"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <h2 className="font-body text-xl font-semibold text-navy-900 sm:text-2xl">
                  {diagnostic.title}
                </h2>
                <span className="inline-flex w-fit items-center rounded-full bg-gold-50 px-3 py-1 font-body text-sm font-semibold text-gold-700">
                  ${diagnostic.price}
                </span>
              </div>

              <p className="mt-4 font-body text-sm leading-relaxed text-navy-600 sm:text-base">
                {diagnostic.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {diagnostic.examLevels.map((level) => (
                  <span
                    key={level}
                    className="rounded-full bg-navy-100 px-3 py-1 font-body text-xs font-medium text-navy-700"
                  >
                    {level}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-2 text-sm text-navy-700">
                {diagnostic.features.slice(0, 3).map((feature) => (
                  <div key={feature} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-wider text-navy-900 transition-colors hover:text-gold-600">
                Learn more
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}

        </div>

      </section>

    </main>
  );
}
