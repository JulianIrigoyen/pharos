"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import clsx from "clsx";
import type { TextPartConfig } from "@/types/exam-parts";

interface TextInputPartProps {
  part: TextPartConfig;
  register: UseFormRegister<Record<string, string>>;
  errors: FieldErrors<Record<string, string>>;
}

/**
 * Renders any Reading & Use of English part where the student types a
 * single word, phrase, or sentence per question: Open Cloze, Word
 * Formation, and Key Word Transformations all share this exact
 * interaction on an answer sheet. The student only writes their answer —
 * never the given word or the original sentence, since those are already
 * printed on the test PDF they're reading.
 */
export function TextInputPart({ part, register, errors }: TextInputPartProps) {
  return (
    <div>
      <h2 className="heading-sm">{part.title}</h2>
      <p className="mt-2 mb-6 font-body text-sm text-navy-500">
        {part.instructions}
      </p>
      <div className="space-y-3">
        {Array.from({ length: part.count }, (_, i) => {
          const questionNumber = part.startQuestion + i;
          const fieldName = `Q${questionNumber}`;
          return (
            <div key={questionNumber} className="flex items-center gap-3">
              <label
                htmlFor={fieldName}
                className="w-8 shrink-0 font-body text-sm font-semibold text-navy-700"
              >
                {questionNumber}
              </label>
              <div className="flex-1">
                <input
                  id={fieldName}
                  type="text"
                  className={clsx(
                    "input-field",
                    errors[fieldName] && "!border-red-400 !ring-red-400/20"
                  )}
                  placeholder="Your answer..."
                  {...register(fieldName, {
                    required: "This answer is required",
                  })}
                />
                {errors[fieldName] && (
                  <p className="mt-1 font-body text-xs text-red-500">
                    {errors[fieldName]?.message as string}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
