'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { useCartContext } from '@/context/CartContext';

export default function Header() {
  const { user, logout, isAdmin } = useAuthContext();
  const { totalItems } = useCartContext();
  const pathname = usePathname();

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors ${
        pathname === href ? 'text-brand-700' : 'text-gray-600 hover:text-brand-700'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-brand-700">
          <span className="text-2xl">🥦</span>
          Gemüsekisterl
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          {navLink('/', 'Produkte')}
          {isAdmin && navLink('/admin', 'Admin')}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-brand-700"
            aria-label="Warenkorb"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="text-sm font-medium text-gray-700 hover:text-brand-700"
              >
                {user.name}
              </Link>
              <button
                onClick={() => logout()}
                className="rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                Abmelden
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              Anmelden
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
