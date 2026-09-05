import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export const runtime = "nodejs";

// Picks an original Pharos writing prompt matching the exam level and assigns
// it to the order, so the Writing form can show it directly on the site
// instead of asking the student to paste in a task from elsewhere.
// Avoids repeating a prompt the same signed-in user has already received.
async function assignWritingPrompt(
  supabase: ReturnType<typeof createAdminClient>,
  orderId: string,
  examLevel: string,
  userId: string | null
) {
  let excludedIds: string[] = [];

  if (userId) {
    const { data: pastOrders } = await supabase
      .from("orders")
      .select("writing_prompt_id")
      .eq("user_id", userId)
      .eq("diagnostic_type", "writing")
      .not("writing_prompt_id", "is", null);

    excludedIds = (pastOrders ?? [])
      .map((o) => o.writing_prompt_id as string | null)
      .filter((id): id is string => Boolean(id));
  }

  let query = supabase
    .from("writing_prompts")
    .select("id")
    .eq("exam_level", examLevel)
    .eq("status", "available");

  if (excludedIds.length > 0) {
    query = query.not("id", "in", `(${excludedIds.join(",")})`);
  }

  const { data: candidates, error: candidatesError } = await query;

  if (candidatesError) {
    throw candidatesError;
  }

  // Fallback: if the student has already seen every available prompt at this
  // level, allow a repeat rather than leaving the order without one.
  const pool =
    candidates && candidates.length > 0
      ? candidates
      : (
          await supabase
            .from("writing_prompts")
            .select("id")
            .eq("exam_level", examLevel)
            .eq("status", "available")
        ).data ?? [];

  if (pool.length === 0) {
    console.error(`No writing prompts available for level ${examLevel}`);
    return;
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];

  const { error: updateError } = await supabase
    .from("orders")
    .update({ writing_prompt_id: chosen.id })
    .eq("id", orderId);

  if (updateError) {
    throw updateError;
  }
}

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

      const { data: insertedOrder, error: insertError } = await supabase
        .from("orders")
        .insert({
          payment_provider: "stripe",
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
        })
        .select("id")
        .single();

      if (insertError) {
        console.error("Failed to insert order:", insertError);
        return NextResponse.json(
          { error: "Failed to create order" },
          { status: 500 }
        );
      }

      // Best-effort: assign an original Pharos writing prompt to Writing orders.
      // Failure here must NOT fail the webhook — the order itself already
      // succeeded, and the student can still be helped manually if this fails.
      if (diagnostic_type === "writing" && insertedOrder?.id) {
        try {
          await assignWritingPrompt(supabase, insertedOrder.id, exam_level, user_id || null);
        } catch (promptError) {
          console.error("Failed to assign writing prompt (non-fatal):", promptError);
        }
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
