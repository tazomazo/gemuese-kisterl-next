import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

interface ImportRow {
  name: string;
  price: number;
  unit: string;
  category_id: string | null;
  available: boolean;
}

// POST /api/import — bulk upsert products
export async function POST(req: NextRequest) {
  const { products } = await req.json();

  if (!Array.isArray(products) || products.length === 0) {
    return NextResponse.json({ error: 'Keine Produkte übergeben' }, { status: 400 });
  }

  const db = createServerClient();
  const errors: string[] = [];
  let imported = 0;

  for (const row of products as ImportRow[]) {
    if (!row.name || typeof row.price !== 'number') {
      errors.push(`Ungültige Zeile: ${JSON.stringify(row)}`);
      continue;
    }

    const { error } = await db.from('products').upsert(
      {
        name: row.name,
        price: row.price,
        unit: row.unit || 'kg',
        category_id: row.category_id,
        available: row.available ?? true,
      },
      { onConflict: 'name' }
    );

    if (error) {
      errors.push(`${row.name}: ${error.message}`);
    } else {
      imported++;
    }
  }

  return NextResponse.json({ imported, errors });
}
