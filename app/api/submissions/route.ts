import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, answers } = body;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid orderId" },
        { status: 400 }
      );
    }

    if (!answers || typeof answers !== "object" || Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Missing or invalid answers object" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Fetch the order and verify it exists and is paid
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status, diagnostic_type, exam_level")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    if (order.status !== "paid") {
      return NextResponse.json(
        { error: "Order is not in a valid state for submission" },
        { status: 400 }
      );
    }

    // Check for existing submission
    const { data: existingSubmission } = await supabase
      .from("submissions")
      .select("id")
      .eq("order_id", orderId)
      .single();

    if (existingSubmission) {
      return NextResponse.json(
        { error: "A submission already exists for this order" },
        { status: 409 }
      );
    }

    // Insert the submission
    const { error: insertError } = await supabase.from("submissions").insert({
      order_id: orderId,
      diagnostic_type: order.diagnostic_type,
      exam_level: order.exam_level,
      answers,
    });

    if (insertError) {
      console.error("Failed to insert submission:", insertError);
      return NextResponse.json(
        { error: "Failed to create submission" },
        { status: 500 }
      );
    }

    // Update order status to submitted
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "submitted" })
      .eq("id", orderId);

    if (updateError) {
      console.error("Failed to update order status:", updateError);
      return NextResponse.json(
        { error: "Submission created but failed to update order status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
