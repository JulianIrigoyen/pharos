# Session Log: PayPal Integration, .env, Single Consolidated Migration

**Date:** July 4, 2026 (evening)
**Requested by:** Julián (Marcela's son / the project's original developer), working through Marcela's Cowork account.
**Scope:** Payment decision made (PayPal), full PayPal checkout built and wired into the live page, DB credentials organized into a gitignored `.env`, migrations 001-005 consolidated into a single `001_init.sql` for the fresh Supabase project, docs updated.

---

## Context

Julián provided the Supabase project credentials (project `umdoppqtajbiuoklwuvk`, DB password, personal access token) and clarified that **the database is brand new — nothing has ever been applied to it**, which contradicted earlier doc assumptions that migrations 001/002 were live. He asked for: a reusable gitignored `.env`, one single migration file, and the PayPal integration.

Note: Claude's cloud sandbox cannot reach Supabase's network (allowlist-only egress; verified 403 on both the DB pooler and api.supabase.com), so everything here is prepared-to-run; a human executes the migration (Dashboard SQL Editor or `npm run db:apply`).

## What changed

### 1. `.env` (gitignored — `.gitignore` already covered it)
Holds the Supabase DB connection (host/port/user/password + ready `SUPABASE_DB_URL`, password URL-encoded), the Supabase access token, and empty PayPal credential slots (`PAYPAL_ENV=sandbox`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`). `.env.example` updated with the PayPal keys (no values). Secrets intentionally kept out of all committed docs; rotation of the chat-shared password/token still recommended.

### 2. Single migration: `supabase/migrations/001_init.sql`
Consolidates the former 001-005 (moved to `supabase/migrations_archive/`). Everything idempotent. Improvements made while consolidating, possible because the DB is fresh:
- `orders` is now **payment-provider-agnostic**: new `payment_provider` column (`stripe|paypal|mercadopago|manual`), `stripe_session_id` relaxed to nullable-unique, new `paypal_order_id` (nullable-unique) + index.
- The **private `exam-tests` Storage bucket is created by the migration itself** (insert into `storage.buckets`) — no manual bucket step anymore.
- `exam_tests` created before `orders` so `assigned_test_code` can reference it inline.
Added `scripts/db-apply.sh` + `npm run db:apply`.

### 3. PayPal integration (the decision: PayPal is the payment platform)
- `lib/paypal.ts` — REST client (OAuth token, create order, capture order), `PAYPAL_ENV` switches sandbox/live. Price always resolved server-side from `DIAGNOSTICS`.
- `app/api/paypal/create-order/route.ts` — validates type/level, creates the PayPal order (with `custom_id = type|level` for later cross-checking), returns its id. No DB write yet.
- `app/api/paypal/capture-order/route.ts` — captures server-to-server, verifies COMPLETED + custom_id match, inserts the `orders` row (`payment_provider: 'paypal'`, `status: 'paid'`, payer email/name, `user_id` if logged in, UTM passthrough), idempotent on `paypal_order_id`, returns our internal `orderId` for the redirect to `/exam/{orderId}`.
- `components/diagnostics/PayPalCheckoutButton.tsx` — level toggle (same UI pattern as the Stripe `CheckoutButton`, which remains intact/unused), PayPal Smart Buttons via `@paypal/react-paypal-js`, graceful "being set up" state when credentials are missing, InitiateCheckout analytics event preserved.
- `app/diagnostics/use-of-english/page.tsx` — **rewritten**: placeholder `YOUR_PAYPAL_LINK_HERE`, the email-your-receipt instructions, and both Google Form links are gone. "How It Works" steps now describe the real flow (Pay → Take It Online → Instant Receipt → Expert Review → Report). Checkout card at the bottom with a log-in-first tip.
- `app/api/stripe/webhook/route.ts` — one-line addition: sets `payment_provider: 'stripe'` for consistency with the new schema.
- `types/order.ts` — `PaymentProvider` type, `payment_provider`, `paypal_order_id`, `stripe_session_id` now nullable.

### 4. `package.json`
Added `@paypal/react-paypal-js` **and `@react-pdf/renderer`** — the latter was imported by the PDF code but missing from this folder's package.json (the earlier install almost certainly landed in the other clone, `/Users/MILM2/Code/pharos`). `npm install` needed.

### 5. Docs
- `docs/db.md` — rewritten: single-migration reality, how to apply, schema at a glance, a plain-language section for Marcela, and the sandbox network limitation.
- `docs/PENDING_FOR_JULIAN.md` — rewritten: 5 steps (migration, PDFs, PayPal creds, npm install, Resend domain).
- `docs/todo/README.md` — item 1 marked DECIDED (PayPal), item 4 folded into item 2.
- `docs/PRODUCT_FLOW.md` — Stage 1 status updated with a resolution note.

## Still pending (human steps)
1. Run `001_init.sql` (Dashboard SQL Editor or `npm run db:apply`).
2. Upload the 6 test PDFs to the `exam-tests` bucket (exact paths in PENDING doc).
3. Create the PayPal developer app; fill sandbox creds into `.env`; test a sandbox purchase end-to-end; then switch to live creds (+ mirror env vars in Vercel).
4. `npm install`.
5. Verify the Resend sending domain.
6. Check whether `writing`/`listening` pages need the same rewire as `use-of-english` (only UoE existed in `app/diagnostics/` in this folder — worth confirming against the other clone/repo).
