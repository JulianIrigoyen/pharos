# Pharos English Lab — Ideal Product Flow

This document describes the **target end-to-end journey** for a Pharos student, from the moment they land on the site to the moment they receive their final, teacher-reviewed report. It exists to reconcile work built at different times (by Julián originally, and by Marcela + Claude since June 22, 2026) into one clear reference.

Each stage is tagged with its current build status:

- ✅ **Built & connected** — working today, in the live flow
- 🟡 **Built, not connected** — the code exists and works, but the live pages don't use it yet
- ⚪ **Not built** — designed/discussed but no code yet
- ⚠️ **Conflict** — two different implementations of the same step exist and need to be reconciled

---

## Stage 0 — Discovery: "Which exam should I take?"

**Status: ⚪ Not built**

A visitor who isn't sure whether they should prepare for B2 First or C1 Advanced arrives at the site. The idea (Marcela's) is an orientation bot/quiz that asks a few quick questions about the student's level and goals and recommends B2 or C1, then routes them to that diagnostic's page.

Today the site has no such guidance — a visitor has to already know which exam they want and navigate to `/diagnostics/use-of-english` (or writing/listening) directly from the diagnostics listing page.

This is future work and does not block anything else in this document; it can be designed once Stages 1–5 are settled.

---

## Stage 1 — Account + Purchase

**Status: 🟡 RESOLVED in code (2026-07-04): PayPal chosen and built — pending credentials + migration to go live**

> **Resolution:** Julián decided on PayPal. A full integration was built the same day: the live `use-of-english` page now uses a real PayPal checkout (`PayPalCheckoutButton` → `/api/paypal/create-order` → `/api/paypal/capture-order`), the price is set server-side, the payment is captured server-to-server, and a confirmed payment inserts an `orders` row (`payment_provider: 'paypal'`, `status: 'paid'`) and redirects the student straight into `/exam/{orderId}`. The old placeholder PayPal link and the Google Form links are gone. Stripe's code remains intact as an optional second processor; Mercado Pago is still a future consideration (see the open-question section below). What's left to go live: PayPal app credentials in `.env`, the database migration, and `npm install` — checklist in `docs/PENDING_FOR_JULIAN.md`.
>
> The description below is kept for historical context on what the conflict was.

This was the most important thing to resolve, because the site had **two separate, disconnected purchase paths** for the Use of English diagnostic.

### Path A — the one that is actually live (`app/diagnostics/use-of-english/page.tsx`)

1. Student clicks a **"Pay with PayPal"** button — but the link is still the placeholder `YOUR_PAYPAL_LINK_HERE`, never filled in.
2. Student is told, in plain text, to email their payment receipt, full name and exam level to `pharosenglishlab@gmail.com`.
3. Student then clicks a link to an external **Google Form** (a different form for B2 vs C1) to submit their exam answers.

There is no login, no Supabase order, no Stripe, and no connection whatsoever to the exam-taking system built this session. Marcela's manual email-checking is the only thing tying a payment to a student.

### Path B — the one that is fully built but not wired up (Stripe + Supabase)

1. Student creates an account / logs in (Supabase Auth — this part **is** live and working).
2. Student uses `CheckoutButton.tsx`, which posts to `/api/stripe/create-checkout`, which creates a real Stripe Checkout Session with the diagnostic type, exam level, and UTM data attached as metadata.
3. Student pays with a card via Stripe's hosted checkout.
4. Stripe calls `/api/stripe/webhook` on `checkout.session.completed`, which inserts a row into the `orders` table (status `paid`) — this is what everything downstream (exam page, dashboard, timer, PDF) depends on.
5. Stripe redirects the student to `/exam/{checkout_session_id}`, which resolves to the real order and lets them start their exam immediately, already logged in, with no manual email step at all.

**This path is fully coded and tested via `/preview`, but `CheckoutButton` is not used anywhere in the live diagnostics pages — it currently only exists as a component, unused.**

### The decision Marcela needs to make

Everything built this session (timer, timed/practice mode choice, the 7/8-part answer sheet, instant PDF receipt, dashboard order tracking) **only works for orders that exist in the `orders` table** — which today only happens through Path B (Stripe). As long as the live page uses Path A (PayPal + Google Form), none of that new work is reachable by real students.

