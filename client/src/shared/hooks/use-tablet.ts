"use client";
import { useEffect, useState } from "react";

const TABLET_BREAKPOINT = 1024;

    export function useTablet() {
    const [isTablet, setIsTablet] = useState(
        typeof window !== "undefined" ? window.innerWidth < TABLET_BREAKPOINT : false
    );

    useEffect(() => {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT - 1}px)`);
        const handler = (e: MediaQueryListEvent) => setIsTablet(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, [])
    return isTablet;
}