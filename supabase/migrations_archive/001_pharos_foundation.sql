-- Pharos English Lab: Orders & Submissions

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  stripe_session_id text unique not null,
  stripe_payment_intent_id text,
  customer_email text not null,
  customer_name text,
  diagnostic_type text not null check (diagnostic_type in ('writing', 'use-of-english', 'listening')),
  exam_level text not null check (exam_level in ('B2', 'C1')),
  amount_paid integer not null,
  currency text not null default 'usd',
  status text not null default 'paid' check (status in ('paid', 'submitted', 'processing', 'completed', 'failed')),
  pdf_url text,
  pdf_sent_at timestamptz
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  order_id uuid not null unique references orders(id) on delete cascade,
  diagnostic_type text not null,
  exam_level text not null,
  answers jsonb not null,
  google_sheet_row integer
);

-- Indexes
create index idx_orders_stripe_session on orders(stripe_session_id);
create index idx_orders_status on orders(status);
create index idx_orders_email on orders(customer_email);
create index idx_submissions_order on submissions(order_id);

-- RLS: deny all public access, API routes use service role
alter table orders enable row level security;
alter table submissions enable row level security;
