"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { RadioPartConfig } from "@/types/exam-parts";

interface RadioQuestionPartProps {
  part: RadioPartConfig;
  register: UseFormRegister<Record<string, string>>;
  errors: FieldErrors<Record<string, string>>;
}

/**
 * Renders any Reading & Use of English part where the student picks one
 * letter option per question: Multiple Choice Cloze, Multiple Choice,
 * Gapped Text, Cross-text Multiple Matching, and Multiple Matching all
 * share this exact interaction — only the title, instructions, question
 * range, and letter options change. Answer-sheet style: just the letter,
 * no question text.
 */
export function RadioQuestionPart({
  part,
  register,
  errors,
}: RadioQuestionPartProps) {
  return (
    <div>
      <h2 className="heading-sm">{part.title}</h2>
      <p className="mt-2 mb-6 font-body text-sm text-navy-500">
        {part.instructions}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: part.count }, (_, i) => {
          const questionNumber = part.startQuestion + i;
          const fieldName = `Q${questionNumber}`;
          return (
            <fieldset
              key={questionNumber}
              className="flex items-center gap-3 rounded-lg border border-navy-100 p-3"
            >
              <legend className="sr-only">Question {questionNumber}</legend>
              <span className="w-8 shrink-0 font-body text-sm font-semibold text-navy-700">
                {questionNumber}
              </span>
              <div className="flex flex-1 flex-wrap gap-3">
                {part.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-1.5"
                  >
                    <input
                      type="radio"
                      value={opt}
                      className="h-4 w-4 border-navy-300 text-navy-900 focus:ring-navy-500"
                      {...register(fieldName, {
                        required: "Required",
                      })}
                    />
                    <span className="font-body text-sm text-navy-700">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
              {errors[fieldName] && (
                <p className="font-body text-xs text-red-500">
                  {errors[fieldName]?.message as string}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}
