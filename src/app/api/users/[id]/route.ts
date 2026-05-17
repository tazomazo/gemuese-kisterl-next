import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { hashPassword, verifyPassword } from '@/lib/auth';

// PATCH /api/users/:id — update name and/or password
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { name, password, currentPassword } = await req.json();
  const db = createServerClient();

  // Fetch current user
  const { data: user, error: fetchError } = await db
    .from('users')
    .select('id, name, is_admin, password_hash')
    .eq('id', params.id)
    .single();

  if (fetchError || !user) {
    return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
  }

  const updates: Record<string, unknown> = {};

  // Update name
  if (name && name.trim() !== user.name) {
    // Check for duplicate
    const { data: existing } = await db
      .from('users')
      .select('id')
      .ilike('name', name.trim())
      .neq('id', params.id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json({ error: 'Dieser Name ist bereits vergeben' }, { status: 409 });
    }
    updates.name = name.trim();
  }

  // Update password
  if (password) {
    // If user already has a password, verify current one first
    if (user.password_hash && currentPassword) {
      const valid = await verifyPassword(currentPassword, user.password_hash);
      if (!valid) {
        return NextResponse.json({ error: 'Aktuelles Passwort ist falsch' }, { status: 401 });
      }
    }
    updates.password_hash = await hashPassword(password);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Keine Änderungen' }, { status: 400 });
  }

  const { data: updated, error: updateError } = await db
    .from('users')
    .update(updates)
    .eq('id', params.id)
    .select('id, name, is_admin')
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json(updated);
}
