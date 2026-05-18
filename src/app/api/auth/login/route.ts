import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { verifyPassword, AUTH_COOKIE_NAME, serializeCookieUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { name, password } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Benutzername erforderlich' }, { status: 400 });
  }

  const db = createServerClient();

  const { data: user } = await db
    .from('users')
    .select('id, name, is_admin, password_hash')
    .ilike('name', name.trim())
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
  }

  if (user.password_hash) {
    if (!password) {
      return NextResponse.json({ error: 'Passwort erforderlich' }, { status: 401 });
    }
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 });
    }
  }

  const authUser = { id: user.id, name: user.name, is_admin: user.is_admin };
  const res = NextResponse.json(authUser);
  res.cookies.set(AUTH_COOKIE_NAME, serializeCookieUser(authUser), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
