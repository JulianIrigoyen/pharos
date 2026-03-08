import type { Metadata } from "next";
import {
  Compass,
  BookOpen,
  Award,
  Users,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About | Pharos English Lab",
  description:
    "Learn about Pharos English Lab — 30+ years of Cambridge exam preparation experience combined with modern AI analysis for B2 First and C1 Advanced diagnostics.",
};

const values = [
  {
    icon: BookOpen,
    title: "Decades of Expertise",
    description:
      "Our diagnostic methodology is built on more than 30 years of hands-on Cambridge exam preparation. Every criterion, every piece of feedback reflects real classroom and examiner insight.",
  },
  {
    icon: Sparkles,
    title: "AI-Enhanced Analysis",
    description:
      "We combine our expert methodology with modern AI analysis to deliver diagnostic reports that are thorough, consistent, and available on demand — no waiting for a teacher's schedule.",
  },
  {
    icon: Award,
    title: "Cambridge Specialists",
    description:
      "We focus exclusively on Cambridge B2 First and C1 Advanced exams. This specialisation means deeper knowledge, better feedback, and more accurate score predictions.",
  },
  {
    icon: Users,
    title: "Student-Centred Approach",
    description:
      "Every diagnostic report is designed to be actionable. We do not just tell you what went wrong — we show you exactly what to study next and how to improve your score.",
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl text-center">
          <Compass
            className="mx-auto mb-6 h-16 w-16 text-gold-500"
            strokeWidth={1.2}
          />
          <h1 className="heading-xl">About Pharos English Lab</h1>
          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-navy-600">
            Expert Cambridge exam diagnostics powered by decades of teaching
            experience and modern technology.
          </p>
        </div>
      </section>

      {/* Our story */}
      <section className="section-padding">
        <div className="mx-auto max-w-3xl">
          <h2 className="heading-lg">Our Story</h2>
          <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-navy-700">
            <p>
              Pharos English Lab was founded on a simple observation: students
              preparing for Cambridge exams often lack clear, objective insight
              into where they actually stand. Mock exams give a score, but they
              rarely explain <em>why</em> that score happened or <em>what</em>{" "}
              to do about it.
            </p>
            <p>
              With more than 30 years of Cambridge exam preparation experience
              — teaching, training other teachers, and preparing thousands of
              students for B2 First and C1 Advanced — we built Pharos to solve
              that problem. Our diagnostic reports do not just mark your work.
              They analyse it against official Cambridge criteria, identify
              patterns in your errors, and give you a clear, prioritised plan
              for improvement.
            </p>
            <p>
              We combined this deep expertise with modern AI analysis to create
              a platform that delivers professional-quality diagnostics on
              demand. The result is feedback that would normally require hours
              with an experienced Cambridge teacher — available instantly and
              affordably.
            </p>
          </div>
        </div>
      </section>

      {/* The name */}
      <section className="section-padding section-dark">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <Compass
              className="h-10 w-10 shrink-0 text-gold-500"
              strokeWidth={1.5}
            />
            <h2 className="heading-lg !text-white">Why &ldquo;Pharos&rdquo;?</h2>
          </div>
          <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-navy-200">
            <p>
              The Pharos of Alexandria was one of the Seven Wonders of the
              Ancient World — a great lighthouse that guided sailors safely to
              harbour. For centuries, it stood as a symbol of clarity, guidance,
              and safe passage through uncertain waters.
            </p>
            <p>
              We chose this name because that is exactly what we do: illuminate
              the path through Cambridge exam preparation. Our diagnostics act
              as your lighthouse, showing you where you are, where you need to
              go, and the most direct route to get there.
            </p>
          </div>
        </div>
      </section>

      {/* Our methodology */}
      <section className="section-padding">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="heading-lg">Our Methodology</h2>
            <p className="mx-auto mt-4 max-w-2xl font-body text-navy-600">
              Every diagnostic report combines proven Cambridge assessment
              methodology with intelligent analysis.
            </p>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50">
                  <value.icon
                    className="h-6 w-6 text-gold-500"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-navy-900">
                    {value.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-navy-600">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cambridge focus */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="heading-lg">Cambridge Exam Specialists</h2>
          <p className="mt-6 font-body text-base leading-relaxed text-navy-700">
            We focus exclusively on Cambridge B2 First and C1 Advanced
            examinations. This deliberate specialisation allows us to go deeper
            than generalist platforms — our feedback is calibrated to the
            specific descriptors, scoring systems, and examiner expectations of
            these two exams.
          </p>

          <div className="mt-8 flex justify-center gap-6">
            <div className="card px-8 py-5 text-center">
              <span className="font-display text-2xl font-semibold text-navy-900">
                B2
              </span>
              <p className="mt-1 font-body text-sm text-navy-500">
                First (FCE)
              </p>
            </div>
            <div className="card px-8 py-5 text-center">
              <span className="font-display text-2xl font-semibold text-navy-900">
                C1
              </span>
              <p className="mt-1 font-body text-sm text-navy-500">
                Advanced (CAE)
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
