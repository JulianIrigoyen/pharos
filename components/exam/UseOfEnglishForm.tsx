"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import type { ExamLevel } from "@/types/diagnostic";
import { USE_OF_ENGLISH_PARTS_BY_LEVEL } from "@/types/exam-parts";
import { RadioQuestionPart } from "@/components/exam/parts/RadioQuestionPart";
import { TextInputPart } from "@/components/exam/parts/TextInputPart";
import { ExamTimer } from "@/components/exam/ExamTimer";

interface UseOfEnglishFormProps {
  orderId: string;
  examLevel: ExamLevel;
  /** Full simulation (countdown + auto-submit) vs. untimed practice. */
  timedMode: boolean;
  /** ISO timestamp set server-side when the student started the exam. */
  examStartedAt: string;
  durationMinutes: number;
}

// Answer-sheet style: field names are the global Cambridge question
// numbers (Q1, Q2, ... Q52/Q56), generated at runtime from the part
// config. One component serves every test in the bank for a given level.
type FormValues = Record<string, string>;

export function UseOfEnglishForm({
  orderId,
  examLevel,
  timedMode,
  examStartedAt,
  durationMinutes,
}: UseOfEnglishFormProps) {
  const router = useRouter();
  const parts = USE_OF_ENGLISH_PARTS_BY_LEVEL[examLevel];

  const [currentPart, setCurrentPart] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [timeExpired, setTimeExpired] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  // Shared by the validated "Submit" button and by the timer running out
  // (timed mode only). The timer path intentionally skips validation —
  // whatever the student has answered gets sent, even if some questions
  // are still blank.
  const performSubmit = useCallback(
    async (data: FormValues) => {
      setSubmitError(null);

      const answers: Record<string, unknown> = {
        exam_level: examLevel,
        ...data,
      };

      try {
        const res = await fetch("/api/submissions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, answers }),
        });

        if (!res.ok) {
          throw new Error("Submission failed");
        }

        router.push("/exam/thank-you");
      } catch {
        setSubmitError(
          "Something went wrong submitting your diagnostic. Please try again."
        );
      }
    },
    [examLevel, orderId, router]
  );

  const handleTimeUp = useCallback(() => {
    setTimeExpired(true);
    performSubmit(getValues());
  }, [getValues, performSubmit]);

  // Warn before leaving the tab while the clock is still running, so a
  // student doesn't lose their exam by accidentally closing it. Applies
  // in practice mode too, since losing unsaved answers is bad either way.
  useEffect(() => {
    if (timeExpired) return;

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [timeExpired]);

  return (
    <div>
      {timedMode && (
        <ExamTimer
          examStartedAt={examStartedAt}
          durationMinutes={durationMinutes}
          onExpire={handleTimeUp}
        />
      )}

      <form
        onSubmit={handleSubmit(performSubmit)}
        className={clsx(
          "card p-8 md:p-10",
          timeExpired && "pointer-events-none opacity-60"
        )}
        noValidate
      >
        {timeExpired && (
          <div className="mb-6 flex items-start gap-3 rounded-lg bg-navy-50 p-4">
            <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-navy-600" />
            <p className="font-body text-sm text-navy-700">
              Time&apos;s up — submitting your answers now...
            </p>
          </div>
        )}

        {!timedMode && (
          <div className="mb-6 rounded-lg bg-navy-50 p-4">
            <p className="font-body text-sm text-navy-700">
              Practice mode — no time limit. Submit whenever you&apos;re
              ready.
            </p>
          </div>
        )}

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {parts.map((part, idx) => (
              <button
                key={part.id}
                type="button"
                onClick={() => setCurrentPart(idx)}
                className={clsx(
                  "flex-1 rounded-lg px-3 py-2 font-body text-xs font-medium transition-colors",
                  idx === currentPart
                    ? "bg-navy-900 text-white"
                    : "bg-navy-50 text-navy-500 hover:bg-navy-100"
                )}
              >
                <span className="hidden sm:inline">{part.title}</span>
                <span className="sm:hidden">Part {part.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Parts — all mounted at once (hidden via CSS) so react-hook-form
            keeps validation state across every part while navigating. */}
        {parts.map((part, idx) => (
          <div key={part.id} className={clsx(currentPart !== idx && "hidden")}>
            {part.kind === "radio" ? (
              <RadioQuestionPart part={part} register={register} errors={errors} />
            ) : (
              <TextInputPart part={part} register={register} errors={errors} />
            )}
          </div>
        ))}

        {/* Navigation + Submit */}
        <div className="mt-10 space-y-4">
          {/* Part Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentPart((p) => Math.max(0, p - 1))}
              disabled={currentPart === 0}
              className={clsx(
                "btn-outline gap-2",
                currentPart === 0 && "cursor-not-allowed opacity-40"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="font-body text-sm text-navy-400">
              Part {currentPart + 1} of {parts.length}
            </span>

            {currentPart < parts.length - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setCurrentPart((p) => Math.min(parts.length - 1, p + 1))
                }
                className="btn-outline gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="w-[120px]" />
            )}
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              <p className="font-body text-sm text-red-700">{submitError}</p>
            </div>
          )}

          {/* Submit Button (visible on last part) */}
          {currentPart === parts.length - 1 && (
            <button
              type="submit"
              disabled={isSubmitting || timeExpired}
              className={clsx(
                "btn-gold w-full",
                (isSubmitting || timeExpired) && "cursor-wait opacity-75"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit Use of English Diagnostic"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
