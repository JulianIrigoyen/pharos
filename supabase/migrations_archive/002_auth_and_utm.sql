-- Add user_id and UTM tracking columns to orders

alter table orders add column user_id uuid references auth.users(id);
alter table orders add column utm_source text;
alter table orders add column utm_medium text;
alter table orders add column utm_campaign text;
alter table orders add column utm_content text;
alter table orders add column utm_term text;

create index idx_orders_user on orders(user_id);

-- RLS policy: authenticated users can read their own orders
create policy "Users can view own orders"
  on orders for select
  to authenticated
  using (user_id = auth.uid());
