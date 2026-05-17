import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET /api/products
export async function GET() {
  const db = createServerClient();
  const { data, error } = await db
    .from('products')
    .select('*, category:categories(id, name, created_at)')
    .order('name');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/products
export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = createServerClient();

  const { data, error } = await db
    .from('products')
    .insert({
      name: body.name,
      price: body.price,
      unit: body.unit,
      category_id: body.category_id ?? null,
      available: body.available ?? true,
    })
    .select('*, category:categories(id, name, created_at)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
