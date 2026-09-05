"use client";

import { useState } from "react";
import clsx from "clsx";
import { UseOfEnglishForm } from "@/components/exam/UseOfEnglishForm";
import type { ExamLevel } from "@/types/diagnostic";

/**
 * Preview-only page: renders the Use of English exam form directly, with
 * no real order behind it. Lets anyone see and click through the form in
 * the browser without needing a Supabase order or a Stripe payment.
 *
 * The "Submit" button will not actually work here (there's no real
 * orderId), but every part, question, and the tab navigation work exactly
 * like they will on the real /exam/{orderId} page.
 */
export default function ExamPreviewPage() {
  const [level, setLevel] = useState<ExamLevel>("B2");

  return (
    <main>
      <section className="section-padding section-alt">
        <div className="mx-auto max-w-4xl">
          <h1 className="heading-lg">Use of English — Vista previa</h1>
          <p className="mt-3 font-body text-navy-600">
            Esta página es solo para ver y probar el formulario. No está
            conectada a ninguna orden real, así que el botón final de
            &quot;Submit&quot; no va a enviar nada.
          </p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setLevel("B2")}
              className={clsx(
                "rounded-lg px-4 py-2 font-body text-sm font-medium transition-colors",
                level === "B2"
                  ? "bg-navy-900 text-white"
                  : "bg-navy-50 text-navy-500 hover:bg-navy-100"
              )}
            >
              B2 First (7 partes)
            </button>
            <button
              type="button"
              onClick={() => setLevel("C1")}
              className={clsx(
                "rounded-lg px-4 py-2 font-body text-sm font-medium transition-colors",
                level === "C1"
                  ? "bg-navy-900 text-white"
                  : "bg-navy-50 text-navy-500 hover:bg-navy-100"
              )}
            >
              C1 Advanced (8 partes)
            </button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-4xl">
          <UseOfEnglishForm orderId="preview-only" examLevel={level} />
        </div>
      </section>
    </main>
  );
}
