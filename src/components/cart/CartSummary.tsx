'use client';

import Button from '@/components/ui/Button';
import { Order } from '@/types';

interface CartSummaryProps {
  totalPrice: number;
  totalItems: number;
  onPublish: () => void;
  publishing: boolean;
  isDirty: boolean;
  isLocked: boolean;
  orderStatus?: Order['status'];
  userLoggedIn: boolean;
}

const STATUS_LABEL: Record<NonNullable<Order['status']>, string> = {
  open: 'Veröffentlicht',
  in_progress: 'In Bearbeitung',
  done: 'Erledigt',
};

const STATUS_STYLE: Record<NonNullable<Order['status']>, string> = {
  open: 'bg-green-50 text-green-700',
  in_progress: 'bg-blue-50 text-blue-700',
  done: 'bg-gray-100 text-gray-600',
};

export default function CartSummary({
  totalPrice,
  totalItems,
  onPublish,
  publishing,
  isDirty,
  isLocked,
  orderStatus,
  userLoggedIn,
}: CartSummaryProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Zusammenfassung</h2>

      <div className="mb-2 flex justify-between text-sm text-gray-600">
        <span>Artikel</span>
        <span>{totalItems}</span>
      </div>
      <div className="mb-4 flex justify-between border-t pt-3 text-base font-semibold text-gray-900">
        <span>Gesamt</span>
        <span>{totalPrice.toFixed(2)} €</span>
      </div>

      {orderStatus && (
        <div
          className={`mb-4 flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${STATUS_STYLE[orderStatus]}`}
        >
          <span>Status</span>
          <span>{STATUS_LABEL[orderStatus]}</span>
        </div>
      )}

      {isLocked ? (
        <div className="rounded-lg bg-blue-50 px-3 py-2 text-center text-sm text-blue-700">
          Deine Bestellung wird gerade bearbeitet.
        </div>
      ) : (
        <>
          <Button
            onClick={onPublish}
            loading={publishing}
            disabled={!userLoggedIn || !isDirty}
            className="w-full"
            size="lg"
          >
            {orderStatus === 'open' ? 'Änderungen veröffentlichen' : 'Veröffentlichen'}
          </Button>
          {!userLoggedIn && (
            <p className="mt-2 text-center text-xs text-gray-400">
              Anmelden um zu veröffentlichen
            </p>
          )}
          {userLoggedIn && !isDirty && orderStatus === 'open' && (
            <p className="mt-2 text-center text-xs text-gray-400">
              Keine ungespeicherten Änderungen
            </p>
          )}
        </>
      )}
    </div>
  );
}
