'use client';

import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Bookmark, Minus, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProductStore } from '@/src/entities/product/model/product.store';
import type { Product } from '@/src/entities/product/types/product.types';

type ProductWithId = Product & { _id?: string };
type LocaleKey = keyof Product['name'];

const accordionSections = [
  { key: 'details', label: 'DETTAGLI' },
  { key: 'sizeGuide', label: 'GUIDA TAGLIE' },
  { key: 'shipping', label: 'SPEDIZIONE' },
  { key: 'payment', label: 'PAGAMENTO' },
  { key: 'returns', label: 'RESO' },
] as const;

export type ProductPageAddToCartProps = {
  onAddToCart?: (product: ProductWithId, quantity: number) => void;
};

export default function ProductPage({
  productId,
  onAddToCart,
}: {
  productId: string;
} & ProductPageAddToCartProps) {
  const t = useTranslations('productPage');
  const locale = useLocale() as LocaleKey;

  const {
    selectedProduct,
    fetchProductById,
    isLoading,
    error,
    setProduct,
    wishlistedByProductId,
    toggleWishlisted,
    selectedColorIndexByProductId,
    setSelectedColorIndex,
    selectedSizeIndexByProductId,
    setSelectedSizeIndex,
    selectedImageIndex,
    setSelectedImageIndex,
    resetProductUI,
  } = useProductStore();

  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (productId) fetchProductById(productId);
    return () => {
      resetProductUI();
    };
  }, [productId, fetchProductById, resetProductUI]);

  useEffect(() => {
    if (selectedProduct && selectedProduct._id === productId) {
      setProduct(selectedProduct as ProductWithId);
    }
    return () => setProduct(null);
  }, [selectedProduct, productId, setProduct]);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current.querySelectorAll('.pp-reveal'),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out' }
      );
    },
    { dependencies: [selectedProduct?._id], scope: containerRef }
  );

  const product = useProductStore((s) => s.product) as ProductWithId | null;

  const id = product?._id ?? '';
  const wishlisted = wishlistedByProductId[id] ?? false;
  const selectedColorIndex = selectedColorIndexByProductId[id] ?? 0;
  const selectedSizeIndex = selectedSizeIndexByProductId[id] ?? 0;

  const displayName = product?.name?.[locale] ?? product?.name?.en ?? '';
  const description =
    (product?.description as Record<string, string>)?.[locale] ??
    (product?.description as Record<string, string>)?.en ??
    '';

  const uniqueColors = [...new Set((product?.variants ?? []).map((v) => v.color))];
  const colors = uniqueColors.length ? uniqueColors : [];
  const selectedColor = colors[selectedColorIndex] ?? colors[0];
  const availableSizes = [
    ...new Set(
      (product?.variants ?? [])
        .filter((v) => !selectedColor || v.color === selectedColor)
        .map((v) => v.size)
    ),
  ];
  const sizes = availableSizes.length
    ? availableSizes
    : (product?.variants ?? []).map((v) => v.size).filter(Boolean);

  const selectedVariant = (product?.variants ?? []).find(
    (v) => v.color === selectedColor && v.size === sizes[selectedSizeIndex]
  );
  const variantStock = selectedVariant?.stock ?? product?.quantity ?? 0;
  const inStock = variantStock > 0;

  const images = product?.images?.length
    ? product.images
    : product?.image
      ? [product.image]
      : [];
  const mainImage = images[selectedImageIndex] ?? product?.image ?? '';

  const handleThumbClick = useCallback(
    (index: number) => {
      if (index === selectedImageIndex) return;
      const prev = mainImageRef.current;
      if (prev) {
        gsap.fromTo(prev, { opacity: 0.4 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
      setSelectedImageIndex(index);
    },
    [selectedImageIndex, setSelectedImageIndex]
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', { minimumFractionDigits: 2 }).format(price);
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key));
  };

  const deliveryDates = useMemo(() => {
    const now = new Date();
    const from = new Date(now.getTime() + 0 * 24 * 60 * 60 * 1000);
    const to = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    return `${fmt(from)} – ${fmt(to)}`;
  }, []);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="h-8 w-8 rounded-full border border-neutral-900 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  const THUMB_W = 100;
  const THUMB_H = Math.round(THUMB_W * (4 / 3));
  const THUMB_GAP = 4;
  const VISIBLE_THUMBS = 3;
  const thumbContainerMaxH = VISIBLE_THUMBS * THUMB_H + (VISIBLE_THUMBS - 1) * THUMB_GAP;

  return (
    <div
      ref={containerRef}
      className="bg-white min-h-screen"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full px-2">
        {/* Left: gallery */}
        <div className="pp-reveal flex gap-1">
          {/* Thumbnail column — left of main image */}
          {images.length > 1 && (
            <div
              className="scrollbar-hide flex flex-col overflow-y-auto shrink-0"
              style={{
                width: THUMB_W,
                maxHeight: thumbContainerMaxH,
                gap: THUMB_GAP,
              }}
            >
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleThumbClick(index)}
                  className="relative overflow-hidden bg-[#f5f5f3] shrink-0 focus:outline-none transition-opacity"
                  style={{
                    width: THUMB_W,
                    height: THUMB_H,
                    opacity: index === selectedImageIndex ? 1 : 0.5,
                    outline:
                      index === selectedImageIndex
                        ? '1.5px solid #171717'
                        : '1.5px solid transparent',
                    outlineOffset: -1,
                  }}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="100px"
                    className="object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div
            ref={mainImageRef}
            className="relative flex-1 overflow-hidden bg-[#f5f5f3]"
            style={{ aspectRatio: '3/4' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0"
              >
                {mainImage && (
                  <Image
                    src={mainImage}
                    alt={displayName}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right: product info */}
        <div className="pp-reveal px-8 py-8 lg:px-12 lg:py-10 flex flex-col relative">
          {/* Breadcrumb + bookmark row */}
          <div className="flex items-start justify-between mb-6">
            <nav className="text-[10px] tracking-widest text-neutral-400 uppercase">
              <span>{t('home')}</span>
              <span className="mx-1.5">›</span>
              <span>{t('newIn')}</span>
              {displayName && (
                <>
                  <span className="mx-1.5">›</span>
                  <span className="text-neutral-600">{displayName.toUpperCase()}</span>
                </>
              )}
            </nav>
            <button
              type="button"
              onClick={() => toggleWishlisted(id)}
              className="text-neutral-500 hover:text-neutral-900 transition-colors focus:outline-none ml-4 mt-0.5 shrink-0"
              aria-label="Save to wishlist"
            >
              <Bookmark
                className="h-[18px] w-[18px]"
                fill={wishlisted ? 'currentColor' : 'none'}
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* Brand + Name */}
          <div className="mb-4">
            <p className="text-[11px] tracking-widest uppercase text-neutral-500 mb-1.5 font-medium">
              {product.subcategoryId ? 'Brand' : 'BRAND'}
            </p>
            <h1 className="font-michroma text-[22px] leading-tight tracking-wide text-neutral-900 uppercase">
              {displayName}
            </h1>
          </div>

          {/* Description text */}
          {description && (
            <p className="text-[13px] leading-relaxed text-neutral-600 mb-5 max-w-sm">
              {description}
            </p>
          )}

          {/* Price */}
          <div className="mb-1">
            <span className="text-[18px] font-medium tracking-wide text-neutral-900">
              {formatPrice(product.price)} {product.currency ?? 'AZN'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-5">{t('taxIncluded')}</p>

          {/* Color selector */}
          {colors.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] tracking-widest uppercase text-neutral-500 mb-3">
                {t('color')}
                {selectedColor && (
                  <span className="ml-2 text-neutral-800 normal-case tracking-normal text-[11px] font-medium">
                    — {selectedColor}
                  </span>
                )}
              </p>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color, index) => {
                  const isSelected = index === selectedColorIndex;
                  const isHex = /^#[0-9a-f]{3,6}$/i.test(color);
                  const bgColor = isHex ? color : color;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedColorIndex(id, index)}
                      className="focus:outline-none transition-all group relative"
                      aria-label={color}
                      title={color}
                    >
                      <span
                        className="block w-8 h-8 rounded-full transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: bgColor,
                          outline: isSelected ? '2px solid #171717' : '1.5px solid transparent',
                          outlineOffset: '3px',
                          boxShadow: '0 0 0 1px #d4d4d4',
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] tracking-widest uppercase text-neutral-500">
                  {t('size')}
                  {sizes[selectedSizeIndex] && (
                    <span className="ml-2 text-neutral-800 normal-case tracking-normal text-[11px] font-medium">
                      — {sizes[selectedSizeIndex]}
                    </span>
                  )}
                </p>
                <button
                  type="button"
                  className="text-[10px] tracking-widest uppercase text-neutral-500 underline underline-offset-2 hover:text-neutral-900 transition-colors focus:outline-none"
                >
                  {t('sizeChart')}
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size, index) => {
                  const isSelected = index === selectedSizeIndex;
                  const sizeVariant = (product?.variants ?? []).find(
                    (v) => v.color === selectedColor && v.size === size
                  );
                  const sizeInStock = (sizeVariant?.stock ?? 0) > 0;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSizeIndex(id, index)}
                      disabled={!sizeInStock}
                      className="relative min-w-[52px] h-10 px-3 text-[11px] tracking-widest uppercase font-medium transition-all focus:outline-none"
                      style={{
                        border: isSelected ? '1.5px solid #171717' : '1px solid #d4d4d4',
                        backgroundColor: isSelected ? '#171717' : 'transparent',
                        color: isSelected ? '#ffffff' : sizeInStock ? '#171717' : '#a3a3a3',
                        cursor: sizeInStock ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {size}
                      {!sizeInStock && (
                        <span
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          aria-hidden
                        >
                          <span className="block w-full h-px bg-neutral-300 rotate-[-30deg]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to cart button */}
          <motion.button
            type="button"
            onClick={() => onAddToCart?.(product, 1)}
            disabled={!onAddToCart || !inStock}
            className="w-full h-12 flex items-center justify-between px-5 bg-neutral-900 text-white text-[11px] tracking-widest uppercase font-medium focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            whileHover={onAddToCart && inStock ? { backgroundColor: '#333' } : {}}
            transition={{ duration: 0.15 }}
          >
            <span>{inStock ? t('addToCart') : 'OUT OF STOCK'}</span>
            {inStock && (
              <span className="text-[13px] font-medium tracking-wide normal-case">
                {formatPrice(product.price)} {product.currency ?? 'AZN'}
              </span>
            )}
          </motion.button>

          {/* Delivery info row */}
          <div className="flex items-center justify-between py-3 border-t border-neutral-100 mb-1">
            <span className="text-[10px] tracking-widest uppercase text-neutral-500">
              ESTIMATED DELIVERY
            </span>
            <span className="text-[11px] text-neutral-700 font-medium">
              {deliveryDates}
            </span>
          </div>

          {/* Made in label */}
          <div className="py-3 border-t border-neutral-100 mb-4">
            <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-medium">
              MADE IN AZERBAIJAN
            </span>
          </div>

          {/* Accordion sections */}
          <div className="border-t border-neutral-200">
            {accordionSections.map(({ key, label }) => (
              <div key={key} className="border-b border-neutral-100">
                <button
                  type="button"
                  onClick={() => toggleAccordion(key)}
                  className="w-full flex items-center justify-between py-4 focus:outline-none group"
                >
                  <span className="text-[10px] tracking-widest uppercase text-neutral-900 font-medium">
                    {label}
                  </span>
                  <motion.div
                    animate={{ rotate: openAccordion === key ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {openAccordion === key ? (
                      <Minus className="h-3.5 w-3.5 text-neutral-500" strokeWidth={1.5} />
                    ) : (
                      <Plus className="h-3.5 w-3.5 text-neutral-500" strokeWidth={1.5} />
                    )}
                  </motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion === key && (
                    <motion.div
                      key={key}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 text-[12px] leading-relaxed text-neutral-500">
                        {key === 'details' && (
                          <p>{description || 'Product details and composition.'}</p>
                        )}
                        {key === 'sizeGuide' && (
                          <p>For size guidance, please refer to our size chart. The model is 176 cm and wears size S.</p>
                        )}
                        {key === 'shipping' && (
                          <p>Free standard delivery on orders over 100 AZN. Express delivery available. Estimated 7–10 business days.</p>
                        )}
                        {key === 'payment' && (
                          <p>We accept all major credit cards, bank transfer, and installment payment options.</p>
                        )}
                        {key === 'returns' && (
                          <p>Free returns within 30 days of purchase. Items must be unworn and in original packaging.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
