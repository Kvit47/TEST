'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  FolderOpen,
  Layers,
  Tag,
  Trash2,
} from 'lucide-react';

import { useCategoryStore } from '@/src/entities/categories/model/categories.store';
import { useSubcategoryStore } from '@/src/entities/subcategories/model/subcategories.store';
import AddCategoryForm from '@/src/entities/categories/ui/add-category-form';
import AddSubcategoryForm from '@/src/entities/subcategories/ui/add-subcategory-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const LANG_BADGE: Record<string, string> = {
  AZ: 'bg-blue-50 text-blue-700 border-blue-100',
  EN: 'bg-green-50 text-green-700 border-green-100',
  RU: 'bg-purple-50 text-purple-700 border-purple-100',
};

export default function CategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const { categories, isLoading: catLoading, fetchCategories } = useCategoryStore();
  const {
    subcategories,
    isLoading: subLoading,
    error: subError,
    fetchSubcategories,
    deleteSubcategory,
  } = useSubcategoryStore();

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories(categoryId);
  }, [fetchCategories, fetchSubcategories, categoryId]);

  const category = categories.find((c) => c._id === categoryId);

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return;
    setDeletingId(pendingDeleteId);
    setPendingDeleteId(null);
    await deleteSubcategory(pendingDeleteId);
    setDeletingId(null);
  };

  /* ─── Loading state ─── */
  if (catLoading && !category) {
    return (
      <div className="container mx-auto px-8 py-8">
        <div className="mt-16 animate-pulse space-y-6">
          <div className="h-56 rounded-xl bg-gray-100" />
          <div className="h-8 w-48 rounded bg-gray-100" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg border border-gray-200 bg-gray-50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Not found ─── */
  if (!category) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-8 py-32 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <FolderOpen className="h-9 w-9 text-gray-400" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Category not found</h2>
        <p className="mb-6 text-gray-500">
          This category doesn&apos;t exist or has been removed.
        </p>
        <Link href="/admin/categories">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto min-h-screen bg-white px-8 py-8">
      {/* ── Breadcrumb ── */}
      <nav className="mt-16 mb-6 flex items-center gap-1.5 text-sm text-gray-500">
        <Link href="/admin/categories" className="hover:text-gray-900 transition-colors">
          Categories
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-gray-900">{category.name.en}</span>
      </nav>

      {/* ── Hero banner ── */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-gray-200">
        {/* Background image / fallback */}
        <div className="relative h-52 bg-gray-50">
          {category.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={category.image}
              alt={category.name.en}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Tag className="h-14 w-14 text-gray-200" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Category info overlay */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
          <div>
            <h1 className="text-3xl font-serif font-semibold text-white drop-shadow">
              {category.name.en}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              {(
                [
                  { code: 'AZ', value: category.name.az },
                  { code: 'RU', value: category.name.ru },
                ] as const
              ).map(({ code, value }) => (
                <span
                  key={code}
                  className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                >
                  {code}: {value}
                </span>
              ))}
            </div>
          </div>

          {/* Edit category button */}
          <div className="shrink-0">
            <AddCategoryForm category={category} />
          </div>
        </div>
      </div>

      {/* ── Subcategories header ── */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif">Subcategories</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            All subcategories belonging to <strong>{category.name.en}</strong>.
          </p>
        </div>
        <AddSubcategoryForm
          defaultCategoryId={categoryId}
          onSuccess={() => fetchSubcategories(categoryId)}
        />
      </div>

      {/* ── Stats pill ── */}
      {subcategories.length > 0 && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <Layers className="h-4 w-4 text-indigo-500" />
          <span className="text-sm text-gray-600">
            <strong className="text-gray-900">{subcategories.length}</strong>{' '}
            {subcategories.length === 1 ? 'subcategory' : 'subcategories'} in this category
          </span>
        </div>
      )}

      {/* ── Error ── */}
      {subError && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{subError}</p>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {subLoading && subcategories.length === 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-3"
            >
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!subLoading && subcategories.length === 0 && !subError && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-20 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm">
            <Layers className="h-7 w-7 text-gray-400" />
          </div>
          <h3 className="mb-1.5 text-lg font-semibold text-gray-900">No subcategories yet</h3>
          <p className="mb-6 max-w-xs text-sm text-gray-500">
            Add subcategories to organise products inside{' '}
            <strong>{category.name.en}</strong>.
          </p>
          <AddSubcategoryForm
            defaultCategoryId={categoryId}
            onSuccess={() => fetchSubcategories(categoryId)}
          />
        </div>
      )}

      {/* ── Subcategories grid ── */}
      {subcategories.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((sub) => (
            <div
              key={sub._id}
              className="group flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Names */}
              <div className="mb-4">
                <p className="mb-3 truncate text-base font-semibold text-gray-900">
                  {sub.name.en}
                </p>
                <ul className="space-y-1.5">
                  {(
                    [
                      { code: 'AZ', value: sub.name.az },
                      { code: 'EN', value: sub.name.en },
                      { code: 'RU', value: sub.name.ru },
                    ] as const
                  ).map(({ code, value }) => (
                    <li key={code} className="flex items-center gap-2.5">
                      <span
                        className={`inline-flex w-8 shrink-0 items-center justify-center rounded border px-1 py-0.5 text-xs font-semibold ${LANG_BADGE[code]}`}
                      >
                        {code}
                      </span>
                      <span className="truncate text-sm text-gray-600">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="font-mono text-xs text-gray-400">
                  #{sub._id?.slice(-8)}
                </span>
                <div className="flex items-center gap-2">
                  <AddSubcategoryForm
                    subcategory={sub}
                    onSuccess={() => fetchSubcategories(categoryId)}
                  />
                  <Button
                    size="icon-sm"
                    variant="outline"
                    className="hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    onClick={() => sub._id && setPendingDeleteId(sub._id)}
                    disabled={deletingId === sub._id}
                    title="Delete subcategory"
                  >
                    {deletingId === sub._id ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
      >
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader>
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle>Delete subcategory?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The subcategory will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={!!deletingId}
            >
              {deletingId ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting…
                </span>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
