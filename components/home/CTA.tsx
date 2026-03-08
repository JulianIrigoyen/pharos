import Link from "next/link";

export function CTA() {
  return (
    <section className="section-dark section-padding">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-light tracking-tight text-white md:text-4xl lg:text-5xl">
          Ready to know where you stand?
        </h2>

        <p className="mx-auto mt-5 max-w-xl font-body text-lg leading-relaxed text-navy-200">
          Choose a diagnostic and get your professional Cambridge-level analysis
          today.
        </p>

        <div className="mt-10">
          <Link href="/diagnostics" className="btn-gold">
            Start Your Diagnostic
          </Link>
        </div>
      </div>
    </section>
  );
}
