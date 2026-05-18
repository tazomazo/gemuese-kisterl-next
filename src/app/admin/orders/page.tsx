'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/types';
import OrderList from '@/components/admin/OrderList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type Filter = 'all' | Order['status'];

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Alle' },
  { value: 'open', label: 'Offen' },
  { value: 'in_progress', label: 'In Bearbeitung' },
  { value: 'done', label: 'Erledigt' },
];

export default function AdminOrdersPage() {
  const { orders, loading, error, updateStatus, deleteOrder } = useOrders();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = orders.filter((o) => filter === 'all' || o.status === filter);
  const openCount = orders.filter((o) => o.status === 'open').length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Bestellungen
          {openCount > 0 && (
            <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-sm font-medium text-yellow-700">
              {openCount} offen
            </span>
          )}
        </h1>

        <div className="flex rounded-lg border bg-white p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.value ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Bestellungen werden geladen…" />
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <OrderList orders={filtered} onUpdateStatus={updateStatus} onDelete={deleteOrder} />
      )}
    </div>
  );
}
