"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef, useState, useCallback, useEffect, useMemo, useTransition } from "react";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import shoes from "@/public/shoes.jpg";
import dress from "@/public/dress.jpg";
import jacket from "@/public/jacket.jpg";
import trousers from "@/public/trousers.jpg";
import contact from "@/public/contact.jpg";

const menuLinks = [
    { name: "Shoes", href: "/shoes", page: "shoes", img: shoes },
    { name: "Dress", href: "/dress", page: "dress", img: dress },
    { name: "Jacket", href: "/jacket", page: "jacket", img: jacket },
    { name: "Trousers", href: "/trousers", page: "trousers", img: trousers },
    { name: "Contact", href: "/contact", page: "contact", img: contact },
];

type Page = "shoes" | "dress" | "jacket" | "trousers" | "contact";

const lockScroll = () => {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.documentElement.style.overflow = "hidden";
};

const unlockScroll = () => {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
    document.documentElement.style.overflow = "";
};

export default function MobileNavMenu() {
    const pathname = usePathname();
    const router = useRouter();

    const menuContentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const lineTopRef = useRef<SVGLineElement>(null);
    const lineBotRef = useRef<SVGLineElement>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAnimatingRef = useRef(false);
    const [isPending, startTransition] = useTransition();
    const isNavigatingRef = useRef(false);

    const activePage = useMemo(
        () => (menuLinks.find(l => l.href === pathname)?.page ?? "shoes") as Page,
        [pathname]
    );

    useGSAP(() => {
        containerRef.current = document.querySelector(".page-container") as HTMLDivElement;
    }, []);

    useEffect(() => {
        if (isNavigatingRef.current) return;

        const lines = [lineTopRef.current, lineBotRef.current].filter(Boolean);

        gsap.killTweensOf(lines);
        gsap.killTweensOf(".mobile-menu-overlay");
        gsap.killTweensOf(menuContentRef.current);
        if (containerRef.current) gsap.killTweensOf(containerRef.current);

        gsap.set(lines, { clearProps: "all" });
        gsap.set(".mobile-menu-overlay", { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" });
        gsap.set(menuContentRef.current, { clearProps: "all" });
        if (containerRef.current) gsap.set(containerRef.current, { clearProps: "all" });

        unlockScroll();
        setTimeout(() => {
            setIsMenuOpen(false);
        }, 100);
        isAnimatingRef.current = false;
        isNavigatingRef.current = false;
    }, [pathname]);

    useEffect(() => {
        if (isNavigatingRef.current && !isPending) {
            isNavigatingRef.current = false;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    gsap.to(".mobile-menu-overlay", {
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
                        duration: 0.7,
                        ease: "power4.inOut",
                        onComplete: () => {
                            isAnimatingRef.current = false;
                            setIsMenuOpen(false);
                        },
                    });
                });
            });
        }
    }, [isPending]);

    useEffect(() => {
        const lineTop = lineTopRef.current;
        const lineBot = lineBotRef.current;
        return () => {
            unlockScroll();
            const lines = [lineTop, lineBot].filter(Boolean);
            if (lines.length) gsap.killTweensOf(lines);
        };
    }, []);

    const handleLinkClick = useCallback((e: React.MouseEvent, href: string) => {
        e.preventDefault();
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;

        unlockScroll();

        gsap.to(".mobile-menu-link-item", {
            y: "120%", opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.in",
        });

        gsap.to(menuContentRef.current, {
            rotation: -15, x: -80, y: -80, scale: 1.4, opacity: 0.25,
            duration: 1.25, ease: "power4.inOut",
        });

        gsap.set([lineTopRef.current, lineBotRef.current], { clearProps: "all" });

        gsap.to(".mobile-menu-overlay", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 0.7,
            ease: "power4.inOut",
            onComplete: () => {
                if (containerRef.current) {
                    gsap.set(containerRef.current, { clearProps: "all" });
                }
                gsap.set(menuContentRef.current, { clearProps: "all" });

                isNavigatingRef.current = true;
                startTransition(() => {
                    router.push(href);
                });
            },
        });
    }, [router]);

    const openMenu = useCallback(() => {
        if (isAnimatingRef.current || isMenuOpen) return;
        isAnimatingRef.current = true;

        lockScroll();

        gsap.killTweensOf([lineTopRef.current, lineBotRef.current]);
        gsap.set([lineTopRef.current, lineBotRef.current], { scaleX: 1 });

        gsap.to(lineTopRef.current, { y: 3, rotation: 45, transformOrigin: "center", duration: 0.5, ease: "power2.inOut" });
        gsap.to(lineBotRef.current, { y: -3, rotation: -45, transformOrigin: "center", duration: 0.5, ease: "power2.inOut" });

        gsap.to(menuContentRef.current, {
            rotation: 0, x: 0, y: 0, scale: 1, opacity: 1,
            duration: 1.25, ease: "power4.inOut",
        });

        gsap.to(".mobile-menu-link-item", {
            y: "0%", delay: 0.6, opacity: 1,
            duration: 1, stagger: 0.1, ease: "power3.out",
        });

        gsap.to(".mobile-menu-overlay", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
            duration: 1.25, ease: "power4.inOut",
            onComplete: () => {
                isAnimatingRef.current = false;
                setIsMenuOpen(true);
            },
        });
    }, [isMenuOpen]);

    const closeMenu = useCallback(() => {
        if (isAnimatingRef.current || !isMenuOpen) return;
        isAnimatingRef.current = true;

        unlockScroll();

        gsap.to(lineTopRef.current, { y: 0, rotation: 0, scaleX: 1, duration: 0.5, ease: "power2.inOut" });
        gsap.to(lineBotRef.current, { y: 0, rotation: 0, scaleX: 1, duration: 0.5, ease: "power2.inOut" });

        gsap.to(menuContentRef.current, {
            rotation: -15, x: -80, y: -80, scale: 1.4, opacity: 0.25,
            duration: 1.25, ease: "power4.inOut",
        });

        gsap.to(".mobile-menu-link-item", {
            y: "120%", opacity: 0, duration: 0.4, stagger: 0.05, ease: "power2.in",
        });

        gsap.to(".mobile-menu-overlay", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            duration: 1.25, ease: "power4.inOut",
            onComplete: () => {
                isAnimatingRef.current = false;
                setIsMenuOpen(false);
            },
        });
    }, [isMenuOpen]);

    const toggleMenu = useCallback(() => {
        if (!isMenuOpen) openMenu();
        else closeMenu();
    }, [isMenuOpen, openMenu, closeMenu]);

    return (
        <>
            <nav className="bg-transparent z-60">
                <div
                    className="relative w-10 h-6 cursor-pointer"
                    onClick={toggleMenu}
                >
                    <svg width={28} height={28} viewBox="0 0 24 24" stroke="#000000" strokeWidth={1} strokeLinecap="round">
                        <line ref={lineTopRef} x1="0" y1="6" x2="22" y2="6" />
                        <line ref={lineBotRef} x1="0" y1="12" x2="22" y2="12" />
                    </svg>
                </div>
            </nav>

            <div className="mobile-menu-overlay fixed inset-0 w-screen h-svh overflow-hidden bg-white z-50 text-black [clip-path:polygon(0%_0%,100%_0%,100%_0%,0%_0%)]">
                <div
                    ref={menuContentRef}
                    className="relative w-full h-full flex flex-col justify-between origin-left-bottom will-change-[transform,opacity]"
                    style={{ transform: "translateX(-80px) translateY(-80px) scale(1.4) rotate(-15deg)", opacity: 0.25 }}
                >
                    {/* Active page background image */}
                    <div className="absolute inset-0 pointer-events-none">
                        {menuLinks.map((link) => (
                            <div
                                key={link.page}
                                className="absolute inset-0 transition-opacity duration-500"
                                style={{ opacity: activePage === link.page ? 0.08 : 0 }}
                            >
                                <Image
                                    src={link.img}
                                    alt={link.name}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Nav links */}
                    <div className="relative z-10 flex flex-col justify-center flex-1 px-8 pt-24 gap-2 select-none">
                        {menuLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className="mobile-menu-link-item inline-flex items-center gap-3 will-change-transform py-1"
                                    style={{ transform: "translateY(120%)", opacity: 0 }}
                                >
                                    {isActive && (
                                        <span className="w-2 h-2 rounded-full bg-black shrink-0" />
                                    )}
                                    <span className={`text-[2.75rem] leading-tight tracking-[-0.02em] ${isActive ? "font-medium" : "font-light text-black/60"}`}>
                                        {link.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 px-8 pb-10 flex items-center justify-between">
                        <p className="mobile-menu-link-item text-xs text-black/40 tracking-widest uppercase will-change-transform" style={{ transform: "translateY(120%)", opacity: 0 }}>
                            © 2026 Brand
                        </p>
                        <div className="mobile-menu-link-item flex gap-5 will-change-transform" style={{ transform: "translateY(120%)", opacity: 0 }}>
                            {["Instagram", "X", "TikTok"].map((social) => (
                                <Link
                                    key={social}
                                    href="#"
                                    className="text-xs text-black/40 hover:text-black tracking-widest uppercase transition-colors duration-300"
                                >
                                    {social}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
