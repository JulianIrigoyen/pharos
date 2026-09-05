# Pending Setup (needs account access — Julian)

Everything below is written and ready in the codebase; these are the
switch-on steps that need real dashboard access. Updated 2026-09-04
(evening): the test bank is back to hosting PDFs privately in Supabase
Storage, but now only Pharos-curated, key-free copies of Cambridge's
free official sample papers — see item 2 below. (Migrations are still
one file; PayPal is still the chosen + implemented payment path.)

## 1. Apply the single migration

`supabase/migrations/001_init.sql` — the former 001-005 files,
consolidated (originals archived in `supabase/migrations_archive/`).
The database is fresh/empty, so this one file creates everything:
tables, indexes, RLS, the private `exam-tests` Storage bucket, and the
test-bank seed rows — a mix of Pharos-hosted `storage_path` rows and
Cambridge-linked `external_url` rows, see item 2 below.

Run it either way:

- Supabase Dashboard → SQL Editor → paste the file → Run, **or**
- `npm run db:apply` from the project root (reads the connection string
  from the gitignored `.env`; see `docs/db.md`).

> **Note (2026-07-04):** Claude confirmed it cannot run this migration
> itself from this Cowork session — the cloud sandbox's network is
> allowlist-only and doesn't reach Supabase's hosts (tested directly:
> both the REST API and the Postgres pooler on port 5432 are blocked).
> This isn't a credentials issue, just this environment's network
> policy. Either of the two options above works fine and takes a couple
> of minutes by hand. If you'd rather have an AI agent run it for you,
> **Claude Code** (Anthropic's separate CLI tool, run locally on your
> own machine) has normal internet access and could execute
> `npm run db:apply` directly — but it's not required, the manual paste
> into the SQL Editor is just as fast.

## 2. Upload the curated (key-free) test PDFs

**Changed 2026-09-04, twice in one day — here's the final shape.** The
old test bank (`B2-RUE-001/002/003`, `C1-RUE-001/002/003`, PDFs from
Marcela's Drive with Pharos branding) turned out to be sourced from a
specific book with no commercial license — that was the real cause of
the month-long "permissions" blocker, not something Cambridge needed
to approve. It's dropped for good.

The replacement is Cambridge's own free official sample papers, but
**not** linked as-is: Cambridge distributes each sample as a ZIP that
bundles the Reading & Use of English question paper together with the
answer key (Marcela confirmed this by downloading one and opening it —
`B2 First sample paper 1 RUE 2022.pdf` + `...answer keys...pdf` as
separate files in the same zip). Linking straight to that zip would let
a student see the correct answers before ever submitting anything to
Pharos, which defeats the point of paying for a diagnostic — so Pharos
extracts and hosts only the question-paper PDF, and never the key.

Two of the eight test codes need nothing from you — `B2-DIGITAL-1` and
`C1-DIGITAL-1` point straight at Cambridge's own digital sample-test
player (`external_url`), which is verifiably separate from the answer
key on Cambridge's site already.

The other six (`B2-CAMBRIDGE-SAMPLE-1/2`, `B2-SCHOOLS-SAMPLE-1/2`,
`C1-CAMBRIDGE-SAMPLE-1/2`) are `storage_path` rows — Pharos hosts a
curated copy in the private `exam-tests` bucket (created by item 1),
served only via short-lived signed URLs, same as the original design.

**Update 2026-09-05: all 6 are curated and sitting in the repo**, pulled
from Marcela's own "2026 SAMPLE PAPERS" folder (she already had every
official Cambridge sample downloaded and organized for her teaching —
no need to re-download from Cambridge after all) and verified page-by-page
to confirm none of them include the answer key:

```
supabase/seed-assets/exam-tests/B2-CAMBRIDGE-SAMPLE-1.pdf
supabase/seed-assets/exam-tests/B2-CAMBRIDGE-SAMPLE-2.pdf
supabase/seed-assets/exam-tests/B2-SCHOOLS-SAMPLE-1.pdf
supabase/seed-assets/exam-tests/B2-SCHOOLS-SAMPLE-2.pdf
supabase/seed-assets/exam-tests/C1-CAMBRIDGE-SAMPLE-1.pdf
supabase/seed-assets/exam-tests/C1-CAMBRIDGE-SAMPLE-2.pdf
```

**Remaining step, real one this time:** upload each of these 6 files to
the `exam-tests` bucket at `use-of-english/<TEST_CODE>.pdf` (exactly
matching the filename, which matches the seed row's `storage_path`).
All 6 rows are already `active = true` in the seed data — so until a
given file is actually uploaded, a student assigned that test code will
hit a 500 ("Could not generate a link to your test"). Upload all 6
before enabling any real traffic on the Use of English diagnostic.

## 3. PayPal credentials

The PayPal integration is fully built (see `lib/paypal.ts`,
`app/api/paypal/*`, `components/diagnostics/PayPalCheckoutButton.tsx` —
the live Use of English page now uses it; the old placeholder link and
Google Forms are gone). It needs an app created at
https://developer.paypal.com → Apps & Credentials:

1. Start with the **Sandbox** app's client ID + secret → put them in
   `.env` (`NEXT_PUBLIC_PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`,
   `PAYPAL_ENV=sandbox`) and test a fake purchase end-to-end.
2. Then swap in the **Live** app's credentials and set
   `PAYPAL_ENV=live` (and mirror all three into Vercel's env settings
   for production).

Flow notes: price is decided server-side; capture is server-to-server
(client can't fake it); a captured payment inserts an `orders` row with
`payment_provider: 'paypal'` and `status: 'paid'`, then redirects the
student straight to `/exam/{orderId}`. Stripe's code path is intact and
untouched; Mercado Pago remains a future consideration for local
students (see `docs/PRODUCT_FLOW.md`, Stage 1).

## 4. Run `npm install`

`package.json` gained `@paypal/react-paypal-js` and now also properly
lists `@react-pdf/renderer` (it was installed earlier but never saved
into this folder's package.json — likely went into the other clone;
see the "two project folders" note in
`sessions/2026-07-04-use-of-english-timer-and-answer-sheet.md`).

## 5. Verify the Resend sending domain

The answer-sheet PDF + email pipeline is built, but the Resend account
looks to be in sandbox/test mode (only delivers to the account owner's
address). Verify `pharosenglishlab.com` as a sending domain in Resend so
receipts reach real students.

## Once all this is done

Full loop, end to end, with real (sandbox) money: pay with PayPal on
`/diagnostics/use-of-english` → order created → Start Exam (timed or
practice) → test assigned sequentially from the bank → split-screen
test PDF + answer sheet → submit → student + Marcela both get the
answer-sheet PDF by email with the test code on it.
