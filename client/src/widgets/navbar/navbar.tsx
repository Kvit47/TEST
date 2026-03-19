"use client";
import ProfileIcon from "@/src/entities/profile/ui/profile-icon";
import useAuthStore from "@/src/entities/user/model/auth.store";
import { useCartStore } from "@/src/views/card/model/card.store";
import ShopCard from "@/src/views/card/ui/shop-card";
import { Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import NavbarMenu from "./navbar-menu";
import { useSelectedProductStore } from "@/src/entities/product/model/selected-product";
import { useCategoryStore } from "@/src/entities/categories/model/categories.store";

export default function Navbar() {
    const { items } = useCartStore();
    const { user, initialize } = useAuthStore();
    const { selectedCategory } = useSelectedProductStore();
    const { categories } = useCategoryStore();
    useEffect(() => {
        initialize();
    }, [initialize]);
    
    const title = useMemo(() => {
        if (!selectedCategory) return "Products";
        const selected = categories.find((c) => c._id === selectedCategory);
        return selected?.name["en"] || Object.values(selected?.name ?? {})[0] || "Products";
    }, [categories, selectedCategory]);

    
    return (
        <div className="p-4">
            <div className="flex items-center justify-between py-4">
                <Link href="/products">
                    <h1 className="text-2xl font-bold">SAINT ASLAN</h1>
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none select-none">
                    <div className="flex items-center gap-2.5">
                        <div className="w-5 h-px bg-neutral-300" />
                        <Package className="w-3.5 h-3.5 text-neutral-400" strokeWidth={1.5} />
                        <div className="w-5 h-px bg-neutral-300" />
                    </div>
                    <h1 className="text-[8px] font-bold tracking-[0.3em] uppercase text-black leading-none mt-1">
                        {title || "Products"}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    {
                        items.length > 0 && (
                            <ShopCard />
                        )
                    }
                    {
                        user && (
                            <ProfileIcon />
                        )
                    }
                    <NavbarMenu />
                </div>
            </div>
        </div>
    )
}