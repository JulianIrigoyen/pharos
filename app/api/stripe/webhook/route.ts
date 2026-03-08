import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { diagnostic_type, exam_level, user_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term } = session.metadata || {};

    if (!diagnostic_type || !exam_level) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    try {
      const supabase = createAdminClient();

      const { error: insertError } = await supabase.from("orders").insert({
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id ?? null,
        customer_email: session.customer_email ?? session.customer_details?.email ?? "",
        diagnostic_type,
        exam_level,
        amount_paid: session.amount_total ?? 0,
        status: "paid",
        user_id: user_id || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        utm_content: utm_content || null,
        utm_term: utm_term || null,
      });

      if (insertError) {
        console.error("Failed to insert order:", insertError);
        return NextResponse.json(
          { error: "Failed to create order" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Database error during webhook processing:", error);
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
