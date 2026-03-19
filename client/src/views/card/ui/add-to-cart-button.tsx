'use client';

import { useTranslations, useLocale } from 'next-intl';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore } from '../model/card.store';
import type { Product } from '@/src/entities/product/types/product.types';

type ProductWithId = Product & { _id?: string };
type LocaleKey = keyof Product['name'];

type AddToCartButtonProps = {
  product: ProductWithId;
  quantity?: number;
  variant?: 'primary' | 'secondary';
  className?: string;
  children?: React.ReactNode;
};

export function AddToCartButton({
  product,
  quantity = 1,
  variant = 'primary',
  className = '',
  children,
}: AddToCartButtonProps) {
  const t = useTranslations('productPage');
  const tCart = useTranslations('cart');
  const locale = useLocale() as LocaleKey;
  const addItem = useCartStore((s) => s.addItem);
  const isSyncing = useCartStore((s) => s.isSyncing);

  const handleClick = async () => {
    const id = (product as { _id?: string })._id ?? (product as { id?: string }).id;
    if (!id) return;
    await addItem(product, quantity);

    const productName = product.name?.[locale] ?? product.name?.en ?? '';

    toast.custom(
      (toastInstance) => (
        <div
          className={`${
            toastInstance.visible ? 'animate-enter' : 'animate-leave'
          } flex items-center gap-3 bg-white border border-neutral-100 shadow-lg shadow-neutral-200/60 rounded-xl px-4 py-3 max-w-xs w-full font-host-grotesk`}
        >
          <div className="shrink-0 w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 font-host-grotesk leading-tight">
              {tCart('addedToCart')}
            </p>
            {productName && (
              <p className="text-xs text-neutral-400 truncate mt-0.5 font-host-grotesk">
                {productName}
              </p>
            )}
          </div>
        </div>
      ),
      { duration: 3000 }
    );
  };

  const baseClass =
    'inline-flex items-center justify-center gap-2 font-medium uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-60';
  const variantClass =
    variant === 'primary'
      ? 'w-full py-4 bg-neutral-900 text-white hover:bg-neutral-800'
      : 'w-full py-3 border border-neutral-300 text-neutral-900 hover:bg-neutral-50 focus:ring-neutral-400';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSyncing || !((product as { _id?: string })._id ?? (product as { id?: string }).id)}
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {children ?? (
        <>
          <ShoppingBag className="h-4 w-4" />
          {t('addToCart')}
        </>
      )}
    </button>
  );
}
