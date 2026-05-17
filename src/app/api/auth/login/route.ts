import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { hashPassword, verifyPassword, AUTH_COOKIE_NAME, serializeCookieUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { name, password } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json({ error: 'Name erforderlich' }, { status: 400 });
  }

  const db = createServerClient();

  // Look up user by name
  const { data: existing } = await db
    .from('users')
    .select('id, name, is_admin, password_hash')
    .ilike('name', name.trim())
    .maybeSingle();

  // New user (no password required for first login)
  if (!existing) {
    const passwordHash = password ? await hashPassword(password) : null;
    const { data: created, error } = await db
      .from('users')
      .insert({ name: name.trim(), password_hash: passwordHash, is_admin: false })
      .select('id, name, is_admin')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Benutzer konnte nicht erstellt werden' }, { status: 500 });
    }

    const authUser = { id: created.id, name: created.name, is_admin: created.is_admin };
    const res = NextResponse.json(authUser);
    res.cookies.set(AUTH_COOKIE_NAME, serializeCookieUser(authUser), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  }

  // Existing user with password — verify it
  if (existing.password_hash) {
    if (!password) {
      return NextResponse.json({ error: 'Passwort erforderlich' }, { status: 401 });
    }
    const valid = await verifyPassword(password, existing.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Falsches Passwort' }, { status: 401 });
    }
  }

  const authUser = { id: existing.id, name: existing.name, is_admin: existing.is_admin };
  const res = NextResponse.json(authUser);
  res.cookies.set(AUTH_COOKIE_NAME, serializeCookieUser(authUser), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
