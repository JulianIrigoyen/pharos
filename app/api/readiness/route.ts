import { NextResponse } from "next/server";
import { Resend } from "resend";

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

    await resend.emails.send({
      from:
        "Pharos English Lab <contact@pharosenglishlab.com>",

      to: email,

      subject:
        "Your Cambridge Placement Profile – Pharos English Lab",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          line-height: 1.7;
          color: #1f2a44;
          max-width: 600px;
          margin: 0 auto;
        ">

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
              href="http://localhost:3000/diagnostics"
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