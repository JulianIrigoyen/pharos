"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

interface UseOfEnglishFormProps {
  orderId: string;
  examLevel: string;
}

interface UseOfEnglishFormData {
  // Part 1: Multiple Choice Cloze (8 questions)
  mcq_1: string;
  mcq_2: string;
  mcq_3: string;
  mcq_4: string;
  mcq_5: string;
  mcq_6: string;
  mcq_7: string;
  mcq_8: string;
  // Part 2: Open Cloze (8 questions)
  open_1: string;
  open_2: string;
  open_3: string;
  open_4: string;
  open_5: string;
  open_6: string;
  open_7: string;
  open_8: string;
  // Part 3: Word Formation (8 questions)
  wf_word_1: string;
  wf_answer_1: string;
  wf_word_2: string;
  wf_answer_2: string;
  wf_word_3: string;
  wf_answer_3: string;
  wf_word_4: string;
  wf_answer_4: string;
  wf_word_5: string;
  wf_answer_5: string;
  wf_word_6: string;
  wf_answer_6: string;
  wf_word_7: string;
  wf_answer_7: string;
  wf_word_8: string;
  wf_answer_8: string;
  // Part 4: Key Word Transformations (6 questions)
  kwt_sentence_1: string;
  kwt_keyword_1: string;
  kwt_answer_1: string;
  kwt_sentence_2: string;
  kwt_keyword_2: string;
  kwt_answer_2: string;
  kwt_sentence_3: string;
  kwt_keyword_3: string;
  kwt_answer_3: string;
  kwt_sentence_4: string;
  kwt_keyword_4: string;
  kwt_answer_4: string;
  kwt_sentence_5: string;
  kwt_keyword_5: string;
  kwt_answer_5: string;
  kwt_sentence_6: string;
  kwt_keyword_6: string;
  kwt_answer_6: string;
}

const PARTS = [
  { id: 1, title: "Part 1: Multiple Choice Cloze", count: 8 },
  { id: 2, title: "Part 2: Open Cloze", count: 8 },
  { id: 3, title: "Part 3: Word Formation", count: 8 },
  { id: 4, title: "Part 4: Key Word Transformations", count: 6 },
];

const OPTIONS = ["A", "B", "C", "D"] as const;

