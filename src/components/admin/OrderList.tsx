'use client';

import { Order } from '@/types';
import Button from '@/components/ui/Button';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (_orderId: string, _status: Order['status']) => Promise<boolean>;
  onDelete: (_orderId: string) => Promise<boolean>;
}

const STATUS_LABEL: Record<Order['status'], string> = {
  open: 'Offen',
  in_progress: 'In Bearbeitung',
  done: 'Erledigt',
};

const STATUS_STYLE: Record<Order['status'], string> = {
  open: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
};

function handleDelete(order: Order, onDelete: OrderListProps['onDelete']) {
  const confirmed =
    order.status === 'done' ||
    window.confirm(
      `Bestellung von „${order.user?.name ?? 'Unbekannt'}" wirklich löschen? Der Status ist noch „${STATUS_LABEL[order.status]}".`
    );
  if (confirmed) onDelete(order.id);
}

export default function OrderList({ orders, onUpdateStatus, onDelete }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border bg-white py-16 text-center text-sm text-gray-400">
        Keine Bestellungen vorhanden
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900">{order.user?.name ?? 'Unbekannt'}</p>
              <p className="text-xs text-gray-400">
                {new Date(order.created_at).toLocaleString('de-AT')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[order.status]}`}
              >
                {STATUS_LABEL[order.status]}
              </span>
              {order.status === 'open' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onUpdateStatus(order.id, 'in_progress')}
                >
                  In Bearbeitung
                </Button>
              )}
              {order.status === 'in_progress' && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onUpdateStatus(order.id, 'done')}
                >
                  Erledigt
                </Button>
              )}
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(order, onDelete)}
              >
                Löschen
              </Button>
            </div>
          </div>

          {order.items && order.items.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-400">
                  <th className="pb-1.5 font-medium">Produkt</th>
                  <th className="pb-1.5 text-right font-medium">Menge</th>
                  <th className="pb-1.5 text-right font-medium">Preis</th>
                  <th className="pb-1.5 text-right font-medium">Summe</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-1.5 text-gray-700">
                      {item.product?.name ?? `Produkt #${item.product_id.slice(0, 6)}`}
                    </td>
                    <td className="py-1.5 text-right text-gray-600">{item.quantity}</td>
                    <td className="py-1.5 text-right text-gray-600">
                      {item.price_at_order.toFixed(2)} €
                    </td>
                    <td className="py-1.5 text-right font-medium text-gray-900">
                      {(item.price_at_order * item.quantity).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-2 text-right text-xs font-semibold text-gray-500">
                    Gesamt
                  </td>
                  <td className="pt-2 text-right font-bold text-gray-900">
                    {order.items
                      .reduce((s, i) => s + i.price_at_order * i.quantity, 0)
                      .toFixed(2)}{' '}
                    €
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
