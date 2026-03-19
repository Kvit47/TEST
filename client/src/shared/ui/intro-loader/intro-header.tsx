"use client";

import { motion } from "framer-motion";
import { useIntro } from "@/src/shared/lib/intro-context";
import { LOGO_CONTAINER_LAYOUT_ID } from "@/src/shared/ui/intro-loader";
import Link from "next/link";

export default function IntroHeader() {
    const { titleInNavbar, setIntroDone } = useIntro();

    return (
        <nav className="w-full flex items-center justify-center py-4">
            {titleInNavbar && (
                <motion.div
                    layoutId={LOGO_CONTAINER_LAYOUT_ID}
                    // Added 'relative' and ensuring the container has a clean flex context
                    className="relative flex items-center justify-center bg-white px-8 py-2 overflow-hidden z-50"
                    transition={{
                        type: "spring",
                        stiffness: 40,
                        damping: 20,
                        duration: 1.5,
                    }}
                    onLayoutAnimationComplete={() => setIntroDone(true)}
                >
                    <Link href="/">
                        <motion.span
                            layout="position"
                            className="mx-auto flex items-center justify-center font-bold uppercase tracking-tighter whitespace-nowrap text-black"
                            style={{
                                fontSize: 60,
                                originX: 0.5,
                                originY: 0.5,
                                fontFamily: "var(--font-michroma)"
                            }}
                        >
                            SAINT ASLAN
                        </motion.span>
                    </Link>

                </motion.div>
            )}
        </nav>
    );
}