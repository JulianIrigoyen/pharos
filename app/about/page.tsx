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
    "Learn about Pharos English Lab — founded by Marcela Liporace Murga, with over 30 years of English teaching and Cambridge exam preparation experience.",
};

const values = [
  {
    icon: BookOpen,
    title: "Decades of Expertise",
    description:
      "My diagnostic methodology is built on more than 30 years of hands-on teaching, mentoring, and international exam preparation.",
  },
  {
    icon: Sparkles,
    title: "Clarity That Builds Confidence",
    description:
      "My goal is not simply to correct your work, but to help you understand your performance deeply and know exactly what to improve next.",
  },
  {
    icon: Award,
    title: "Cambridge Specialist",
    description:
      "I focus on Cambridge B2 First and C1 Advanced exams, offering precise feedback aligned with real exam expectations.",
  },
  {
    icon: Users,
    title: "A Personal Approach",
    description:
      "Every diagnostic is designed to feel personal, practical, and actionable — never generic.",
  },
];

export default function AboutPage() {
  return (
    <main>

      {/* Hero */}
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl px-6 text-center">

          <Compass
            className="mx-auto mb-6 h-14 w-14 text-gold-500 sm:h-16 sm:w-16"
            strokeWidth={1.2}
          />

          <h1 className="heading-xl">
            About Pharos English Lab
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-base leading-relaxed text-navy-600 sm:text-lg">
            Cambridge exam diagnostics built on decades of experience,
            personal guidance, and honest feedback.
          </p>

        </div>
      </section>


      {/* Story Section */}
      <section className="relative overflow-hidden section-padding">

        {/* Background image */}
        <div className="pointer-events-none absolute inset-0">

          <div
            className="absolute right-[-10%] top-0 h-full w-[92%] bg-right bg-contain bg-no-repeat opacity-[0.10] sm:opacity-[0.14] md:right-0 md:w-[58%] md:opacity-[0.34]"
            style={{
              backgroundImage:
                "url('/marcela-lighthouse-pharos.jpg')",
              filter:
                "grayscale(100%) sepia(8%) hue-rotate(180deg) saturate(90%) brightness(0.92)",
            }}
          />

          {/* Smooth fade */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  to right,
                  rgba(248,249,251,1) 0%,
                  rgba(248,249,251,0.985) 42%,
                  rgba(228,236,247,0.72) 62%,
                  rgba(214,226,241,0.28) 82%,
                  rgba(214,226,241,0.06) 100%
                )
              `,
            }}
          />

        </div>


        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-6">

          <div className="max-w-3xl">

            <h2 className="heading-lg mb-8 sm:mb-10">
              The Story Behind Pharos
            </h2>

            <div className="space-y-7 font-body text-[15px] leading-relaxed text-navy-700 sm:space-y-8 sm:text-base">

              <p>
                Hi, I’m Marcela Liporace Murga — English teacher and founder of Pharos English Lab.
              </p>

              <p>
                After decades teaching English in schools, working as a private tutor, and preparing students for international exams, I began noticing the same challenge again and again.
              </p>

              <p>
                Many capable learners want international certification, but often do not know which exam is right for them, what level they are actually performing at, or what is holding them back.
              </p>

              <p>
                At the same time, not every learner can take traditional weekly 1:1 lessons.
              </p>

              <p>
                That is why I created Pharos English Lab. My project is designed for independent learners who already have a solid foundation, but need expert diagnostic guidance, honest feedback, and a clear sense of direction before taking an important exam.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Why Pharos */}
      <section className="section-padding section-dark">
        <div className="mx-auto max-w-3xl px-6">

          <div className="flex items-center gap-4">

            <Compass
              className="h-9 w-9 shrink-0 text-gold-500 sm:h-10 sm:w-10"
              strokeWidth={1.5}
            />

            <h2 className="heading-lg !text-white">
              Why "Pharos"?
            </h2>

          </div>

          <div className="mt-6 space-y-4 font-body text-[15px] leading-relaxed text-navy-200 sm:text-base">

            <p>
              A lighthouse exists to guide, illuminate, and offer direction when the path ahead feels uncertain.
            </p>

            <p>
              That is exactly what I aim to do through every diagnostic, every piece of feedback, and every learner journey at Pharos English Lab.
            </p>

          </div>

        </div>
      </section>


      {/* Methodology */}
      <section className="section-padding">
        <div className="mx-auto max-w-5xl px-6">

          <div className="text-center">

            <h2 className="heading-lg">
              My Methodology
            </h2>

            <p className="mx-auto mt-4 max-w-2xl font-body text-navy-600">
              Every diagnostic combines Cambridge expertise, structured analysis, and practical next steps.
            </p>

          </div>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">

            {values.map((value) => (
              <div key={value.title} className="flex gap-5">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-50">
                  <value.icon
                    className="h-6 w-6 text-gold-500"
                    strokeWidth={1.5}
                  />
                </div>

                <div>

                  <h3 className="font-body text-lg font-semibold text-navy-900">
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
        <div className="mx-auto max-w-3xl px-6 text-center">

          <h2 className="heading-lg">
            Cambridge Exam Specialist
          </h2>

          <p className="mt-6 font-body text-[15px] leading-relaxed text-navy-700 sm:text-base">
            My current focus is helping B2 First and C1 Advanced candidates prepare with clarity, strategy, and honest performance feedback.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:gap-6">

            <div className="card px-8 py-5 text-center">
              <span className="font-body text-2xl font-semibold text-navy-900">
                B2
              </span>
              <p className="mt-1 font-body text-sm text-navy-500">
                First (FCE)
              </p>
            </div>

            <div className="card px-8 py-5 text-center">
              <span className="font-body text-2xl font-semibold text-navy-900">
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