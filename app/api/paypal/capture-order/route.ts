import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { DiagnosticType, ExamLevel } from "@/types/diagnostic";

const VALID_DIAGNOSTIC_TYPES: DiagnosticType[] = [
  "writing",
  "use-of-english",
  "listening",
];
const VALID_EXAM_LEVELS: ExamLevel[] = ["B2", "C1"];

/**
 * Step 2 of the PayPal flow: after the student approves the payment in
 * the PayPal popup, this captures it (server-to-server, using the secret
 * — the client can't fake this) and, once PayPal confirms COMPLETED,
 * inserts the order row that everything downstream depends on
 * (status "paid" → exam page, timer, test assignment, PDF receipt,
 * dashboard). Returns our internal orderId so the client can redirect
 * straight to /exam/{orderId}.
 *
 * Idempotent: paypal_order_id is unique in the DB, so a double-click or
 * retry finds the existing row and returns it instead of double-charging
 * anything (the capture call itself is also idempotent on PayPal's side).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      paypalOrderId,
      diagnosticType,
      examLevel,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
    } = body;

    if (!paypalOrderId || typeof paypalOrderId !== "string") {
      return NextResponse.json(
        { error: "Missing paypalOrderId" },
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

    const admin = createAdminClient();

    // Already captured & recorded? Return the existing order (idempotency).
    const { data: existing } = await admin
      .from("orders")
      .select("id")
      .eq("paypal_order_id", paypalOrderId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ orderId: existing.id });
    }

    const capture = await capturePayPalOrder(paypalOrderId);

    if (!capture.completed) {
      return NextResponse.json(
        { error: "Payment was not completed" },
        { status: 402 }
      );
    }

    // Cross-check what PayPal says was bought against what the client
    // claims — the custom_id was set server-side at create-order time.
    if (
      capture.customId &&
      capture.customId !== `${diagnosticType}|${examLevel}`
    ) {
      console.error(
        "PayPal custom_id mismatch:",
        capture.customId,
        "vs",
        `${diagnosticType}|${examLevel}`
      );
      return NextResponse.json(
        { error: "Order details mismatch" },
        { status: 400 }
      );
    }

    // Tie to the logged-in account if there is one (dashboard visibility).
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: inserted, error: insertError } = await admin
      .from("orders")
      .insert({
        payment_provider: "paypal",
        paypal_order_id: paypalOrderId,
        customer_email: user?.email ?? capture.payerEmail ?? "",
        customer_name: capture.payerName,
        diagnostic_type: diagnosticType,
        exam_level: examLevel,
        amount_paid: capture.amountCents,
        currency: capture.currency,
        status: "paid",
        user_id: user?.id ?? null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null,
        utm_term: utm_term || null,
      })
      .select("id")
      .single();

    if (insertError || !inserted) {
      // Unique-violation race: another request inserted it first — reread.
      const { data: reread } = await admin
        .from("orders")
        .select("id")
        .eq("paypal_order_id", paypalOrderId)
        .maybeSingle();
      if (reread) {
        return NextResponse.json({ orderId: reread.id });
      }
      console.error(
        "PayPal payment captured but order insert failed:",
        insertError
      );
      return NextResponse.json(
        {
          error:
            "Payment received but we couldn't register your order automatically. Please contact pharosenglishlab@gmail.com with your PayPal receipt.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ orderId: inserted.id });
  } catch (error) {
    console.error("PayPal capture-order failed:", error);
    return NextResponse.json(
      { error: "Failed to capture PayPal payment" },
      { status: 500 }
    );
  }
}
