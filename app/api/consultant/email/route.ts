import { NextResponse } from "next/server";
import { Resend } from "resend";
import { PHAROS_OFFICIAL_LOCKUP_CROPPED_BASE64 } from "@/lib/emailLogo";
import { SITE_URL } from "@/lib/siteUrl";

const resend = new Resend(process.env.RESEND_API_KEY);

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// Basic per-IP rate limiting, same approach as /api/consultant.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5; // email sends per IP per hour
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderTranscriptHtml(messages: ChatMessage[]) {
  return messages
    .filter((m) => m.role === "assistant")
    .map((m, i) => {
      const isLast = i === messages.filter((mm) => mm.role === "assistant").length - 1;
      return `
        <div style="margin-bottom: 18px; ${isLast ? "border-left: 3px solid #d9a22b; padding-left: 14px;" : ""}">
          <p style="white-space: pre-wrap; margin: 0; color: #1f2a44; font-size: 14px; line-height: 1.7;">
            ${escapeHtml(m.content).replace(/\n/g, "<br/>")}
          </p>
        </div>
      `;
    })
    .join("");
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const { name, email, messages } = await request.json();

    if (
      !email ||
      typeof email !== "string" ||
      !Array.isArray(messages) ||
      messages.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const safeName = typeof name === "string" ? name.slice(0, 100) : "";
    const safeMessages: ChatMessage[] = messages.slice(-30);

    const lastRecommendation =
      [...safeMessages].reverse().find((m) => m.role === "assistant")
        ?.content ?? "";

    const transcriptHtml = renderTranscriptHtml(safeMessages);
    const fullTranscriptText = safeMessages
      .map(
        (m) =>
          `${m.role === "user" ? "Visitor" : "PHAROS Consultant"}: ${m.content}`
      )
      .join("\n\n");

    // Email to the visitor — branded, matches the report style used elsewhere.
    // The logo is sent as a CID-embedded attachment rather than a base64 data
    // URI in the HTML: Gmail (and several other clients) strip base64 image
    // sources for security reasons, so a data: URI silently fails to render.
    await resend.emails.send({
      from: "Pharos English Lab <contact@pharosenglishlab.com>",
      to: email,
      subject: "Your English Certification Consultation – Pharos English Lab",
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
        <div style="font-family: 'Raleway', Arial, sans-serif; background:#f4f1ea; padding: 32px 16px;">
          <div style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e7e2d6;">

            <div style="background: #ffffff; padding: 26px 32px 18px; text-align: center; border-bottom: 1px solid #eee7d8;">
              <img
                src="cid:pharos-logo"
                alt="Pharos English Lab — Shine your way to English"
                style="height: 84px; width: auto;"
              />
            </div>

            <div style="padding: 32px;">
              <p style="font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #d9a22b; font-weight: bold; margin: 0 0 6px;">
                Certification Consultation
              </p>
              <h1 style="font-size: 22px; color: #10213f; margin: 0 0 20px; font-weight: normal;">
                Hello ${safeName || "there"}, here is your consultation summary
              </h1>

              <p style="font-size: 14px; color: #4a5568; line-height: 1.7; margin: 0 0 24px;">
                Thank you for consulting the PHAROS English Certification Consultant.
                Below is the recommendation from your conversation.
              </p>

              <div style="background: #faf8f3; border-radius: 12px; padding: 20px 24px; margin-bottom: 24px;">
                ${transcriptHtml}
              </div>

              <p style="font-size: 13px; color: #718096; line-height: 1.6; margin: 0 0 28px;">
                This recommendation is a summary of your conversation with Pharos English Lab&reg;'s
                AI Consultant — this is not a diagnostic. If your situation involves a Cambridge English
                Qualification, as an expert I can personally diagnose your level through a Pharos Premium
                Diagnostic.
                <br/><br/>
                Marcela Liporace Murga.<br/>
                Pharos English Lab&reg; Founder
              </p>

              <div style="text-align: center; margin-bottom: 8px;">
                <a
                  href="${SITE_URL}/diagnostics"
                  style="display:inline-block; padding: 14px 28px; background-color:#d9a22b; color:#ffffff; text-decoration:none; border-radius:10px; font-weight:bold; font-family: Arial, sans-serif; font-size: 13px; letter-spacing: 0.04em;"
                >
                  Explore Diagnostics
                </a>
              </div>
            </div>

            <div style="background: #10213f; padding: 20px 32px; text-align: center;">
              <p style="color: #ffffff; font-size: 13px; margin: 0; opacity: 0.85;">
                Marcela Liporace Murga · Founder &amp; Academic Director · Pharos English Lab
              </p>
            </div>

          </div>
        </div>
      `,
    });

    // Internal notification so Marcela can follow up personally.
    await resend.emails.send({
      from: "Pharos English Lab <contact@pharosenglishlab.com>",
      to: ["pharosenglishlab@gmail.com"],
      replyTo: email,
      subject: `New Consultant conversation — ${safeName || email}`,
      text: `Name: ${safeName || "(not provided)"}\nEmail: ${email}\n\nFinal recommendation given:\n${lastRecommendation}\n\n---\nFull transcript:\n${fullTranscriptText}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONSULTANT EMAIL ERROR:", error);
    return NextResponse.json(
      { error: "Could not send the email" },
      { status: 500 }
    );
  }
}
