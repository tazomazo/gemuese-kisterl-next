'use client';

import { useState } from 'react';
import { useCartContext } from '@/context/CartContext';
import { useAuthContext } from '@/context/AuthContext';

export function useCart() {
  const cart = useCartContext();
  const { user } = useAuthContext();
  const [ordering, setOrdering] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const placeOrder = async (): Promise<boolean> => {
    if (!user) {
      setOrderError('Bitte zuerst anmelden');
      return false;
    }
    if (cart.items.length === 0) {
      setOrderError('Der Warenkorb ist leer');
      return false;
    }

    setOrdering(true);
    setOrderError(null);
    setOrderSuccess(false);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cart.items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            priceAtOrder: i.product.price,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setOrderError(data.error || 'Bestellung fehlgeschlagen');
        return false;
      }

      cart.clearCart();
      setOrderSuccess(true);
      return true;
    } catch {
      setOrderError('Netzwerkfehler');
      return false;
    } finally {
      setOrdering(false);
    }
  };

  return { ...cart, placeOrder, ordering, orderError, orderSuccess, setOrderSuccess };
}
