import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/orders — admin: all orders with items and user info
export async function GET() {
  const db = createServerClient();
  const { data, error } = await db
    .from('orders')
    .select(
      `
      id, user_id, status, created_at,
      user:users(id, name),
      items:order_items(
        id, order_id, product_id, quantity, price_at_order,
        product:products(id, name, unit)
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

