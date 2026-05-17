-- ============================================================
-- Gemüsekisterl – Supabase Schema
-- Ausführen im Supabase SQL Editor
-- ============================================================

-- Users
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  password_hash text,
  is_admin      boolean not null default false,
  created_at    timestamptz not null default now()
);

-- Categories
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  price       numeric(10,2) not null default 0,
  unit        text not null default 'kg',
  category_id uuid references public.categories(id) on delete set null,
  available   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Orders
create table if not exists public.orders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  status     text not null default 'pending' check (status in ('pending', 'fulfilled')),
  created_at timestamptz not null default now()
);

-- Order Items
create table if not exists public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  product_id     uuid not null references public.products(id) on delete restrict,
  quantity       numeric(10,3) not null,
  price_at_order numeric(10,2) not null
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ============================================================
-- Disable RLS for simplicity (enable & configure for production)
-- ============================================================
alter table public.users disable row level security;
alter table public.categories disable row level security;
alter table public.products disable row level security;
alter table public.orders disable row level security;
alter table public.order_items disable row level security;
