"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";
import type { DiagnosticType, ExamLevel } from "@/types/diagnostic";
import { trackInitiateCheckout } from "@/lib/analytics";
import { getUtmParams } from "@/lib/utm";

interface PayPalCheckoutButtonProps {
  diagnosticType: DiagnosticType;
  price: number;
  className?: string;
}

/**
 * PayPal checkout for a diagnostic: exam-level toggle + PayPal's own
 * Smart Buttons. The price is decided server-side (create-order route);
 * on approval the payment is captured server-side and the student is
 * redirected straight into their exam at /exam/{orderId}. Mirrors the
 * UI conventions of CheckoutButton.tsx (the Stripe variant, kept intact).
 */
export function PayPalCheckoutButton({
  diagnosticType,
  price,
  className = "",
}: PayPalCheckoutButtonProps) {
  const router = useRouter();
  const [examLevel, setExamLevel] = useState<ExamLevel>("B2");
  const [error, setError] = useState<string | null>(null);
  const [finalizing, setFinalizing] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className={className}>
        <p className="rounded-lg bg-navy-50 px-4 py-3 font-body text-sm text-navy-600">
          Online payment is being set up. Please check back soon, or write
          to pharosenglishlab@gmail.com to purchase directly.
        </p>
      </div>
    );
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

      {finalizing ? (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-navy-50 px-4 py-4 font-body text-sm text-navy-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          Confirming your payment...
        </div>
      ) : (
        <PayPalScriptProvider
          options={{ clientId, currency: "USD", intent: "capture" }}
        >
          <PayPalButtons
            // Re-render PayPal's iframe when the level changes so the
            // createOrder closure always sees the current selection.
            forceReRender={[examLevel]}
            style={{ layout: "vertical", label: "pay" }}
            createOrder={async () => {
              setError(null);
              trackInitiateCheckout({
                content_name: diagnosticType,
                value: price,
                currency: "USD",
              });
              const res = await fetch("/api/paypal/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ diagnosticType, examLevel }),
              });
              const data = await res.json();
              if (!res.ok || !data.id) {
                throw new Error(data.error || "Could not start checkout");
              }
              return data.id;
            }}
            onApprove={async (data) => {
              setFinalizing(true);
              setError(null);
              try {
                const utmParams = getUtmParams();
                const res = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    paypalOrderId: data.orderID,
                    diagnosticType,
                    examLevel,
                    ...utmParams,
                  }),
                });
                const result = await res.json();
                if (!res.ok || !result.orderId) {
                  throw new Error(
                    result.error || "Payment confirmation failed"
                  );
                }
                router.push(`/exam/${result.orderId}`);
              } catch (err) {
                setFinalizing(false);
                setError(
                  err instanceof Error
                    ? err.message
                    : "Something went wrong confirming your payment. If you were charged, contact pharosenglishlab@gmail.com."
                );
              }
            }}
            onError={() => {
              setError(
                "PayPal couldn't process the payment. Please try again."
              );
            }}
          />
        </PayPalScriptProvider>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 font-body text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
