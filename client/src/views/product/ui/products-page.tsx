'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useProductStore } from '@/src/entities/product/model/product.store';
import { useCartStore } from '@/src/views/card/model/card.store';
import { useCategoryStore } from '@/src/entities/categories/model/categories.store';
import { useSubcategoryStore } from '@/src/entities/subcategories/model/subcategories.store';
import ProductCard from './product-card';
import { isAdmin } from '@/src/entities/user/lib/auth.utils';
import useAuthStore from '@/src/entities/user/model/auth.store';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSelectedProductStore } from '@/src/entities/product/model/selected-product';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'newest';

const SORT_LABELS: Record<SortOption, string> = {
  default: 'Default',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  newest: 'Newest',
};

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function ProductsPage() {
  const { user } = useAuthStore();

  const locale = useLocale() as 'az' | 'en' | 'ru';
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const { categories, fetchCategories } = useCategoryStore();
  const { subcategories, fetchSubcategories } = useSubcategoryStore();
  const { selectedCategory, selectedSubCategory, setSelectedCategory, setSelectedSubCategory } = useSelectedProductStore();

  const activeCategory = selectedCategory ?? 'default';
  const activeSubcategory = selectedSubCategory ?? null;

  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>('default');
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Fetch subcategories when a category is already selected (e.g. page re-mount)
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Recomputed whenever shuffleKey increments (user switches to Default) or products load
  const shuffledProducts = useMemo(
    () => (products.length > 0 ? shuffleArray(products) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shuffleKey, products.length]
  );

  const handleCategorySelect = useCallback(
    (catId: string) => {
      if (catId === 'default') {
        setShuffleKey((k) => k + 1);
        setSelectedCategory(null);
      } else {
        fetchSubcategories(catId);
        setSelectedCategory(catId);
      }
      setSelectedSubCategory(null);
    },
    [fetchSubcategories, setSelectedCategory, setSelectedSubCategory]
  );

  const handleSubcategorySelect = useCallback((subId: string) => {
    setSelectedSubCategory(activeSubcategory === subId ? null : subId);
  }, [activeSubcategory, setSelectedSubCategory]);

  const onAddToCart = useCallback(
    async (product: Parameters<typeof addItem>[0]) => {
      await addItem(product, 1);
    },
    [addItem]
  );

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'default') return shuffledProducts;

    if (activeSubcategory) {
      return products.filter((p) => p.subcategoryId === activeSubcategory);
    }

    const subcatIds = new Set(subcategories.map((s) => s._id));
    return products.filter((p) => subcatIds.has(p.subcategoryId));
  }, [activeCategory, activeSubcategory, products, shuffledProducts, subcategories]);

  const sortedProducts = useMemo(() => {
    const base = [...filteredProducts];
    if (sort === 'price-asc') return base.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return base.sort((a, b) => b.price - a.price);
    if (sort === 'newest')
      return base.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return base;
  }, [filteredProducts, sort]);

  const showSubcategories =
    activeCategory !== 'default' && subcategories.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-neutral-200">
        {/* Row 1: left spacer | category tabs | filter */}
        <div className="w-full px-3 h-12 flex items-center justify-between gap-2">
          {/* Center: category pills */}
          <div className="flex-1 flex items-center overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => handleCategorySelect('default')}
              className={`shrink-0 px-3 py-1 text-xs font-semibold tracking-widest uppercase transition-colors whitespace-nowrap ${activeCategory === 'default'
                ? 'text-black border-b-2 border-black'
                : 'text-neutral-400 hover:text-neutral-700'
                }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => handleCategorySelect(cat._id!)}
                className={`shrink-0 px-3 py-1 text-xs font-semibold tracking-widest uppercase transition-colors whitespace-nowrap ${activeCategory === cat._id
                  ? 'text-black border-b-2 border-black'
                  : 'text-neutral-400 hover:text-neutral-700'
                  }`}
              >
                {cat.name[locale]}
              </button>
            ))}
          </div>

          {/* Right: sort */}
          <div className="w-24 shrink-0 flex justify-end relative gap-4">
            {isAdmin(user) ? (
              <Link href="/admin/products/add">
                <Button variant="outline" className="flex items-center gap-1.5 text-xs uppercase bg-black text-white px-3 hover:bg-black/80 hover:text-white rounded-none cursor-pointer">
                  <Plus className="w-3.5 h-3.5" strokeWidth={1.8} />
                  Add Product
                </Button>
              </Link>
            ) : null}
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-neutral-700 hover:text-black transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" strokeWidth={1.8} />
              FILTER
            </button>

            {sortOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-neutral-200 shadow-lg z-30">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSort(key);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-host-grotesk hover:bg-neutral-50 transition-colors ${sort === key ? 'font-bold text-black' : 'text-neutral-600'
                      }`}
                  >
                    {SORT_LABELS[key]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: subcategory chips */}
        {showSubcategories && (
          <div className="w-full px-3 h-9 flex items-center overflow-x-auto scrollbar-none gap-0 border-t border-neutral-100">
            {subcategories.map((sub) => (
              <button
                key={sub._id}
                type="button"
                onClick={() => handleSubcategorySelect(sub._id!)}
                className={`shrink-0 px-3 py-0.5 text-xs tracking-widest uppercase transition-colors whitespace-nowrap ${activeSubcategory === sub._id
                  ? 'text-black font-semibold border-b-2 border-black'
                  : 'text-neutral-400 hover:text-neutral-700 font-medium'
                  }`}
              >
                {sub.name[locale]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Close sort dropdown on outside click */}
      {sortOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setSortOpen(false)}
        />
      )}

      {/* Content */}
      <div className="w-full px-3 py-6">
        {isLoading && products.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col w-full animate-pulse">
                <div className="aspect-3/4 w-full bg-neutral-100" />
                <div className="mt-2 h-3 bg-neutral-100 rounded w-3/4" />
                <div className="mt-1 h-3 bg-neutral-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {!isLoading && !error && sortedProducts.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-neutral-400 tracking-widest uppercase">
              No products found
            </p>
          </div>
        )}

        {sortedProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
