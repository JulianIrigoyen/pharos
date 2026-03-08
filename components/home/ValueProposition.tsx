import { GraduationCap, Brain, Target } from "lucide-react";

const PROPOSITIONS = [
  {
    title: "Expert Analysis",
    description:
      "Built on 30+ years of experience preparing students for Cambridge B2 First and C1 Advanced exams. Every diagnostic reflects real examiner standards.",
    icon: GraduationCap,
  },
  {
    title: "AI-Powered Feedback",
    description:
      "Receive Cambridge-aligned reports generated with precision AI analysis. Detailed scoring across all official assessment criteria.",
    icon: Brain,
  },
  {
    title: "Targeted Improvement",
    description:
      "Pinpoint your exact weaknesses and get actionable study recommendations. Focus your preparation where it matters most.",
    icon: Target,
  },
] as const;

export function ValueProposition() {
  return (
    <section className="section-light section-padding">
      <div className="mx-auto max-w-6xl">
        <h2 className="heading-lg text-center">
          Why Choose <span className="text-gold-500">Pharos</span>
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {PROPOSITIONS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="card p-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50">
                  <Icon
                    className="h-8 w-8 text-gold-500"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="heading-md mt-6 !text-xl">{item.title}</h3>

                <p className="mt-3 font-body text-sm leading-relaxed text-navy-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
