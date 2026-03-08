import { Hero } from "@/components/home/Hero";
import { ValueProposition } from "@/components/home/ValueProposition";
import { HowItWorks } from "@/components/home/HowItWorks";
import { DiagnosticsPreview } from "@/components/home/DiagnosticsPreview";
import { CTA } from "@/components/home/CTA";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ValueProposition />
      <HowItWorks />
      <DiagnosticsPreview />
      <CTA />
    </main>
  );
}
