"use client";
import { useCategoryStore } from "@/src/entities/categories/model/categories.store";
import { Category, CategoryName } from "@/src/entities/categories/types/categories.type";
import { useSelectedProductStore } from "@/src/entities/product/model/selected-product";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef } from "react";

export default function Shopify() {
    const gridRef = useRef<HTMLDivElement>(null);

    const { categories } = useCategoryStore();
    const locale = useLocale() as keyof CategoryName;
    const { setSelectedCategory } = useSelectedProductStore();
    const router = useRouter();

    const shuffleArray = (array: Category[]): Category[] => array.sort(() => Math.random() - 0.5);

    const shuffledCategories = useMemo(() => shuffleArray(categories), [categories]);
    const randomCategories = useMemo(() => shuffledCategories.slice(0, 4), [shuffledCategories]);

    const menuLinks = useMemo(
        () => randomCategories.map((c) => ({
            name: c.name[locale] ?? c.name.en,
            href: `/products`,
            page: c._id,
            img: c.image,
        })),
        [randomCategories, locale]
    );

    const handleLinkClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        router.push(href);
    }, [router]);

    useGSAP(() => {
        if (!gridRef.current) return;

        const cells = gridRef.current.querySelectorAll<HTMLElement>(".shopify-cell");

        gsap.set(cells, { opacity: 0, scale: 1.08, filter: "blur(12px)" });

        gsap.to(cells, {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.18,
        });
    }, { scope: gridRef, dependencies: [menuLinks] });

    return (
        <section className="w-full overflow-hidden">
            <div ref={gridRef} className="grid grid-cols-2 grid-rows-2 w-full h-[200vh]">
                {menuLinks.map((category) => (
                    <Link
                        key={category.page}
                        href={category.href}
                        onClick={(e) => {
                            setSelectedCategory(category.page as string);
                            handleLinkClick(e, category.href);
                        }}
                        className="shopify-cell group relative overflow-hidden"
                    >
                        <Image
                            src={category.img}
                            alt={category.name}
                            fill
                            className="object-cover h-full w-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/50 backdrop-blur-sm">
                            <span className="text-black text-xl font-semibold tracking-widest uppercase">
                                {category.name}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}