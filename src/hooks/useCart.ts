'use client';

import { useState, useEffect } from 'react';
import { useCartContext } from '@/context/CartContext';
import { useAuthContext } from '@/context/AuthContext';
import { CartItem, Order } from '@/types';

function cartMatchesOrder(cartItems: CartItem[], orderItems: Order['items']): boolean {
  if (!orderItems || cartItems.length !== orderItems.length) return false;
  for (const cartItem of cartItems) {
    const orderItem = orderItems.find((oi) => oi.product_id === cartItem.product.id);
    if (!orderItem || orderItem.quantity !== cartItem.quantity) return false;
  }
  return true;
}

export function useCart() {
  const cart = useCartContext();
  const { user } = useAuthContext();

  // undefined = loading, null = loaded but no active order
  const [activeOrder, setActiveOrder] = useState<Order | null | undefined>(undefined);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setActiveOrder(null);
      return;
    }
    fetch('/api/orders/my')
      .then((res) => (res.ok ? res.json() : null))
      .then(setActiveOrder)
      .catch(() => setActiveOrder(null));
  }, [user]);

  const isLocked = activeOrder?.status === 'in_progress';
  const isLoading = activeOrder === undefined;

  const isDirty =
    !isLoading &&
    !isLocked &&
    cart.items.length > 0 &&
    (activeOrder === null || !cartMatchesOrder(cart.items, activeOrder.items));

  const publishCart = async (): Promise<boolean> => {
    if (!user || cart.items.length === 0 || isLocked) return false;
    setPublishing(true);
    setPublishError(null);
    try {
      const res = await fetch('/api/orders/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            priceAtOrder: i.product.price,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setPublishError(data.error || 'Veröffentlichung fehlgeschlagen');
        return false;
      }
      // Refresh active order to get the latest snapshot
      const orderRes = await fetch('/api/orders/my');
      if (orderRes.ok) setActiveOrder(await orderRes.json());
      return true;
    } catch {
      setPublishError('Netzwerkfehler');
      return false;
    } finally {
      setPublishing(false);
    }
  };

  return {
    ...cart,
    activeOrder,
    isLocked,
    isDirty,
    publishing,
    publishError,
    publishCart,
  };
}