To close the loop, the `use-of-english` (and, presumably, `writing` and `listening`) diagnostic pages need to be updated to use `CheckoutButton` / the Stripe flow instead of the PayPal link and Google Forms. Concretely this means:

- Replace the "Pay with PayPal" button and the manual-email instructions with the existing `CheckoutButton` component.
- Remove the two Google Form links — they become unnecessary once answers are submitted through the exam page itself.
- Confirm a live Stripe account, real price IDs (`STRIPE_WRITING_PRICE_ID`, `STRIPE_UOE_PRICE_ID`, `STRIPE_LISTENING_PRICE_ID`), and a webhook endpoint are configured in production (this needs Julián or Supabase/Stripe dashboard access).

*Note: only the `use-of-english` diagnostic page was available to review directly. It's worth checking whether `writing` and `listening` follow the same PayPal + Google Form pattern, since if so they need the identical fix.*

### Open question: adding Mercado Pago

Marcela has also raised adding **Mercado Pago** as a payment option for
local (Argentina) and neighboring-country students, alongside PayPal for
international students. She'd rather Julián weigh in on the technical
shape of this than decide it herself right now — the open question for
him is whether the final setup should be:

- **PayPal + Mercado Pago only** (dropping Stripe, and building both
  integrations to feed the same `orders` table / exam flow), or
- **Stripe + PayPal + Mercado Pago** (keeping the already-built Stripe
  path live for card payments, retiring the old broken PayPal button,
  and adding Mercado Pago as a third option specifically for local
  students).

Either way, whatever payment method is used still needs to end up
creating a row in `orders` with `status: "paid"` — that's the one hard
requirement everything downstream (timer, exam form, PDF, dashboard)
depends on, regardless of which processor collected the money.

---

## Stage 2 — Taking the Exam Online

**Status: ✅ Built (code complete); the embedded test PDF needs one more setup step before it's fully live — see below**

