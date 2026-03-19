'use client';

import { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useCategoryStore } from '@/src/entities/categories/model/categories.store';
import { categorySchema, CategoryForm } from '@/src/entities/categories/model/category.schema';
import { Category } from '@/src/entities/categories/types/categories.type';
import CloudinaryUploadWidget from '@/src/widgets/cloudinary/cloudinary-upload-widget';
import { useModal } from '@/src/shared/hooks/use-modal';
import { Pencil, Plus } from 'lucide-react';

type Props = {
  category?: Category;
  onSuccess?: () => void;
};

export default function AddCategoryForm({ category, onSuccess }: Props) {
  const isEditing = !!category;
  const modalId = isEditing ? `edit-category-${category._id}` : 'create-category';

  const { isOpen, onOpen, onClose } = useModal(modalId);
  const { createCategory, updateCategory, isLoading } = useCategoryStore();
  const isCloudinaryOpen = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: { en: '', az: '', ru: '' },
      image: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: {
          en: category?.name.en ?? '',
          az: category?.name.az ?? '',
          ru: category?.name.ru ?? '',
        },
        image: category?.image ?? '',
      });
    }
  }, [isOpen, category, reset]);

  const onSubmit = async (data: CategoryForm) => {
    let success = false;

    if (isEditing && category._id) {
      const result = await updateCategory(category._id, data);
      success = !!result;
    } else {
      const result = await createCategory(data);
      success = !!result;
    }

    if (success) {
      if (!isEditing) {
        reset({ name: { en: '', az: '', ru: '' }, image: '' });
      }
      onClose();
      onSuccess?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? onOpen() : onClose())} modal={false}>
      <DialogTrigger asChild className="rounded-none">
        {isEditing ? (
          <Button size="icon-sm" variant="outline" title="Edit category">
            <Pencil />
          </Button>
        ) : (
          <Button variant="outline" className="flex items-center gap-2">
            <Plus className="w-3.5 h-3.5" strokeWidth={1.8} />
            Add Category
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        // Only block outside-interaction close while the Cloudinary overlay is active.
        // This keeps the dialog open during upload without blocking Cloudinary's own buttons.
        onInteractOutside={(e) => {
          if (isCloudinaryOpen.current) e.preventDefault();
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Category' : 'New Category'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update the category details below.'
                : 'Fill in the details to create a new category.'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <FieldGroup>
              <Field>
                <Label htmlFor="name-en">Name (EN)</Label>
                <Input
                  id="name-en"
                  placeholder="e.g. Clothing"
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
                  placeholder="e.g. Geyim"
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
                  placeholder="e.g. Одежда"
                  aria-invalid={!!errors.name?.ru}
                  {...register('name.ru')}
                />
                {errors.name?.ru && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.ru.message}</p>
                )}
              </Field>

              <Field>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <CloudinaryUploadWidget
                      currentImage={field.value}
                      onUpload={(url) => setValue('image', url, { shouldValidate: true })}
                      onWidgetOpenChange={(open) => { isCloudinaryOpen.current = open; }}
                      error={errors.image?.message}
                    />
                  )}
                />
              </Field>
            </FieldGroup>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditing ? 'Saving…' : 'Creating…'}
                </span>
              ) : isEditing ? (
                'Save Changes'
              ) : (
                'Create Category'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
