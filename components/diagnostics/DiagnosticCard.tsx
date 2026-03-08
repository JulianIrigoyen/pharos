import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { Diagnostic } from "@/types/diagnostic";

interface DiagnosticCardProps {
  diagnostic: Diagnostic;
}

export function DiagnosticCard({ diagnostic }: DiagnosticCardProps) {
  const { slug, title, subtitle, description, price, features, examLevels } =
    diagnostic;

  return (
    <div className="card flex flex-col p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="heading-sm">{title}</h3>
          <span className="inline-flex shrink-0 items-center rounded-full bg-gold-50 px-3 py-1 font-body text-lg font-semibold text-gold-500">
            ${price}
          </span>
        </div>
        <p className="font-body text-sm font-medium text-navy-500">
          {subtitle}
        </p>
      </div>

      {/* Exam level badges */}
      <div className="mb-5 flex gap-2">
        {examLevels.map((level) => (
          <span
            key={level}
            className="inline-flex items-center rounded-md bg-cambridge/20 px-2.5 py-1 font-body text-xs font-semibold tracking-wide text-navy-700"
          >
            {level}
          </span>
        ))}
      </div>

      {/* Description */}
      <p className="mb-6 font-body text-sm leading-relaxed text-navy-600">
        {description}
      </p>

      {/* Features list */}
      <ul className="mb-8 flex-1 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5">
            <CheckCircle2
              className="mt-0.5 h-4 w-4 shrink-0 text-gold-500"
              strokeWidth={2}
            />
            <span className="font-body text-sm text-navy-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={`/diagnostics/${slug}`} className="btn-gold text-center">
        Get Diagnostic
      </Link>
    </div>
  );
}
