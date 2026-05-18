-- Migration: update order status values
-- Run this in the Supabase SQL Editor on existing databases

-- Drop old constraint
alter table public.orders drop constraint if exists orders_status_check;

-- Migrate existing data
update public.orders set status = 'open'  where status = 'pending';
update public.orders set status = 'done'  where status = 'fulfilled';

-- Add new constraint and update default
alter table public.orders
  add constraint orders_status_check check (status in ('open', 'in_progress', 'done')),
  alter column status set default 'open';
