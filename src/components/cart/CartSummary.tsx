'use client';

import Button from '@/components/ui/Button';

interface CartSummaryProps {
  totalPrice: number;
  totalItems: number;
  onOrder: () => void;
  ordering: boolean;
  disabled: boolean;
}

export default function CartSummary({
  totalPrice,
  totalItems,
  onOrder,
  ordering,
  disabled,
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

      <Button onClick={onOrder} loading={ordering} disabled={disabled} className="w-full" size="lg">
        Jetzt bestellen
      </Button>

      <p className="mt-3 text-center text-xs text-gray-400">
        Kein Checkout — Bestellung geht direkt ein
      </p>
    </div>
  );
}
