-- ============================================================================
-- Pharos English Lab — full schema, single migration.
--
-- Consolidates the former 001-005 migration files (archived in
-- supabase/migrations_archive/) into one file, since this is being applied
-- to a fresh Supabase project (umdoppqtajbiuoklwuvk) that has never had any
-- migration run against it. Safe to re-run: everything is IF NOT EXISTS /
-- ON CONFLICT DO NOTHING.
--
-- How to apply: Supabase Dashboard → SQL Editor → paste this whole file →
-- Run. Or from a terminal: see scripts/db-apply.sh (uses .env, gitignored).
-- ============================================================================

-- ── Test bank ───────────────────────────────────────────────────────────────
-- Each row is one exam variant available for a level, sourced one of two
-- ways (decided Sep 2026, after the previous book-derived test bank turned
-- out to have no commercial license — see docs/PENDING_FOR_JULIAN.md and
-- the licensing_exam_essentials project memory for the full story):
--
--   storage_path  — a Reading & Use of English-only PDF that Pharos has
--                    curated from Cambridge's own free official sample
--                    paper (the Cambridge zip bundles the question paper
--                    together with the answer key; Pharos strips the key
--                    out before hosting, so a student can never open it
--                    ahead of submitting to Pharos) and re-hosts privately
--                    in the "exam-tests" Storage bucket, served only via a
--                    short-lived signed URL to a student with a paid,
--                    started order. Source files live in
--                    supabase/seed-assets/exam-tests/ for whoever uploads
--                    them. Cambridge's own copy (with the key) stays
--                    linkable too — see the diagnostic page copy.
--   external_url  — used only for the two "-DIGITAL-" tests, which are
--                    Cambridge's own interactive Reading & Use of English
--                    sample player (a URL that is verifiably answer-key-free
--                    on Cambridge's site — the key is a separate, never-
--                    linked resource there). Pharos just sends the student
--                    there in a new tab; nothing is hosted.
--
-- Exactly one of the two must be set per row (see the check constraint).
-- Assignment to a student is sequential per student (1st attempt → first
-- test, 2nd → next, wrapping around) — see lib/exam-tests.ts.

create table if not exists exam_tests (
  test_code text primary key,
  exam_level text not null check (exam_level in ('B2', 'C1')),
  diagnostic_type text not null default 'use-of-english' check (diagnostic_type = 'use-of-english'),
  storage_path text,
  external_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint exam_tests_exactly_one_source check (
    (storage_path is not null and external_url is null) or
    (storage_path is null and external_url is not null)
  )
);

-- ── Orders ──────────────────────────────────────────────────────────────────
-- One row per purchased diagnostic. Payment-provider-agnostic: Stripe fills
-- stripe_session_id, PayPal fills paypal_order_id; either way the row lands
-- here with status 'paid', which is the single requirement everything
-- downstream (exam page, timer, PDF receipt, dashboard) depends on.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- payment
  payment_provider text not null default 'stripe'
    check (payment_provider in ('stripe', 'paypal', 'mercadopago', 'manual')),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  paypal_order_id text unique,
  amount_paid integer not null,          -- in cents
  currency text not null default 'usd',

  -- customer
  customer_email text not null,
  customer_name text,
  user_id uuid references auth.users(id),

  -- what was bought
  diagnostic_type text not null check (diagnostic_type in ('writing', 'use-of-english', 'listening')),
  exam_level text not null check (exam_level in ('B2', 'C1')),

  -- lifecycle
  status text not null default 'paid'
    check (status in ('paid', 'submitted', 'processing', 'completed', 'failed')),
  pdf_url text,
  pdf_sent_at timestamptz,

  -- exam session (set once when the student clicks "Start Exam")
  exam_started_at timestamptz,           -- server-side start timestamp; drives the countdown
  exam_timed_mode boolean,               -- true = timed simulation, false = untimed practice
  assigned_test_code text references exam_tests(test_code),

  -- campaign attribution
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text
);

