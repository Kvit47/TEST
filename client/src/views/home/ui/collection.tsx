"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowDown } from "lucide-react";

import PixelReveal, { PIXEL_COLS, PIXEL_ROWS } from "@/src/shared/ui/pixel/pixel-reveal";
import PixelConnectors from "@/src/shared/ui/pixel/pixel-connectors";
import Shopify from "./shopify";


gsap.registerPlugin(ScrollTrigger);

export default function CollectionSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const collectionRef = useRef<HTMLDivElement>(null);
    const cursor = useRef(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const linkRef = useRef<HTMLAnchorElement>(null);
    const textBlockRef = useRef<HTMLDivElement>(null);
    const mobileLinkRef = useRef<HTMLAnchorElement>(null);

    const pixelRef = useRef<HTMLDivElement>(null);
    const connectorsRef = useRef<HTMLDivElement>(null);
    const asciiWrapRef = useRef<HTMLDivElement>(null);

    // Курсор
    useGSAP(() => {
        if (!linkRef.current || !cursor.current) return;
        const area = linkRef.current;
        const c = cursor.current;

        const move = (e: MouseEvent) => {
            const rect = area.getBoundingClientRect();

            gsap.to(c, {
                x: e.clientX - rect.left - 20,
                y: e.clientY - rect.top - 20,
                duration: 0.2
            });
        };

        const enter = () => gsap.to(c, { opacity: 1 });
        const leave = () => gsap.to(c, { opacity: 0 });

        area.addEventListener("mousemove", move);
        area.addEventListener("mouseenter", enter);
        area.addEventListener("mouseleave", leave);

        return () => {
            area.removeEventListener("mousemove", move);
            area.removeEventListener("mouseenter", enter);
            area.removeEventListener("mouseleave", leave);
        };
    }, []);

    useGSAP(() => {
        if (!svgRef.current || !linkRef.current) return;

        const paths = svgRef.current.querySelectorAll("path");
        const link = linkRef.current;

        paths.forEach((path) => {
            const originalFill = path.getAttribute("fill") || "black";
            const length = path.getTotalLength();

            path.setAttribute("data-fill", originalFill);
            path.style.fill = "none";
            path.style.stroke = originalFill;
            path.style.strokeWidth = "2";
            path.style.strokeDasharray = `${length}`;
            path.style.strokeDashoffset = `${length}`;
        });

        gsap.set(link, { backgroundColor: "transparent" });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 70%",
            },
        });

        // Обводка
        tl.to(paths, {
            strokeDashoffset: 0,
            duration: 1,
            ease: "power2.inOut",
            stagger: 0.1,
        });

        // Заливка
        tl.to(
            paths,
            {
                fill: (i: number, el: SVGPathElement) => el.getAttribute("data-fill") || "black",
                strokeWidth: 0,
                duration: 0.6,
                ease: "power1.in",
                stagger: 0.05,
            },
            ">-0.3"
        );

        // Лёгкое уменьшение SVG
        tl.to(
            svgRef.current,
            { scale: 0.92, duration: 0.8, ease: "power2.in" },
            ">0.5"
        );

        // Раскрытие Link
        tl.to(
            collectionRef.current,
            { backgroundColor: "transparent", duration: 0.5, ease: "power2.out" },
            ">-0.3"
        );

        tl.to(
            link,
            { padding: "40px", duration: 0.8, ease: "power2.inOut" },
            "<"
        );

        // Pixel-эффект появления
        if (pixelRef.current && connectorsRef.current && asciiWrapRef.current) {
            const pixelEls = Array.from(pixelRef.current.children);

            const connectorEls = Array.from(connectorsRef.current.querySelectorAll('.connector-pixel'));

            // Появление основных пикселей
            tl.to(pixelEls, {
                opacity: 1,
                duration: 0.02,
                ease: "none",
                stagger: {
                    grid: [PIXEL_ROWS, PIXEL_COLS],
                    from: "random",
                    amount: 0.5,
                },
            }, ">");

            tl.to(connectorEls, {
                opacity: 1,
                duration: 0.05,
                stagger: {
                    from: "random",
                    amount: 0.6,
                }
            }, "<");

            tl.set(link, { backgroundColor: "#000000" });

            // Блоки выключаются мгновенно в случайном порядке
            tl.to(pixelEls, {
                opacity: 0,
                duration: 0.02,
                ease: "none",
                stagger: {
                    grid: [PIXEL_ROWS, PIXEL_COLS],
                    from: "random",
                    amount: 0.8,
                },
            }, ">0.1");

            // AsciiIcon3D появляется
            tl.to(
                asciiWrapRef.current,
                { opacity: 1, duration: 0.6, ease: "power2.out" },
                "<0.2"
            );

        }

        // Мобильная кнопка
        if (mobileLinkRef.current) {
            tl.fromTo(
                mobileLinkRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
                "<"
            );
        }

        // Scale-down and fade-out svgRef as ShopifySection scrolls into overlap
        gsap.to(svgRef.current, {
            scale: 0.65,
            autoAlpha: 0,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "bottom 75%",
                end: "bottom 15%",
                scrub: 1.2,
            },
        });
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden flex flex-row"
        >
            <div ref={textBlockRef} className="relative w-full min-h-screen flex flex-col md:flex-row  overflow-hidden">
                <div ref={collectionRef} className="lg:rounded-[50px] absolute inset-0 z-10 flex items-center justify-center bg-white">
                    <svg
                        ref={svgRef}
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full p-10"
                        viewBox="0 0 2000 768"
                    >
                        {/* C */}
                        <path fill="black" d="M250 82H100V686H250V634H152V134H250V82Z" />

                        {/* O */}
                        <path fill="black" d="M300 82H450V686H300V82Z" />
                        <path fill="white" d="M352 134H398V634H352V134Z" />

                        {/* L */}
                        <path fill="black" d="M500 82H552V634H650V686H500V82Z" />

                        {/* L */}
                        <path fill="black" d="M700 82H752V634H850V686H700V82z" />

                        {/* E */}
                        <path fill="black" d="M900 82H1050V134H952V330H1030V382H952V634H1050V686H900V82Z" />

                        {/* C */}
                        <path fill="black" d="M1200 82H1100V686H1200V634H1152V134H1200V82Z" />

                        {/* T */}
                        <path fill="black" d="M1250 82H1400V134H1352V686H1300V134H1250V82Z" />

                        {/* I */}
                        <path fill="black" d="M1450 82H1502V686H1450V82Z" />

                        {/* O */}
                        <path fill="black" d="M1550 82H1700V686H1550V82Z" />
                        <path fill="white" d="M1602 134H1648V634H1602V134Z" />

                        {/* N */}
                        <path fill="black" d="M1750 82H1802V400L1880 82H1932V686H1880V368L1802 686H1750V82Z" />
                    </svg>
                </div>

                <Link href="/products" ref={linkRef} className="hidden lg:flex flex-1 min-w-0 flex-col items-center justify-center relative overflow-visible cursor-none group z-10">
                    <PixelReveal ref={pixelRef} />
                    <PixelConnectors ref={connectorsRef} />

                    <div
                        ref={cursor}
                        className="custom-cursor pointer-events-none absolute top-0 left-0 p-3 bg-white rounded-full opacity-0 flex items-center justify-center z-20"
                    >
                        <ArrowDown className="w-7 h-7 text-black" />
                    </div>



                </Link>
            </div>

        </section>
    );
}