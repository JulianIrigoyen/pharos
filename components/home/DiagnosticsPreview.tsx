import Link from "next/link";
import { DIAGNOSTICS } from "@/types/diagnostic";

export function DiagnosticsPreview() {
  return (
    <section className="section-alt px-5 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl">

        <h2 className="heading-lg text-center">
          Our Diagnostics
        </h2>

        <div className="mt-8 grid gap-5 sm:mt-12 md:grid-cols-2 md:gap-8 xl:grid-cols-3">

          {DIAGNOSTICS.map((diagnostic) => (
            <div
              key={diagnostic.slug}
              className="card flex flex-col p-5 sm:p-8"
            >

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                <h3 className="heading-md !text-base sm:!text-xl">
                  {diagnostic.title}
                </h3>

                <span className="inline-flex shrink-0 items-center rounded-full bg-gold-50 px-3 py-1 font-body text-sm font-semibold text-gold-700">
                  ${diagnostic.price}
                </span>

              </div>

              <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-navy-600">
                {diagnostic.subtitle}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {diagnostic.examLevels.map((level) => (
                  <span
                    key={level}
                    className="inline-block rounded bg-navy-100 px-2 py-1 font-body text-xs font-medium text-navy-700"
                  >
                    {level}
                  </span>
                ))}
              </div>

              <Link
                href={`/diagnostics/${diagnostic.slug}`}
                className="mt-6 font-body text-sm font-semibold uppercase tracking-wider text-gold-600 transition-colors hover:text-gold-700"
              >
                View Diagnostic →
              </Link>

            </div>
          ))}

        </div>

        <div className="mt-10 text-center sm:mt-12">
          <Link
            href="/diagnostics"
            className="btn-primary w-full sm:w-auto"
          >
            View All Diagnostics
          </Link>
        </div>

      </div>
    </section>
  );
}