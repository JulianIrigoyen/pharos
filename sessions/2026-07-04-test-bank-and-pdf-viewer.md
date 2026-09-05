# Session Log: Test Bank Assignment + Embedded Test PDF Viewer

**Date:** July 4, 2026
**Scope:** Added a real test bank (B2/C1, 3 variants each), automatic sequential assignment per order, a signed-URL endpoint to serve the assigned PDF securely, and a split-screen exam page (test on the left, answer sheet on the right). Also reconciled a gap found between the prior session's log and what was actually on disk.

---

## Important finding: prior session's "completed" work wasn't fully saved

Before starting today's feature, the files described as finished in
`sessions/2026-07-04-use-of-english-timer-and-answer-sheet.md` were
re-checked directly against this project folder. Several were **not**
actually in their final state on disk, despite being reported complete:

- `components/exam/UseOfEnglishForm.tsx` was still the original hardcoded
  4-part form (field names like `mcq_1`, `wf_word_1`...), not the
  config-driven, timer-integrated version described in that log.
- `app/exam/[orderId]/page.tsx` fetched the order and rendered the form
  directly — it never showed the "Full Simulation (Timed) vs. Practice
  Mode" choice screen, and never called `/api/exam/[orderId]/start`.
- `app/api/submissions/route.ts` inserted the submission and updated the
  order status, but never generated the answer-sheet PDF or sent the
  Resend email — that logic only ever existed in the dev-only
  `/api/dev/test-answer-sheet` endpoint.
- `types/order.ts` and `app/api/status/[orderId]/route.ts` were missing
  `exam_started_at` / `exam_timed_mode` entirely.

The corrected, final versions of these files (matching what the prior
log described) were still sitting in this session's scratch workspace,
so nothing had to be redesigned — they simply hadn't been written back
to the real project folder in the last pass. They've now been
re-verified and committed for real, alongside today's new work below.
**If anything before today's date still looks like the old 4-part form,
that's the signal something didn't save — worth a quick check with
Claude next time before assuming a feature is live.**

---

## What's new today

### 1. Test bank + automatic assignment
Marcela's Google Drive was reviewed (via the Drive connector) to confirm
the real bank: folders `B2-RUE-TESTS` and `C1-RUE-TESTS`, each with 3
test PDFs (`B2-RUE-001/002/003.pdf`, `C1-RUE-001/002/003.pdf`) plus
matching `*-KEY` answer keys that must never be shown to students.

- `supabase/migrations/005_exam_test_bank.sql`: new `exam_tests` table
  (`test_code` primary key, `exam_level`, `storage_path`, `active`) and a
  new `orders.assigned_test_code` column, seeded with the 6 known tests
  (storage paths only — the actual PDF files still need uploading to
  Supabase Storage; see "Still pending" below).
- `lib/exam-tests.ts`: `pickTestForOrder()` — picks tests in sequential
  order per student (1st attempt at a level gets the first test
  alphabetically, 2nd attempt the next, etc.), wrapping back to the
  first once they've cycled through the whole bank. (Originally random;
  changed to sequential per Marcela's preference — more predictable to
  reason about than random assignment.)
- `app/api/exam/[orderId]/start/route.ts`: now also assigns a test
  (for Use of English orders) in the same request that sets
  `exam_started_at`, idempotently, alongside the timed/practice choice.

### 2. Secure, signed delivery of the assigned test PDF
- `app/api/exam/[orderId]/test-pdf/route.ts`: new endpoint. Looks up the
  order's `assigned_test_code`, resolves it to a Storage path, and
  returns a signed URL (70-minute expiry) — never a public link.
- `components/exam/TestPdfViewer.tsx`: new client component. Fetches the
  signed URL, renders it in an iframe, and silently re-fetches a fresh
  one a few minutes before it expires — so a long practice-mode session
  never hits a dead link.

### 3. Split-screen exam page
- `app/exam/[orderId]/page.tsx`: once a Use of English exam has started,
  the page now shows a two-column layout — the assigned test PDF
  (sticky, scrolls independently) on the left, the answer-sheet form on
  the right — instead of the form alone.
- `app/preview/page.tsx`: same split layout, but the left panel is a
  generated placeholder PDF (`public/sample-exam-preview.pdf`, invented
  text only, no real exam content) so the visual layout can be reviewed
  without touching Supabase.

### 4. Answer-sheet PDF now includes the test code
- `lib/pdf/answer-sheet.tsx`: added an optional `testCode` field, shown
  under the order/date meta row when present (e.g. "Test Code:
  B2-RUE-002"). This is what lets Marcela's correction process (GPT
  Corrector → Claude Project JSON → `enviar_reporte.command`) know which
  answer key a given submission should be graded against, without her
  having to track it by hand.
- `app/api/submissions/route.ts` and `app/api/dev/test-answer-sheet`
  updated to pass this through.

---

## Still pending (needs Supabase project access — Julian)

- Apply `supabase/migrations/003_exam_timer.sql`,
  `004_exam_timed_mode.sql`, and `005_exam_test_bank.sql`.
- Create a **private** Supabase Storage bucket named `exam-tests`.
- Upload the 6 real test PDFs (not the `-KEY` files!) from Google Drive
  into that bucket, matching the `storage_path` values seeded in
  migration 005 (`use-of-english/B2-RUE-001.pdf`, etc.).
- Once the above is done, test end-to-end: paid order → Start Exam →
  test assigned → PDF viewer loads the real test → submit → PDF/email
  received with the correct test code on it.

See `docs/PRODUCT_FLOW.md` for how this fits into the full purchase-to-
report flow, including the still-open PayPal-vs-Stripe question that
blocks any of this from reaching a real paying student today.
