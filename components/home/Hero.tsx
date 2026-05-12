import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="section-dark section-padding relative overflow-hidden">
      
      <div className="relative mx-auto max-w-5xl text-center">

        {/* Lighthouse */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/hero-lighthouse.png"
            alt="Pharos Lighthouse"
            width={95}
            height={95}
            className="object-contain opacity-95"
            priority
          />
        </div>

        {/* Headline */}
        <h1 className="font-body font-light tracking-tight text-white leading-[1.1] text-5xl md:text-6xl lg:text-7xl">
          
          <span className="block text-white">
            Navigate Your
          </span>

          <span className="block text-gold-400">
            Cambridge Exam Journey
          </span>

        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-8 max-w-4xl font-body text-xl leading-relaxed text-navy-200 md:text-2xl">
          Expert Cambridge diagnostics built on 30+ years of experience. Gain clarity,
          direction, and the confidence to improve.
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">

          <Link
            href="/readiness"
            className="inline-flex items-center justify-center rounded-xl border border-white/30 px-10 py-4 font-body text-sm uppercase tracking-wider text-white transition-all duration-300 hover:border-white hover:bg-white/5"
          >
            Check Your Exam Readiness
          </Link>

          <Link
            href="/diagnostics"
            className="btn-gold"
          >
            Explore Diagnostics
          </Link>

        </div>

        <p className="mt-8 font-body text-base text-navy-300">
          Not sure where you stand? Start with a personalised readiness check.
        </p>

      </div>
    </section>
  );
}