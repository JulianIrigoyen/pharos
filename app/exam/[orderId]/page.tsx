"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle, Clock, Gauge } from "lucide-react";
import clsx from "clsx";
import type { Order } from "@/types/order";
import { WritingForm } from "@/components/exam/WritingForm";
import { UseOfEnglishForm } from "@/components/exam/UseOfEnglishForm";
import { ListeningForm } from "@/components/exam/ListeningForm";
import { TestPdfViewer } from "@/components/exam/TestPdfViewer";
import { USE_OF_ENGLISH_DURATION_MINUTES } from "@/types/exam-parts";

type ExamOrder = Pick<
  Order,
  | "id"
  | "status"
  | "diagnostic_type"
  | "exam_level"
  | "pdf_url"
  | "exam_started_at"
  | "exam_timed_mode"
  | "assigned_test_code"
  | "writing_prompt_id"
  | "writing_prompt"
>;

export default function ExamPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const [order, setOrder] = useState<ExamOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/status/${orderId}`);

        if (!res.ok) {
          setError("Order not found. Please check your link and try again.");
          return;
        }

        const data = await res.json();

        if (data.status !== "paid") {
          setError(
            "This order has already been submitted or is no longer active."
          );
          return;
        }

        setOrder(data);
      } catch {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  async function handleStartExam(timed: boolean) {
    if (!order) return;
    setStarting(true);
    setError(null);

    try {
      const res = await fetch(`/api/exam/${order.id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timed }),
      });

      if (!res.ok) {
        throw new Error("Failed to start exam");
      }

      const data = await res.json();
      setOrder({
        ...order,
        exam_started_at: data.exam_started_at,
        exam_timed_mode: data.exam_timed_mode,
        assigned_test_code: data.assigned_test_code,
      });
    } catch {
      setError("Couldn't start the exam. Please refresh and try again.");
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <main>
        <section className="section-padding">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-20 text-center">
            <Loader2
              className="mb-4 h-10 w-10 animate-spin text-navy-400"
              strokeWidth={1.5}
            />
            <p className="font-body text-navy-600">
              Loading your diagnostic...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main>
        <section className="section-padding">
          <div className="mx-auto max-w-2xl py-20 text-center">
            <AlertCircle
              className="mx-auto mb-4 h-12 w-12 text-red-400"
              strokeWidth={1.5}
            />
            <h1 className="heading-md">Unable to Load Diagnostic</h1>
            <p className="mt-3 font-body text-navy-600">
              {error ?? "An unexpected error occurred."}
            </p>
          </div>
        </section>
      </main>
    );
  }

  // Use of English lets the student choose timed vs. untimed before
  // starting. Writing and Listening aren't gated this way yet.
  const offersModeChoice = order.diagnostic_type === "use-of-english";
  const needsToStart = offersModeChoice && !order.exam_started_at;

  if (needsToStart) {
    const durationMinutes = USE_OF_ENGLISH_DURATION_MINUTES[order.exam_level];

    return (
      <main>
        <section className="section-padding section-alt">
          <div className="mx-auto max-w-3xl">
            <h1 className="heading-lg">Use of English Diagnostic</h1>
            <p className="mt-3 font-body text-navy-600">
              Choose how you&apos;d like to take this diagnostic.
            </p>
          </div>
        </section>

        <section className="section-padding">
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="card flex flex-col p-8 text-center">
              <Clock
                className="mx-auto mb-4 h-10 w-10 text-navy-400"
                strokeWidth={1.5}
              />
              <h2 className="heading-sm">Full Simulation (Timed)</h2>
              <p className="mt-3 flex-1 font-body text-sm text-navy-600">
                You&apos;ll have <strong>{durationMinutes} minutes</strong> —
                the same timing as the real Cambridge {order.exam_level}{" "}
                Reading and Use of English exam. The clock starts as soon as
                you click below and cannot be paused; whatever you&apos;ve
                answered gets submitted automatically when time runs out.
              </p>
              <button
                type="button"
                onClick={() => handleStartExam(true)}
                disabled={starting}
                className={clsx(
                  "btn-gold mt-6",
                  starting && "cursor-wait opacity-75"
                )}
              >
                {starting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Starting...
                  </span>
                ) : (
                  "Start Timed Exam"
                )}
              </button>
            </div>

            <div className="card flex flex-col p-8 text-center">
              <Gauge
                className="mx-auto mb-4 h-10 w-10 text-navy-400"
                strokeWidth={1.5}
              />
              <h2 className="heading-sm">Practice Mode (No Time Limit)</h2>
              <p className="mt-3 flex-1 font-body text-sm text-navy-600">
                No countdown, no pressure — take as long as you need. Choose
                this if you just want to know your level, regardless of
                whether you&apos;d finish in time on exam day.
              </p>
              <button
                type="button"
                onClick={() => handleStartExam(false)}
                disabled={starting}
                className={clsx(
                  "btn-outline mt-6",
                  starting && "cursor-wait opacity-75"
                )}
              >
                {starting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Starting...
                  </span>
                ) : (
                  "Start Practice Mode"
                )}
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Use of English is the only diagnostic with an embedded test PDF panel
  // so far — it's the only one with a bank of assigned tests behind it
  // (see supabase/migrations/005_exam_test_bank.sql). Writing and
  // Listening keep their existing single-column layout.
  const showsSplitView =
    order.diagnostic_type === "use-of-english" && order.exam_started_at;

  return (
    <main>
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl">
          <h1 className="heading-lg">
            {order.diagnostic_type === "writing" && "Writing Diagnostic"}
            {order.diagnostic_type === "use-of-english" &&
              "Use of English Diagnostic"}
            {order.diagnostic_type === "listening" && "Listening Diagnostic"}
          </h1>
          <p className="mt-3 font-body text-navy-600">
            {showsSplitView
              ? "Read your test on the left and enter your answers on the right, exactly like a real answer sheet."
              : "Complete the form below and submit your answers. You will receive your professional report via email within 24-48 hours."}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className={clsx("mx-auto", showsSplitView ? "max-w-7xl" : "max-w-4xl")}>
          {order.diagnostic_type === "writing" && (
            <WritingForm
              orderId={order.id}
              examLevel={order.exam_level}
              prompt={order.writing_prompt ?? null}
            />
          )}

          {order.diagnostic_type === "use-of-english" &&
            order.exam_started_at && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start">
                  <TestPdfViewer orderId={order.id} />
                </div>
                <div>
                  <UseOfEnglishForm
                    orderId={order.id}
                    examLevel={order.exam_level}
                    timedMode={order.exam_timed_mode === true}
                    examStartedAt={order.exam_started_at}
                    durationMinutes={
                      USE_OF_ENGLISH_DURATION_MINUTES[order.exam_level]
                    }
                  />
                </div>
              </div>
            )}

          {order.diagnostic_type === "listening" && (
            <ListeningForm orderId={order.id} examLevel={order.exam_level} />
          )}
        </div>
      </section>
    </main>
  );
}
