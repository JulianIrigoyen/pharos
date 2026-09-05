import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import type { DiagnosticType, ExamLevel } from "@/types/diagnostic";

const VALID_DIAGNOSTIC_TYPES: DiagnosticType[] = [
  "writing",
  "use-of-english",
  "listening",
];
const VALID_EXAM_LEVELS: ExamLevel[] = ["B2", "C1"];

/**
 * Step 1 of the PayPal flow: creates a PayPal order server-side (price
 * always comes from DIAGNOSTICS on the server, never from the client) and
 * returns its id for the PayPal button to open the approval popup with.
 * Nothing is written to our database yet — that only happens in
 * /api/paypal/capture-order, after PayPal confirms the money.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diagnosticType, examLevel } = body;

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

    const paypalOrderId = await createPayPalOrder(diagnosticType, examLevel);
    return NextResponse.json({ id: paypalOrderId });
  } catch (error) {
    console.error("PayPal create-order failed:", error);
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
