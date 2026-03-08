import type { Metadata } from "next";
import { FileText, BarChart3, Target } from "lucide-react";
import { DIAGNOSTICS } from "@/types/diagnostic";
import { DiagnosticCard } from "@/components/diagnostics/DiagnosticCard";

export const metadata: Metadata = {
  title: "Cambridge Exam Diagnostics | Pharos English Lab",
  description:
    "Professional diagnostic reports for Cambridge B2 First and C1 Advanced. Writing, Use of English, and Listening analysis with expert methodology.",
};

const reportIncludes = [
  {
    icon: FileText,
    title: "Detailed Analysis",
    description:
      "Every diagnostic provides a thorough breakdown of your performance against official Cambridge assessment criteria.",
  },
  {
    icon: BarChart3,
    title: "Score Estimation",
    description:
      "Receive an estimated Cambridge exam score so you know exactly where you stand before exam day.",
  },
  {
    icon: Target,
    title: "Improvement Plan",
    description:
      "Targeted suggestions and priority areas to focus your study time where it matters most.",
  },
];

export default function DiagnosticsPage() {
  return (
    <main>
      {/* Hero section */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="heading-xl">Cambridge Exam Diagnostics</h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-navy-600">
            Understand your exam readiness with professional diagnostic reports.
            Each diagnostic analyses your performance against real Cambridge
            criteria and provides actionable feedback to improve your score.
          </p>
        </div>
      </section>

      {/* Diagnostic cards grid */}
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {DIAGNOSTICS.map((diagnostic) => (
              <DiagnosticCard key={diagnostic.slug} diagnostic={diagnostic} />
            ))}
          </div>
        </div>
      </section>

      {/* What a diagnostic report includes */}
      <section className="section-padding section-dark">
        <div className="mx-auto max-w-5xl">
          <h2 className="heading-lg text-center !text-white">
            What Every Diagnostic Report Includes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center font-body text-navy-200">
            Built on 30+ years of Cambridge exam preparation methodology,
            enhanced with modern AI analysis.
          </p>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {reportIncludes.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-navy-800">
                  <item.icon className="h-7 w-7 text-gold-500" strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-display text-lg font-medium text-white">
                  {item.title}
                </h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-navy-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
