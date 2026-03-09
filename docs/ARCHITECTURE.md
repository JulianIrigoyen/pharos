# Pharos English Lab — Architecture Documentation

## Overview

Pharos English Lab is an online diagnostic platform for Cambridge English exams (B2 First, C1 Advanced). Students purchase diagnostic assessments, complete exam-style tasks, and receive professional feedback reports.

**Live URL:** Deployed on Vercel (auto-deploys from `master` branch)
**Repository:** https://github.com/JulianIrigoyen/pharos

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Runtime | React | 19.x |
| Language | TypeScript | 5.7+ |
| Styling | Tailwind CSS | 3.4+ |
| Auth & Database | Supabase (SSR) | @supabase/ssr 0.5+ |
| Payments | Stripe Checkout | stripe 17.x |
| Forms | react-hook-form | 7.54+ |
| Icons | lucide-react | 0.474+ |
| Analytics | Meta Pixel, UTM tracking | Custom |
| Hosting | Vercel | — |

---

## Project Structure

```
pharos/
├── app/                          # Next.js App Router pages & API routes
│   ├── layout.tsx                # Root layout (fonts, SEO, Header/Footer, analytics)
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Design system (utility classes, theme)
│   ├── about/page.tsx            # About page
│   ├── contact/page.tsx          # Contact form (react-hook-form)
│   ├── login/page.tsx            # Login page
│   ├── signup/page.tsx           # Signup page
│   ├── reset-password/
│   │   ├── page.tsx              # Request password reset
│   │   └── update/page.tsx       # Set new password
│   ├── auth/callback/route.ts    # OAuth code exchange endpoint
│   ├── diagnostics/
│   │   ├── page.tsx              # Diagnostics listing (3 cards)
│   │   ├── writing/page.tsx      # Writing diagnostic detail + checkout
│   │   ├── use-of-english/page.tsx
│   │   └── listening/page.tsx
│   ├── exam/
│   │   ├── [orderId]/page.tsx    # Dynamic exam form (renders by diagnostic type)
│   │   └── thank-you/page.tsx    # Post-submission confirmation
│   └── api/
│       ├── stripe/
│       │   ├── create-checkout/route.ts  # Creates Stripe Checkout Session
│       │   └── webhook/route.ts          # Handles checkout.session.completed
│       ├── submissions/route.ts          # Accepts exam answers, updates order
│       └── status/[orderId]/route.ts     # Order status lookup (UUID or Stripe session ID)
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx            # Sticky nav, session-aware (UserMenu vs Login/Signup)
│   │   └── Footer.tsx            # 4-column footer
│   ├── home/
│   │   ├── Hero.tsx              # Landing hero section
│   │   ├── HowItWorks.tsx        # 4-step process
│   │   ├── ValueProposition.tsx  # 3-column value cards
│   │   ├── DiagnosticsPreview.tsx # Preview cards for 3 diagnostics
│   │   └── CTA.tsx               # Full-width call-to-action
│   ├── diagnostics/
│   │   ├── DiagnosticCard.tsx    # Reusable card for diagnostics listing
│   │   └── CheckoutButton.tsx    # Exam level selector + Stripe checkout trigger
│   ├── exam/
│   │   ├── WritingForm.tsx       # Writing task submission form
│   │   ├── UseOfEnglishForm.tsx  # 4-part UoE form (MCQ, cloze, word formation, transformations)
│   │   └── ListeningForm.tsx     # 4-part listening form
│   ├── auth/
│   │   ├── LoginForm.tsx         # Email/password + Google OAuth login
│   │   ├── SignupForm.tsx        # Registration with name + email verification
│   │   ├── ResetPasswordForm.tsx # Request password reset email
│   │   ├── UpdatePasswordForm.tsx # Set new password
│   │   └── UserMenu.tsx          # Authenticated user dropdown (avatar, logout)
│   └── analytics/
│       ├── MetaPixel.tsx         # Meta Pixel script loader + SPA pageview tracking
│       ├── UtmCapture.tsx        # Captures UTM params from URL to localStorage
│       └── ThankYouTracker.tsx   # Fires Purchase event on thank-you page
│
├── lib/
│   ├── stripe.ts                 # Lazy-initialized Stripe client + price ID mapping
│   ├── analytics.ts              # Meta Pixel event wrappers (trackLead, trackPurchase, etc.)
│   ├── utm.ts                    # UTM param capture/retrieval from localStorage
│   └── supabase/
│       ├── client.ts             # Browser Supabase client (createBrowserClient)
│       ├── server.ts             # Server Supabase client (uses cookies())
│       ├── admin.ts              # Service role Supabase client (for API routes)
│       └── middleware.ts         # Session refresh + auth-based route protection
│
├── types/
│   ├── diagnostic.ts             # DiagnosticType, ExamLevel, Diagnostic interface + DIAGNOSTICS constant
│   └── order.ts                  # Order, Submission interfaces, OrderStatus type
│
├── supabase/
│   └── migrations/
│       ├── 001_pharos_foundation.sql  # orders + submissions tables, indexes, RLS
│       └── 002_auth_and_utm.sql       # user_id + UTM columns on orders, RLS policy
│
├── middleware.ts                 # Root middleware (delegates to Supabase middleware)
├── tailwind.config.ts            # Navy/gold/cambridge color palette, Playfair + Inter fonts
├── next.config.js                # Security headers, image config
├── tsconfig.json                 # Bundler resolution, @/* paths
├── postcss.config.js             # Tailwind + autoprefixer
├── .env.example                  # All required env vars documented
└── .gitignore
```

