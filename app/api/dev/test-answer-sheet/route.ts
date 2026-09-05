import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderAnswerSheetPdf } from "@/lib/pdf/render-answer-sheet";
import { USE_OF_ENGLISH_PARTS_BY_LEVEL } from "@/types/exam-parts";
import type { ExamLevel } from "@/types/diagnostic";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * DEV-ONLY: generates a sample answer sheet PDF and sends the exact same
 * email the real /api/submissions flow sends, using fake answers instead
 * of a real Supabase order. Lets us verify the PDF + email pipeline
 * (Resend delivery, attachment, formatting) without needing a paid order.
 *
 * Usage: visit in the browser, e.g.
 *   http://localhost:3000/api/dev/test-answer-sheet
 *   http://localhost:3000/api/dev/test-answer-sheet?level=C1
 *   http://localhost:3000/api/dev/test-answer-sheet?to=someone@example.com
 *
 * Disabled outside development so it can never be triggered once deployed.
 */
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 404 }
    );
  }

  const { searchParams } = new URL(request.url);
  const level = (searchParams.get("level") === "C1" ? "C1" : "B2") as ExamLevel;
  const to = searchParams.get("to") || "pharosenglishlab@gmail.com";

  const parts = USE_OF_ENGLISH_PARTS_BY_LEVEL[level];
  const answers: Record<string, string> = {};
  for (const part of parts) {
    for (let i = 0; i < part.count; i++) {
      const q = part.startQuestion + i;
      answers[`Q${q}`] =
        part.kind === "radio"
          ? part.options[i % part.options.length]
          : `sample answer ${q}`;
    }
  }

  try {
    const pdfBuffer = await renderAnswerSheetPdf({
      studentName: "Test Student",
      studentEmail: to,
      examLevel: level,
      orderId: "TEST-ORDER-0001",
      testCode: `${level}-RUE-001`,
      submittedAt: new Date().toISOString(),
      answers,
    });

    const result = await resend.emails.send({
      from: "Pharos English Lab <contact@pharosenglishlab.com>",
      to: [to],
      bcc: ["pharosenglishlab@gmail.com"],
      subject: `[TEST] Your Use of English answers — ${level}`,
      text: `This is a TEST email from /api/dev/test-answer-sheet — no real student submitted this. It's here to verify the PDF + email pipeline before we connect a real order.\n\nLevel: ${level}\nSample answers included as an attached PDF.`,
      attachments: [
        {
          filename: `pharos-answer-sheet-TEST.pdf`,
          content: pdfBuffer.toString("base64"),
        },
      ],
    });

    return NextResponse.json({ ok: true, sentTo: to, resend: result });
  } catch (error) {
    console.error("Test answer sheet failed:", error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
