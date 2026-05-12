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
    "Learn about Pharos English Lab — over 30 years of Cambridge exam preparation experience for B2 First and C1 Advanced students worldwide.",
};

const values = [
  {
    icon: BookOpen,
    title: "Decades of Expertise",
    description:
      "My diagnostic methodology is built on more than 30 years of hands-on Cambridge exam preparation. Every criterion, every piece of feedback reflects real classroom experience and examiner insight.",
  },
  {
    icon: Sparkles,
    title: "Clarity That Builds Confidence",
    description:
      "My goal is not simply to correct your work, but to help you understand your performance deeply, identify patterns, and know exactly what to improve next.",
  },
  {
    icon: Award,
    title: "Cambridge Specialist",
    description:
      "I focus exclusively on Cambridge B2 First and C1 Advanced exams. This specialisation allows me to deliver deeper analysis, more accurate feedback, and realistic exam predictions.",
  },
  {
    icon: Users,
    title: "A Personal Approach",
    description:
      "Every diagnostic is designed to feel personal, practical, and actionable — giving you clear direction, not generic advice.",
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
            Cambridge exam diagnostics built on decades of experience, personal guidance, and honest feedback.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="mx-auto max-w-3xl">

          <h2 className="heading-lg">Pharos Story</h2>

          <div className="mt-8 space-y-5 font-body text-base leading-relaxed text-navy-700">

            <p>
              Pharos English Lab began with a simple observation: many students preparing for Cambridge exams receive scores, but very few receive the clarity they truly need to improve.
            </p>

            <p>
              After more than 30 years dedicated to Cambridge exam preparation — teaching students, mentoring teachers, and guiding hundreds of candidates through B2 First and C1 Advanced — I saw the same pattern again and again: learners often worked hard, but lacked precise, honest feedback about where they stood and what to do next.
            </p>

            <p>
              That is why I created Pharos English Lab.
            </p>

            <p>
              To me, a lighthouse represents clarity, direction, and confidence — especially when the path ahead feels uncertain. That idea is at the heart of everything I do as a teacher, mentor, and examiner.
            </p>

            <p>
              Every diagnostic is built on my professional experience with Cambridge assessment criteria, examiner expectations, and real classroom results. My goal is not simply to correct your work, but to help you understand your performance deeply, identify recurring patterns, and move forward with confidence.
            </p>

            <p>
              Pharos was created to offer high-level Cambridge diagnostic feedback that is clear, personal, and truly useful — wherever you are in the world.
            </p>

          </div>
        </div>
      </section>

      {/* Why Pharos */}
      <section className="section-padding section-dark">
        <div className="mx-auto max-w-3xl">

          <div className="flex items-center gap-4">
            <Compass
              className="h-10 w-10 shrink-0 text-gold-500"
              strokeWidth={1.5}
            />

            <h2 className="heading-lg !text-white">
              Why "Pharos"?
            </h2>
          </div>

          <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-navy-200">

            <p>
              A lighthouse exists to guide, illuminate, and offer direction when the path ahead feels uncertain.
            </p>

            <p>
              That is exactly what I aim to do through every diagnostic, every piece of feedback, and every student journey at Pharos English Lab.
            </p>

          </div>
        </div>
      </section>

      {/* Methodology */}
      <section className="section-padding">
        <div className="mx-auto max-w-5xl">

          <div className="text-center">
            <h2 className="heading-lg">My Methodology</h2>

            <p className="mx-auto mt-4 max-w-2xl font-body text-navy-600">
              Every diagnostic combines Cambridge assessment expertise with structured analysis and practical feedback.
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

      {/* Cambridge Focus */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-3xl text-center">

          <h2 className="heading-lg">Cambridge Exam Specialist</h2>

          <p className="mt-6 font-body text-base leading-relaxed text-navy-700">
            I focus exclusively on Cambridge B2 First and C1 Advanced examinations. This deliberate specialisation allows me to go deeper than generalist platforms — with feedback calibrated to the specific descriptors, scoring systems, and examiner expectations of these exams.
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