Once an order exists with status `paid`, the student can go to `/exam/{orderId}` (from the dashboard's "Start Exam" button, or directly after Stripe checkout).

1. **Mode choice screen.** For the Use of English diagnostic, the student sees two clearly-marked options before anything starts:
   - **Full Simulation (Timed)** — a real Cambridge-timed attempt (75 minutes for B2, 90 for C1).
   - **Practice Mode (No Time Limit)** — same exam, no clock, for students who just want to see their level.
2. Whichever mode is chosen is recorded server-side (`exam_started_at`, `exam_timed_mode` on the `orders` row) the moment the student starts, so the timer can't be reset or spoofed by refreshing the page.
3. **A test is assigned from the bank at the same moment.** Marcela's real test bank (3 variants per level: `B2-RUE-001/002/003`, `C1-RUE-001/002/003`) is registered in a new `exam_tests` table. Assignment is **sequential per student**: their 1st attempt at a level gets the first test, the 2nd attempt gets the next one, and so on — wrapping back to the first once they've cycled through all three. The assigned `test_code` is recorded on the order (`assigned_test_code`) so it's traceable for correction later.
4. **The assigned test PDF is shown next to the answer sheet**, split-screen (test on the left, scrolls independently; answer sheet on the right) — via a signed, time-limited link generated on demand, never a public URL, so a test can't just be forwarded around once a link exists.
5. The exam itself is the **answer sheet only** — it never reproduces the test questions, given words, or original sentences, since the student is now reading those directly from the embedded PDF on the left. The student just enters the letter or word for each globally-numbered question (Q1–Q52 for B2, Q1–Q56 for C1), matching the numbering Cambridge itself uses and the numbering already used in Marcela's correction spreadsheet.
6. In Timed mode, a countdown is always visible (turns gold under 5 minutes, red under 1 minute) and **auto-submits whatever the student has answered so far** the instant time runs out — no answers are lost, but no extra time is given either.
7. In Practice mode, there's no clock and no forced submission; the student submits manually when ready.

**Still needed before this is live for real students:** the single migration `supabase/migrations/001_init.sql` needs to be applied (it creates the private `exam-tests` Storage bucket itself, no separate dashboard step), and then the 6 real test PDFs need to be uploaded into that bucket — both require Julián's Supabase access. Full checklist in `docs/PENDING_FOR_JULIAN.md`. A visual preview of the split-screen layout (with a placeholder PDF, no Supabase needed) is available at `/preview`.

---

## Stage 3 — Instant Receipt (PDF + Email)

**Status: ✅ Built this session, pending final email delivery configuration**

The moment a student submits (manually or via timer auto-submit):

1. Their answers are saved to the `submissions` table and the order status becomes `submitted`.
2. A PDF answer sheet is generated automatically — carrying Marcela's actual Pharos English Lab logo at the top, the student's name/order info, the assigned test code (e.g. "B2-RUE-002", so Marcela's correction process always knows which answer key to grade against), and every answer organized part-by-part exactly as Cambridge structures the exam.
3. That PDF is emailed immediately to **both** the student and Marcela (bcc), serving as a receipt/proof of submission for the student and as the raw input Marcela needs to start correcting.

This was tested end-to-end using a dev-only test endpoint (bypassing the database) since Marcela doesn't currently have Supabase access. **Before this goes live for real students**, the sending domain needs to be verified in Resend — right now the account is in sandbox/test mode, which typically only allows sending to the account's own address, not to arbitrary student emails.

---

## Stage 4 — Correction (Marcela's process, off-platform)

**Status: Existing manual/semi-automated process — described as-is, not something to change right now**

This part happens entirely outside the website and stays that way for now:

1. Marcela takes the submitted answer-sheet PDF and runs it through her GPT Corrector.
2. She brings that correction into a Claude Project, which produces a structured JSON of the results.
3. She runs `enviar_reporte.command`, which sends that JSON to a Make.com scenario.
4. Make produces a formatted Word document and drops it into Marcela's Google Drive.
5. Marcela reviews it there before it goes anywhere near the student.

This is a working pipeline Marcela already relies on — nothing here needs to change unless she wants it to. The only thing worth flagging is Stage 5 below: how the final result gets *back* onto the site.

---

## Stage 5 — Review & Final Delivery to the Student

**Status: 🟡 Partially built — dashboard side is ready, the connection from Make back to the site is not**

The student's `/dashboard` already:

- Shows each of their diagnostics with a status badge (Ready to Start / Under Review / Report Ready / Payment Issue).
- Shows a **"Download Report"** button the moment an order's status is `completed` **and** it has a `pdf_url`.

What's missing is the last mile: once Marcela has reviewed the final Word doc from Stage 4 and turned it into the finished PDF, something needs to (a) upload that PDF somewhere reachable (e.g. Supabase Storage), (b) set `pdf_url` on the right order, and (c) flip the order's `status` to `completed`. Today that update to the database doesn't happen automatically from the Make scenario — this is the natural next automation to build once Stage 1 is resolved, since it's what finally closes the loop from "student pays" all the way to "student downloads their finished report" without Marcela ever having to touch the database by hand.

---

## Summary: what to fix first

The stages build on each other, but the one blocking everything else is **Stage 1**. Every other piece of work built so far — timer, mode choice, test bank assignment, split-screen test viewer, answer sheet, instant PDF/email, dashboard tracking — is code-complete, but is currently unreachable by real students because the live `use-of-english` page still runs on the old PayPal + Google Form flow instead of a working payment integration, and because the test bank still needs its Storage bucket set up (Stage 2).

**Recommended order of work:**

1. Decide on the final payment setup — resolve the PayPal/Stripe question above, including whether Mercado Pago gets added for local/regional students (see "Open question: adding Mercado Pago" above).
2. Wire `use-of-english` (and check `writing`/`listening`) to whichever payment method(s) get chosen, and confirm production keys/webhooks are live.
3. Verify the Resend sending domain so receipt emails reach real student addresses, not just the account owner.
4. Apply the single Supabase migration (`supabase/migrations/001_init.sql` — it creates every table plus the private `exam-tests` Storage bucket in one step) and upload the 6 real test PDFs — full checklist in `docs/PENDING_FOR_JULIAN.md`.
5. Once real orders are flowing end-to-end, build the Stage 5 "closing the loop" step (Make → Supabase `pdf_url` + `status: completed`) so finished reports appear on the dashboard automatically.
6. Design the Stage 0 orientation bot as a later enhancement, once the core paid flow is solid.

---

*Companion document: see `docs/ARCHITECTURE.md` for the technical reference (file structure, schema, design system). This document describes the intended flow; `ARCHITECTURE.md` describes how the code is organized.*
