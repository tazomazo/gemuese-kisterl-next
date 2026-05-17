'use client';

import { useState } from 'react';
import { Product } from '@/types';
import Button from '@/components/ui/Button';
import { useCartContext } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCartContext();
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.product.id === product.id);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="flex flex-col rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Category badge */}
      {product.category && (
        <span className="mb-2 self-start rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
          {product.category.name}
        </span>
      )}

      {/* Name & Price */}
      <h3 className="flex-1 text-base font-semibold text-gray-900">{product.name}</h3>
      <p className="mt-1 text-sm text-gray-500">
        {product.price.toFixed(2)} € / {product.unit}
      </p>

      {/* Unavailable badge */}
      {!product.available && (
        <span className="mt-2 text-xs font-medium text-red-500">Nicht verfügbar</span>
      )}

      {/* Cart action */}
      <div className="mt-4 flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={!product.available}
          className="flex-1"
        >
          {added ? '✓ Hinzugefügt' : 'In den Warenkorb'}
        </Button>
        {inCart && (
          <span className="rounded-lg bg-brand-50 px-2 py-1 text-xs text-brand-700">
            {inCart.quantity}×
          </span>
        )}
      </div>
    </div>
  );
}
