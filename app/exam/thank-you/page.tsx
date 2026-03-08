import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ThankYouTracker } from "@/components/analytics/ThankYouTracker";

export default function ThankYouPage() {
  return (
    <main>
      <ThankYouTracker />
      <section className="section-padding">
        <div className="mx-auto flex max-w-2xl flex-col items-center py-16 text-center">
          <CheckCircle2
            className="mb-6 h-16 w-16 text-gold-500"
            strokeWidth={1.5}
          />

          <h1 className="heading-lg">Your Diagnostic Has Been Submitted!</h1>

          <p className="mt-4 font-body text-lg leading-relaxed text-navy-600">
            Thank you for completing your diagnostic. You will receive your
            professional PDF report via email within 24-48 hours.
          </p>

          <p className="mt-3 font-body text-sm text-navy-400">
            If you have any questions in the meantime, feel free to contact us.
          </p>

          <div className="mt-10 flex gap-4">
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
            <Link href="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
