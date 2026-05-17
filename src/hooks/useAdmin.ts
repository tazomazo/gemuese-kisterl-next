'use client';

import { useState } from 'react';
import { Product, Category } from '@/types';

export function useAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Products ---
  const createProduct = async (
    data: Omit<Product, 'id' | 'created_at' | 'category'>
  ): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        setError((await res.json()).error || 'Fehler beim Erstellen');
        return null;
      }
      return res.json();
    } catch {
      setError('Netzwerkfehler');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    id: string,
    data: Partial<Omit<Product, 'id' | 'created_at' | 'category'>>
  ): Promise<Product | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        setError((await res.json()).error || 'Fehler beim Aktualisieren');
        return null;
      }
      return res.json();
    } catch {
      setError('Netzwerkfehler');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setError((await res.json()).error || 'Fehler beim Löschen');
        return false;
      }
      return true;
    } catch {
      setError('Netzwerkfehler');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Categories ---
  const createCategory = async (name: string): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        setError((await res.json()).error || 'Fehler beim Erstellen');
        return null;
      }
      return res.json();
    } catch {
      setError('Netzwerkfehler');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, name: string): Promise<Category | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        setError((await res.json()).error || 'Fehler beim Aktualisieren');
        return null;
      }
      return res.json();
    } catch {
      setError('Netzwerkfehler');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setError((await res.json()).error || 'Fehler beim Löschen');
        return false;
      }
      return true;
    } catch {
      setError('Netzwerkfehler');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // --- Excel Import ---
  const importProducts = async (
    rows: Omit<Product, 'id' | 'created_at' | 'category'>[]
  ): Promise<{ imported: number; errors: string[] } | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: rows }),
      });
      if (!res.ok) {
        setError((await res.json()).error || 'Import fehlgeschlagen');
        return null;
      }
      return res.json();
    } catch {
      setError('Netzwerkfehler');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    updateCategory,
    deleteCategory,
    importProducts,
  };
}