---

## Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `navy-900` | `#1a365d` | Primary backgrounds, headings |
| `navy-800` | `#243b53` | Dark section backgrounds |
| `navy-600` | `#486581` | Body text |
| `gold-500` | `#d69e2e` | CTAs, accents, prices |
| `cambridge` | `#a3bfdb` | Exam level badges |

### Typography

- **Headings:** Playfair Display (serif) via `font-display`
- **Body:** Inter (sans-serif) via `font-body`
- CSS classes: `heading-xl`, `heading-lg`, `heading-md`, `heading-sm`

### Component Classes

Defined in `app/globals.css`:
- **Buttons:** `btn-primary`, `btn-gold`, `btn-outline`
- **Layout:** `section-padding`, `section-dark`, `section-light`, `section-alt`
- **Forms:** `input-field`
- **Cards:** `card`

---

## Authentication Flow

### Provider: Supabase Auth

- **Email/password:** Sign up with email verification, login, password reset
- **Google OAuth:** Sign in with Google, handled via `/auth/callback` route

### Protected Routes

The middleware at `lib/supabase/middleware.ts` protects `/exam/*` routes:
1. Refreshes the Supabase session (cookie-based)
2. Calls `supabase.auth.getUser()` to check authentication
3. If unauthenticated on `/exam/*`, redirects to `/login?redirect={path}`
4. After login, user is redirected back to their intended destination

### Session-Aware Header

`Header.tsx` checks auth state on mount and listens for changes:
- **Logged in:** Shows `UserMenu` (avatar circle, dropdown with "My Orders" + "Log Out")
- **Logged out:** Shows "Log In" link + "Get Started" button (links to `/signup`)

### Graceful Degradation

If Supabase env vars are not configured, the root `middleware.ts` skips the Supabase middleware entirely, allowing the static site to function without a database.

---

## Payment Flow (Stripe Checkout)

### 1. Purchase Initiation

User visits a diagnostic detail page (e.g., `/diagnostics/writing`) and uses the `CheckoutButton`:
- Selects exam level (B2 First or C1 Advanced)
- Clicks "Purchase for $X"
- Client calls `POST /api/stripe/create-checkout`

### 2. Checkout Session Creation

`app/api/stripe/create-checkout/route.ts`:
- Validates `diagnosticType` and `examLevel`
- Gets current user session (if logged in) for `user_id` and email pre-fill
- Reads UTM params from request body
- Creates Stripe Checkout Session with:
  - Line item (price from `STRIPE_*_PRICE_ID` env vars)
  - Metadata: `diagnostic_type`, `exam_level`, `user_id`, UTM fields
  - `success_url`: `/exam/{CHECKOUT_SESSION_ID}` (Stripe template variable)
  - `cancel_url`: `/diagnostics/{type}`
- Returns the checkout URL

### 3. Stripe Webhook

`app/api/stripe/webhook/route.ts`:
- Verifies webhook signature
- On `checkout.session.completed`:
  - Extracts metadata (type, level, user_id, UTM)
  - Inserts order into `orders` table via admin client

### 4. Exam Page

After payment, Stripe redirects to `/exam/{cs_session_id}`:
- Page calls `/api/status/{cs_session_id}`
- Status API detects `cs_*` prefix, looks up by `stripe_session_id`
- Returns order data including real UUID `id`
- Page renders the appropriate form using `order.id` for submissions

### 5. Submission

Exam forms submit to `POST /api/submissions`:
- Validates order exists and status is `paid`
- Checks no prior submission exists
- Inserts submission with answers (JSONB)
- Updates order status to `submitted`
- Redirects to `/exam/thank-you`

### Stripe Configuration

The Stripe client is lazily initialized to avoid build-time crashes when env vars aren't set:
```typescript
let _stripe: Stripe | null = null;
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
    _stripe = new Stripe(key);
  }
  return _stripe;
}
```

Price IDs are mapped per diagnostic type via env vars:
- `STRIPE_WRITING_PRICE_ID` → writing ($15)
- `STRIPE_UOE_PRICE_ID` → use-of-english ($8)
- `STRIPE_LISTENING_PRICE_ID` → listening ($8)

---

## Database Schema

