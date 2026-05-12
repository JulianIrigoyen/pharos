import { GraduationCap, Sparkles, Target } from "lucide-react";

const PROPOSITIONS = [
  {
    title: "Deep Cambridge Expertise",
    description:
      "Built on more than 30 years of Cambridge exam preparation, teaching, and teacher mentoring. Every diagnostic reflects real classroom experience and examiner expectations.",
    icon: GraduationCap,
  },
  {
    title: "Modern Diagnostic Approach",
    description:
      "A contemporary methodology that combines structured analysis, academic expertise, and clear performance insights — designed for today's independent learners.",
    icon: Sparkles,
  },
  {
    title: "Targeted Improvement",
    description:
      "Identify your exact weaknesses and receive clear, actionable recommendations so you can focus your preparation where it matters most.",
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

                <h3 className="heading-md mt-6 !text-xl">
                  {item.title}
                </h3>

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