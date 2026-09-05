import { DIAGNOSTICS, type DiagnosticType } from "@/types/diagnostic";

/**
 * Minimal PayPal REST client (no SDK dependency server-side): OAuth
 * client-credentials token + Orders v2 create/capture. Environment is
 * selected with PAYPAL_ENV=sandbox|live so the whole flow can be tested
 * with PayPal's fake sandbox money before real credentials go in.
 */

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

export function getDiagnosticPrice(type: DiagnosticType): number {
  const diagnostic = DIAGNOSTICS.find((d) => d.slug === type);
  if (!diagnostic) throw new Error(`Unknown diagnostic: ${type}`);
  return diagnostic.price;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal not configured: set NEXT_PUBLIC_PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env"
    );
  }

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`PayPal token request failed: ${res.status}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

/** Creates a PayPal order (intent: CAPTURE) and returns its id. */
export async function createPayPalOrder(
  diagnosticType: DiagnosticType,
  examLevel: string
): Promise<string> {
  const price = getDiagnosticPrice(diagnosticType);
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          // Round-trips through PayPal so capture can re-verify what was bought.
          custom_id: `${diagnosticType}|${examLevel}`,
          description: `Pharos English Lab — ${diagnosticType} diagnostic (${examLevel})`,
          amount: {
            currency_code: "USD",
            value: price.toFixed(2),
          },
        },
      ],
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PayPal order creation failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  return data.id as string;
}

export interface PayPalCaptureResult {
  completed: boolean;
  payerEmail: string | null;
  payerName: string | null;
  /** In cents, from PayPal's captured amount — not from the client. */
  amountCents: number;
  currency: string;
  customId: string | null;
}

/** Captures an approved PayPal order and returns the verified details. */
export async function capturePayPalOrder(
  paypalOrderId: string
): Promise<PayPalCaptureResult> {
  const accessToken = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PayPal capture failed: ${res.status} ${body}`);
  }

  const data = await res.json();
  const unit = data.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  const payer = data.payer;

  const givenName = payer?.name?.given_name ?? "";
  const surname = payer?.name?.surname ?? "";
  const fullName = `${givenName} ${surname}`.trim();

  return {
    completed: data.status === "COMPLETED" && capture?.status === "COMPLETED",
    payerEmail: payer?.email_address ?? null,
    payerName: fullName || null,
    amountCents: capture?.amount?.value
      ? Math.round(parseFloat(capture.amount.value) * 100)
      : 0,
    currency: (capture?.amount?.currency_code ?? "USD").toLowerCase(),
    customId: capture?.custom_id ?? unit?.custom_id ?? null,
  };
}
