import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f6f3ef] pb-24 pt-32 text-navy-900 sm:pb-28 sm:pt-36 md:pb-36 md:pt-40">
      
      {/* Atmospheric lighthouse image */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] md:block">
        
        <div
          className="absolute inset-0 bg-right bg-contain bg-no-repeat opacity-[0.16]"
          style={{
            backgroundImage: "url('/marcela-lighthouse-pharos.jpg')",
            filter: "grayscale(100%) sepia(18%) brightness(1.08)",
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#f6f3ef]/55 to-[#f6f3ef]" />
      </div>

      {/* Soft texture */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-[0.10]">
        <div
          className="h-full w-full bg-repeat-x"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='160' height='40' viewBox='0 0 160 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 24C20 8 40 8 60 24C80 40 100 40 120 24C140 8 160 8 180 24' stroke='%239f7a2f' stroke-width='1.4'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 text-center">

        {/* Lighthouse */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/favicon.png"
            alt="Pharos Lighthouse"
            width={58}
            height={58}
            className="object-contain opacity-95"
            priority
          />
        </div>

        {/* Headline */}
        <div className="space-y-2">

          <h1 className="font-body text-4xl font-light leading-[0.95] tracking-[-0.03em] text-navy-900 sm:text-5xl md:text-6xl">
            Navigate Your
          </h1>

          <h2 className="font-body text-[2.1rem] font-light leading-[1.02] tracking-[-0.03em] text-gold-600 sm:text-4xl md:text-5xl">
            Cambridge Exam Journey
          </h2>

        </div>

        {/* Subheadline */}
        <p className="mx-auto mt-10 max-w-3xl font-body text-lg font-light leading-relaxed text-navy-600 sm:text-xl">
          Expert Cambridge diagnostics built on 30+ years of experience.
          Gain clarity, direction, and the confidence to improve.
        </p>

        {/* CTAs */}
        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <a
            href="/readiness"
            className="inline-flex h-[82px] w-full max-w-[340px] items-center justify-center rounded-xl border border-navy-300 bg-white/30 px-8 text-center text-sm uppercase tracking-[0.16em] text-navy-900 backdrop-blur-sm transition-all duration-300 hover:border-navy-900 hover:bg-white/55 sm:w-auto sm:min-w-[300px]"
          >
            Check Your Exam Readiness
          </a>

          <a
            href="/diagnostics"
            className="inline-flex h-[82px] w-full max-w-[340px] items-center justify-center rounded-xl border border-navy-300 bg-white/30 px-8 text-center text-sm uppercase tracking-[0.16em] text-navy-900 backdrop-blur-sm transition-all duration-300 hover:border-navy-900 hover:bg-white/55 sm:w-auto sm:min-w-[300px]"
          >
            Explore Diagnostics
          </a>

        </div>

        {/* Supporting copy */}
        <p className="mx-auto mt-10 max-w-2xl font-body text-sm leading-relaxed text-navy-500 md:text-base">
          Not sure where you stand? Start with a personalised readiness check.
        </p>

      </div>
    </section>
  );
}