"use client";

import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import clsx from "clsx";

interface ExamTimerProps {
  /** ISO timestamp set once, server-side, when the student started the exam. */
  examStartedAt: string;
  durationMinutes: number;
  /** Called exactly once, the moment remaining time hits zero. */
  onExpire: () => void;
}

/**
 * Server-tracked countdown: the source of truth is `examStartedAt`
 * (set once by the server when the student clicks "Start Exam", never by
 * the browser). Remaining time is always computed as
 * (examStartedAt + durationMinutes) - now, so refreshing or closing the
 * tab never resets or extends it.
 */
export function ExamTimer({
  examStartedAt,
  durationMinutes,
  onExpire,
}: ExamTimerProps) {
  const endTimeMs = useRef(
    new Date(examStartedAt).getTime() + durationMinutes * 60_000
  );
  const hasExpiredRef = useRef(false);
  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, endTimeMs.current - Date.now())
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, endTimeMs.current - Date.now());
      setRemainingMs(remaining);

      if (remaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        clearInterval(interval);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onExpire]);

  const totalSeconds = Math.floor(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isCritical = totalSeconds <= 60;
  const isWarning = !isCritical && totalSeconds <= 5 * 60;

  return (
    <div
      className={clsx(
        "sticky top-0 z-10 mb-6 flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 font-body text-sm font-semibold transition-colors",
        isCritical
          ? "border-red-300 bg-red-50 text-red-700"
          : isWarning
          ? "border-gold-300 bg-gold-50 text-gold-700"
          : "border-navy-100 bg-navy-50 text-navy-700"
      )}
      role="timer"
      aria-live="polite"
    >
      <Clock className="h-4 w-4" />
      <span>
        {minutes}:{seconds.toString().padStart(2, "0")} remaining
      </span>
    </div>
  );
}
