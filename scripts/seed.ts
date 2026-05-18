/**
 * Seed-Script: Admin-User und Beispiel-Kategorien anlegen
 *
 * Ausführen:
 *   npx tsx scripts/seed.ts
 *
 * Voraussetzung: .env muss gesetzt sein
 */

import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import ws from 'ws';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { auth: { persistSession: false }, realtime: { transport: ws as any } }
);

async function seed() {
  console.log('🌱 Seeding database…');

  // Admin user
  const adminHash = await bcrypt.hash('admin123', 10);
  const { error: userError } = await supabase
    .from('users')
    .upsert({ name: 'admin', password_hash: adminHash, is_admin: true }, { onConflict: 'name' });

  if (userError) {
    console.error('❌ Admin user:', userError.message);
  } else {
    console.log('✅ Admin user (admin / admin123)');
  }

  // Example categories
  const categories = ['Gemüse', 'Obst', 'Kräuter', 'Salate', 'Wurzelgemüse'];
  for (const name of categories) {
    const { error } = await supabase
      .from('categories')
      .upsert({ name }, { onConflict: 'name' });
    if (error) {
      console.error(`❌ Kategorie "${name}":`, error.message);
    } else {
      console.log(`✅ Kategorie: ${name}`);
    }
  }

  console.log('\n✨ Seeding abgeschlossen!');
}

seed().catch(console.error);
