'use client';

import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useAdmin } from '@/hooks/useAdmin';
import { Category } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import CategoryForm from '@/components/admin/CategoryForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminCategoriesPage() {
  const { categories, loading, refetch } = useCategories();
  const { createCategory, updateCategory, deleteCategory, loading: saving } = useAdmin();

  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleCreate = async (name: string) => {
    const result = await createCategory(name);
    if (result) { setShowCreate(false); refetch(); }
  };

  const handleUpdate = async (name: string) => {
    if (!editCategory) return;
    const result = await updateCategory(editCategory.id, name);
    if (result) { setEditCategory(null); refetch(); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const ok = await deleteCategory(deleteId);
    if (ok) { setDeleteId(null); refetch(); }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Kategorien ({categories.length})</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          + Kategorie
        </Button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm"
            >
              <span className="font-medium text-gray-900">{cat.name}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setEditCategory(cat)}
                  className="text-xs text-brand-600 hover:underline"
                >
                  Umbenennen
                </button>
                <button
                  onClick={() => setDeleteId(cat.id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="col-span-3 py-12 text-center text-sm text-gray-400">
              Noch keine Kategorien vorhanden
            </p>
          )}
        </div>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Neue Kategorie" maxWidth="max-w-sm">
        <CategoryForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} loading={saving} />
      </Modal>

      <Modal open={!!editCategory} onClose={() => setEditCategory(null)} title="Kategorie umbenennen" maxWidth="max-w-sm">
        <CategoryForm
          initial={editCategory}
          onSubmit={handleUpdate}
          onCancel={() => setEditCategory(null)}
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Kategorie löschen"
        message="Die Kategorie wird gelöscht. Produkte in dieser Kategorie bleiben erhalten, verlieren aber ihre Kategorie-Zuordnung."
        loading={saving}
      />
    </div>
  );
}
