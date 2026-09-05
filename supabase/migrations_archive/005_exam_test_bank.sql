-- Test bank: each row is one exam variant available for a level. The
-- storage_path points to a private Supabase Storage object (bucket
-- "exam-tests") — never a public URL, and NEVER an answer-key file
-- (Marcela's Drive folders also contain "*-KEY.pdf"/KEY docs — those must
-- never be added here or uploaded to this bucket, since this table drives
-- what gets shown to students).
--
-- Assignment happens once per order, inside /api/exam/[orderId]/start
-- (see lib/exam-tests.ts), and is recorded on the order via
-- assigned_test_code so:
--   1. the same variant is always re-served to that student
--      (via /api/exam/[orderId]/test-pdf), and
--   2. the code is traceable end-to-end for correction — it matches the
--      "Test Code" column already used in Marcela's Google Sheet / GPT
--      Corrector pipeline (e.g. "B2-RUE-001", "C1-RUE-002").

create table if not exists exam_tests (
  test_code text primary key,
  exam_level text not null check (exam_level in ('B2', 'C1')),
  diagnostic_type text not null default 'use-of-english' check (diagnostic_type = 'use-of-english'),
  storage_path text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table orders add column if not exists assigned_test_code text references exam_tests(test_code);

-- Seed the known bank: 3 tests per level, per Marcela's Google Drive
-- folders B2-RUE-TESTS / C1-RUE-TESTS (checked July 2026). The
-- storage_path files still need to be uploaded to the "exam-tests"
-- Storage bucket before these rows are actually servable — see
-- docs/PRODUCT_FLOW.md, Stage 2, for the remaining migration steps.
insert into exam_tests (test_code, exam_level, storage_path) values
  ('B2-RUE-001', 'B2', 'use-of-english/B2-RUE-001.pdf'),
  ('B2-RUE-002', 'B2', 'use-of-english/B2-RUE-002.pdf'),
  ('B2-RUE-003', 'B2', 'use-of-english/B2-RUE-003.pdf'),
  ('C1-RUE-001', 'C1', 'use-of-english/C1-RUE-001.pdf'),
  ('C1-RUE-002', 'C1', 'use-of-english/C1-RUE-002.pdf'),
  ('C1-RUE-003', 'C1', 'use-of-english/C1-RUE-003.pdf')
on conflict (test_code) do nothing;
