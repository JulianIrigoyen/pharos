# Database — Supabase Reference

**No secrets in this file, on purpose** — real credentials live in the gitignored `.env` at the project root (covered by the `.env` line in `.gitignore`). This doc explains everything *about* the database; `.env` holds the keys to it.

## Project

- Dashboard: https://supabase.com/dashboard/project/umdoppqtajbiuoklwuvk
- Project ref: `umdoppqtajbiuoklwuvk`
- Postgres connection (Shared Pooler): host `aws-1-us-west-2.pooler.supabase.com`, port `5432`, database `postgres`, user `postgres.umdoppqtajbiuoklwuvk`. Password + ready-made connection string (`SUPABASE_DB_URL`) + a Supabase Management API token (`SUPABASE_ACCESS_TOKEN`): all in `.env`.

## Migration: one file

The schema lives in a **single migration**: `supabase/migrations/001_init.sql`. (The old incremental files 001–005 were consolidated into it on 2026-07-04, since this is a fresh database that has never had anything applied; the originals are archived in `supabase/migrations_archive/` for history.)

**Status: not yet applied.** The database is empty until someone runs `001_init.sql` once.

It creates, in order: the `exam_tests` table (test bank) with its 6 seeded tests, the `orders` table (payment-provider-agnostic: Stripe, PayPal, Mercado Pago or manual — whichever processor is used, a paid order lands here), the `submissions` table, all indexes, row-level security (deny-all; students can read only their own orders), and the **private `exam-tests` Storage bucket**. Everything is idempotent (`if not exists` / `on conflict do nothing`), so re-running it is harmless.

## How to apply it

Two options, pick one:

1. **Dashboard (no tools needed):** SQL Editor → paste the full contents of `supabase/migrations/001_init.sql` → Run.
2. **Terminal:** `npm run db:apply` (wraps `scripts/db-apply.sh`, which reads `SUPABASE_DB_URL` from `.env` and runs the file with `psql`).

After applying, the only remaining manual step is uploading the 6 real test PDFs into the `exam-tests` bucket (the bucket itself is created by the migration) — exact paths in `docs/PENDING_FOR_JULIAN.md`.

## Schema at a glance

- **`orders`** — one row per purchased diagnostic. Key columns: `payment_provider` (`stripe` | `paypal` | `mercadopago` | `manual`), `stripe_session_id` / `paypal_order_id` (each unique, nullable — filled by whichever provider was used), `customer_email`, `user_id` (links to the student's login), `diagnostic_type`, `exam_level`, `amount_paid` (cents), `status` (`paid` → `submitted` → `completed`), `pdf_url` (the finished report), `exam_started_at` / `exam_timed_mode` / `assigned_test_code` (the exam session), and `utm_*` (campaign attribution).
- **`submissions`** — one per order: the student's answers as JSON (`Q1`...`Q52/56` + `exam_level`).
- **`exam_tests`** — the test bank: `test_code` (e.g. `B2-RUE-001`), level, `storage_path` in the `exam-tests` bucket, `active` flag. Students are assigned tests sequentially (1st attempt → first test, and so on, wrapping around).
- **Storage bucket `exam-tests`** (private) — the student-facing test PDFs. Served only via short-lived signed URLs from `/api/exam/[orderId]/test-pdf`. Never upload `*-KEY` answer-key files here.

## For Marcela — the plain-language version

Think of the database as the site's filing cabinet. It has three drawers: one card per purchase (**orders** — who bought what, whether they paid, whether they've taken the exam yet, and where their finished report lives), one envelope per completed exam (**submissions** — the answers exactly as the student typed them), and a catalogue of your test bank (**exam_tests** — which exams exist per level and where each PDF is stored). There's also a locked cupboard (**the `exam-tests` storage bucket**) holding the actual test PDFs — "locked" meaning the site only ever hands a student a temporary key that expires on its own, so tests can't circulate freely.

The keys to all of this are in a file called `.env` on the computer, which git is told to never upload anywhere — that's why the passwords aren't written in this document. If you ever need to check something in the database yourself, the Dashboard link at the top of this page is the friendly web interface to it (log in with the pharosenglishlab Google account).

## Claude's network limitation (why Claude can't run migrations itself)

Claude's cloud workspace has an allowlist-only network policy that doesn't include Supabase's hosts (verified 2026-07-04: connections to both the DB pooler and `api.supabase.com` are blocked with a 403 before they leave the sandbox). So Claude prepares everything — SQL, scripts, docs — and a human runs the one command. If direct access is ever wanted, the environment's network policy is the thing to change (see the Claude Code on the web docs), not the credentials.
