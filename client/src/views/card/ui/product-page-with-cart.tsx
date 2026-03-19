'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

import { useCartStore } from '../model/card.store';
import type { Product } from '@/src/entities/product/types/product.types';
import ProductPage from '../../product/ui/product-page';

type ProductWithId = Product & { _id?: string };

type ProductPageWithCartProps = {
  productId: string;
};

export function ProductPageWithCart({ productId }: ProductPageWithCartProps) {
  const t = useTranslations('cart');
  const addItem = useCartStore((s) => s.addItem);

  const onAddToCart = useCallback(
    async (product: ProductWithId, quantity: number) => {
      await addItem(product, quantity);
      toast.success(t('addedToCart'));
    },
    [addItem, t]
  );

  return <ProductPage productId={productId} onAddToCart={onAddToCart} />;
}
