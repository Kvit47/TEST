"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";

import { useProductStore } from "@/src/entities/product/model/product.store";
import { ProductWithId } from "../../card/types/product-with-id";
import ProductMarketCard from "../../product/ui/product-card-market";

gsap.registerPlugin(ScrollTrigger);

const WORDS = ["Artisan", "threads.", "Modern", "silhouettes.", "Effortless", "soul.", "Welcome", "to", "your", "new", "favorite", "ritual."];
const CARD_ROTATIONS = [-2, 1, -4, 6, 8, -1, -6, -5, 2];


export default function ProductsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const lettersRef = useRef<(SVGGElement | null)[]>([null, null, null, null, null]);
    const wordsRef = useRef<(HTMLSpanElement | null)[]>(WORDS.map(() => null));
    const cardsSectionRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>(Array(8).fill(null));
    const floatRefs = useRef<(HTMLDivElement | null)[]>(Array(8).fill(null));


    const { products, fetchProducts } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const shuffleArray = (product: ProductWithId[]): ProductWithId[] => product.sort(() => Math.random() - 0.5);

    const shuffledProducts = useMemo(() => shuffleArray(products), [products]);
    const randomProducts = useMemo(() => shuffledProducts.slice(0, 8), [shuffledProducts]);

    useGSAP(() => {
        const letters = lettersRef.current.filter(Boolean) as SVGGElement[];
        const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
        if (!sectionRef.current || letters.length === 0) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top top",
                end: "+=2800",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        tl.to(letters, { opacity: 1, stagger: 0.15, duration: 0.25, ease: "none" });
        tl.to({}, { duration: 0.025 });
        tl.to(letters, { opacity: 0, stagger: 0.15, duration: 0.25, ease: "none" });
        tl.to({}, { duration: 0.025 });
        tl.to(words, { opacity: 1, stagger: 0.12, duration: 0.2, ease: "none" });
        tl.to({}, { duration: 0.025 });
        tl.to(words, { opacity: 0, stagger: 0.12, duration: 0.2, ease: "none" });
    }, []);

    useGSAP(() => {
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
        if (!cardsSectionRef.current || cards.length === 0) return;

        if (window.matchMedia("(max-width: 1023px)").matches) return;

        gsap.set(cards, { y: "110vh" });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: cardsSectionRef.current,
                start: "top top",
                end: "+=2400",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        tl.to(cards, { y: 0, stagger: 0.055, duration: 0.5, ease: "power3.out" })
            .to({}, { duration: 0.5 })
            .to(cards, { y: "-110vh", stagger: 0.045, duration: 0.45, ease: "power3.in" });

        const floats = floatRefs.current.filter(Boolean) as HTMLDivElement[];
        floats.forEach((el, i) => {
            gsap.to(el, {
                y: -(11 + (i % 4) * 2),
                duration: 2.1 + (i % 4) * 0.25,
                delay: (i * 0.35) % 1.4,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
            });
        });
    }, []);

    return (
        <>
            <section ref={sectionRef} className="h-screen w-full flex items-center justify-center bg-black overflow-hidden p-5 sm:p-15">
                <div className="w-full flex items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1344 768"
                        className="w-full max-w-4xl absolute"
                    >
                        {/* M */}
                        <g ref={(el) => { lettersRef.current[0] = el; }} style={{ opacity: 0 }}>
                            <path fill="white" d="M211.292 81.5262L290.593 81.6138C292.393 116.211 295.417 152.195 297.956 186.777L307.87 324.905L313.873 409.936C314.853 424.035 315.629 443.455 317.605 457.032C323.807 389.434 327.653 318.427 332.733 250.427L340.68 141.358C342.018 122.755 344.211 99.9385 344.773 81.6005L423.964 81.6127L423.944 686.571L368.506 686.573L368.604 508.369L368.659 447.143C368.671 438.727 369.154 424.298 368.651 416.557C367.477 413.135 367.875 396.192 367.877 391.584L368.001 331.61C368.018 326.88 368.788 301.347 367.023 298.787C363.844 326.911 362.239 360.079 360.119 388.847L345.672 585.278C343.283 617.517 341.391 654.625 337.948 686.562C324.071 686.416 309.951 686.553 296.053 686.552L266.886 298.118C264.728 302.35 266.723 324.977 265.678 332.368C264.832 361.943 265.718 394.953 265.761 424.944L265.855 595.081C265.879 625.151 266.385 656.632 265.906 686.6L211.346 686.568L211.292 81.5262Z" />
                        </g>

                        {/* A */}
                        <g ref={(el) => { lettersRef.current[1] = el; }} style={{ opacity: 0 }}>
                            <path fill="white" d="M493.685 81.6731L567.548 81.7884L618.635 686.533L558.507 686.566C555.507 649.291 553.952 609.119 551.727 571.573C551.095 565.483 550.873 558.191 550.535 551.994L512.688 551.997C512.33 571.365 510.248 594.616 509.001 614.214C507.503 637.766 506.347 663.297 504.047 686.584L445.4 686.62L493.685 81.6731Z" />
                            <path fill="black" d="M530.548 222.427C533.287 226.406 545.409 476.713 547.149 499.759L533.099 499.852L515.835 499.786L530.548 222.427Z" />
                        </g>

                        {/* R */}
                        <g ref={(el) => { lettersRef.current[2] = el; }} style={{ opacity: 0 }}>
                            <path fill="white" d="M637.324 81.567C669.125 81.9028 712.929 78.8709 743.219 87.2446C785.989 99.0696 783.769 140.276 783.809 176.497L783.839 227.468L783.889 288.826C783.899 309.534 785.059 333.198 779.229 353.292C775.709 365.417 763.279 372.506 752.689 377.97C755.139 379.019 757.539 380.173 759.879 381.43C789.869 397.706 783.849 441.52 783.809 470.576L783.809 582.742C783.819 612.262 781.539 659.789 789.349 686.569L731.159 686.584C724.079 665.228 726.159 615.164 726.149 590.404L726.099 493.007L726.069 446.387C726.059 437.326 727.449 413.719 721.199 406.174C717.299 401.472 703.049 401.941 696.829 401.917L696.709 686.622L637.517 686.593L637.324 81.567Z" />
                            <path fill="black" d="M696.829 131.476C704.659 131.5 722.749 130.704 724.459 141.464C726.569 154.813 725.959 170.051 725.989 183.643L725.949 253.824L725.909 305.874C725.889 316.744 727.539 337.507 721.909 346.385C714.929 352.293 705.639 351.385 696.919 351.367C696.459 323.887 696.779 295.604 696.769 268.047L696.829 131.476Z" />
                        </g>

                        {/* K */}
                        <g ref={(el) => { lettersRef.current[3] = el; }} style={{ opacity: 0 }}>
                            <path fill="white" d="M920.891 81.5009L978.982 81.5794L946.612 269.559L937.641 321.297C936.586 327.299 933.29 344.028 933.157 349.269C932.979 356.248 936.091 373.727 937.294 381.653L945.969 439.725L982.912 686.581L969.876 686.542L923.006 686.569C920.524 664.63 916.778 640.755 913.794 618.73L895.791 484.73L886.267 412.988C884.557 400.014 882.354 379.324 879.123 367.075C878.058 374.877 878.483 393.437 878.488 402.045L878.55 467.255L878.534 686.545L819.606 686.598L819.648 81.567L878.594 81.7191L878.546 253.036L878.498 306.74C878.493 316.294 878.126 330.451 879.099 339.643C894.2 254.695 907.337 166.886 920.891 81.5009Z" />
                        </g>

                        {/* E */}
                        <g ref={(el) => { lettersRef.current[4] = el; }} style={{ opacity: 0 }}>
                            <path fill="white" d="M1001.676 81.5646L1127.214 81.5812L1127.13 134.33L1060.658 134.38L1060.579 348.535L1112.639 348.542L1112.63 399.755L1060.626 399.74L1060.616 634.785L1127.139 634.692L1127.087 686.546L1001.784 686.547L1001.676 81.5646Z" />
                        </g>

                        {/* T */}
                        <g ref={(el) => { lettersRef.current[5] = el; }} style={{ opacity: 0 }}>
                            <path fill="white" d="M1150 81.5646L1300 81.5646L1300 134.33L1254.5 134.33L1254.5 686.547L1195.5 686.547L1195.5 134.33L1150 134.33Z" />
                        </g>
                    </svg>
                    <p className="relative text-white text-3xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-center max-w-4xl leading-tight">
                        {WORDS.map((word, i) => (
                            <span key={i} ref={(el) => { wordsRef.current[i] = el; }} style={{ opacity: 0 }} className="inline-block mr-[0.3em]">
                                {word}
                            </span>
                        ))}
                    </p>
                </div>

            </section>
            <section ref={cardsSectionRef} className="bg-black hidden lg:flex h-screen w-full items-center justify-center overflow-hidden">
                <div className="grid grid-cols-4 gap-8 px-10 w-full max-w-[1600px]">
                    {randomProducts.map((product, i) => (
                        <div
                            key={i}
                            ref={(el) => { cardsRef.current[i] = el; }}
                            className="will-change-transform"
                        >
                            <div
                                ref={(el) => { floatRefs.current[i] = el; }}
                                className="h-full w-full"
                                style={{ rotate: `${CARD_ROTATIONS[i] ?? 0}deg` }}
                            >
                                <ProductMarketCard product={product} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}