import Link from "next/link";

export function CTA() {
  return (
    <section className="section-dark px-5 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-3xl text-center">

        <h2 className="font-body text-2xl font-light tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
          Ready to discover your true Cambridge level?
        </h2>

        <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-navy-200 sm:mt-5 sm:text-lg">
          Choose your diagnostic and receive expert feedback designed to guide
          your next stage of progress.
        </p>

        <div className="mt-8 sm:mt-10">
          <Link
            href="/diagnostics"
            className="btn-gold w-full sm:w-auto"
          >
            Start Your Diagnostic
          </Link>
        </div>

      </div>
    </section>
  );
}