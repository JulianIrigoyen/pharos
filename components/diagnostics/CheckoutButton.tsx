"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { DiagnosticType, ExamLevel } from "@/types/diagnostic";
import { trackInitiateCheckout } from "@/lib/analytics";
import { getUtmParams } from "@/lib/utm";

interface CheckoutButtonProps {
  diagnosticType: DiagnosticType;
  price: number;
  className?: string;
}

export function CheckoutButton({
  diagnosticType,
  price,
  className = "",
}: CheckoutButtonProps) {
  const [examLevel, setExamLevel] = useState<ExamLevel>("B2");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    trackInitiateCheckout({
      content_name: diagnosticType,
      value: price,
      currency: "USD",
    });

    try {
      const utmParams = getUtmParams();
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosticType,
          examLevel,
          ...utmParams,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      {/* Exam level selector */}
      <div className="mb-4">
        <label className="mb-2 block font-body text-sm font-medium text-navy-700">
          Select your exam level
        </label>
        <div className="flex gap-3">
          {(["B2", "C1"] as ExamLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setExamLevel(level)}
              className={`rounded-lg border-2 px-5 py-2.5 font-body text-sm font-semibold transition-all ${
                examLevel === level
                  ? "border-gold-500 bg-gold-50 text-gold-700"
                  : "border-navy-200 bg-white text-navy-600 hover:border-navy-300"
              }`}
            >
              {level === "B2" ? "B2 First" : "C1 Advanced"}
            </button>
          ))}
        </div>
      </div>

      {/* Checkout button */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="btn-gold w-full disabled:opacity-50"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Redirecting to checkout...
          </span>
        ) : (
          `Purchase for $${price}`
        )}
      </button>

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 font-body text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
