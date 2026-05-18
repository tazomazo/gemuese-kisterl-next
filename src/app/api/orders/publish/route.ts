import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { parseCookieUser, AUTH_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const cookieValue = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!cookieValue) return NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
  const cookieUser = parseCookieUser(cookieValue);
  if (!cookieUser) return NextResponse.json({ error: 'Ungültige Sitzung' }, { status: 401 });

  const { items } = await req.json();
  if (!items?.length) {
    return NextResponse.json({ error: 'Warenkorb ist leer' }, { status: 400 });
  }

  const db = createServerClient();

  // Find existing open order
  const { data: existingOrder } = await db
    .from('orders')
    .select('id')
    .eq('user_id', cookieUser.id)
    .eq('status', 'open')
    .maybeSingle();

  let orderId: string;

  if (existingOrder) {
    orderId = existingOrder.id;
    // Replace all items
    await db.from('order_items').delete().eq('order_id', orderId);
  } else {
    const { data: newOrder, error: orderError } = await db
      .from('orders')
      .insert({ user_id: cookieUser.id, status: 'open' })
      .select('id')
      .single();
    if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });
    orderId = newOrder.id;
  }

  const orderItems = items.map(
    (i: { productId: string; quantity: number; priceAtOrder: number }) => ({
      order_id: orderId,
      product_id: i.productId,
      quantity: i.quantity,
      price_at_order: i.priceAtOrder,
    })
  );

  const { error: itemsError } = await db.from('order_items').insert(orderItems);
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  return NextResponse.json({ id: orderId });
}
