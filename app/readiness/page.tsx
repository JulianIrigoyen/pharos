"use client";

import { useMemo, useState } from "react";
import {
  Compass,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type Question = {
  type: "self" | "task";
  question: string;
  prompt?: string;
  scores: number[];
  options: string[];
};

const selfQuestions: Question[] = [
  {
    type: "self",
    question: "How familiar are you with the C1 Advanced Writing paper?",
    scores: [3, 2, 1, 0],
    options: [
      "I know the task types, assessment criteria, and time limits.",
      "I know the task types, but I’m not fully sure how writing is assessed.",
      "I’ve practised writing, but I’m not sure what examiners actually look for.",
      "I’ve studied English, but I’m not really familiar with the writing paper.",
    ],
  },
  {
    type: "self",
    question:
      "When working under exam conditions, what usually affects your performance the most?",
    scores: [1, 1, 2, 3],
    options: [
      "I spend too much time on difficult questions and lose track of time.",
      "I usually know what to do, but I doubt myself and change answers.",
      "I can complete tasks, but I’m not always sure my answers are accurate.",
      "I generally manage my time well and stay focused.",
    ],
  },
  {
    type: "self",
    question: "When doing Use of English tasks, what feels most challenging?",
    scores: [2, 1, 1, 3],
    options: [
      "Understanding the grammar, but not knowing which structure fits best.",
      "Knowing the vocabulary, but struggling with collocations and precision.",
      "Running out of time because I overanalyse each question.",
      "I usually feel comfortable with most task types.",
    ],
  },
  {
    type: "self",
    question: "When working on Reading tasks, what usually happens?",
    scores: [2, 1, 1, 3],
    options: [
      "I understand most texts, but I sometimes lose focus with longer tasks.",
      "I often understand the text, but I struggle to identify the best answer.",
      "I usually spend too much time rereading and second-guessing myself.",
      "I generally read efficiently and feel confident with most tasks.",
    ],
  },
  {
    type: "self",
    question: "What usually affects your Listening performance most?",
    scores: [1, 1, 2, 3],
    options: [
      "I lose track when speakers talk too fast.",
      "If I miss one answer, I panic and lose focus.",
      "I understand the audio, but I sometimes misinterpret details.",
      "I usually follow the audio confidently.",
    ],
  },
  {
    type: "self",
    question: "How do you usually feel during speaking tasks?",
    scores: [0, 1, 2, 3],
    options: [
      "I freeze or become overly aware of my mistakes.",
      "I can communicate, but I simplify too much.",
      "I speak fluently, but I’m not always strategic.",
      "I usually communicate confidently and naturally.",
    ],
  },
  {
    type: "self",
    question: "How well do you understand the structure of C1 Advanced?",
    scores: [3, 2, 1, 0],
    options: [
      "I know all papers, timing, and task types well.",
      "I know the papers, but not all task requirements.",
      "I know some sections, but not the exam as a whole.",
      "I’m still figuring out how the exam works.",
    ],
  },
  {
    type: "self",
    question: "If you had to sit the C1 exam tomorrow, how would you feel?",
    scores: [3, 2, 1, 0],
    options: [
      "Very confident.",
      "Mostly prepared, but unsure.",
      "Not fully ready.",
      "Definitely not ready.",
    ],
  },
];

const useOfEnglishBank: Question[] = [
  {
    type: "task",
    question: "Use of English",
    prompt:
      "She regrets not studying harder for the exam.\n\nKeyword: WISHES\n\nShe __________ harder for the exam.",
    scores: [0, 3, 0, 1],
    options: [
      "wishes she studied",
      "wishes she had studied",
      "wishes studying",
      "wishes she would study",
    ],
  },
];

const readingBank: Question[] = [
  {
    type: "task",
    question: "Reading",
    prompt:
      "Although many candidates feel confident about their English, exam performance often reveals gaps in strategy rather than language ability.",
    scores: [0, 3, 0, 0],
    options: [
      "Candidates usually lack grammar knowledge.",
      "Confidence does not always reflect exam performance.",
      "C1 Advanced is mainly a vocabulary exam.",
      "Strategy is not important.",
    ],
  },
];

const writingBank: Question[] = [
  {
    type: "task",
    question: "Writing",
    prompt: "Which introduction is more appropriate for a C1 essay?",
    scores: [0, 3],
    options: [
      "People argue that practical skills are more important than academic knowledge.",
      "It is often argued that practical skills are more important than academic knowledge.",
    ],
  },
];

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getReadinessProfile(score: number) {
  if (score >= 80) {
    return "Near Exam Ready";
  }

  if (score >= 60) {
    return "High Potential, Needs Calibration";
  }

  if (score >= 40) {
    return "Inconsistent Performer";
  }

  return "Developing Candidate";
}

export default function ReadinessPage() {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const questions = useMemo(() => {
    return [
      ...selfQuestions,
      pickRandom(useOfEnglishBank),
      pickRandom(readingBank),
      pickRandom(writingBank),
    ];
  }, []);

  function handleAnswer(index: number) {
    const updated = [...answers, index];

    setAnswers(updated);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowForm(true);
    }
  }

  function calculateResult() {
    const totalScore = answers.reduce((sum, answerIndex, questionIndex) => {
      return sum + questions[questionIndex].scores[answerIndex];
    }, 0);

    const maxScore = questions.reduce((sum, q) => {
      return sum + Math.max(...q.scores);
    }, 0);

    const readinessScore = Math.round((totalScore / maxScore) * 100);

    return {
      readinessScore,
      profile: getReadinessProfile(readinessScore),
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

    setSubmitted(true);
    setSending(false);
  }

  if (!started) {
    return (
      <main className="min-h-screen px-6 py-16">

        <div className="mx-auto max-w-4xl">

          <div className="text-center">

            <Compass className="mx-auto h-16 w-16 text-gold-500 mb-6" />

            <h1 className="font-display text-4xl text-navy-900">
              Pharos Readiness Assessment
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-600">
              Discover where you currently stand before investing in diagnostics or exam preparation.
            </p>

          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">

            <div className="rounded-2xl border border-gold-200 bg-gold-50 p-8 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-gold-600 mb-4" />
              <h3 className="font-display text-xl text-navy-900">
                C1 Advanced
              </h3>
              <p className="mt-2 text-sm text-navy-600">
                Available now
              </p>
            </div>

            <div className="rounded-2xl border border-navy-100 bg-navy-50 p-8 text-center opacity-80">
              <Sparkles className="mx-auto h-8 w-8 text-gold-500 mb-4" />
              <h3 className="font-display text-xl text-navy-900">
                B2 First
              </h3>
              <p className="mt-2 text-sm text-navy-600">
                Launching Soon
              </p>
            </div>

          </div>

          <div className="text-center mt-16">

            <button
              onClick={() => setStarted(true)}
              className="btn-gold px-10"
            >
              Start My Assessment
            </button>

          </div>

        </div>

      </main>
    );
  }

  if (showForm && !submitted) {
    return (
      <main className="min-h-screen px-6 py-16">

        <div className="mx-auto max-w-xl">

          <h1 className="font-display text-3xl text-navy-900 text-center mb-10">
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
      <main className="min-h-screen px-6 py-20">

        <div className="mx-auto max-w-2xl text-center">

          <h1 className="font-display text-3xl text-navy-900">
            Your Pharos Readiness Profile Is On Its Way
          </h1>

          <p className="mt-6 text-navy-600">
            Please check your inbox.
          </p>

          <div className="mt-12 text-sm text-navy-500">
            <p>Marcela Liporace Murga</p>
            <p>Founder & Academic Director</p>
            <p>Pharos English Lab</p>
          </div>

        </div>

      </main>
    );
  }

  const question = questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen px-6 py-16">

      <div className="mx-auto max-w-3xl">

        <div className="text-center mb-10">

          <p className="text-sm text-navy-500">
            Question {currentQuestion + 1} of {questions.length}
          </p>

          <div className="mt-4 h-2 rounded-full bg-navy-100 overflow-hidden">
            <div
              className="h-full bg-gold-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        <div className="card p-10">

          <h2 className="font-display text-2xl text-navy-900 mb-8">
            {question.question}
          </h2>

          {question.prompt && (
            <div className="mb-8 whitespace-pre-line text-navy-700">
              {question.prompt}
            </div>
          )}

          <div className="grid gap-4">

            {question.options.map((option, i) => (
              <button
                key={option}
                onClick={() => handleAnswer(i)}
                className="rounded-2xl border border-navy-200 bg-white p-5 text-left text-navy-700 transition-all duration-300 hover:border-gold-500 hover:bg-gold-50"
              >
                {option}
              </button>
            ))}

          </div>

        </div>

      </div>

    </main>
  );
}