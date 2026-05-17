'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import OrderList from '@/components/admin/OrderList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Filter = 'all' | 'pending' | 'fulfilled';

export default function AdminOrdersPage() {
  const { orders, loading, error, markFulfilled } = useOrders();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = orders.filter((o) => filter === 'all' || o.status === filter);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  const handleMarkFulfilled = async (orderId: string) => {
    await markFulfilled(orderId);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Bestellungen
          {pendingCount > 0 && (
            <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-sm font-medium text-yellow-700">
              {pendingCount} offen
            </span>
          )}
        </h1>

        {/* Filter tabs */}
        <div className="flex rounded-lg border bg-white p-1">
          {(['all', 'pending', 'fulfilled'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? 'Alle' : f === 'pending' ? 'Offen' : 'Erledigt'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Bestellungen werden geladen…" />
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <OrderList orders={filtered} onMarkFulfilled={handleMarkFulfilled} />
      )}
    </div>
  );
}
