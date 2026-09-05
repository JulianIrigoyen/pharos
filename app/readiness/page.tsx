"use client";

import { useMemo, useState } from "react";
import {
  Compass,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type Question = {
  question: string;
  prompt?: string;
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
    question: "When facing complex grammar in exams, what feels most familiar?",
    scores: [3, 1, 2, 0],
    options: [
      "I can usually manipulate complex grammar naturally.",
      "I recognise the structures, but applying them accurately can be difficult.",
      "I understand them, but pressure affects my choices.",
      "I usually avoid using structures I’m not fully confident with.",
    ],
  },
  {
    question: "If you notice a mistake during an exam...",
    scores: [3, 2, 1, 0],
    options: [
      "I recover quickly and keep my focus.",
      "I notice it, but it affects me for a short time.",
      "I sometimes start doubting later answers.",
      "It often affects my confidence.",
    ],
  },
  {
    question: "Which sentence sounds most natural?",
    scores: [1, 3, 0, 0],
    options: [
      "Had I known earlier, I would prepare differently.",
      "Had I known earlier, I would have prepared differently.",
      "If I had knew earlier, I would prepare differently.",
      "If I know earlier, I would have prepared differently.",
    ],
  },
  {
    question: "Choose the best option:",
    prompt: "She insisted ______ paying for dinner.",
    scores: [0, 3, 0, 0],
    options: ["to", "on", "in", "for"],
  },
  {
    question: "Which sentence shows the strongest control?",
    scores: [1, 0, 3, 2],
    options: [
      "The results were surprising enough for everyone.",
      "The results were enough surprising for everyone.",
      "The results were sufficiently surprising to everyone.",
      "The results were so surprising that everyone noticed.",
    ],
  },
  {
    question: "A writer describes a proposal as:",
    prompt:
      "“Ambitious, though perhaps slightly idealistic.” What is the implied attitude?",
    scores: [1, 3, 0, 0],
    options: [
      "Complete approval",
      "Balanced admiration with some doubt",
      "Clear rejection",
      "Confusion",
    ],
  },
  {
    question: "When a writer avoids stating an opinion directly...",
    scores: [3, 2, 1, 0],
    options: [
      "I usually detect implied meaning easily.",
      "I sometimes need to reread.",
      "I often focus more on vocabulary than tone.",
      "I usually miss the intention.",
    ],
  },
  {
    question: "Read carefully:",
    prompt:
      "Although the candidate appeared confident, her responses often lacked the precision expected at higher levels.",
    scores: [0, 3, 1, 0],
    options: [
      "The candidate was fully prepared.",
      "The candidate showed confidence but lacked accuracy.",
      "The candidate had grammar problems only.",
      "The candidate refused to answer.",
    ],
  },
  {
    question: "Which opening sounds most appropriate for an academic essay?",
    scores: [1, 2, 3, 0],
    options: [
      "A lot of people think education is changing fast.",
      "Education has changed a lot recently.",
      "It is often argued that education is undergoing significant transformation.",
      "Nowadays education changes very quickly.",
    ],
  },
  {
    question: "Which phrase sounds least natural in formal writing?",
    scores: [1, 1, 3, 1],
    options: [
      "From my perspective",
      "To a considerable extent",
      "Kids these days",
      "It could be argued that",
    ],
  },
];

function getProfile(score: number) {
  if (score <= 12) return "Still Building Toward B2";
  if (score <= 22) return "B2 Ready — Ready for Diagnostic Confirmation";
  if (score <= 30) return "Strong B2 / Emerging C1";

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
    const updated = [...answers];

    updated.push(index);

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

          <h1 className="font-body text-3xl font-light text-navy-900 sm:text-4xl">
            Pharos Cambridge Readiness Assessment
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-base text-navy-600 sm:text-lg">
            Discover which Cambridge pathway may best match your current level.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">

            <div className="card p-8 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-8 w-8 text-gold-500" />
              <h3 className="font-body text-lg text-navy-900">
                B2 First
              </h3>
            </div>

            <div className="card p-8 text-center">
              <Sparkles className="mx-auto mb-4 h-8 w-8 text-gold-500" />
              <h3 className="font-body text-lg text-navy-900">
                C1 Advanced
              </h3>
            </div>

          </div>

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

          <h1 className="mb-8 text-center font-body text-2xl font-light text-navy-900 sm:text-3xl">
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
      <main className="min-h-screen bg-navy-50 flex items-center justify-center px-6">

        <div className="mx-auto max-w-2xl text-center">

          <Compass className="mx-auto mb-6 h-12 w-12 text-gold-500" />

          <h1 className="font-body text-2xl font-light text-navy-900 sm:text-3xl">
            Your Readiness Profile Is On Its Way
          </h1>

          <p className="mt-6 font-body text-base text-navy-600 sm:text-lg">
            Please check your inbox. Your personalised feedback is on its way.
          </p>

        </div>

      </main>
    );
  }

  const question = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <main className="section-light section-padding min-h-screen">

      <div className="mx-auto max-w-3xl">

        <div className="mb-10 text-center">

          <p className="font-body text-sm text-navy-500">
            Question {current + 1} of {questions.length}
          </p>

          <div className="mt-4 overflow-hidden rounded-full bg-navy-100">
            <div
              className="h-2 bg-gold-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        <div className="card p-6 sm:p-8 md:p-10">

          <h2 className="mb-8 font-body text-xl font-light text-navy-900 sm:text-2xl">
            {question.question}
          </h2>

          {question.prompt && (
            <div className="mb-8 whitespace-pre-line font-body text-base text-navy-700">
              {question.prompt}
            </div>
          )}

          <div className="grid gap-4">

            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => handleAnswer(index)}
                className="rounded-2xl border border-navy-200 bg-white p-5 text-left font-body text-base text-navy-700 transition-all duration-300 hover:border-gold-500 hover:bg-gold-50"
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