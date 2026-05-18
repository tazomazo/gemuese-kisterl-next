'use client';

import { CartItem as CartItemType } from '@/types';
import { useCartContext } from '@/context/CartContext';

interface CartItemProps {
  item: CartItemType;
  readonly?: boolean;
}

export default function CartItem({ item, readonly = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartContext();
  const { product, quantity } = item;

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-white p-4">
      <div className="flex-1">
        <p className="font-medium text-gray-900">{product.name}</p>
        <p className="text-sm text-gray-500">
          {product.price.toFixed(2)} € / {product.unit}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {!readonly && (
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-50"
            aria-label="Weniger"
          >
            −
          </button>
        )}
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        {!readonly && (
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-full border text-gray-600 hover:bg-gray-50"
            aria-label="Mehr"
          >
            +
          </button>
        )}
      </div>

      <p className="w-20 text-right text-sm font-semibold text-gray-900">
        {(product.price * quantity).toFixed(2)} €
      </p>

      {!readonly && (
        <button
          onClick={() => removeItem(product.id)}
          className="ml-1 rounded-lg p-1 text-gray-300 hover:bg-red-50 hover:text-red-500"
          aria-label="Entfernen"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
