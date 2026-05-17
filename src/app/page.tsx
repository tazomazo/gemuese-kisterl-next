'use client';

import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductGrid from '@/components/products/ProductGrid';
import SearchBar from '@/components/products/SearchBar';
import CategoryFilter from '@/components/products/CategoryFilter';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProductsPage() {
  const { products, loading, error, search, setSearch, selectedCategory, setSelectedCategory } =
    useProducts();
  const { categories } = useCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Unsere Produkte</h1>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col gap-4">
        <SearchBar value={search} onChange={setSearch} />
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        )}
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner text="Produkte werden geladen…" />
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