export function UseOfEnglishForm({
  orderId,
  examLevel,
}: UseOfEnglishFormProps) {
  const router = useRouter();
  const [currentPart, setCurrentPart] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UseOfEnglishFormData>();

  const onSubmit = async (data: UseOfEnglishFormData) => {
    setSubmitError(null);

    const answers = {
      exam_level: examLevel,
      part1_multiple_choice: Array.from({ length: 8 }, (_, i) => ({
        question: i + 1,
        answer: data[`mcq_${i + 1}` as keyof UseOfEnglishFormData],
      })),
      part2_open_cloze: Array.from({ length: 8 }, (_, i) => ({
        question: i + 1,
        answer: data[`open_${i + 1}` as keyof UseOfEnglishFormData],
      })),
      part3_word_formation: Array.from({ length: 8 }, (_, i) => ({
        question: i + 1,
        given_word: data[`wf_word_${i + 1}` as keyof UseOfEnglishFormData],
        answer: data[`wf_answer_${i + 1}` as keyof UseOfEnglishFormData],
      })),
      part4_key_word_transformations: Array.from({ length: 6 }, (_, i) => ({
        question: i + 1,
        sentence: data[`kwt_sentence_${i + 1}` as keyof UseOfEnglishFormData],
        keyword: data[`kwt_keyword_${i + 1}` as keyof UseOfEnglishFormData],
        answer: data[`kwt_answer_${i + 1}` as keyof UseOfEnglishFormData],
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

      {/* Part 1: Multiple Choice Cloze */}
      <div className={clsx(currentPart !== 0 && "hidden")}>
        <h2 className="heading-sm">Part 1: Multiple Choice Cloze</h2>
        <p className="mt-2 mb-6 font-body text-sm text-navy-500">
          For each question 1-8, select the correct option A, B, C, or D.
        </p>
        <div className="space-y-6">
          {Array.from({ length: 8 }, (_, i) => {
            const fieldName =
              `mcq_${i + 1}` as keyof UseOfEnglishFormData;
            return (
              <fieldset key={i} className="rounded-lg border border-navy-100 p-4">
                <legend className="px-2 font-body text-sm font-semibold text-navy-700">
                  Question {i + 1}
                </legend>
                <div className="mt-2 flex flex-wrap gap-4">
                  {OPTIONS.map((opt) => (
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

      {/* Part 2: Open Cloze */}
      <div className={clsx(currentPart !== 1 && "hidden")}>
        <h2 className="heading-sm">Part 2: Open Cloze</h2>
        <p className="mt-2 mb-6 font-body text-sm text-navy-500">
          For each question 1-8, type the missing word in the gap.
        </p>
        <div className="space-y-5">
          {Array.from({ length: 8 }, (_, i) => {
            const fieldName =
              `open_${i + 1}` as keyof UseOfEnglishFormData;
            return (
              <div key={i}>
                <label
                  htmlFor={fieldName}
                  className="mb-1.5 block font-body text-sm font-medium text-navy-700"
                >
                  Gap {i + 1}
                </label>
                <input
                  id={fieldName}
                  type="text"
                  className={clsx(
                    "input-field",
                    errors[fieldName] && "!border-red-400 !ring-red-400/20"
                  )}
                  placeholder="Type the missing word..."
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

      {/* Part 3: Word Formation */}
      <div className={clsx(currentPart !== 2 && "hidden")}>
        <h2 className="heading-sm">Part 3: Word Formation</h2>
        <p className="mt-2 mb-6 font-body text-sm text-navy-500">
          For each question 1-8, use the given word to form a new word that fits
          the gap.
        </p>
        <div className="space-y-6">
          {Array.from({ length: 8 }, (_, i) => {
            const wordField =
              `wf_word_${i + 1}` as keyof UseOfEnglishFormData;
            const answerField =
              `wf_answer_${i + 1}` as keyof UseOfEnglishFormData;
            return (
              <div
                key={i}
                className="rounded-lg border border-navy-100 p-4"
              >
                <p className="mb-3 font-body text-sm font-semibold text-navy-700">
                  Question {i + 1}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={wordField}
                      className="mb-1.5 block font-body text-xs font-medium text-navy-500"
                    >
                      Given Word
                    </label>
                    <input
                      id={wordField}
                      type="text"
                      className={clsx(
                        "input-field",
                        errors[wordField] &&
                          "!border-red-400 !ring-red-400/20"
                      )}
                      placeholder="e.g. DECIDE"
                      {...register(wordField, {
                        required: "Please provide the given word",
                      })}
                    />
                    {errors[wordField] && (
                      <p className="mt-1 font-body text-xs text-red-500">
                        {errors[wordField]?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={answerField}
                      className="mb-1.5 block font-body text-xs font-medium text-navy-500"
                    >
                      Your Answer
                    </label>
                    <input
                      id={answerField}
                      type="text"
                      className={clsx(
                        "input-field",
                        errors[answerField] &&
                          "!border-red-400 !ring-red-400/20"
                      )}
                      placeholder="e.g. decision"
                      {...register(answerField, {
                        required: "Please provide your answer",
                      })}
                    />
                    {errors[answerField] && (
                      <p className="mt-1 font-body text-xs text-red-500">
                        {errors[answerField]?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Part 4: Key Word Transformations */}
      <div className={clsx(currentPart !== 3 && "hidden")}>
        <h2 className="heading-sm">Part 4: Key Word Transformations</h2>
        <p className="mt-2 mb-6 font-body text-sm text-navy-500">
          For each question 1-6, complete the second sentence so that it has a
          similar meaning to the first sentence, using the key word given.
        </p>
        <div className="space-y-6">
          {Array.from({ length: 6 }, (_, i) => {
            const sentenceField =
              `kwt_sentence_${i + 1}` as keyof UseOfEnglishFormData;
            const keywordField =
              `kwt_keyword_${i + 1}` as keyof UseOfEnglishFormData;
            const answerField =
              `kwt_answer_${i + 1}` as keyof UseOfEnglishFormData;
            return (
              <div
                key={i}
                className="rounded-lg border border-navy-100 p-4"
              >
                <p className="mb-3 font-body text-sm font-semibold text-navy-700">
                  Question {i + 1}
                </p>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor={sentenceField}
                      className="mb-1.5 block font-body text-xs font-medium text-navy-500"
                    >
                      Original Sentence
                    </label>
                    <input
                      id={sentenceField}
                      type="text"
                      className={clsx(
                        "input-field",
                        errors[sentenceField] &&
                          "!border-red-400 !ring-red-400/20"
                      )}
                      placeholder="Type the original sentence..."
                      {...register(sentenceField, {
                        required: "Please provide the sentence",
                      })}
                    />
                    {errors[sentenceField] && (
                      <p className="mt-1 font-body text-xs text-red-500">
                        {errors[sentenceField]?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={keywordField}
                      className="mb-1.5 block font-body text-xs font-medium text-navy-500"
                    >
                      Key Word
                    </label>
                    <input
                      id={keywordField}
                      type="text"
                      className={clsx(
                        "input-field",
                        errors[keywordField] &&
                          "!border-red-400 !ring-red-400/20"
                      )}
                      placeholder="e.g. UNLESS"
                      {...register(keywordField, {
                        required: "Please provide the key word",
                      })}
                    />
                    {errors[keywordField] && (
                      <p className="mt-1 font-body text-xs text-red-500">
                        {errors[keywordField]?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={answerField}
                      className="mb-1.5 block font-body text-xs font-medium text-navy-500"
                    >
                      Your Transformed Sentence
                    </label>
                    <input
                      id={answerField}
                      type="text"
                      className={clsx(
                        "input-field",
                        errors[answerField] &&
                          "!border-red-400 !ring-red-400/20"
                      )}
                      placeholder="Complete the sentence using the key word..."
                      {...register(answerField, {
                        required: "Please provide your answer",
                      })}
                    />
                    {errors[answerField] && (
                      <p className="mt-1 font-body text-xs text-red-500">
                        {errors[answerField]?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
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
              "Submit Use of English Diagnostic"
            )}
          </button>
        )}
      </div>
    </form>
  );
}
