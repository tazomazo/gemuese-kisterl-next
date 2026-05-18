import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { hashPassword, AUTH_COOKIE_NAME, serializeCookieUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { name, password } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Benutzername erforderlich' }, { status: 400 });
  }

  const db = createServerClient();

  const { data: existing } = await db
    .from('users')
    .select('id')
    .ilike('name', name.trim())
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'Dieser Name ist bereits vergeben' }, { status: 409 });
  }

  const passwordHash = password ? await hashPassword(password) : null;
  const { data: created, error } = await db
    .from('users')
    .insert({ name: name.trim(), password_hash: passwordHash, is_admin: false })
    .select('id, name, is_admin')
    .single();

  if (error) {
    return NextResponse.json({ error: 'Konto konnte nicht erstellt werden' }, { status: 500 });
  }

  const authUser = { id: created.id, name: created.name, is_admin: created.is_admin };
  const res = NextResponse.json(authUser, { status: 201 });
  res.cookies.set(AUTH_COOKIE_NAME, serializeCookieUser(authUser), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
