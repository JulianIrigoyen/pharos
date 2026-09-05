import { NextResponse } from "next/server";
import { Resend } from "resend";
import { PHAROS_OFFICIAL_LOCKUP_CROPPED_BASE64 } from "@/lib/emailLogo";
import { SITE_URL } from "@/lib/siteUrl";

const resend = new Resend(process.env.RESEND_API_KEY);

function getPersonalMessage(profile: string) {
  switch (profile) {
    case "Still Building Toward B2":
      return {
        explanation:
          "Your responses suggest that you may still be developing the language control, exam familiarity, and strategic confidence needed for consistent B2-level exam performance.",
        nextStep:
          "Before investing in a full diagnostic, your strongest next step may be strengthening grammar accuracy, reading control, and exam familiarity.",
      };

    case "B2 Ready — Ready for Diagnostic Confirmation":
      return {
        explanation:
          "Your responses suggest that you already demonstrate many of the language skills, exam behaviours, and strategic awareness typically associated with B2 First candidates.",
        nextStep:
          "A full diagnostic can help confirm how your writing, grammar control, and task performance hold up under authentic exam conditions.",
      };

    case "Strong B2 / Emerging C1":
      return {
        explanation:
          "Your profile suggests that you are already showing several features associated with higher-level exam performance, though some areas may still need greater consistency.",
        nextStep:
          "A diagnostic can help confirm whether your current performance supports a realistic move toward C1 Advanced.",
      };

    case "Likely C1 Advanced Candidate":
      return {
        explanation:
          "Your responses suggest strong language control, academic awareness, and strategic performance associated with C1-level candidates.",
        nextStep:
          "A full diagnostic can help validate your readiness under authentic Cambridge exam conditions.",
      };

    default:
      return {
        explanation:
          "Your profile suggests a high degree of exam awareness, language precision, and task control.",
        nextStep:
          "You may already be operating close to exam-ready performance. A diagnostic can help confirm your readiness with confidence.",
      };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      profile,
      readinessScore,
    } = body;

    if (
      !email ||
      !profile ||
      readinessScore === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result =
      getPersonalMessage(profile);

    // Logo/lighthouse are sent as CID-embedded attachments rather than base64
    // data URIs in the HTML: Gmail (and several other clients) strip base64
    // image sources for security reasons, so a data: URI silently fails to
    // render even though the rest of the email displays fine.
    await resend.emails.send({
      from:
        "Pharos English Lab <contact@pharosenglishlab.com>",

      to: email,

      subject:
        "Your Cambridge Placement Profile – Pharos English Lab",

      attachments: [
        {
          content: PHAROS_OFFICIAL_LOCKUP_CROPPED_BASE64,
          filename: "pharos-logo.png",
          contentId: "pharos-logo",
        },
      ],

      html: `
        <style>
          /* Raleway is one of the two Pharos brand fonts (Tan Pearl is used
             only for the logo, baked into the image above). Clients that
             support @import (Apple Mail, iOS Mail, Outlook for Mac) will
             load it; Gmail/Outlook/Yahoo don't support web fonts in email
             at all and will use the Arial/sans-serif fallback instead —
             that's expected, not a bug. */
          @import url('https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700&display=swap');
        </style>
        <div style="
          font-family: 'Raleway', Arial, sans-serif;
          line-height: 1.7;
          color: #1f2a44;
          max-width: 600px;
          margin: 0 auto;
        ">

          <div style="
            background: #ffffff;
            padding: 24px 0 16px;
            text-align: center;
            border-bottom: 1px solid #eee7d8;
            border-radius: 10px 10px 0 0;
          ">
            <img
              src="cid:pharos-logo"
              alt="Pharos English Lab — Shine your way to English"
              style="height: 76px; width: auto;"
            />
          </div>

          <div style="padding: 8px 4px;">

          <h2>
            Your Cambridge Placement Profile
          </h2>

          <p>
            Hello ${name || "there"},
          </p>

          <p>
            Thank you for completing the Pharos Cambridge Placement & Readiness Assessment.
          </p>

          <p>
            <strong>Your current profile:</strong><br/>
            ${profile}
          </p>

          <p>
            <strong>Readiness Score:</strong>
            ${readinessScore}
          </p>

          <hr style="margin: 25px 0;" />

          <p>
            <strong>What this means:</strong>
          </p>

          <p>
            ${result.explanation}
          </p>

          <p>
            <strong>Recommended next step:</strong><br/>
            ${result.nextStep}
          </p>

          <div style="
            margin-top: 30px;
            text-align: center;
          ">

            <a
              href="${SITE_URL}/diagnostics"
              style="
                display: inline-block;
                padding: 14px 24px;
                background-color: #d9a22b;
                color: white;
                text-decoration: none;
                border-radius: 10px;
                font-weight: bold;
              "
            >
              Explore Diagnostics
            </a>

          </div>

          <p style="margin-top: 35px;">
            Marcela Liporace Murga<br/>
            Founder & Academic Director<br/>
            Pharos English Lab
          </p>

          </div>

        </div>
      `,
    });

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(
      "Readiness email error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not send readiness email",
      },
      {
        status: 500,
      }
    );
  }
}
