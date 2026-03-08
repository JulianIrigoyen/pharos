"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from "lucide-react";
import clsx from "clsx";

interface ListeningFormProps {
  orderId: string;
  examLevel: string;
}

interface ListeningFormData {
  // Part 1: Multiple choice (8 questions, A/B/C)
  p1_1: string;
  p1_2: string;
  p1_3: string;
  p1_4: string;
  p1_5: string;
  p1_6: string;
  p1_7: string;
  p1_8: string;
  // Part 2: Sentence completion (10 text inputs)
  p2_1: string;
  p2_2: string;
  p2_3: string;
  p2_4: string;
  p2_5: string;
  p2_6: string;
  p2_7: string;
  p2_8: string;
  p2_9: string;
  p2_10: string;
  // Part 3: Multiple matching (5 questions, A-H)
  p3_1: string;
  p3_2: string;
  p3_3: string;
  p3_4: string;
  p3_5: string;
  // Part 4: Multiple choice (7 questions, A/B/C)
  p4_1: string;
  p4_2: string;
  p4_3: string;
  p4_4: string;
  p4_5: string;
  p4_6: string;
  p4_7: string;
}

const PARTS = [
  { id: 1, title: "Part 1: Multiple Choice", count: 8 },
  { id: 2, title: "Part 2: Sentence Completion", count: 10 },
  { id: 3, title: "Part 3: Multiple Matching", count: 5 },
  { id: 4, title: "Part 4: Multiple Choice", count: 7 },
];

const ABC_OPTIONS = ["A", "B", "C"] as const;
const MATCHING_OPTIONS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

