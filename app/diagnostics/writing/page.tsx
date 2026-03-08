import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileEdit,
  BarChart3,
  Target,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Writing Diagnostic | Pharos English Lab",
  description:
    "Get a detailed analysis of your Cambridge writing performance. Essay, letter, review, report, and article assessment against official Cambridge criteria.",
};

const writingTypes = [
  { label: "Essay", description: "Formal argumentation and opinion development" },
  { label: "Letter / Email", description: "Formal and informal correspondence" },
  { label: "Review", description: "Evaluative writing with recommendation" },
  { label: "Report", description: "Structured information with proposals" },
  { label: "Article", description: "Engaging writing for a target audience" },
];

const cambridgeCriteria = [
  {
    title: "Content",
    description:
      "Has the candidate addressed all parts of the task? Is the target reader fully informed?",
  },
  {
    title: "Communicative Achievement",
    description:
      "Is the writing appropriate for the task type? Does it hold the reader's attention and communicate ideas effectively?",
  },
  {
    title: "Organisation",
    description:
      "Is the writing well-structured with clear paragraphing, cohesive devices, and logical progression?",
  },
  {
    title: "Language",
    description:
      "Does the candidate use a range of vocabulary and grammatical structures accurately and appropriately?",
  },
];

const whatYouReceive = [
  {
    icon: FileEdit,
    title: "Corrected Version",
    description:
      "A fully corrected version of your writing with annotations explaining each correction and why it matters.",
  },
  {
    icon: BarChart3,
    title: "Band Scores",
    description:
      "Individual band scores for each of the four Cambridge criteria, giving you a clear picture of your strengths and weaknesses.",
  },
  {
    icon: Target,
    title: "Improvement Areas",
    description:
      "Prioritised areas for improvement with specific examples and suggestions drawn from your own writing.",
  },
  {
    icon: BookOpen,
    title: "Estimated Exam Score",
    description:
      "An overall estimated Cambridge exam score based on your performance, so you know where you stand.",
  },
];

export default function WritingDiagnosticPage() {
  return (
    <main>
      {/* Hero */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/diagnostics"
            className="mb-8 inline-flex items-center gap-2 font-body text-sm text-navy-500 transition-colors hover:text-navy-700"
          >
            <ArrowLeft className="h-4 w-4" />
            All Diagnostics
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="heading-xl">Writing Diagnostic</h1>
              <p className="mt-3 font-body text-lg text-navy-600">
                Detailed analysis of your writing performance against Cambridge
                criteria
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center self-start rounded-xl bg-gold-50 px-5 py-2.5 font-display text-3xl font-semibold text-gold-500">
              $15
            </span>
          </div>
        </div>
      </section>

      {/* What it covers */}
      <section className="section-padding">
        <div className="mx-auto max-w-4xl">
          <h2 className="heading-lg">What It Covers</h2>
          <p className="mt-4 font-body text-navy-600">
            Submit any Cambridge writing task type. Our diagnostic analyses your
            work against the same criteria used by real Cambridge examiners.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {writingTypes.map((type) => (
              <div key={type.label} className="card p-5">
                <h3 className="font-display text-lg font-medium text-navy-900">
                  {type.label}
                </h3>
                <p className="mt-1 font-body text-sm text-navy-500">
                  {type.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How the analysis works */}
      <section className="section-padding section-dark">
        <div className="mx-auto max-w-4xl">
          <h2 className="heading-lg !text-white">How the Analysis Works</h2>
          <p className="mt-4 font-body text-navy-200">
            Your writing is evaluated against the four official Cambridge
            assessment criteria used for both B2 First and C1 Advanced exams.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {cambridgeCriteria.map((criterion, index) => (
              <div
                key={criterion.title}
                className="rounded-xl border border-navy-700 bg-navy-800/50 p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 font-body text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <h3 className="font-display text-lg font-medium text-white">
                    {criterion.title}
                  </h3>
                </div>
                <p className="font-body text-sm leading-relaxed text-navy-300">
                  {criterion.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you receive */}
      <section className="section-padding">
        <div className="mx-auto max-w-4xl">
          <h2 className="heading-lg">What You Receive</h2>
          <p className="mt-4 font-body text-navy-600">
            Every Writing Diagnostic report includes the following components,
            designed to give you maximum insight into your exam readiness.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {whatYouReceive.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50">
                  <item.icon className="h-6 w-6 text-gold-500" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-navy-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 font-body text-sm leading-relaxed text-navy-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam levels */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="heading-md">Available for Both Exam Levels</h2>
          <div className="mt-6 flex justify-center gap-4">
            <span className="inline-flex items-center rounded-lg bg-cambridge/20 px-4 py-2 font-body text-sm font-semibold text-navy-700">
              B2 First
            </span>
            <span className="inline-flex items-center rounded-lg bg-cambridge/20 px-4 py-2 font-body text-sm font-semibold text-navy-700">
              C1 Advanced
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding section-dark">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="heading-lg !text-white">
            Ready to Analyse Your Writing?
          </h2>
          <p className="mt-4 font-body text-lg text-navy-200">
            Get a comprehensive diagnostic report for just{" "}
            <span className="font-semibold text-gold-500">$15</span>.
          </p>
          <Link href="/diagnostics" className="btn-gold mt-8">
            Purchase This Diagnostic
          </Link>
        </div>
      </section>
    </main>
  );
}