### `orders` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `created_at` | timestamptz | Default now() |
| `stripe_session_id` | text (unique) | Stripe Checkout Session ID |
| `stripe_payment_intent_id` | text | Payment intent reference |
| `customer_email` | text | From Stripe session |
| `customer_name` | text | Optional |
| `diagnostic_type` | text | 'writing', 'use-of-english', 'listening' |
| `exam_level` | text | 'B2', 'C1' |
| `amount_paid` | integer | In cents |
| `currency` | text | Default 'usd' |
| `status` | text | 'paid', 'submitted', 'processing', 'completed', 'failed' |
| `pdf_url` | text | URL to completed report |
| `pdf_sent_at` | timestamptz | When report was emailed |
| `user_id` | uuid (FK) | References auth.users(id), nullable |
| `utm_source` | text | Campaign tracking |
| `utm_medium` | text | Campaign tracking |
| `utm_campaign` | text | Campaign tracking |
| `utm_content` | text | Campaign tracking |
| `utm_term` | text | Campaign tracking |

### `submissions` table

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `created_at` | timestamptz | Default now() |
| `order_id` | uuid (FK, unique) | References orders(id) |
| `diagnostic_type` | text | Denormalized from order |
| `exam_level` | text | Denormalized from order |
| `answers` | jsonb | Form responses |
| `google_sheet_row` | integer | For Google Sheets pipeline |

### Row Level Security

- Both tables have RLS enabled
- No public access policies (API routes use service role)
- Authenticated users can SELECT their own orders (where `user_id = auth.uid()`)

### Indexes

- `idx_orders_stripe_session` on `orders(stripe_session_id)`
- `idx_orders_status` on `orders(status)`
- `idx_orders_email` on `orders(customer_email)`
- `idx_orders_user` on `orders(user_id)`
- `idx_submissions_order` on `submissions(order_id)`

---

## Analytics & Campaign Tracking

### Meta Pixel

- Loaded via `components/analytics/MetaPixel.tsx` in root layout
- Configured via `NEXT_PUBLIC_META_PIXEL_ID` env var
- Returns null (no-op) when pixel ID is not set
- Tracks SPA route changes via `usePathname()` effect

### Standard Events

| Event | Trigger | Location |
|-------|---------|----------|
| `PageView` | Every page load + SPA navigation | `MetaPixel.tsx` |
| `Lead` | Successful signup | `SignupForm.tsx` |
| `InitiateCheckout` | Checkout button click | `CheckoutButton.tsx` |
| `Purchase` | Thank-you page mount | `ThankYouTracker.tsx` |

### UTM Tracking

1. `UtmCapture` component runs on every page load
2. Reads `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` from URL
3. Stores in `localStorage` under `pharos_utm` key
4. `CheckoutButton` reads UTM params and passes them in the checkout API call
5. Checkout route forwards UTM to Stripe session metadata
6. Webhook persists UTM fields on the `orders` row

This enables full attribution: Meta campaign → site visit → purchase → order row with UTM data.

---

## Environment Variables

All variables are documented in `.env.example`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=        # Supabase service role key (server-only)

# Stripe
STRIPE_SECRET_KEY=                # Stripe secret key
STRIPE_WEBHOOK_SECRET=            # Stripe webhook signing secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= # Stripe publishable key (client-side)
STRIPE_WRITING_PRICE_ID=          # Stripe Price ID for writing diagnostic
STRIPE_UOE_PRICE_ID=              # Stripe Price ID for UoE diagnostic
STRIPE_LISTENING_PRICE_ID=        # Stripe Price ID for listening diagnostic

# Google Sheets (future)
GOOGLE_SHEETS_CREDENTIALS=        # Base64-encoded service account JSON
GOOGLE_SHEETS_SPREADSHEET_ID=     # Target spreadsheet ID

# Email (future)
RESEND_API_KEY=                   # Resend API key for transactional emails

# Analytics
NEXT_PUBLIC_GTM_ID=               # Google Tag Manager container ID
NEXT_PUBLIC_META_PIXEL_ID=        # Meta/Facebook Pixel ID
```

---

## Deployment

### Vercel

- Auto-deploys on push to `master` branch
- GitHub integration connected to `JulianIrigoyen/pharos`
- Framework preset: Next.js (auto-detected)
- Environment variables must be configured in Vercel Dashboard

### Setup Steps

1. **Supabase:** Create project, run migrations, enable Google OAuth provider
2. **Stripe:** Create products/prices, set up webhook endpoint pointing to `/api/stripe/webhook`
3. **Vercel:** Add all env vars from `.env.example`
4. **Meta Pixel:** Create pixel in Meta Business Suite, add ID to env vars
5. **Google OAuth:** Set up OAuth consent screen + credentials in Google Cloud Console, configure in Supabase Auth settings

---

## Diagnostics Offered

| Diagnostic | Slug | Price | Exam Levels |
|-----------|------|-------|-------------|
| Writing Diagnostic | `writing` | $15 | B2 First, C1 Advanced |
| Use of English Diagnostic | `use-of-english` | $8 | B2 First, C1 Advanced |
| Listening Diagnostic | `listening` | $8 | B2 First, C1 Advanced |

---

## Future Work

- **Google Sheets pipeline:** `lib/google-sheets.ts` — bridge submissions to a Google Sheet for the teacher to review
- **Email delivery:** Send completed PDF reports via Resend
- **My Orders page:** `/orders` — show authenticated user's order history and report downloads
- **Admin dashboard:** View submissions, update statuses, upload PDF reports
- **GTM integration:** Google Tag Manager for additional analytics
