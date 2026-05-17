import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

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

// POST /api/orders — place a new order
export async function POST(req: NextRequest) {
  const { userId, items } = await req.json();

  if (!userId || !items?.length) {
    return NextResponse.json({ error: 'Ungültige Bestelldaten' }, { status: 400 });
  }

  const db = createServerClient();

  // Create order
  const { data: order, error: orderError } = await db
    .from('orders')
    .insert({ user_id: userId, status: 'pending' })
    .select('id')
    .single();

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  // Insert items
  const orderItems = items.map(
    (i: { productId: string; quantity: number; priceAtOrder: number }) => ({
      order_id: order.id,
      product_id: i.productId,
      quantity: i.quantity,
      price_at_order: i.priceAtOrder,
    })
  );

  const { error: itemsError } = await db.from('order_items').insert(orderItems);
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  return NextResponse.json({ id: order.id }, { status: 201 });
}
