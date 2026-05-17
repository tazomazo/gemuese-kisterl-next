'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user !== undefined && !isAdmin) {
      router.replace('/');
    }
  }, [user, isAdmin, router]);

  if (!isAdmin) return null;

  const navItem = (href: string, label: string) => (
    <Link
      href={href}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        pathname === href
          ? 'bg-brand-100 text-brand-800'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <span className="text-lg font-bold text-gray-900">Admin</span>
        <span className="text-gray-300">|</span>
        <nav className="flex gap-1">
          {navItem('/admin', 'Übersicht')}
          {navItem('/admin/products', 'Produkte')}
          {navItem('/admin/categories', 'Kategorien')}
          {navItem('/admin/orders', 'Bestellungen')}
        </nav>
      </div>
      {children}
    </div>
  );
}
