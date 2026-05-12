import Link from "next/link";

export default function DiagnosticsPage() {
  return (
    <main className="section-alt min-h-screen">

      <section className="mx-auto max-w-6xl px-6 py-16">

        <h1 className="heading-lg text-center">
          Diagnostics
        </h1>

        <div className="mt-14 grid gap-8 md:grid-cols-2">

          <Link
            href="/diagnostics/writing"
            className="card p-8"
          >
            <h2 className="font-body text-2xl font-semibold text-navy-900">
              Writing
            </h2>

            <p className="mt-3 font-body text-base leading-relaxed text-navy-600">
              Detailed Cambridge writing feedback.
            </p>

          </Link>

          <Link
            href="/diagnostics/use-of-english"
            className="card p-8"
          >
            <h2 className="font-body text-2xl font-semibold text-navy-900">
              Use of English
            </h2>

            <p className="mt-3 font-body text-base leading-relaxed text-navy-600">
              Grammar, vocabulary and transformation analysis.
            </p>

          </Link>

        </div>

      </section>

    </main>
  );
}