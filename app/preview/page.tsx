"use client";

import { useState } from "react";
import clsx from "clsx";
import { FileText } from "lucide-react";
import { UseOfEnglishForm } from "@/components/exam/UseOfEnglishForm";
import type { ExamLevel } from "@/types/diagnostic";
import { USE_OF_ENGLISH_DURATION_MINUTES } from "@/types/exam-parts";

/**
 * Preview-only page: renders the Use of English exam form directly, with
 * no real order behind it. Lets anyone see and click through the form
 * (including the countdown timer and the timed/untimed choice) in the
 * browser without needing a Supabase order, a Stripe payment, or a
 * logged-in account.
 *
 * Deliberately placed OUTSIDE /exam and /dashboard: middleware.ts protects
 * any path starting with those two prefixes (see
 * lib/supabase/middleware.ts), so a page meant to be viewed without
 * logging in has to live somewhere else — hence /preview instead of
 * /exam/preview.
 *
 * The "Submit" button will not actually work here (there's no real
 * orderId), but every part, question, the tab navigation, and the timer
 * work exactly like they will on the real /exam/{orderId} page.
 */
export default function PreviewPage() {
  const [level, setLevel] = useState<ExamLevel>("B2");
  const [timedMode, setTimedMode] = useState(true);
  // Stable per switch, not recomputed on every render — starts the
  // preview's timer "now", same as if the student had just clicked Start.
  const [examStartedAt, setExamStartedAt] = useState(() =>
    new Date().toISOString()
  );

  function restart(nextLevel: ExamLevel, nextTimedMode: boolean) {
    setLevel(nextLevel);
    setTimedMode(nextTimedMode);
    setExamStartedAt(new Date().toISOString());
  }

  const selectableButton = (active: boolean) =>
    clsx(
      "rounded-lg border-2 px-4 py-2 font-body text-sm font-medium transition-colors",
      active
        ? "border-navy-900 bg-navy-900 text-white"
        : "border-navy-200 bg-white text-navy-600 hover:border-navy-300 hover:bg-navy-50"
    );

  return (
    <main>
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl">
          <h1 className="heading-lg">Use of English — Preview</h1>
          <p className="mt-3 font-body text-navy-600">
            This page is only for viewing and testing the form, including
            the timer and practice mode. It isn&apos;t connected to a real
            order, so the final &quot;Submit&quot; button won&apos;t send
            anything.
          </p>
          <p className="mt-2 font-body text-sm text-navy-500">
            The panel on the left below is a placeholder — on the real
            site, it shows the actual test PDF assigned to that student
            from the test bank.
          </p>

          <p className="mt-6 font-body text-xs font-semibold uppercase tracking-wide text-navy-400">
            Choose a level
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => restart("B2", timedMode)}
              className={selectableButton(level === "B2")}
            >
              B2 First (7 parts, 75 min)
            </button>
            <button
              type="button"
              onClick={() => restart("C1", timedMode)}
              className={selectableButton(level === "C1")}
            >
              C1 Advanced (8 parts, 90 min)
            </button>
          </div>

          <p className="mt-5 font-body text-xs font-semibold uppercase tracking-wide text-navy-400">
            Choose a mode
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => restart(level, true)}
              className={selectableButton(timedMode)}
            >
              Timed Mode
            </button>
            <button
              type="button"
              onClick={() => restart(level, false)}
              className={selectableButton(!timedMode)}
            >
              Practice Mode (No Limit)
            </button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start">
              <div className="card flex h-full flex-col overflow-hidden p-0">
                <div className="flex items-center gap-2 border-b border-navy-100 px-4 py-2.5">
                  <FileText
                    className="h-4 w-4 text-navy-400"
                    strokeWidth={1.5}
                  />
                  <span className="font-body text-xs font-medium text-navy-500">
                    Your Test (placeholder)
                  </span>
                </div>
                <iframe
                  src="/sample-exam-preview.pdf"
                  title="Sample test placeholder"
                  className="h-full min-h-[600px] w-full flex-1"
                />
              </div>
            </div>
            <div>
              <UseOfEnglishForm
                orderId="preview-only"
                examLevel={level}
                timedMode={timedMode}
                examStartedAt={examStartedAt}
                durationMinutes={USE_OF_ENGLISH_DURATION_MINUTES[level]}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