-- ── Submissions ─────────────────────────────────────────────────────────────

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null unique references orders(id) on delete cascade,
  diagnostic_type text not null,
  exam_level text not null,
  answers jsonb not null,
  google_sheet_row integer
);

-- ── Indexes ─────────────────────────────────────────────────────────────────

create index if not exists idx_orders_stripe_session on orders(stripe_session_id);
create index if not exists idx_orders_paypal_order on orders(paypal_order_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_email on orders(customer_email);
create index if not exists idx_orders_user on orders(user_id);
create index if not exists idx_submissions_order on submissions(order_id);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- Deny-all by default; API routes use the service role key. The one
-- exception: logged-in students can read their own orders (dashboard).

alter table orders enable row level security;
alter table submissions enable row level security;
alter table exam_tests enable row level security;

drop policy if exists "Users can view own orders" on orders;
create policy "Users can view own orders"
  on orders for select
  to authenticated
  using (user_id = auth.uid());

-- ── Storage: private bucket for the curated (key-free) test PDFs ───────────
-- Private on purpose: served only via short-lived signed URLs (see
-- /api/exam/[orderId]/test-pdf), never a public link. Holds ONLY
-- Reading & Use of English question papers that Pharos has stripped of
-- Cambridge's answer key — never the key itself, never the full Cambridge
-- zip. See supabase/seed-assets/exam-tests/ for the source files and their
-- upload status.

insert into storage.buckets (id, name, public)
values ('exam-tests', 'exam-tests', false)
on conflict (id) do nothing;

-- ── Seed the test bank ──────────────────────────────────────────────────────
-- Decided Sep 2026 (see the exam_tests comment above for the two sourcing
-- modes). B2 First: 2 standard sample papers + 2 "for Schools" sample
-- papers (same level, younger-audience texts — per the Sep 2026 decision,
-- don't label these "for Schools" in the student-facing report) + 1
-- digital interactive sample. C1 Advanced: 2 sample papers + 1 digital
-- interactive sample.
--
-- All 6 storage_path PDFs are curated (RUE only, key stripped) and sit in
-- supabase/seed-assets/exam-tests/ — all rows are active=true. They still
-- need manually uploading to the exam-tests Storage bucket before they'll
-- actually work for a real student (see docs/PENDING_FOR_JULIAN.md item 2)
-- — until uploaded, requesting one of these tests will 500 (missing
-- object), so do the upload before flipping any real traffic on. The two
-- -DIGITAL- rows need no file at all.

insert into exam_tests (test_code, exam_level, storage_path, external_url, active) values
  ('B2-CAMBRIDGE-SAMPLE-1', 'B2', 'use-of-english/B2-CAMBRIDGE-SAMPLE-1.pdf', null, true),
  ('B2-CAMBRIDGE-SAMPLE-2', 'B2', 'use-of-english/B2-CAMBRIDGE-SAMPLE-2.pdf', null, true),
  ('B2-SCHOOLS-SAMPLE-1', 'B2', 'use-of-english/B2-SCHOOLS-SAMPLE-1.pdf', null, true),
  ('B2-SCHOOLS-SAMPLE-2', 'B2', 'use-of-english/B2-SCHOOLS-SAMPLE-2.pdf', null, true),
  ('B2-DIGITAL-1', 'B2', null, 'https://ceq.inspera.com/player/?assessmentRunId=146731716&context=exam', true),
  ('C1-CAMBRIDGE-SAMPLE-1', 'C1', 'use-of-english/C1-CAMBRIDGE-SAMPLE-1.pdf', null, true),
  ('C1-CAMBRIDGE-SAMPLE-2', 'C1', 'use-of-english/C1-CAMBRIDGE-SAMPLE-2.pdf', null, true),
  ('C1-DIGITAL-1', 'C1', null, 'https://ceq.inspera.com/player/?assessmentRunId=160272499&context=exam', true)
on conflict (test_code) do update
  set storage_path = excluded.storage_path,
      external_url = excluded.external_url;
