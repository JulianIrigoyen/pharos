"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface WritingFormProps {
  orderId: string;
  examLevel: string;
}

interface WritingFormData {
  task_type: string;
  prompt: string;
  response_text: string;
}

const taskTypes = [
  { value: "", label: "Select a task type" },
  { value: "essay", label: "Essay" },
  { value: "letter", label: "Letter" },
  { value: "review", label: "Review" },
  { value: "report", label: "Report" },
  { value: "article", label: "Article" },
];

export function WritingForm({ orderId, examLevel }: WritingFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WritingFormData>();

  const responseText = watch("response_text", "");
  const wordCount = responseText
    ? responseText
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length
    : 0;

  const onSubmit = async (data: WritingFormData) => {
    setSubmitError(null);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          answers: {
            task_type: data.task_type,
            prompt: data.prompt,
            response_text: data.response_text,
            word_count: wordCount,
            exam_level: examLevel,
          },
        }),
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
      className="card space-y-8 p-8 md:p-10"
      noValidate
    >
      <div>
        <h2 className="heading-sm">Your Writing Submission</h2>
        <p className="mt-2 font-body text-sm text-navy-500">
          Paste or type your Cambridge writing task below. Make sure to include
          the original exam question so we can evaluate your response
          accurately.
        </p>
      </div>

      {/* Task Type */}
      <div>
        <label
          htmlFor="task_type"
          className="mb-1.5 block font-body text-sm font-medium text-navy-700"
        >
          Task Type
        </label>
        <select
          id="task_type"
          className={clsx(
            "input-field",
            errors.task_type && "!border-red-400 !ring-red-400/20"
          )}
          {...register("task_type", { required: "Please select a task type" })}
        >
          {taskTypes.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.task_type && (
          <p className="mt-1 font-body text-xs text-red-500">
            {errors.task_type.message}
          </p>
        )}
      </div>

      {/* Task Prompt */}
      <div>
        <label
          htmlFor="prompt"
          className="mb-1.5 block font-body text-sm font-medium text-navy-700"
        >
          Task Prompt / Question
        </label>
        <textarea
          id="prompt"
          rows={4}
          className={clsx(
            "input-field resize-y",
            errors.prompt && "!border-red-400 !ring-red-400/20"
          )}
          placeholder="Paste the exam question or task instructions here..."
          {...register("prompt", {
            required: "Please provide the task question",
            minLength: {
              value: 10,
              message: "The task question seems too short",
            },
          })}
        />
        {errors.prompt && (
          <p className="mt-1 font-body text-xs text-red-500">
            {errors.prompt.message}
          </p>
        )}
      </div>

      {/* Response Text */}
      <div>
        <div className="mb-1.5 flex items-end justify-between">
          <label
            htmlFor="response_text"
            className="block font-body text-sm font-medium text-navy-700"
          >
            Your Writing Response
          </label>
          <span
            className={clsx(
              "font-body text-xs",
              wordCount > 0 ? "text-navy-500" : "text-navy-300"
            )}
          >
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>
        <textarea
          id="response_text"
          rows={12}
          className={clsx(
            "input-field resize-y",
            errors.response_text && "!border-red-400 !ring-red-400/20"
          )}
          placeholder="Paste or type your writing response here..."
          {...register("response_text", {
            required: "Please provide your writing response",
            minLength: {
              value: 50,
              message: "Your response seems too short for a diagnostic",
            },
          })}
        />
        {errors.response_text && (
          <p className="mt-1 font-body text-xs text-red-500">
            {errors.response_text.message}
          </p>
        )}
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <p className="font-body text-sm text-red-700">{submitError}</p>
        </div>
      )}

      {/* Submit */}
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
          "Submit Writing Diagnostic"
        )}
      </button>
    </form>
  );
}
