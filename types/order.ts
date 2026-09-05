import type { DiagnosticType, ExamLevel } from "./diagnostic";

export type OrderStatus = "paid" | "submitted" | "processing" | "completed" | "failed";

export type PaymentProvider = "stripe" | "paypal" | "mercadopago" | "manual";

// Original Pharos writing prompt, assigned automatically to "writing" orders.
// See supabase/migrations/003_writing_prompts.sql.
export interface WritingPrompt {
  id: string;
  code: string;
  exam_level: ExamLevel;
  part: "Part 1" | "Part 2";
  task_type: string;
  word_count: string;
  prompt_text: string;
  topic_tag: string | null;
}

export interface Order {
  id: string;
  created_at: string;
  /** Which processor collected the money. Stripe orders fill stripe_session_id; PayPal orders fill paypal_order_id. */
  payment_provider: PaymentProvider;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  paypal_order_id: string | null;
  customer_email: string;
  customer_name: string | null;
  diagnostic_type: DiagnosticType;
  exam_level: ExamLevel;
  amount_paid: number;
  currency: string;
  status: OrderStatus;
  pdf_url: string | null;
  pdf_sent_at: string | null;
  user_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  /** Set once, server-side, when the student clicks "Start Exam". Drives the countdown timer. */
  exam_started_at: string | null;
  /** Null until the student picks a mode on the "Start Exam" screen. true = timed simulation, false = untimed practice. */
  exam_timed_mode: boolean | null;
  /** Set once, alongside exam_started_at, from the bank of tests for this level (e.g. "B2-CAMBRIDGE-SAMPLE-1"). References exam_tests.test_code. */
  assigned_test_code: string | null;
  writing_prompt_id: string | null;
  // Present only when the API embeds the joined prompt (see /api/status/[orderId]).
  writing_prompt?: WritingPrompt | null;
}

export interface Submission {
  id: string;
  created_at: string;
  order_id: string;
  diagnostic_type: DiagnosticType;
  exam_level: ExamLevel;
  answers: Record<string, unknown>;
  google_sheet_row: number | null;
}
