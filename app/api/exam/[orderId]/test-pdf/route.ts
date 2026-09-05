import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Comfortably longer than the longest paper (C1, 90 min); the client
// (TestPdfViewer) refreshes 5 minutes before this expires, so a signed URL
// stays valid indefinitely for as long as the student needs it, in both
// timed and untimed practice mode. Only applies to storage_path tests —
// external_url tests (the two Cambridge-hosted "-DIGITAL-" ones) never
// expire, there's nothing to sign.
const SIGNED_URL_TTL_SECONDS = 60 * 70;

// Private Storage bucket holding Pharos's curated, key-free test PDFs. See
// supabase/migrations/001_init.sql, "Seed the test bank", for the full
// sourcing story (why some tests are storage_path and some external_url).
const BUCKET = "exam-tests";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, diagnostic_type, assigned_test_code, exam_started_at")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.exam_started_at) {
      return NextResponse.json(
        { error: "Start the exam before requesting your test." },
        { status: 409 }
      );
    }

    if (!order.assigned_test_code) {
      return NextResponse.json(
        { error: "No test has been assigned to this order yet." },
        { status: 409 }
      );
    }

    const { data: test, error: testError } = await supabase
      .from("exam_tests")
      .select("storage_path, external_url")
      .eq("test_code", order.assigned_test_code)
      .single();

    if (testError || !test) {
      console.error(
        "Assigned test not found in bank:",
        order.assigned_test_code
      );
      return NextResponse.json(
        {
          error:
            "Your test could not be found. Please contact Pharos English Lab.",
        },
        { status: 500 }
      );
    }

    // external_url tests (Cambridge's own digital sample player): nothing
    // to sign, no expiry — just hand back the link.
    if (test.external_url) {
      return NextResponse.json({
        url: test.external_url,
        testCode: order.assigned_test_code,
        mode: "external" as const,
      });
    }

    // storage_path tests: Pharos's own curated, key-free PDF, private in
    // Storage — resolve to a short-lived signed URL.
    if (!test.storage_path) {
      console.error(
        "Test row has neither storage_path nor external_url:",
        order.assigned_test_code
      );
      return NextResponse.json(
        {
          error:
            "Your test could not be found. Please contact Pharos English Lab.",
        },
        { status: 500 }
      );
    }

    const { data: signed, error: signError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(test.storage_path, SIGNED_URL_TTL_SECONDS);

    if (signError || !signed) {
      console.error("Failed to create signed URL:", signError);
      return NextResponse.json(
        { error: "Could not generate a link to your test right now." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: signed.signedUrl,
      testCode: order.assigned_test_code,
      mode: "embed" as const,
      expiresAt: new Date(
        Date.now() + SIGNED_URL_TTL_SECONDS * 1000
      ).toISOString(),
    });
  } catch (error) {
    console.error("test-pdf error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
