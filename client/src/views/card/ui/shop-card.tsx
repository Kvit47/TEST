'use client';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { ShoppingBag, X, ArrowRight, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { getProductId } from "../hooks/get-product-id";
import { useCartStore } from "../model/card.store";
import { ProductWithId } from "../types/product-with-id";
import CartLine from "./shop-card-line";


export default function ShopCard() {
    const t = useTranslations('cart');
    const items = useCartStore((s) => s.items);
    const totalPrice = useCartStore((s) => s.getTotalPrice());
    const totalItems = useCartStore((s) => s.getTotalItems());
    const isLoading = useCartStore((s) => s.isLoading);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <button
                    type="button"
                    className="relative p-1.5 -mt-3 group"
                    aria-label={t('title')}
                >
                    <ShoppingBag className="w-[26px] h-[26px] text-neutral-800 group-hover:text-black transition-colors" />
                    {totalItems > 0 && (
                        <span className="absolute -top-0.5 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white px-1 font-host-grotesk">
                            {totalItems > 99 ? '99+' : totalItems}
                        </span>
                    )}
                </button>
            </SheetTrigger>

            <SheetContent className="flex flex-col w-full sm:max-w-[420px] p-0 gap-0 font-host-grotesk z-9999">
                {/* Header */}
                <SheetHeader className="px-6 py-5 border-b border-neutral-100 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <SheetTitle className="text-base font-semibold tracking-tight text-neutral-900 font-host-grotesk">
                                {t('title')}
                            </SheetTitle>
                            {totalItems > 0 && (
                                <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-neutral-900 text-[10px] font-semibold text-white px-1.5 font-host-grotesk">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        
                    </div>
                </SheetHeader>

                {/* Cart Body */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
                            <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-neutral-800 animate-spin" />
                            <p className="text-sm text-neutral-400 font-host-grotesk">{t('empty')}</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 px-6 gap-5">
                            <div className="w-20 h-20 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                                <Package className="w-9 h-9 text-neutral-300" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-neutral-800 font-host-grotesk">{t('empty')}</p>
                                <p className="text-xs text-neutral-400 mt-1 font-host-grotesk">
                                    {t('description')}
                                </p>
                            </div>
                            <SheetClose asChild>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 border border-neutral-900 px-5 py-2.5 rounded-full hover:bg-neutral-900 hover:text-white transition-all duration-200 font-host-grotesk"
                                >
                                    Shop now
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </SheetClose>
                        </div>
                    ) : (
                        <ul className="px-6 py-4 space-y-1">
                            {items.map((item) => (
                                <li key={getProductId(item.product as ProductWithId)}>
                                    <CartLine item={item} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="shrink-0 border-t border-neutral-100 px-6 pt-4 pb-6 space-y-4">
                        {/* Subtotal row */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-neutral-500 font-host-grotesk">{t('total')}</span>
                            <span className="text-base font-semibold text-neutral-900 font-host-grotesk">
                                {totalPrice.toFixed(2)} AZN
                            </span>
                        </div>

                        {/* CTA */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white text-sm font-medium tracking-wide py-3.5 rounded-xl transition-colors duration-200 font-host-grotesk"
                        >
                            Checkout
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        {/* Continue shopping */}
                        <SheetClose asChild>
                            <button
                                type="button"
                                className="w-full text-sm text-neutral-500 hover:text-neutral-900 transition-colors text-center font-host-grotesk"
                            >
                                {t('close')}
                            </button>
                        </SheetClose>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
