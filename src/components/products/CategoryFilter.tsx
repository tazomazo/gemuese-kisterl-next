'use client';

import { Category } from '@/types';

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onChange: (_id: string | null) => void;
}

export default function CategoryFilter({ categories, selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-brand-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Alle
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selected === cat.id
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
