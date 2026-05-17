import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// PATCH /api/products/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const db = createServerClient();

  const { data, error } = await db
    .from('products')
    .update(body)
    .eq('id', params.id)
    .select('*, category:categories(id, name, created_at)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE /api/products/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const db = createServerClient();
  const { error } = await db.from('products').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
