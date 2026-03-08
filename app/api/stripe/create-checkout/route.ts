import { NextRequest, NextResponse } from "next/server";
import { getStripe, getPriceId } from "@/lib/stripe";
import type { DiagnosticType, ExamLevel } from "@/types/diagnostic";

const VALID_DIAGNOSTIC_TYPES: DiagnosticType[] = [
  "writing",
  "use-of-english",
  "listening",
];
const VALID_EXAM_LEVELS: ExamLevel[] = ["B2", "C1"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diagnosticType, examLevel } = body;

    if (!diagnosticType || !examLevel) {
      return NextResponse.json(
        { error: "Missing required fields: diagnosticType, examLevel" },
        { status: 400 }
      );
    }

    if (!VALID_DIAGNOSTIC_TYPES.includes(diagnosticType)) {
      return NextResponse.json(
        { error: `Invalid diagnosticType: ${diagnosticType}` },
        { status: 400 }
      );
    }

    if (!VALID_EXAM_LEVELS.includes(examLevel)) {
      return NextResponse.json(
        { error: `Invalid examLevel: ${examLevel}` },
        { status: 400 }
      );
    }

    const priceId = getPriceId(diagnosticType);
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await getStripe().checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      metadata: {
        diagnostic_type: diagnosticType,
        exam_level: examLevel,
      },
      success_url: `${origin}/exam/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/diagnostics/${diagnosticType}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
