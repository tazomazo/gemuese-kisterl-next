'use client';

import Link from 'next/link';

const cards = [
  {
    href: '/admin/products',
    emoji: '🥕',
    title: 'Produkte',
    description: 'Produkte hinzufügen, bearbeiten, löschen und importieren',
  },
  {
    href: '/admin/categories',
    emoji: '📂',
    title: 'Kategorien',
    description: 'Produktkategorien verwalten und zuordnen',
  },
  {
    href: '/admin/orders',
    emoji: '📋',
    title: 'Bestellungen',
    description: 'Alle eingehenden Bestellungen einsehen und abwickeln',
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Admin-Bereich</h1>
      <p className="mb-8 text-sm text-gray-500">Verwalte Produkte, Kategorien und Bestellungen.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md hover:border-brand-200"
          >
            <span className="mb-3 text-3xl">{card.emoji}</span>
            <h2 className="font-semibold text-gray-900">{card.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
