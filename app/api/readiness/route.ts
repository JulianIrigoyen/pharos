import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, profile, readinessScore, message } = body;

    if (!email || !profile || readinessScore === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Pharos English Lab <contact@pharosenglishlab.com>",
      to: email,
      subject: "Your C1 Readiness Profile – Pharos English Lab",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2a44; max-width: 600px; margin: 0 auto;">

          <h2 style="margin-bottom: 10px;">Your C1 Readiness Profile</h2>

          <p>Hello ${name || "there"},</p>

          <p>
            Thank you for completing the Pharos C1 Readiness Check.
          </p>

          <p>
            Here is a snapshot of your current performance:
          </p>

          <p>
            <strong>Profile:</strong> ${profile}<br/>
            <strong>Estimated readiness:</strong> ${readinessScore}%
          </p>

          <p style="margin-top: 16px;">
            ${message}
          </p>

          <hr style="margin: 24px 0;" />

          <p>
            <strong>What this means:</strong><br/>
            This result reflects both your self-assessment and your performance on targeted exam-style tasks.
          </p>

          <p style="margin-top: 20px;">
            If you're preparing for C1 Advanced, the next step is to see how your writing performs under real exam conditions.
          </p>

          <!-- CTA BUTTON -->
          <div style="margin-top: 30px; text-align: center;">
            <a href="http://localhost:3000/diagnostics"
              style="
                display: inline-block;
                padding: 14px 24px;
                background-color: #d9a22b;
                color: white;
                text-decoration: none;
                border-radius: 10px;
                font-weight: bold;
              ">
              Start your full diagnostic
            </a>
          </div>

          <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
            If the button doesn’t work, you can copy and paste this link:<br/>
            http://localhost:3000/diagnostics
          </p>

          <p style="margin-top: 20px;">
            — Pharos English Lab
          </p>

        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Readiness email error:", error);

    return NextResponse.json(
      { error: "Could not send readiness email" },
      { status: 500 }
    );
  }
}