export function ListeningForm({ orderId, examLevel }: ListeningFormProps) {
  const router = useRouter();
  const [currentPart, setCurrentPart] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ListeningFormData>();

  const onSubmit = async (data: ListeningFormData) => {
    setSubmitError(null);

    const answers = {
      exam_level: examLevel,
      part1_multiple_choice: Array.from({ length: 8 }, (_, i) => ({
        question: i + 1,
        answer: data[`p1_${i + 1}` as keyof ListeningFormData],
      })),
      part2_sentence_completion: Array.from({ length: 10 }, (_, i) => ({
        question: i + 1,
        answer: data[`p2_${i + 1}` as keyof ListeningFormData],
      })),
      part3_multiple_matching: Array.from({ length: 5 }, (_, i) => ({
        question: i + 1,
        answer: data[`p3_${i + 1}` as keyof ListeningFormData],
      })),
      part4_multiple_choice: Array.from({ length: 7 }, (_, i) => ({
        question: i + 1,
        answer: data[`p4_${i + 1}` as keyof ListeningFormData],
      })),
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
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card p-8 md:p-10"
      noValidate
    >
      {/* Audio Notice */}
      <div className="mb-8 flex items-start gap-3 rounded-lg bg-navy-50 p-4">
        <Headphones
          className="mt-0.5 h-5 w-5 shrink-0 text-navy-600"
          strokeWidth={1.5}
        />
        <p className="font-body text-sm leading-relaxed text-navy-700">
          Listen to the audio tracks provided and answer the questions below.
          Make sure you have completed the listening exam before filling in your
          answers.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-2">
          {PARTS.map((part, idx) => (
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

      {/* Part 1: Multiple Choice (8 questions, A/B/C) */}
      <div className={clsx(currentPart !== 0 && "hidden")}>
        <h2 className="heading-sm">Part 1: Multiple Choice</h2>
        <p className="mt-2 mb-6 font-body text-sm text-navy-500">
          For each question 1-8, choose the best answer A, B, or C.
        </p>
        <div className="space-y-6">
          {Array.from({ length: 8 }, (_, i) => {
            const fieldName = `p1_${i + 1}` as keyof ListeningFormData;
            return (
              <fieldset
                key={i}
                className="rounded-lg border border-navy-100 p-4"
              >
                <legend className="px-2 font-body text-sm font-semibold text-navy-700">
                  Question {i + 1}
                </legend>
                <div className="mt-2 flex flex-wrap gap-4">
                  {ABC_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="radio"
                        value={opt}
                        className="h-4 w-4 border-navy-300 text-navy-900 focus:ring-navy-500"
                        {...register(fieldName, {
                          required: "Please select an answer",
                        })}
                      />
                      <span className="font-body text-sm text-navy-700">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
                {errors[fieldName] && (
                  <p className="mt-2 font-body text-xs text-red-500">
                    {errors[fieldName]?.message}
                  </p>
                )}
              </fieldset>
            );
          })}
        </div>
      </div>

      {/* Part 2: Sentence Completion (10 text inputs) */}
      <div className={clsx(currentPart !== 1 && "hidden")}>
        <h2 className="heading-sm">Part 2: Sentence Completion</h2>
        <p className="mt-2 mb-6 font-body text-sm text-navy-500">
          For each question 1-10, complete the sentence with a word or short
          phrase.
        </p>
        <div className="space-y-5">
          {Array.from({ length: 10 }, (_, i) => {
            const fieldName = `p2_${i + 1}` as keyof ListeningFormData;
            return (
              <div key={i}>
                <label
                  htmlFor={fieldName}
                  className="mb-1.5 block font-body text-sm font-medium text-navy-700"
                >
                  Question {i + 1}
                </label>
                <input
                  id={fieldName}
                  type="text"
                  className={clsx(
                    "input-field",
                    errors[fieldName] && "!border-red-400 !ring-red-400/20"
                  )}
                  placeholder="Type your answer..."
                  {...register(fieldName, {
                    required: "This answer is required",
                  })}
                />
                {errors[fieldName] && (
                  <p className="mt-1 font-body text-xs text-red-500">
                    {errors[fieldName]?.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 3: Multiple Matching (5 questions, A-H) */}
      <div className={clsx(currentPart !== 2 && "hidden")}>
        <h2 className="heading-sm">Part 3: Multiple Matching</h2>
        <p className="mt-2 mb-6 font-body text-sm text-navy-500">
          For each question 1-5, choose the correct option from A to H.
        </p>
        <div className="space-y-6">
          {Array.from({ length: 5 }, (_, i) => {
            const fieldName = `p3_${i + 1}` as keyof ListeningFormData;
            return (
              <fieldset
                key={i}
                className="rounded-lg border border-navy-100 p-4"
              >
                <legend className="px-2 font-body text-sm font-semibold text-navy-700">
                  Question {i + 1}
                </legend>
                <div className="mt-2 flex flex-wrap gap-3">
                  {MATCHING_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="radio"
                        value={opt}
                        className="h-4 w-4 border-navy-300 text-navy-900 focus:ring-navy-500"
                        {...register(fieldName, {
                          required: "Please select an answer",
                        })}
                      />
                      <span className="font-body text-sm text-navy-700">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
                {errors[fieldName] && (
                  <p className="mt-2 font-body text-xs text-red-500">
                    {errors[fieldName]?.message}
                  </p>
                )}
              </fieldset>
            );
          })}
        </div>
      </div>

      {/* Part 4: Multiple Choice (7 questions, A/B/C) */}
      <div className={clsx(currentPart !== 3 && "hidden")}>
        <h2 className="heading-sm">Part 4: Multiple Choice</h2>
        <p className="mt-2 mb-6 font-body text-sm text-navy-500">
          For each question 1-7, choose the best answer A, B, or C.
        </p>
        <div className="space-y-6">
          {Array.from({ length: 7 }, (_, i) => {
            const fieldName = `p4_${i + 1}` as keyof ListeningFormData;
            return (
              <fieldset
                key={i}
                className="rounded-lg border border-navy-100 p-4"
              >
                <legend className="px-2 font-body text-sm font-semibold text-navy-700">
                  Question {i + 1}
                </legend>
                <div className="mt-2 flex flex-wrap gap-4">
                  {ABC_OPTIONS.map((opt) => (
                    <label
                      key={opt}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <input
                        type="radio"
                        value={opt}
                        className="h-4 w-4 border-navy-300 text-navy-900 focus:ring-navy-500"
                        {...register(fieldName, {
                          required: "Please select an answer",
                        })}
                      />
                      <span className="font-body text-sm text-navy-700">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
                {errors[fieldName] && (
                  <p className="mt-2 font-body text-xs text-red-500">
                    {errors[fieldName]?.message}
                  </p>
                )}
              </fieldset>
            );
          })}
        </div>
      </div>

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
            Part {currentPart + 1} of {PARTS.length}
          </span>

          {currentPart < PARTS.length - 1 ? (
            <button
              type="button"
              onClick={() =>
                setCurrentPart((p) => Math.min(PARTS.length - 1, p + 1))
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
        {currentPart === PARTS.length - 1 && (
          <button
            type="submit"
            disabled={isSubmitting}
            className={clsx(
              "btn-gold w-full",
              isSubmitting && "cursor-wait opacity-75"
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit Listening Diagnostic"
            )}
          </button>
        )}
      </div>
    </form>
  );
}
