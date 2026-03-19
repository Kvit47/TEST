'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Pencil, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useSubcategoryStore } from '@/src/entities/subcategories/model/subcategories.store';
import { subcategorySchema, SubcategoryForm } from '@/src/entities/subcategories/model/subcategory.schema';
import { useCategoryStore } from '@/src/entities/categories/model/categories.store';
import { Subcategory } from '@/src/entities/subcategories/types/subcategories.types';
import { useModal } from '@/src/shared/hooks/use-modal';

type Props = {
  subcategory?: Subcategory & { _id?: string };
  defaultCategoryId?: string;
  onSuccess?: () => void;
};

export default function AddSubcategoryForm({ subcategory, defaultCategoryId, onSuccess }: Props) {
  const isEditing = !!subcategory;
  const modalId = isEditing ? `edit-subcategory-${subcategory._id}` : 'create-subcategory';

  const { isOpen, onOpen, onClose } = useModal(modalId);
  const { createSubcategory, updateSubcategory, isLoading } = useSubcategoryStore();
  const { categories, fetchCategories, isLoading: categoriesLoading } = useCategoryStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubcategoryForm>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: {
      name: { en: '', az: '', ru: '' },
      category: defaultCategoryId ?? '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      reset({
        name: {
          en: subcategory?.name.en ?? '',
          az: subcategory?.name.az ?? '',
          ru: subcategory?.name.ru ?? '',
        },
        category: subcategory?.categoryId ?? defaultCategoryId ?? '',
      });
    }
  }, [isOpen, subcategory, defaultCategoryId, reset, fetchCategories]);

  const onSubmit = async (data: SubcategoryForm) => {
    const payload = {
      name: data.name,
      categoryId: data.category,
    };

    let success = false;

    if (isEditing && subcategory._id) {
      const result = await updateSubcategory(subcategory._id, payload);
      success = !!result;
    } else {
      const result = await createSubcategory(payload);
      success = !!result;
    }

    if (success) {
      if (!isEditing) {
        reset({ name: { en: '', az: '', ru: '' }, category: defaultCategoryId ?? '' });
      }
      onClose();
      onSuccess?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? onOpen() : onClose())}>
      <DialogTrigger asChild className="rounded-none">
        {isEditing ? (
          <Button size="icon-sm" variant="outline" title="Edit subcategory">
            <Pencil />
          </Button>
        ) : (
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" strokeWidth={1.8} />
            Add Subcategory
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Subcategory' : 'New Subcategory'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update the subcategory details below.'
                : 'Select a parent category and fill in the names to create a new subcategory.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <FieldGroup>
              {/* Category selector */}
              <Field>
                <Label htmlFor="category">Parent Category</Label>
                <div className="relative">
                  <select
                    id="category"
                    className="w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-9 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500"
                    aria-invalid={!!errors.category}
                    disabled={categoriesLoading}
                    {...register('category')}
                  >
                    <option value="" disabled>
                      {categoriesLoading ? 'Loading categories…' : 'Select a category'}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name.en}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
                )}
              </Field>

              <div className="my-1 border-t border-border" />

              {/* Name fields */}
              <Field>
                <Label htmlFor="name-en">Name (EN)</Label>
                <Input
                  id="name-en"
                  placeholder="e.g. T-Shirts"
                  aria-invalid={!!errors.name?.en}
                  {...register('name.en')}
                />
                {errors.name?.en && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.en.message}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="name-az">Name (AZ)</Label>
                <Input
                  id="name-az"
                  placeholder="e.g. Futbolkalar"
                  aria-invalid={!!errors.name?.az}
                  {...register('name.az')}
                />
                {errors.name?.az && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.az.message}</p>
                )}
              </Field>

              <Field>
                <Label htmlFor="name-ru">Name (RU)</Label>
                <Input
                  id="name-ru"
                  placeholder="e.g. Футболки"
                  aria-invalid={!!errors.name?.ru}
                  {...register('name.ru')}
                />
                {errors.name?.ru && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.ru.message}</p>
                )}
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || categoriesLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditing ? 'Saving…' : 'Creating…'}
                </span>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Subcategory'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
