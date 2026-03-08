import Stripe from "stripe";
import type { DiagnosticType } from "@/types/diagnostic";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
    _stripe = new Stripe(key);
  }
  return _stripe;
}

const PRICE_MAP: Record<DiagnosticType, string | undefined> = {
  writing: process.env.STRIPE_WRITING_PRICE_ID,
  "use-of-english": process.env.STRIPE_UOE_PRICE_ID,
  listening: process.env.STRIPE_LISTENING_PRICE_ID,
};

export function getPriceId(type: DiagnosticType): string {
  const priceId = PRICE_MAP[type];
  if (!priceId) throw new Error(`No price configured for diagnostic: ${type}`);
  return priceId;
}
