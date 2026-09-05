import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { pickTestForOrder } from "@/lib/exam-tests";

/**
 * Starts the server-tracked exam session for an order, exactly once.
 * The student picks a mode on the "Start Exam" screen — `timed: true` for
 * the full Cambridge-timing simulation (drives the countdown + auto-submit
 * on expiry), `timed: false` for untimed practice (no clock at all).
 *
 * For Use of English orders, this is also the moment a specific test is
 * assigned from the bank (see lib/exam-tests.ts) and recorded as
 * `assigned_test_code` — done here, not earlier at checkout, so it only
 * happens once the student is actually about to take the exam.
 *
 * Idempotent: if the student refreshes the "Start Exam" screen or
 * double-clicks a button, this always returns the original
 * exam_started_at/exam_timed_mode/assigned_test_code instead of
 * overwriting them — once chosen, none of these change for that order.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const timed = body?.timed === true;

    const supabase = createAdminClient();

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select(
        "id, status, exam_started_at, exam_timed_mode, exam_level, diagnostic_type, customer_email, assigned_test_code"
      )
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "paid") {
      return NextResponse.json(
        { error: "Order is not in a valid state to start" },
        { status: 400 }
      );
    }

    if (order.exam_started_at) {
      return NextResponse.json({
        exam_started_at: order.exam_started_at,
        exam_timed_mode: order.exam_timed_mode,
        assigned_test_code: order.assigned_test_code,
      });
    }

    // Assign a test from the bank before starting, if this diagnostic uses
    // one (only Use of English does, for now) and it isn't assigned yet.
    let assignedTestCode: string | null = order.assigned_test_code;
    if (!assignedTestCode && order.diagnostic_type === "use-of-english") {
      assignedTestCode = await pickTestForOrder(
        supabase,
        order.exam_level,
        order.customer_email
      );
    }

    // Guard against a double-click race: only the request that finds
    // exam_started_at still null wins the update.
    const { data: updated, error: updateError } = await supabase
      .from("orders")
      .update({
        exam_started_at: new Date().toISOString(),
        exam_timed_mode: timed,
        ...(assignedTestCode ? { assigned_test_code: assignedTestCode } : {}),
      })
      .eq("id", orderId)
      .is("exam_started_at", null)
      .select("exam_started_at, exam_timed_mode, assigned_test_code")
      .single();

    if (updateError || !updated) {
      // Lost the race — someone else's request set it a moment ago.
      const { data: reread } = await supabase
        .from("orders")
        .select("exam_started_at, exam_timed_mode, assigned_test_code")
        .eq("id", orderId)
        .single();

      if (reread?.exam_started_at) {
        return NextResponse.json({
          exam_started_at: reread.exam_started_at,
          exam_timed_mode: reread.exam_timed_mode,
          assigned_test_code: reread.assigned_test_code,
        });
      }

      console.error("Failed to start exam:", updateError);
      return NextResponse.json(
        { error: "Failed to start exam" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exam_started_at: updated.exam_started_at,
      exam_timed_mode: updated.exam_timed_mode,
      assigned_test_code: updated.assigned_test_code,
    });
  } catch (error) {
    console.error("Exam start error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
