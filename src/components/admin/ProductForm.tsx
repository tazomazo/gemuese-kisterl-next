'use client';

import { useState, useEffect } from 'react';
import { Product, Category } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface ProductFormProps {
  initial?: Product | null;
  categories: Category[];
  onSubmit: (data: Omit<Product, 'id' | 'created_at' | 'category'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ProductForm({
  initial,
  categories,
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [categoryId, setCategoryId] = useState<string>('');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (initial) {
      setName(initial.name);
      setPrice(String(initial.price));
      setUnit(initial.unit);
      setCategoryId(initial.category_id ?? '');
      setAvailable(initial.available);
    }
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: name.trim(),
      price: parseFloat(price),
      unit: unit.trim(),
      category_id: categoryId || null,
      available,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="z.B. Bio-Karotten"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Preis (€)"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          placeholder="0.00"
        />
        <Input
          label="Einheit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
          placeholder="kg / Stück / Bund"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Kategorie</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">— Keine Kategorie —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
          className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
        />
        Verfügbar
      </label>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Abbrechen
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Speichern' : 'Erstellen'}
        </Button>
      </div>
    </form>
  );
}
