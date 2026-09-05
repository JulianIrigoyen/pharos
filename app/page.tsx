import Image from "next/image";

import { Hero } from "@/components/home/Hero";
import { ValueProposition } from "@/components/home/ValueProposition";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CTA } from "@/components/home/CTA";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <Hero />

      {/* Why Choose Pharos */}
      <ValueProposition />

      {/* How It Works */}
      <HowItWorks />

      {/* Diagnostic CTA */}
      <CTA />

      {/* Brand Film */}
      <section className="bg-navy-50 py-10 md:py-20">
        <div className="relative h-[220px] overflow-hidden md:h-[400px] lg:h-[520px]">

          {/* Video */}
          <video
            className="absolute inset-0 h-full w-full object-cover brightness-[1.06] contrast-[0.94] saturate-[0.90]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/pharos-intro.mp4" type="video/mp4" />
          </video>

          {/* Soft navy tint */}
          <div className="absolute inset-0 bg-navy-900/8" />

          {/* Soft white lift */}
          <div className="absolute inset-0 bg-white/10" />

          {/* Branding */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 -translate-y-12 md:-translate-y-36">

            <div className="relative h-[72px] w-[280px] md:h-[110px] md:w-[560px]">

              <Image
                src="/pharos-navbar.png"
                alt="Pharos English Lab"
                fill
                priority
                className="object-contain brightness-0 invert drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]"
              />

            </div>

            <p className="mt-[-14px] text-center text-[10px] font-light tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] md:mt-[-20px] md:text-sm">
              Your path to confident English.
            </p>

          </div>

        </div>
      </section>
    </main>
  );
}