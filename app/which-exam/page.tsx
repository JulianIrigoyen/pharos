"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Compass, Mail } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const INTRO_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "Hello! I'm the PHAROS English Certification Consultant. I help people work out which English qualification actually fits their goals — Cambridge, IELTS, TOEFL, PTE, Duolingo and others. Tell me a bit about your situation: why do you need the certificate, and where will you be using it?",
};

type EmailStatus = "idle" | "sending" | "sent" | "error";

export default function WhichExamPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [emailName, setEmailName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "The consultant is temporarily unavailable. Please try again shortly."
        );
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setError(
        "Couldn't reach the consultant. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!emailAddress.trim() || emailStatus === "sending") return;

    setEmailStatus("sending");

    try {
      const res = await fetch("/api/consultant/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: emailName,
          email: emailAddress,
          messages,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setEmailStatus("sent");
    } catch {
      setEmailStatus("error");
    }
  }

  const hasConversation = messages.length > 1;

  return (
    <main className="section-alt min-h-screen">
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold-50">
            <Compass className="h-6 w-6 text-gold-500" />
          </div>
          <h1 className="heading-lg">Which Exam Is Right for You?</h1>
          <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed text-navy-600 sm:text-lg">
            Talk to our English Certification Consultant to find out which
            qualification genuinely fits your goals — before you commit to
            preparing for one.
          </p>
        </div>

        <div className="card mt-10 flex h-[70vh] flex-col overflow-hidden">
          <div className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 font-body text-sm leading-relaxed sm:text-base ${
                    message.role === "user"
                      ? "bg-navy-900 text-white"
                      : "bg-navy-50 text-navy-900"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl bg-navy-50 px-4 py-3 font-body text-sm text-navy-500">
                  Thinking…
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-700">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-3 border-t border-navy-100 p-4 sm:p-5"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tell us about your situation..."
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              className="btn-gold shrink-0 px-4 py-3"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        {hasConversation && (
          <div className="card mt-6 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-50">
                <Mail className="h-4 w-4 text-gold-500" />
              </div>
              <div>
                <h2 className="font-body text-base font-semibold text-navy-900">
                  Want a copy of this by email?
                </h2>
                <p className="mt-1 font-body text-sm leading-relaxed text-navy-600">
                  We'll send you a summary of this consultation, and a member
                  of the PHAROS team may follow up personally.
                </p>
              </div>
            </div>

            {emailStatus === "sent" ? (
              <p className="mt-4 font-body text-sm font-medium text-green-700">
                Sent! Please check your inbox.
              </p>
            ) : (
              <form
                onSubmit={sendEmail}
                className="mt-4 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="text"
                  value={emailName}
                  onChange={(e) => setEmailName(e.target.value)}
                  placeholder="Your name"
                  className="input-field flex-1"
                />
                <input
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field flex-1"
                />
                <button
                  type="submit"
                  className="btn-gold shrink-0"
                  disabled={emailStatus === "sending" || !emailAddress.trim()}
                >
                  {emailStatus === "sending" ? "Sending…" : "Email me this"}
                </button>
              </form>
            )}

            {emailStatus === "error" && (
              <p className="mt-3 font-body text-sm text-red-700">
                Something went wrong sending that — please try again.
              </p>
            )}

            <p className="mt-4 font-body text-xs leading-relaxed text-navy-400">
              By submitting, you agree to receive this summary by email and
              allow PHAROS English Lab to follow up about your consultation.
              See our{" "}
              <a href="/privacy" className="underline hover:text-navy-600">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
