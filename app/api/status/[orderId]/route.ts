import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // If it looks like a Stripe session ID, look up by stripe_session_id
    const isStripeSession = orderId.startsWith("cs_");
    const column = isStripeSession ? "stripe_session_id" : "id";

    const { data: order, error } = await supabase
      .from("orders")
      .select("id, status, diagnostic_type, exam_level, pdf_url")
      .eq(column, orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
