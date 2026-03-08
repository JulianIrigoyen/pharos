import Link from "next/link";
import { DIAGNOSTICS } from "@/types/diagnostic";

export function DiagnosticsPreview() {
  return (
    <section className="section-alt section-padding">
      <div className="mx-auto max-w-6xl">
        <h2 className="heading-lg text-center">Our Diagnostics</h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {DIAGNOSTICS.map((diagnostic) => (
            <div key={diagnostic.slug} className="card flex flex-col p-8">
              <div className="flex items-start justify-between">
                <h3 className="heading-md !text-xl">{diagnostic.title}</h3>
                <span className="inline-flex shrink-0 items-center rounded-full bg-gold-50 px-3 py-1 font-body text-sm font-semibold text-gold-700">
                  ${diagnostic.price}
                </span>
              </div>

              <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-navy-600">
                {diagnostic.subtitle}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {diagnostic.examLevels.map((level) => (
                  <span
                    key={level}
                    className="inline-block rounded bg-navy-100 px-2 py-0.5 font-body text-xs font-medium text-navy-700"
                  >
                    {level}
                  </span>
                ))}
              </div>

              <Link
                href={`/diagnostics/${diagnostic.slug}`}
                className="mt-6 font-body text-sm font-semibold uppercase tracking-wider text-navy-900 transition-colors hover:text-gold-600"
              >
                Learn More &rarr;
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/diagnostics" className="btn-primary">
            View All Diagnostics
          </Link>
        </div>
      </div>
    </section>
  );
}
