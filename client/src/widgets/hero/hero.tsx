"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import Link from "next/link";

const IMAGES = ["/hero_22.jpg", "/hero_33.jpg"];
const SQUARE_SIZE = 200;
const INTERVAL = 5000;

type ImageNaturalSize = { width: number; height: number };

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);

    const [currentIdx, setCurrentIdx] = useState(0);
    const [nextIdx, setNextIdx] = useState(1);
    const [grid, setGrid] = useState({ cols: 0, rows: 0, width: 0, height: 0 });
    const [imageSizes, setImageSizes] = useState<Record<string, ImageNaturalSize>>({});
    const isAnimating = useRef(false);

    const calcGrid = useCallback(() => {
        if (!containerRef.current) return;
        const { clientWidth, clientHeight } = containerRef.current;
        setGrid({
            cols: Math.ceil(clientWidth / SQUARE_SIZE),
            rows: Math.ceil(clientHeight / SQUARE_SIZE),
            width: clientWidth,
            height: clientHeight,
        });
    }, []);

    useEffect(() => {
        calcGrid();
        window.addEventListener("resize", calcGrid);
        return () => window.removeEventListener("resize", calcGrid);
    }, [calcGrid]);



    // Preload all images to get natural dimensions
    useEffect(() => {
        IMAGES.forEach((src) => {
            const img = new Image();
            img.onload = () => {
                setImageSizes((prev) => ({
                    ...prev,
                    [src]: { width: img.naturalWidth, height: img.naturalHeight },
                }));
            };
            img.src = src;
        });
    }, []);

    /**
     * Calculates the exact backgroundSize and backgroundPosition for a grid cell
     * to perfectly match `background-size: cover; background-position: center`
     * on the full container.
     */
    const getCoverStyle = useCallback(
        (src: string, col: number, row: number) => {
            const { width: containerW, height: containerH, cols, rows } = grid;
            const imgSize = imageSizes[src];

            if (!imgSize || !containerW || !containerH) return {};

            // Replicate CSS `cover`: scale image so it fills the container, maintaining aspect ratio
            const scale = Math.max(containerW / imgSize.width, containerH / imgSize.height);
            const renderedW = imgSize.width * scale;
            const renderedH = imgSize.height * scale;

            // Center offset: how far the image extends beyond the container edges
            const xOffset = (renderedW - containerW) / 2;
            const yOffset = (renderedH - containerH) / 2;

            // Cell dimensions
            const cellW = containerW / cols;
            const cellH = containerH / rows;

            // Position of the image's top-left corner relative to this cell's top-left corner
            const bgPosX = -(xOffset + col * cellW);
            const bgPosY = -(yOffset + row * cellH);

            return {
                backgroundSize: `${renderedW}px ${renderedH}px`,
                backgroundPosition: `${bgPosX}px ${bgPosY}px`,
            };
        },
        [grid, imageSizes]
    );

    const runTransition = useCallback(() => {
        if (isAnimating.current || grid.cols === 0) return;

        const squares = containerRef.current?.querySelectorAll(".sq");
        if (!squares) return;

        isAnimating.current = true;

        const tl = gsap.timeline({
            onComplete: () => {
                setCurrentIdx(nextIdx);
                setNextIdx((prev) => (prev + 1) % IMAGES.length);
                gsap.set(squares, { opacity: 0, clipPath: "inset(50%)" });
                isAnimating.current = false;
            },
        });

        tl.to(squares, {
            opacity: 1,
            clipPath: "inset(0%)",
            duration: 0.7,
            stagger: {
                amount: 0.7,
                from: "random",
            },
            ease: "power2.inOut",
        });
    }, [grid, nextIdx]);

    useEffect(() => {
        const timer = setInterval(runTransition, INTERVAL);
        return () => clearInterval(timer);
    }, [runTransition]);

    return (
        <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
            {/* Base Image */}
            <Link href="/products">
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${IMAGES[currentIdx]})`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                    }}
                />
            </Link>

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 z-10 pointer-events-none grid"
                style={{
                    gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
                }}
            >
                {Array.from({ length: grid.cols * grid.rows }).map((_, i) => {
                    const col = i % grid.cols;
                    const row = Math.floor(i / grid.cols);
                    const coverStyle = getCoverStyle(IMAGES[nextIdx], col, row);

                    return (
                        <div
                            key={`${grid.cols}-${i}`}
                            className="sq w-full h-full"
                            style={{
                                backgroundImage: `url(${IMAGES[nextIdx]})`,
                                backgroundRepeat: "no-repeat",
                                ...coverStyle,
                                opacity: 0,
                                clipPath: "inset(50%)",
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
