'use client';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useCategoryStore } from '@/src/entities/categories/model/categories.store';
import AddCategoryForm from '@/src/entities/categories/ui/add-category-form';
import AddSubcategoryForm from '@/src/entities/subcategories/ui/add-subcategory-form';
import { AlertCircle, FolderOpen, Tag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import AdminHeader from './admin-header';

export default function CategoriesManager() {
    const { categories, isLoading, error, fetchCategories, deleteCategory } = useCategoryStore();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDeleteConfirm = async () => {
        if (!pendingDeleteId) return;
        setDeletingId(pendingDeleteId);
        setPendingDeleteId(null);
        await deleteCategory(pendingDeleteId);
        setDeletingId(null);
    };

    return (
        <>
            <AdminHeader title="Categories" />
            <div className=" mx-auto min-h-screen bg-white px-8 py-8">



                {/* Stats bar */}
                {categories.length > 0 && (
                    <div className="mb-6 flex items-center justify-between gap-3 rounded-sm border border-gray-200 bg-gray-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-gray-600">
                                <strong className="text-gray-900">{categories.length}</strong>{' '}
                                {categories.length === 1 ? 'category' : 'categories'} total
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <AddCategoryForm />
                            <AddSubcategoryForm />
                        </div>
                    </div>
                )}

                {/* Error banner */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Loading skeleton */}
                {isLoading && categories.length === 0 && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse overflow-hidden rounded-lg border border-gray-200"
                            >
                                <div className="h-48 bg-gray-100" />
                                <div className="space-y-3 p-5">
                                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                                    <div className="h-3 w-2/3 rounded bg-gray-100" />
                                </div>
                                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3">
                                    <div className="h-3 w-20 rounded bg-gray-100" />
                                    <div className="flex gap-2">
                                        <div className="h-7 w-14 rounded bg-gray-100" />
                                        <div className="h-7 w-16 rounded bg-gray-100" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && categories.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center py-28 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                            <Tag className="h-9 w-9 text-gray-400" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-gray-900">No categories yet</h3>
                        <p className="mb-6 max-w-xs text-gray-500">
                            Create your first category to start organizing your products.
                        </p>
                        <AddCategoryForm />
                    </div>
                )}

                {/* Categories grid */}
                {categories.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <div
                                key={category._id}
                                className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Thumbnail + Names — clickable area */}
                                <Link href={`/admin/categories/${category._id}`} className="flex flex-col flex-1">
                                    {/* Thumbnail */}
                                    <div className="relative h-48 overflow-hidden bg-gray-50">
                                        {category.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={category.image}
                                                alt={category.name.en}
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                                                <Tag className="h-10 w-10 text-gray-300" />
                                                <span className="text-xs text-gray-400">No image</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Names */}
                                    <div className="flex-1 p-5">
                                        <h3 className="mb-3 truncate text-lg font-semibold text-gray-900">
                                            {category.name.en}
                                        </h3>
                                        <ul className="space-y-1.5">
                                            {(
                                                [
                                                    { code: 'AZ', value: category.name.az, colors: 'bg-blue-50 text-blue-700 border-blue-100' },
                                                    { code: 'EN', value: category.name.en, colors: 'bg-green-50 text-green-700 border-green-100' },
                                                    { code: 'RU', value: category.name.ru, colors: 'bg-purple-50 text-purple-700 border-purple-100' },
                                                ] as const
                                            ).map(({ code, value, colors }) => (
                                                <li key={code} className="flex items-center gap-2.5">
                                                    <span
                                                        className={`inline-flex w-8 shrink-0 items-center justify-center rounded border px-1 py-0.5 text-xs font-semibold ${colors}`}
                                                    >
                                                        {code}
                                                    </span>
                                                    <span className="truncate text-sm text-gray-600">{value}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </Link>

                                {/* Footer actions — outside the Link to prevent navigation */}
                                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-5 py-3">
                                    <span className="font-mono text-xs text-gray-400">
                                        #{category._id.slice(-8)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <AddCategoryForm category={category} />
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-7 gap-1 px-2.5 text-xs hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                                            onClick={() => setPendingDeleteId(category._id)}
                                            disabled={deletingId === category._id}
                                        >
                                            {deletingId === category._id ? (
                                                <span className="flex items-center gap-1.5">
                                                    <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    Deleting…
                                                </span>
                                            ) : (
                                                <>
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Delete confirmation dialog */}
                <Dialog open={!!pendingDeleteId} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
                    <DialogContent showCloseButton={false} className="max-w-sm">
                        <DialogHeader>
                            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-red-100">
                                <Trash2 className="h-5 w-5 text-red-600" />
                            </div>
                            <DialogTitle>Delete category?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. The category will be permanently removed.
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
        </>
    );
}
