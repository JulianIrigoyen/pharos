# Session Log: Pharos English Lab — Use of English Rebuild, Answer Sheet PDF, Exam Timer

**Date:** July 4, 2026
**Base Commit:** Not confirmed from this session — see "Important: two project folders" below before merging.
**Scope:** Rebuilt the Use of English exam form to be config-driven across levels, added an automatic answer-sheet PDF + email on submission, and added a server-tracked exam countdown timer.

---

## Context

Marcela (non-technical, working with Claude/Cowork, her usual dev — Julian — unavailable during this session) wanted to continue the idea (already discussed in a prior session, per `pharosupdate.md`) of building the full exam experience into the site: student reads the test PDF, answers on the site, and eventually feeds a GPT correction agent — replacing today's manual Google Form + Google Sheet flow.

Prior to this session, `components/exam/UseOfEnglishForm.tsx` only implemented 4 of the 7-8 official Cambridge Reading & Use of English parts, with no distinction between B2 (7 parts, 52 questions) and C1 (8 parts, 56 questions).

---

## What Changed

### 1. Config-driven part structure (one component per level, not per test)
- Added `types/exam-parts.ts`: describes the official Cambridge structure per level (B2: 7 parts / 52 questions / 75 min; C1: 8 parts / 56 questions / 90 min), confirmed against cambridgeenglish.org. Question numbering is global and continuous (Q1...Q52/56), matching both the real Cambridge answer sheet and the existing Google Sheet columns.
- Added two reusable part renderers: `components/exam/parts/RadioQuestionPart.tsx` (any letter-choice part: MC Cloze, Multiple Choice, Gapped Text, Cross-text Matching, Multiple Matching) and `components/exam/parts/TextInputPart.tsx` (any typed-answer part: Open Cloze, Word Formation, Key Word Transformations).
- `WordFormationPart.tsx` and `KeyWordTransformationPart.tsx` are now deprecated stubs (kept so the file history isn't a mystery deletion) — safe to delete.
- Rewrote `components/exam/UseOfEnglishForm.tsx` to render whichever part list matches `examLevel`, with one shared component serving every test in the bank (B2-RUE-001/002/003, C1-RUE-001/002/003 — content differences live in the test PDF, not the form).

### 2. Answer-sheet style (per Marcela's feedback)
- Removed the "retype the given word / original sentence / key word" fields — those are already on the test PDF. The form now only captures the student's actual answer per question (a letter or a word/phrase), like a real Cambridge answer sheet.
- Submission payload is now flat: `{ exam_level, Q1, Q2, ... Q52 }`, matching the Google Sheet columns directly.

### 3. Answer-sheet PDF + automatic email
- Added `lib/pdf/answer-sheet.tsx` (React-PDF document, Pharos navy/gold branding) and `lib/pdf/render-answer-sheet.tsx`.
- `app/api/submissions/route.ts` now renders the PDF after a successful submission (use-of-english only, for now) and emails it via Resend to the student (`to`) and Marcela (`bcc: pharosenglishlab@gmail.com`), so both have a copy "for transparency." PDF/email failure is non-fatal — the submission is already saved before this step runs.
- New dependency: `@react-pdf/renderer` (installed).

### 4. Exam timer (server-tracked, auto-submit on expiry)
- New column `orders.exam_started_at` (migration `supabase/migrations/003_exam_timer.sql` — **not yet applied**, needs Supabase access).
- New endpoint `app/api/exam/[orderId]/start/route.ts`: idempotent POST, sets `exam_started_at = now()` once; safe against refresh/double-click.
- New `components/exam/ExamTimer.tsx`: countdown computed from `exam_started_at + duration`, not from client state — survives refresh/tab close. Visual warning under 5 min, critical under 1 min.
- `app/exam/[orderId]/page.tsx`: for `diagnostic_type === "use-of-english"`, shows a "Start Exam" instructions screen first; the clock only starts when the student clicks Start.
- `components/exam/UseOfEnglishForm.tsx`: on timer expiry, auto-submits whatever the student has answered so far, bypassing react-hook-form validation (a validated submit would otherwise block on empty required fields). `beforeunload` warning while the clock is running.
- `app/api/status/[orderId]/route.ts` select updated to include `exam_started_at`.
- `types/order.ts`: added `exam_started_at: string | null`.

### 5. `/preview` page (dev-only, no auth/Supabase/Stripe needed)
- `app/preview/page.tsx`: renders `UseOfEnglishForm` directly with a fake orderId and a live "started now" timestamp, with a B2/C1 toggle. Deliberately placed **outside** `/exam` — `middleware.ts` protects any path starting with `/exam` or `/dashboard`, and Marcela doesn't have a login for this environment.
- Submitting from `/preview` will fail (no real order in the DB) — it's for visually reviewing parts/timer only.

---

## Important: two project folders on this machine

Mid-session we discovered the local dev server was running from `/Users/MILM2/Code/pharos` (a separate clone), while Claude/Cowork's connected-folder edits all landed in `/Users/MILM2/Claude/Projects/Website Pharos/pharos` (a different copy on the same Mac). **All the work in this log is only in the "Claude/Projects/Website Pharos" copy.** These two folders need to be reconciled (ideally via git — push from one, pull into the other) before this becomes the canonical working copy. Whoever picks this up next (Julian) should check `git remote -v` / `git log` in both folders to figure out which one is ahead and merge accordingly.

---

## Pending / Next Recommended Pass

- **Apply `supabase/migrations/003_exam_timer.sql`** (needs someone with Supabase project access — Julian).
- Reconcile the two project folders (see above) so future sessions don't edit the wrong copy.
- Test the full flow end-to-end once Supabase/Stripe access is available: real paid order → Start Exam → timer → submit → confirm PDF + email arrive.
- Decide on and build the left-hand embedded test PDF panel for `/exam/{orderId}` (still open from the prior session's design discussion).
- Extend the timed-exam pattern to Listening and Writing if desired — they currently keep their pre-existing, untimed forms.
- Consider whether Listening/Writing should also move to the config-driven "answer sheet" pattern used here for Use of English.
