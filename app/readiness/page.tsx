"use client";

import { useMemo, useState } from "react";

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
  {
    type: "task",
    question: "Use of English",
    prompt:
      "I didn’t realise how difficult the exam would be.\n\nKeyword: HAD\n\nIf __________ how difficult the exam would be, I would have prepared differently.",
    scores: [3, 0, 0, 0],
    options: [
      "I had realised",
      "I would realise",
      "I realised",
      "I have realised",
    ],
  },
  {
    type: "task",
    question: "Use of English",
    prompt: "Choose the most natural sentence:",
    scores: [0, 0, 3, 0],
    options: [
      "committed several mistakes",
      "did several mistakes",
      "made several mistakes",
      "performed several mistakes",
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
  {
    type: "task",
    question: "Reading",
    prompt:
      "Some students revise intensively but avoid practising under timed conditions. As a result, their knowledge may not translate into effective exam performance.",
    scores: [0, 3, 0, 0],
    options: [
      "Studying a lot always leads to success.",
      "Timed practice can reveal performance issues.",
      "Exam timing is less important than vocabulary.",
      "Students should avoid timed practice.",
    ],
  },
  {
    type: "task",
    question: "Reading",
    prompt:
      "A candidate may understand every word in a text and still choose the wrong answer if they miss the writer’s attitude or purpose.",
    scores: [0, 3, 0, 0],
    options: [
      "Reading is only about vocabulary.",
      "Understanding words is not always enough.",
      "Writer attitude is irrelevant.",
      "C1 texts are impossible to understand.",
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
      "People argue that practical skills are more important than academic knowledge, and this essay will examine both perspectives.",
      "It is often argued that practical skills are more important than academic knowledge, an issue that continues to generate debate in educational contexts.",
    ],
  },
  {
    type: "task",
    question: "Writing",
    prompt: "Which sentence shows better C1-level precision?",
    scores: [0, 3],
    options: [
      "People should make more efforts to protect the environment.",
      "People should make a greater effort to protect the environment.",
    ],
  },
  {
    type: "task",
    question: "Writing",
    prompt: "Which sentence is more suitable for a formal essay?",
    scores: [0, 3],
    options: [
      "This issue is quite complex and people have different opinions about it.",
      "This issue is complex, and opinions on it vary considerably.",
    ],
  },
];

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getReadinessProfile(score: number, performanceScore: number) {
  if (score >= 80 && performanceScore >= 70) {
    return {
      profile: "Near Exam Ready",
      message:
        "You show strong exam awareness and stable performance habits. Your mini task performance also suggests good exam precision.",
    };
  }

  if (score >= 65 && performanceScore < 60) {
    return {
      profile: "High Confidence, Needs Evidence",
      message:
        "Your self-assessment suggests confidence, but your mini task performance indicates that your real exam precision may need checking.",
    };
  }

  if (score >= 60) {
    return {
      profile: "High Potential, Needs Calibration",
      message:
        "You likely have a solid foundation, but your exam performance may need clearer calibration under real exam conditions.",
    };
  }

  if (score >= 40) {
    return {
      profile: "Inconsistent Performer",
      message:
        "Your performance may vary across tasks or under time pressure.",
    };
  }

  return {
    profile: "Developing Candidate",
    message:
      "You may still need to strengthen exam awareness and performance habits.",
  };
}

export default function ReadinessPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const questions = useMemo(() => {
    return [
      ...selfQuestions,
      pickRandom(useOfEnglishBank),
      pickRandom(readingBank),
      pickRandom(writingBank),
    ];
  }, []);

  function handleAnswer(index: number) {
    setAnswers([...answers, index]);

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

    const taskIndexes = questions
      .map((q, i) => (q.type === "task" ? i : -1))
      .filter((i) => i !== -1);

    const taskScore = taskIndexes.reduce((sum, i) => {
      return sum + questions[i].scores[answers[i]];
    }, 0);

    const maxTaskScore = taskIndexes.reduce((sum, i) => {
      return sum + Math.max(...questions[i].scores);
    }, 0);

    const readinessScore = Math.round((totalScore / maxScore) * 100);
    const performanceScore = Math.round((taskScore / maxTaskScore) * 100);

    const result = getReadinessProfile(readinessScore, performanceScore);

    return { readinessScore, performanceScore, result };
  }

  async function handleSubmit() {
    if (!email) return;

    setSending(true);

    const { readinessScore, performanceScore, result } = calculateResult();

    try {
      await fetch("/api/readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          profile: result.profile,
          readinessScore,
          message: `${result.message}<br><br>Mini task performance: ${performanceScore}%.`,
        }),
      });

      setSubmitted(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  }

  if (showForm && submitted) {
    return (
      <main style={{ padding: "56px 24px", maxWidth: "760px", margin: "0 auto" }}>
        <h1>Check your inbox</h1>
        <p style={{ fontSize: "22px", marginTop: "20px" }}>
          Your C1 Readiness Profile has been sent to your email.
        </p>
        <p style={{ fontSize: "16px", color: "#6b7280" }}>
          If you don’t see it, check your spam folder.
        </p>
      </main>
    );
  }

  if (showForm) {
    return (
      <main style={{ padding: "56px 24px", maxWidth: "760px", margin: "0 auto" }}>
        <h1>Get Your Personal C1 Readiness Profile</h1>

        <p style={{ fontSize: "18px", marginTop: "16px" }}>
          Receive a clear, expert-level snapshot of your current performance — and what to focus on next before the exam.
        </p>

        <div style={{ display: "grid", gap: "16px", marginTop: "32px" }}>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "16px", borderRadius: "12px", border: "1px solid #ccc" }}
          />

          <input
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "16px", borderRadius: "12px", border: "1px solid #ccc" }}
          />

          <button
            onClick={handleSubmit}
            disabled={sending}
            style={{
              padding: "16px",
              borderRadius: "12px",
              background: "#d9a22b",
              color: "white",
              fontWeight: "bold",
              border: "none",
            }}
          >
            {sending ? "Sending..." : "Get my results"}
          </button>

          <p style={{ fontSize: "14px", color: "#6b7280" }}>
            No spam. Just your results.
          </p>
        </div>
      </main>
    );
  }

  const question = questions[currentQuestion];

  return (
    <main style={{ padding: "56px 24px", maxWidth: "860px", margin: "0 auto" }}>
      <p>Question {currentQuestion + 1} of {questions.length}</p>

      <h1 style={{ marginBottom: "24px" }}>C1 Readiness Check</h1>

      <h2 style={{ marginBottom: "16px" }}>{question.question}</h2>

      {question.prompt && (
        <div style={{ marginBottom: "20px" }}>
          {question.prompt}
        </div>
      )}

      <div style={{ display: "grid", gap: "12px" }}>
        {question.options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => handleAnswer(i)}
            style={{
              padding: "16px",
              textAlign: "left",
              borderRadius: "12px",
              border: "1px solid #ccc",
              background: "white",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </main>
  );
}