import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Puzzle,
  Layers,
  RefreshCw,
} from "lucide-react";
import { CheckoutButton } from "@/components/diagnostics/CheckoutButton";

export const metadata: Metadata = {
  title: "Use of English Diagnostic | Pharos English Lab",
  description:
    "Detailed grammar and vocabulary analysis for Cambridge B2 First and C1 Advanced Use of English papers. Identify weaknesses and targeted improvement areas.",
};

const parts = [
  {
    icon: BookOpen,
    title: "Multiple Choice Cloze",
    description:
      "Tests your understanding of vocabulary, collocations, idioms, phrasal verbs, and shades of meaning. We analyse which areas of vocabulary are strong and which need attention.",
  },
  {
    icon: Puzzle,
    title: "Open Cloze",
    description:
      "Assesses your knowledge of grammatical structures, linking words, and fixed phrases. Our report pinpoints the grammar patterns that are causing errors.",
  },
  {
    icon: Layers,
    title: "Word Formation",
    description:
      "Evaluates your ability to form words using prefixes, suffixes, and internal changes. We identify which word families and formation rules need revision.",
  },
  {
    icon: RefreshCw,
    title: "Key Word Transformations",
    description:
      "Tests your ability to rephrase sentences using a given key word. This part combines grammar and vocabulary knowledge, and our analysis reveals structural gaps.",
  },
];

const analysisReveals = [
  "Grammar patterns causing repeated errors",
  "Vocabulary gaps by topic and word family",
  "Common collocations and phrasal verbs you need to learn",
  "Word formation rules that need reinforcement",
  "Sentence transformation structures to practise",
  "Part-by-part score breakdown with exam-day prediction",
];

export default function UseOfEnglishDiagnosticPage() {
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
              <h1 className="heading-xl">Use of English Diagnostic</h1>
              <p className="mt-3 font-body text-lg text-navy-600">
                Grammar, vocabulary and structure analysis for Cambridge exam
                readiness
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center self-start rounded-xl bg-gold-50 px-5 py-2.5 font-display text-3xl font-semibold text-gold-500">
              $8
            </span>
          </div>
        </div>
      </section>

      {/* Parts covered */}
      <section className="section-padding">
        <div className="mx-auto max-w-4xl">
          <h2 className="heading-lg">Parts Covered</h2>
          <p className="mt-4 font-body text-navy-600">
            The Use of English paper tests your command of grammar and
            vocabulary across four distinct parts. Our diagnostic analyses your
            performance in each one.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {parts.map((part, index) => (
              <div key={part.title} className="card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50">
                    <part.icon
                      className="h-5 w-5 text-gold-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <span className="font-body text-xs font-semibold uppercase tracking-wider text-navy-400">
                      Part {index + 1}
                    </span>
                    <h3 className="font-display text-lg font-medium text-navy-900">
                      {part.title}
                    </h3>
                  </div>
                </div>
                <p className="font-body text-sm leading-relaxed text-navy-600">
                  {part.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What the analysis reveals */}
      <section className="section-padding section-dark">
        <div className="mx-auto max-w-4xl">
          <h2 className="heading-lg !text-white">
            What the Analysis Reveals
          </h2>
          <p className="mt-4 font-body text-navy-200">
            Our diagnostic goes beyond simple right-or-wrong marking. It
            identifies the underlying patterns in your errors so you can study
            more effectively.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {analysisReveals.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold-500"
                  strokeWidth={2}
                />
                <span className="font-body text-sm text-navy-100">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Exam levels */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="heading-md">Available for Both Exam Levels</h2>
          <p className="mt-3 font-body text-navy-600">
            The Use of English paper differs between B2 First and C1 Advanced.
            Select your exam level when you purchase, and you will receive the
            appropriate paper.
          </p>
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
        <div className="mx-auto max-w-md text-center">
          <h2 className="heading-lg !text-white">
            Ready to Test Your Grammar &amp; Vocabulary?
          </h2>
          <p className="mt-4 mb-8 font-body text-lg text-navy-200">
            Get a comprehensive Use of English diagnostic for just{" "}
            <span className="font-semibold text-gold-500">$8</span>.
          </p>
          <CheckoutButton diagnosticType="use-of-english" price={8} />
        </div>
      </section>
    </main>
  );
}
