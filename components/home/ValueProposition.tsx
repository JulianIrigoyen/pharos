import { GraduationCap, Sparkles, Target } from "lucide-react";

const PROPOSITIONS = [
  {
    title: "Deep Cambridge Expertise",
    description:
      "Built on 30+ years of Cambridge exam preparation, teaching, and teacher mentoring. Every diagnostic reflects real classroom experience and examiner expectations.",
    icon: GraduationCap,
  },
  {
    title: "Modern Diagnostic Approach",
    description:
      "Structured analysis, academic expertise, and performance insights designed for today's independent learners.",
    icon: Sparkles,
  },
  {
    title: "Targeted Improvement",
    description:
      "Identify your exact weaknesses and receive clear recommendations that focus your preparation where it matters most.",
    icon: Target,
  },
] as const;

export function ValueProposition() {
  return (
    <section className="section-light px-5 py-16 sm:px-6 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl">

        <h2 className="heading-lg text-center">
          Why Choose <span className="text-gold-500">Pharos</span>
        </h2>

        <div className="mt-8 grid gap-5 sm:mt-12 md:grid-cols-3 md:gap-8">

          {PROPOSITIONS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="card p-5 text-center sm:p-7"
              >

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-50 sm:h-16 sm:w-16">
                  <Icon
                    className="h-7 w-7 text-gold-500 sm:h-8 sm:w-8"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="heading-md mt-4 !text-base sm:mt-5 sm:!text-xl">
                  {item.title}
                </h3>

                <p className="mt-2 font-body text-sm leading-relaxed text-navy-600 sm:mt-3">
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