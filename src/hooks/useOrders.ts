'use client';

import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('Fehler beim Laden der Bestellungen');
      setOrders(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (
    orderId: string,
    status: Order['status']
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) return false;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      return true;
    } catch {
      return false;
    }
  };

  return { orders, loading, error, refetch: fetchOrders, updateStatus };
}
