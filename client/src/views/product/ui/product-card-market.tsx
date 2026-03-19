'use client';

import { Product } from '@/src/entities/product/types/product.types';
import { Link } from '@/src/i18n/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

type ProductWithId = Product & { _id?: string };
type LocaleKey = keyof Product['name'];

export type ProductCardAddToCartProps = {
  onAddToCart?: (product: ProductWithId) => void;
};



export default function ProductMarketCard({
  product,
}: { product: ProductWithId } & ProductCardAddToCartProps) {
  const locale = useLocale() as LocaleKey;
  const displayName = product.name[locale] ?? product.name.en;

  return (
    <article className="w-full group">
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative aspect-3/5 w-full overflow-hidden rounded-sm bg-neutral-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={displayName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transition-all duration-500 group-hover:scale-105 group-hover:blur-sm"
            />
          ) : (
            <div className="w-full h-full bg-neutral-200" />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm" />

          {/* Product name overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="text-sm font-medium text-white uppercase tracking-widest text-center px-4 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              {displayName}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
