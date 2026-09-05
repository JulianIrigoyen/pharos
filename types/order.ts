import type { DiagnosticType, ExamLevel } from "./diagnostic";

export type OrderStatus = "paid" | "submitted" | "processing" | "completed" | "failed";

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
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
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
