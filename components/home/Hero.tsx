import Link from "next/link";

export function Hero() {
  return (
    <section className="section-dark section-padding relative overflow-hidden">
      {/* Decorative lighthouse beam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-32 right-0 h-[600px] w-[600px] rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute top-0 right-1/4 h-[400px] w-1 rotate-12 bg-gradient-to-b from-gold-400/30 via-gold-400/10 to-transparent blur-sm" />
        <div className="absolute top-0 right-[27%] h-[350px] w-1 rotate-6 bg-gradient-to-b from-gold-400/20 via-gold-400/5 to-transparent blur-sm" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <h1 className="font-display text-4xl font-light tracking-tight text-white md:text-5xl lg:text-6xl">
          Navigate Your Cambridge{" "}
          <span className="text-gold-400">Exam Preparation</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-navy-200 md:text-xl">
          AI-powered diagnostic reports for B2 First and C1 Advanced. Know
          exactly where you stand&nbsp;&mdash; and how to improve.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/diagnostics" className="btn-gold">
            View Diagnostics
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3.5 font-body text-sm uppercase tracking-wider text-white transition-colors duration-300 hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
          >
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
