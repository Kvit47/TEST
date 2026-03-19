"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SquareOrnament() {
    return (
        <div>
            <div className="flex">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white" />
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-black" />
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white" />
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-black" />
            </div>
            <div className="flex">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-black" />
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white" />
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-black" />
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white" />
            </div>
        </div>
    );
}

function MarqueeRow() {
    const ornaments = Array.from({ length: 30 });
    return (
        <div className="flex shrink-0">
            {ornaments.map((_, i) => (
                <SquareOrnament key={i} />
            ))}
        </div>
    );
}

export default function CheckerMarquee() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!trackRef.current || !sectionRef.current) return;

        gsap.to(trackRef.current, {
            xPercent: -33.33,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "+=2000",
                scrub: 2,
            },
        });
    }, []);

    return (
        <section ref={sectionRef} className="overflow-hidden bg-black">
            <div ref={trackRef} className="flex w-max">
                <MarqueeRow />
                <MarqueeRow />
                <MarqueeRow />
            </div>
        </section>
    );
}
