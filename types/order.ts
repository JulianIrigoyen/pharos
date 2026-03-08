import type { DiagnosticType, ExamLevel } from "./diagnostic";

export type OrderStatus = "paid" | "submitted" | "processing" | "completed" | "failed";

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
