import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { parseCookieUser, AUTH_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const cookieValue = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!cookieValue) return NextResponse.json(null);
  const cookieUser = parseCookieUser(cookieValue);
  if (!cookieUser) return NextResponse.json(null);

  const db = createServerClient();
  const { data, error } = await db
    .from('orders')
    .select(
      `id, user_id, status, created_at,
      items:order_items(
        id, order_id, product_id, quantity, price_at_order,
        product:products(id, name, unit)
      )`
    )
    .eq('user_id', cookieUser.id)
    .in('status', ['open', 'in_progress'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
