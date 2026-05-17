'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useAuthContext } from '@/context/AuthContext';
import CartItemComponent from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { items, totalItems, totalPrice, placeOrder, ordering, orderError, orderSuccess, setOrderSuccess } =
    useCart();
  const { user } = useAuthContext();

  if (orderSuccess) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <span className="text-5xl">🎉</span>
        <h2 className="text-xl font-bold text-gray-900">Bestellung eingegangen!</h2>
        <p className="text-sm text-gray-500">Vielen Dank, deine Bestellung wurde aufgenommen.</p>
        <div className="flex gap-3">
          <Button onClick={() => setOrderSuccess(false)} variant="secondary">
            Neuer Warenkorb
          </Button>
          <Link href="/">
            <Button>Weiter einkaufen</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <span className="text-5xl">🛒</span>
        <h2 className="text-xl font-semibold text-gray-700">Dein Warenkorb ist leer</h2>
        <Link href="/">
          <Button>Jetzt einkaufen</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Warenkorb ({totalItems})</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Item list */}
        <div className="flex flex-col gap-3 lg:col-span-2">
          {items.map((item) => (
            <CartItemComponent key={item.product.id} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          {!user && (
            <div className="mb-4 rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
              Bitte{' '}
              <Link href="/login" className="font-medium underline">
                anmelden
              </Link>{' '}
              um zu bestellen.
            </div>
          )}
          {orderError && (
            <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{orderError}</p>
          )}
          <CartSummary
            totalPrice={totalPrice}
            totalItems={totalItems}
            onOrder={placeOrder}
            ordering={ordering}
            disabled={!user}
          />
        </div>
      </div>
    </div>
  );
}
