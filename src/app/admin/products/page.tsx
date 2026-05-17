'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useAdmin } from '@/hooks/useAdmin';
import { Product } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ProductForm from '@/components/admin/ProductForm';
import ExcelImport from '@/components/admin/ExcelImport';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminProductsPage() {
  const { allProducts, loading, refetch } = useProducts();
  const { categories } = useCategories();
  const { createProduct, updateProduct, deleteProduct, importProducts, loading: saving } = useAdmin();

  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);

  const handleCreate = async (data: Omit<Product, 'id' | 'created_at' | 'category'>) => {
    const result = await createProduct(data);
    if (result) { setShowCreate(false); refetch(); }
  };

  const handleUpdate = async (data: Omit<Product, 'id' | 'created_at' | 'category'>) => {
    if (!editProduct) return;
    const result = await updateProduct(editProduct.id, data);
    if (result) { setEditProduct(null); refetch(); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const ok = await deleteProduct(deleteId);
    if (ok) { setDeleteId(null); refetch(); }
  };

  const handleImport = async (rows: Omit<Product, 'id' | 'created_at' | 'category'>[]) => {
    const result = await importProducts(rows);
    if (result) refetch();
    return result;
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Produkte ({allProducts.length})</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowImport(true)}>
            Excel importieren
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            + Produkt
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Kategorie</th>
                <th className="px-4 py-3 text-right font-medium">Preis</th>
                <th className="px-4 py-3 text-left font-medium">Einheit</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {allProducts.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{p.price.toFixed(2)} €</td>
                  <td className="px-4 py-3 text-gray-500">{p.unit}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.available
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {p.available ? 'Verfügbar' : 'Nicht verfügbar'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditProduct(p)}
                      className="mr-2 text-xs text-brand-600 hover:underline"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))}
              {allProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    Noch keine Produkte vorhanden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Neues Produkt">
        <ProductForm
          categories={categories}
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={saving}
        />
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editProduct} onClose={() => setEditProduct(null)} title="Produkt bearbeiten">
        <ProductForm
          initial={editProduct}
          categories={categories}
          onSubmit={handleUpdate}
          onCancel={() => setEditProduct(null)}
          loading={saving}
        />
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Produkt löschen"
        message="Möchtest du dieses Produkt wirklich löschen? Dies kann nicht rückgängig gemacht werden."
        loading={saving}
      />

      {/* Excel Import modal */}
      <Modal
        open={showImport}
        onClose={() => setShowImport(false)}
        title="Produkte importieren"
        maxWidth="max-w-2xl"
      >
        <ExcelImport categories={categories} onImport={handleImport} />
      </Modal>
    </div>
  );
}
