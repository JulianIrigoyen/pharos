import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Headphones,
  MessageSquare,
  Shuffle,
} from "lucide-react";
import { CheckoutButton } from "@/components/diagnostics/CheckoutButton";

export const metadata: Metadata = {
  title: "Listening Diagnostic | Pharos English Lab",
  description:
    "Analyse your Cambridge listening exam performance. Multiple choice, sentence completion, and multiple matching assessment for B2 First and C1 Advanced.",
};

const parts = [
  {
    icon: Headphones,
    title: "Multiple Choice",
    description:
      "You listen to short extracts and answer multiple choice questions. This tests your ability to understand gist, detail, opinion, attitude, and purpose. Our report shows how well you identify distractors and select the correct answer.",
  },
  {
    icon: MessageSquare,
    title: "Sentence Completion",
    description:
      "You listen to a longer monologue and complete sentences with information from the recording. This part tests your ability to identify specific information and paraphrase recognition. We analyse accuracy and common error patterns.",
  },
  {
    icon: Shuffle,
    title: "Multiple Matching",
    description:
      "You listen to a series of short monologues and match each speaker to a statement. This tests your ability to understand the main point of what each speaker says. Our diagnostic evaluates your ability to distinguish between similar ideas.",
  },
];

const audioFormatPoints = [
  "Authentic Cambridge-style audio recordings",
  "Natural speech pace, accents, and background context",
  "Two listening opportunities per extract, just like the real exam",
  "Timed conditions to replicate exam-day pressure",
];

const diagnosticReveals = [
  "Listening accuracy rate by part and question type",
  "Paraphrase recognition strengths and weaknesses",
  "Distractor analysis — why wrong answers seemed right",
  "Speed of comprehension assessment",
  "Strategy effectiveness for each part",
  "Targeted practice recommendations",
];

export default function ListeningDiagnosticPage() {
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
              <h1 className="heading-xl">Listening Diagnostic</h1>
              <p className="mt-3 font-body text-lg text-navy-600">
                Comprehension and strategy assessment for Cambridge listening
                exams
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
            The Cambridge listening exam consists of multiple parts, each
            testing different listening skills. Our diagnostic assesses your
            performance across all of them.
          </p>

          <div className="mt-10 space-y-6">
            {parts.map((part, index) => (
              <div key={part.title} className="card p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50">
                    <part.icon
                      className="h-6 w-6 text-gold-500"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <span className="font-body text-xs font-semibold uppercase tracking-wider text-navy-400">
                      Part {index + 1}
                    </span>
                    <h3 className="font-display text-xl font-medium text-navy-900">
                      {part.title}
                    </h3>
                    <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">
                      {part.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audio-based exam format */}
      <section className="section-padding section-dark">
        <div className="mx-auto max-w-4xl">
          <h2 className="heading-lg !text-white">Audio-Based Exam Format</h2>
          <p className="mt-4 font-body text-navy-200">
            Our listening diagnostic replicates the real Cambridge exam
            experience as closely as possible, giving you an accurate picture of
            your performance under exam conditions.
          </p>

          <ul className="mt-10 space-y-4">
            {audioFormatPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold-500"
                  strokeWidth={2}
                />
                <span className="font-body text-sm text-navy-100">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What the diagnostic reveals */}
      <section className="section-padding">
        <div className="mx-auto max-w-4xl">
          <h2 className="heading-lg">What the Diagnostic Reveals</h2>
          <p className="mt-4 font-body text-navy-600">
            Beyond just marking your answers, we analyse the patterns behind
            your listening performance so you can focus your practice on what
            matters most.
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {diagnosticReveals.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold-500"
                  strokeWidth={2}
                />
                <span className="font-body text-sm text-navy-700">{item}</span>
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
            The listening paper varies between B2 First and C1 Advanced in
            complexity and speech speed. Select your exam level when purchasing
            for the appropriate assessment.
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
            Ready to Test Your Listening Skills?
          </h2>
          <p className="mt-4 mb-8 font-body text-lg text-navy-200">
            Get a comprehensive listening diagnostic for just{" "}
            <span className="font-semibold text-gold-500">$8</span>.
          </p>
          <CheckoutButton diagnosticType="listening" price={8} />
        </div>
      </section>
    </main>
  );
}
