'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface CategoryFormProps {
  initial?: Category | null;
  onSubmit: (_name: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CategoryForm({
  initial,
  onSubmit,
  onCancel,
  loading = false,
}: CategoryFormProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initial) setName(initial.name);
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Kategoriename"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="z.B. Wurzelgemüse"
        autoFocus
      />
      <div className="flex justify-end gap-2">
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
