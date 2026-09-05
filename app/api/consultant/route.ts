import { NextResponse } from "next/server";
import { CONSULTANT_SYSTEM_PROMPT } from "@/lib/consultantPrompt";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

// ---- Basic abuse protection -------------------------------------------
// This is an in-memory, per-instance limiter. It is NOT bulletproof (a
// determined attacker distributed across many serverless instances could
// get around it), but it stops casual abuse and runaway cost from a single
// visitor or script hammering the endpoint. If traffic grows a lot, this
// should be upgraded to a shared store (e.g. Upstash/Redis or a Supabase
// table) so limits are enforced across all instances, not just one.

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_MESSAGES = 15; // messages per IP per hour
const MAX_MESSAGES_IN_CONVERSATION = 20; // only send the last N turns to the model
const MAX_MESSAGE_LENGTH = 2000; // characters per message
const MAX_RESPONSE_TOKENS = 700; // caps cost of a single reply

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_MESSAGES) {
    return false;
  }

  entry.count += 1;
  return true;
}

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

// -------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          error:
            "You've reached the message limit for now. Please try again in a little while, or contact us directly.",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const rawMessages: ChatMessage[] = body?.messages;

    if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
      return NextResponse.json(
        { error: "Missing messages" },
        { status: 400 }
      );
    }

    // Trim conversation length and per-message size before sending to the model.
    const messages = rawMessages
      .slice(-MAX_MESSAGES_IN_CONVERSATION)
      .map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: String(m.content ?? "").slice(0, MAX_MESSAGE_LENGTH),
      }));

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // No key configured yet — fail gracefully instead of crashing the page.
      // Add OPENAI_API_KEY to .env.local (and to Vercel's env vars) to go live.
      return NextResponse.json(
        {
          error:
            "The consultant isn't connected yet. (Missing OPENAI_API_KEY.)",
        },
        { status: 503 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          temperature: 0.4,
          max_tokens: MAX_RESPONSE_TOKENS,
          messages: [
            { role: "system", content: CONSULTANT_SYSTEM_PROMPT },
            ...messages,
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("CONSULTANT API ERROR:", errText);
      return NextResponse.json(
        {
          error:
            "The consultant is temporarily unavailable. Please try again shortly.",
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "The consultant didn't return a response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("CONSULTANT ROUTE ERROR:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
