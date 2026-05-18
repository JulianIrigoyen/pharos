"use client";

import { useMemo, useState } from "react";
import {
  Compass,
} from "lucide-react";

type Question = {
  question: string;
  scores: number[];
  options: string[];
};

const questionsBank: Question[] = [
  {
    question: "When reading longer texts in English, what usually happens?",
    scores: [3, 2, 1, 0],
    options: [
      "I read efficiently and usually infer meaning from context.",
      "I understand most ideas, though unfamiliar vocabulary sometimes slows me down.",
      "I usually understand the main ideas, but often reread key sections.",
      "I sometimes lose track of the writer’s main argument.",
    ],
  },
  {
    question: "When writing under exam conditions, what tends to affect you most?",
    scores: [3, 0, 1, 2],
    options: [
      "I usually balance ideas, structure, and language effectively.",
      "I often focus so much on grammar that I lose time.",
      "I usually have ideas, but organising them clearly can be difficult.",
      "I sometimes doubt whether my language sounds natural enough.",
    ],
  },
  {
    question: "If you notice a mistake during an exam...",
    scores: [3, 2, 1, 0],
    options: [
      "I recover quickly and keep my focus.",
      "I notice it, but it affects me briefly.",
      "I sometimes start doubting later answers.",
      "It often affects my confidence.",
    ],
  },
];

function getProfile(score: number) {
  if (score <= 2) return "Still Building Toward B2";
  if (score <= 5) return "B2 Ready — Ready for Diagnostic Confirmation";
  if (score <= 7) return "Strong B2 / Emerging C1";

  return "Likely C1 Advanced Candidate";
}

export default function ReadinessPage() {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const questions = useMemo(() => questionsBank, []);

  function handleAnswer(index: number) {
    const updated = [...answers, index];

    setAnswers(updated);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setShowForm(true);
    }
  }

  function calculateResult() {
    const total = answers.reduce(
      (sum, answerIndex, questionIndex) =>
        sum + questions[questionIndex].scores[answerIndex],
      0
    );

    return {
      readinessScore: total,
      profile: getProfile(total),
    };
  }

  async function handleSubmit() {
    setSending(true);

    const result = calculateResult();

    await fetch("/api/readiness", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        profile: result.profile,
        readinessScore: result.readinessScore,
      }),
    });

    setSending(false);
    setSubmitted(true);
  }

  if (!started) {
    return (
      <main className="section-light section-padding min-h-screen">

        <div className="mx-auto max-w-4xl text-center">

          <Compass className="mx-auto mb-6 h-16 w-16 text-gold-500" />

          <h1 className="font-body text-4xl font-light text-navy-900">
            Are You Truly Ready for Cambridge?
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg leading-relaxed text-navy-600">
            Discover whether you are truly ready for B2 First or C1 Advanced before investing months of preparation.
          </p>

          <button
            onClick={() => setStarted(true)}
            className="btn-gold mt-12"
          >
            Start My Assessment
          </button>

        </div>

      </main>
    );
  }

  if (showForm && !submitted) {
    return (
      <main className="section-light section-padding min-h-screen">

        <div className="mx-auto max-w-xl">

          <h1 className="mb-8 text-center font-body text-3xl text-navy-900">
            Receive Your Results
          </h1>

          <div className="grid gap-4">

            <input
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
            />

            <input
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />

            <button
              onClick={handleSubmit}
              disabled={sending}
              className="btn-gold"
            >
              {sending ? "Sending..." : "Get My Results"}
            </button>

          </div>

        </div>

      </main>
    );
  }

  if (submitted) {
    return (
      <main className="section-light min-h-screen relative">

        <div className="mx-auto max-w-2xl text-center pt-20">

          <Compass className="mx-auto mb-6 h-12 w-12 text-gold-500" />

          <h1 className="font-body text-3xl font-light text-navy-900">
            Your Placement Profile Is On Its Way
          </h1>

          <p className="mt-6 font-body text-navy-600">
            Please check your inbox.
          </p>

        </div>

      </main>
    );
  }

  const question = questions[current];

  return (
    <main className="section-light section-padding min-h-screen">

      <div className="mx-auto max-w-3xl">

        <div className="card p-8">

          <p className="mb-4 text-sm tracking-[0.12em] uppercase text-gold-600">
            Question {current + 1} of {questions.length}
          </p>

          <h2 className="mb-8 font-body text-2xl text-navy-900">
            {question.question}
          </h2>

          <div className="grid gap-4">

            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => handleAnswer(index)}
                className="rounded-2xl border border-navy-200 bg-white p-5 text-left font-body text-base text-navy-700 transition-all duration-200 hover:border-gold-400 hover:shadow-sm"
              >

                <span className="flex gap-3">

                  <span className="font-semibold text-gold-600">
                    {String.fromCharCode(65 + index)}.
                  </span>

                  <span>{option}</span>

                </span>

              </button>
            ))}

          </div>

        </div>

      </div>

    </main>
  );
}