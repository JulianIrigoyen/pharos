# Pharos English Lab — TODO

Ranked list of what's left to get the full student journey (see
`docs/PRODUCT_FLOW.md`) working for real, paying students. Ranked by
how much it blocks everything else, not by effort.

---

## 1. ~~Decide the payment platform~~ → DECIDED: PayPal (2026-07-04)

**Status: ✅ Resolved.** Julián chose PayPal as the payment integration.
A full PayPal flow was built the same day (server-side price + capture,
order row inserted on confirmed payment, straight redirect into the
exam) and the live `use-of-english` page now uses it — the broken
placeholder link and Google Forms are gone. Stripe's code remains
intact as a possible second processor; Mercado Pago stays a future
consideration for local students (PRODUCT_FLOW.md, Stage 1).

## 2. Switch on the PayPal + database setup

**Priority: P0 — the only thing between the code and real students**
**Owner: Julián**
**Source: docs/PENDING_FOR_JULIAN.md (full checklist)**

Remaining hands-on steps: run the single consolidated migration
(`supabase/migrations/001_init.sql` — creates all tables plus the
private `exam-tests` Storage bucket), upload all 6 curated test PDFs
from `supabase/seed-assets/exam-tests/` to that bucket (see
`docs/PENDING_FOR_JULIAN.md` item 2 — all 6 are ready now), create the
PayPal app and put its sandbox credentials in `.env`, run
`npm install`, then test one full sandbox purchase end-to-end. Also
check whether `writing` and `listening` pages have the same old
PayPal-placeholder pattern and need the same rewire as use-of-english.

## 3. Verify the Resend sending domain

**Priority: P1**
**Owner: Julián (Resend account access)**
**Source: PRODUCT_FLOW.md, Stage 3**

The answer-sheet PDF + email pipeline is built and tested, but the
Resend account is still in sandbox mode, which typically only allows
sending to the account's own address — not to real student inboxes.

## 4. ~~Apply pending Supabase migrations~~ → folded into #2

**Status: superseded (2026-07-04).** The five incremental migrations
were consolidated into one file (`001_init.sql`) that also creates the
storage bucket, since the database is brand new and empty. Applying it
is now part of item #2 above. Old files archived in
`supabase/migrations_archive/`; DB reference and credentials handling
documented in `docs/db.md`.

## 5. Build the Stage 5 "closing the loop" automation

**Priority: P2**
**Owner: Julián (or Claude, once the above is live)**
**Source: PRODUCT_FLOW.md, Stage 5**

Today, once Marcela finishes correcting a submission (GPT Corrector →
Claude Project JSON → `enviar_reporte.command` → Make → Word doc in
Drive), nothing writes the finished PDF back to Supabase. Need an
automation so Make (or a follow-up step) uploads the final PDF, sets
`orders.pdf_url`, and flips `orders.status` to `completed` — so it
shows up on the student's dashboard automatically instead of needing a
manual database edit.

## 6. Design the Stage 0 orientation bot (B2 vs. C1 recommendation)

**Priority: P3 — nice to have, not blocking**
**Owner: Marcela (concept) + Claude (build)**
**Source: PRODUCT_FLOW.md, Stage 0**

A short quiz/bot for visitors who don't know which Cambridge exam to
prepare for, recommending B2 First or C1 Advanced and routing them to
the right diagnostic page. Purely additive — doesn't block or depend on
anything above, best done once the core paid flow (#1-#4) is solid.
