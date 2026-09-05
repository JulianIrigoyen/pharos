import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { renderAnswerSheetPdf } from "@/lib/pdf/render-answer-sheet";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      .select(
        "id, status, diagnostic_type, exam_level, customer_email, customer_name, assigned_test_code"
      )
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
    const { data: submission, error: insertError } = await supabase
      .from("submissions")
      .insert({
        order_id: orderId,
        diagnostic_type: order.diagnostic_type,
        exam_level: order.exam_level,
        answers,
      })
      .select("id, created_at")
      .single();

    if (insertError || !submission) {
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

    // From here on, the submission is already saved successfully.
    // The answer-sheet PDF + email are a "nice to have" on top — if
    // either fails, we log it but still return success to the student,
    // since their answers are safely recorded either way.
    if (order.diagnostic_type === "use-of-english") {
      try {
        const pdfBuffer = await renderAnswerSheetPdf({
          studentName: order.customer_name,
          studentEmail: order.customer_email,
          examLevel: order.exam_level,
          orderId: order.id,
          testCode: order.assigned_test_code,
          submittedAt: submission.created_at,
          answers,
        });

        await resend.emails.send({
          from: "Pharos English Lab <contact@pharosenglishlab.com>",
          to: [order.customer_email],
          bcc: ["pharosenglishlab@gmail.com"],
          subject: `Your Use of English answers — Order ${order.id}`,
          text: `Hi ${order.customer_name ?? ""},\n\nThanks for completing your Use of English diagnostic (${order.exam_level}). Attached is a copy of the answers you submitted, for your records.\n\nYou'll receive your full report separately within 24-48 hours.\n\n— Pharos English Lab`,
          attachments: [
            {
              filename: `pharos-answer-sheet-${order.id}.pdf`,
              content: pdfBuffer.toString("base64"),
            },
          ],
        });
      } catch (pdfOrEmailError) {
        console.error(
          "Answer sheet PDF/email failed (submission still saved):",
          pdfOrEmailError
        );
      }
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
