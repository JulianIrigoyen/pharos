"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import type { Order } from "@/types/order";
import { WritingForm } from "@/components/exam/WritingForm";
import { UseOfEnglishForm } from "@/components/exam/UseOfEnglishForm";
import { ListeningForm } from "@/components/exam/ListeningForm";

export default function ExamPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/status/${orderId}`);

        if (!res.ok) {
          setError("Order not found. Please check your link and try again.");
          return;
        }

        const data: Order = await res.json();

        if (data.status !== "paid") {
          setError(
            "This order has already been submitted or is no longer active."
          );
          return;
        }

        setOrder(data);
      } catch {
        setError("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <main>
        <section className="section-padding">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-20 text-center">
            <Loader2
              className="mb-4 h-10 w-10 animate-spin text-navy-400"
              strokeWidth={1.5}
            />
            <p className="font-body text-navy-600">
              Loading your diagnostic...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main>
        <section className="section-padding">
          <div className="mx-auto max-w-2xl py-20 text-center">
            <AlertCircle
              className="mx-auto mb-4 h-12 w-12 text-red-400"
              strokeWidth={1.5}
            />
            <h1 className="heading-md">Unable to Load Diagnostic</h1>
            <p className="mt-3 font-body text-navy-600">
              {error ?? "An unexpected error occurred."}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl">
          <h1 className="heading-lg">
            {order.diagnostic_type === "writing" && "Writing Diagnostic"}
            {order.diagnostic_type === "use-of-english" &&
              "Use of English Diagnostic"}
            {order.diagnostic_type === "listening" && "Listening Diagnostic"}
          </h1>
          <p className="mt-3 font-body text-navy-600">
            Complete the form below and submit your answers. You will receive
            your professional report via email within 24-48 hours.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-4xl">
          {order.diagnostic_type === "writing" && (
            <WritingForm orderId={orderId} examLevel={order.exam_level} />
          )}
          {order.diagnostic_type === "use-of-english" && (
            <UseOfEnglishForm orderId={orderId} examLevel={order.exam_level} />
          )}
          {order.diagnostic_type === "listening" && (
            <ListeningForm orderId={orderId} examLevel={order.exam_level} />
          )}
        </div>
      </section>
    </main>
  );
}
