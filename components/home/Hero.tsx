import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="section-dark relative overflow-hidden px-5 py-16 sm:px-6 sm:py-20 md:py-28">
      
      <div className="relative mx-auto max-w-5xl text-center">

        {/* Lighthouse */}
        <div className="mb-5 flex justify-center sm:mb-7 md:mb-8">
          <Image
            src="/hero-lighthouse.png"
            alt="Pharos Lighthouse"
            width={95}
            height={95}
            className="h-12 w-12 object-contain opacity-95 sm:h-16 sm:w-16 md:h-[95px] md:w-[95px]"
            priority
          />
        </div>

        {/* Headline */}
        <h1 className="font-body text-3xl font-light leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          
          <span className="block">
            Navigate Your
          </span>

          <span className="block text-gold-400">
            Cambridge Exam Journey
          </span>

        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-5 max-w-3xl font-body text-sm leading-relaxed text-navy-200 sm:mt-6 sm:text-lg md:mt-8 md:max-w-4xl md:text-2xl">
          Expert Cambridge diagnostics built on 30+ years of experience. Gain clarity,
          direction, and the confidence to improve.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-5">

          <Link
            href="/readiness"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 px-5 py-3 font-body text-[11px] uppercase tracking-wider text-white transition-all duration-300 hover:border-white hover:bg-white/5 sm:w-auto sm:px-10 sm:py-4 sm:text-sm"
          >
            Check Your Exam Readiness
          </Link>

          <Link
            href="/diagnostics"
            className="btn-gold w-full sm:w-auto"
          >
            Explore Diagnostics
          </Link>

        </div>

        <p className="mt-5 font-body text-xs text-navy-300 sm:mt-7 sm:text-base">
          Not sure where you stand? Start with a personalised readiness check.
        </p>

      </div>
    </section>
  );
}