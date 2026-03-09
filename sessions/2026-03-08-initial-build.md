# Session Log: Pharos English Lab — Initial Build

**Date:** March 8-9, 2026
**Scope:** Full project scaffolding, auth, analytics, checkout flow, deployment

---

## Context

Pharos English Lab was requested as a new client site within the `hermes-thrice` monorepo. The client is an English teacher with 30+ years of Cambridge exam preparation experience who wants to sell online diagnostic assessments for B2 First and C1 Advanced students.

The project was built from scratch in a single extended session, going from zero to deployed with auth, payments, and analytics.

---

## What Was Built

### Phase 1-3: Foundation, Design System & Pages

**Scaffolded the full Next.js 15 App Router project:**
- `package.json` with React 19, Supabase SSR, Stripe, react-hook-form, lucide-react
- `tailwind.config.ts` with navy/gold/cambridge color palette, Playfair Display + Inter fonts
- `app/globals.css` with full design system utility classes (btn-primary, btn-gold, btn-outline, input-field, card, section-padding, heading-xl/lg/md/sm, etc.)
- `next.config.js` with security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy), image formats
- `tsconfig.json` with bundler module resolution and `@/*` path alias

**Created all pages:**
- Home page with Hero, HowItWorks, ValueProposition, DiagnosticsPreview, CTA sections
- About page (30+ years methodology story)
- Contact page with react-hook-form
- Diagnostics listing page with 3 DiagnosticCards
- Individual diagnostic detail pages (Writing, Use of English, Listening) with full content sections
- Root layout with Playfair Display + Inter fonts, SEO metadata, JSON-LD structured data

**Created layout components:**
- `Header.tsx` — sticky responsive nav with Compass icon logo, mobile hamburger, "Get Started" CTA
- `Footer.tsx` — 4-column footer with brand, quick links, diagnostic links, CTA

### Phase 4: Supabase Integration

**Created 4 Supabase client utilities (adapted from selvia project pattern):**
- `lib/supabase/client.ts` — browser client using `createBrowserClient`
- `lib/supabase/server.ts` — server client using `cookies()` for App Router
- `lib/supabase/admin.ts` — service role client for API routes
- `lib/supabase/middleware.ts` — session refresh in middleware

**Created database migration:**
- `001_pharos_foundation.sql` — `orders` and `submissions` tables with check constraints, indexes, and RLS enabled

**Root middleware** at `middleware.ts` with matcher excluding static assets.

### Phase 5: Stripe Checkout

**Created payment infrastructure:**
- `lib/stripe.ts` — lazily-initialized Stripe client (avoids build-time env var crashes) + price ID mapping per diagnostic type
- `app/api/stripe/create-checkout/route.ts` — validates input, creates Stripe Checkout Session with metadata, returns checkout URL
- `app/api/stripe/webhook/route.ts` — verifies signature, handles `checkout.session.completed`, inserts order into Supabase

### Phase 6: Exam Forms

**Created the exam delivery system (3 form components built by parallel agent):**
- `app/exam/[orderId]/page.tsx` — dynamic client page that fetches order status, renders appropriate form
- `components/exam/WritingForm.tsx` — task type selector, prompt input, long-form response with live word count
- `components/exam/UseOfEnglishForm.tsx` — 4-part form (MCQ, open cloze, word formation, key word transformations)
- `components/exam/ListeningForm.tsx` — 4-part listening form with multiple question types
- `app/exam/thank-you/page.tsx` — submission confirmation page

### Phase 7: API Routes

**Created additional API endpoints:**
- `app/api/submissions/route.ts` — accepts answers JSON, validates order is "paid", checks no duplicate submission, inserts submission, updates order status to "submitted"
- `app/api/status/[orderId]/route.ts` — returns order status, diagnostic type, exam level, pdf URL

### Phase 8: Authentication

**Built full Supabase Auth system (10 new files):**
- `app/login/page.tsx` + `components/auth/LoginForm.tsx` — email/password + Google OAuth, redirect support
- `app/signup/page.tsx` + `components/auth/SignupForm.tsx` — registration with name, email verification, fires `trackLead`
- `app/auth/callback/route.ts` — OAuth code exchange for Google sign-in
- `app/reset-password/page.tsx` + `components/auth/ResetPasswordForm.tsx` — email request
- `app/reset-password/update/page.tsx` + `components/auth/UpdatePasswordForm.tsx` — set new password
- `components/auth/UserMenu.tsx` — authenticated user dropdown (avatar, "My Orders", logout)

**Modified Header.tsx** to be session-aware:
- Checks `supabase.auth.getUser()` on mount
- Listens for `onAuthStateChange`
- Shows UserMenu when logged in, Login/Sign Up when logged out

**Modified middleware** to protect `/exam/*` routes:
- Redirects unauthenticated users to `/login?redirect={path}`

### Phase 9: Analytics & Campaign Readiness

**Meta Pixel integration:**
- `components/analytics/MetaPixel.tsx` — loads pixel script, tracks SPA pageviews via `usePathname()`
- `lib/analytics.ts` — typed wrappers: `trackPageView`, `trackLead`, `trackInitiateCheckout`, `trackPurchase`
- `components/analytics/ThankYouTracker.tsx` — fires Purchase event on mount

**UTM tracking pipeline:**
- `lib/utm.ts` — captures UTM params from URL to localStorage, provides `getUtmParams()`
- `components/analytics/UtmCapture.tsx` — runs capture on every page load

