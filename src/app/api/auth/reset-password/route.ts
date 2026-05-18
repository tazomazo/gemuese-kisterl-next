import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { name, newPassword } = await req.json();

  if (!name?.trim() || !newPassword) {
    return NextResponse.json({ error: 'Name und neues Passwort erforderlich' }, { status: 400 });
  }

  const db = createServerClient();

  const { data: user } = await db
    .from('users')
    .select('id, password_hash')
    .ilike('name', name.trim())
    .maybeSingle();

  if (!user) {
    return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
  }

  if (!user.password_hash) {
    return NextResponse.json(
      { error: 'Dieser Benutzer hat kein Passwort gesetzt' },
      { status: 400 }
    );
  }

  const passwordHash = await hashPassword(newPassword);
  const { error } = await db
    .from('users')
    .update({ password_hash: passwordHash })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: 'Fehler beim Zurücksetzen des Passworts' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