**Database migration:**
- `002_auth_and_utm.sql` — adds `user_id` (FK to auth.users), 5 UTM columns, RLS policy for authenticated users

**Updated API routes** to pass `user_id` and UTM data through the entire Stripe metadata → webhook → orders pipeline.

### Phase 10: Checkout Flow Fix

**Identified and fixed broken checkout flow:**

The diagnostic detail pages had "Purchase This Diagnostic" buttons that just linked back to `/diagnostics` (circular). No UI existed to actually trigger a purchase.

**Created `CheckoutButton` component:**
- Exam level selector (B2 First / C1 Advanced toggle)
- Calls `POST /api/stripe/create-checkout` with diagnostic type, exam level, UTM params
- Shows loading state during redirect
- Fires `trackInitiateCheckout` analytics event
- Error handling with user-friendly messages

**Fixed status API** to support both UUID and Stripe session ID lookups:
- Detects `cs_*` prefix → queries by `stripe_session_id`
- Otherwise queries by `id`
- Returns full order data including `exam_level` (was previously omitted)

**Fixed exam page** to use `order.id` (real UUID) for form submission instead of URL param (which is a Stripe session ID after checkout).

**Replaced broken CTAs** on all 3 diagnostic detail pages with CheckoutButton.

---

## Deployment

### Initial Deploy to Vercel

1. Initialized git repo in `/clients/pharos/`
2. Created GitHub repo: `JulianIrigoyen/pharos` (public)
3. Linked to Vercel with auto-deploy on push
4. First deploy failed: `MIDDLEWARE_INVOCATION_FAILED` — Supabase middleware crashed without env vars

**Fix:** Added guard in root `middleware.ts` to skip Supabase middleware when `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set. Static pages now load without any backend configuration.

### Build Issues Fixed During Session

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| `cookiesToSet implicitly has any type` | Strict TS on Vercel caught implicit `any` in Supabase cookie handlers | Added explicit type annotations to `middleware.ts` and `server.ts` |
| `MIDDLEWARE_INVOCATION_FAILED` on deploy | Supabase client created without env vars | Guard clause in root middleware, returns `NextResponse.next()` |
| `useSearchParams() should be wrapped in Suspense` | Next.js 15 requires Suspense boundary for `useSearchParams` in SSG pages | Wrapped LoginForm and SignupForm in `<Suspense>` in their parent pages |
| Stripe build error: `Neither apiKey nor config.authenticator` | Module-level Stripe instantiation failed at build time | Lazy `getStripe()` function that only creates client on first call |
| Supabase query chain error | `.eq()` called after `.single()` | Restructured to call `.eq()` before `.single()` |

---

## Commit History

```
65df55c fix: wire up complete checkout flow for diagnostics
0e422b4 feat: add Supabase Auth, Meta Pixel, and UTM tracking
afe563f fix: skip Supabase middleware when env vars are not configured
b083569 fix: add type annotation for cookiesToSet in server Supabase client
0822e1d fix: add type annotation for cookiesToSet in Supabase middleware
ad317c8 feat: scaffold Pharos English Lab — diagnostic platform for Cambridge exams
```

---

## Remaining Work

### Must-Do Before Launch
- [ ] Create Supabase project and run both migrations
- [ ] Enable Google OAuth provider in Supabase Auth settings
- [ ] Create Stripe products/prices for all 3 diagnostics
- [ ] Configure webhook endpoint in Stripe dashboard → `https://domain/api/stripe/webhook`
- [ ] Add all env vars to Vercel dashboard
- [ ] Set custom domain

### Nice-to-Have
- [ ] Google Sheets pipeline bridge (`lib/google-sheets.ts`) — push submissions to a spreadsheet for the teacher
- [ ] Email delivery — send PDF reports via Resend when `pdf_url` is set
- [ ] My Orders page (`/orders`) — show authenticated user's order history
- [ ] Admin dashboard for reviewing submissions and uploading reports
- [ ] OG images per page for social sharing
- [ ] Error boundaries and loading.tsx skeletons

---

## Architecture Decisions

### Why lazy Stripe initialization?
Next.js builds all route files at build time for type checking. Module-level `new Stripe(process.env.STRIPE_SECRET_KEY!)` fails when env vars aren't available during build. The `getStripe()` pattern defers initialization to runtime.

### Why service role for API routes?
RLS is enabled on all tables but no public access policies exist. API routes use the admin/service role client to bypass RLS, since they perform their own validation (checking order ownership, payment status, etc.). The authenticated user RLS policy is for future client-side queries (e.g., "My Orders" page).

### Why detect Stripe session ID in status API?
Stripe's `success_url` uses `{CHECKOUT_SESSION_ID}` template variable, which sends the user to `/exam/cs_test_xxx`. But orders are stored with UUID primary keys. Rather than adding an intermediate redirect route, the status API detects the `cs_` prefix and queries by `stripe_session_id` column instead.

### Why UTM in localStorage instead of cookies?
UTM params need to survive across pages during the same visit but don't need server-side access (they're passed explicitly in the checkout API call body). localStorage is simpler and doesn't add to request headers.

### Why Suspense around auth forms?
Next.js 15 requires `useSearchParams()` to be wrapped in a `<Suspense>` boundary when used in pages that could be statically generated. The login and signup pages read `?redirect=` from search params, triggering this requirement.
