"use client";

import gsap from "gsap";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIntro } from "@/src/shared/lib/intro-context";

export const LOGO_CONTAINER_LAYOUT_ID = "logo-container";

const REVEAL_DURATION = 0.6;
const PHASE2_START = 1.2;

export function IntroLoader() {
  const { introDone, titleInNavbar, setTitleInNavbar } = useIntro();
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef({ value: 0 });
  const [inverted, setInverted] = useState(false);

  useEffect(() => {
    if (titleInNavbar) return;
    const el = containerRef.current;
    const revealEl = revealRef.current;
    const cursorEl = cursorRef.current;
    if (!el) return;

    const tl = gsap.timeline();

    // Phase 1: blur-in
    tl.fromTo(
      el,
      { opacity: 0, filter: "blur(12px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power2.out" }
    );

    // Phase 2: scan-line reveal (cursor + clip-path) at ~1.2s
    tl.to(
      progressRef.current,
      {
        value: 1,
        duration: REVEAL_DURATION,
        ease: "none",
        onUpdate: () => {
          const p = progressRef.current.value;
          const right = 100 - p * 100;
          if (revealEl) {
            revealEl.style.clipPath = `inset(0 ${right}% 0 0)`;
          }
          if (cursorEl) {
            cursorEl.style.left = `${p * 100}%`;
          }
        },
        onComplete: () => setInverted(true),
      },
      PHASE2_START
    );

    // Phase 3: trigger move to navbar (layoutId transition)
    tl.add(() => setTitleInNavbar(true), PHASE2_START + REVEAL_DURATION);

    return () => {
      tl.kill();
    };
  }, [titleInNavbar, setTitleInNavbar]);

  if (introDone) {
    return null;
  }

  const textClass =
    "font-bold uppercase tracking-tight whitespace-nowrap text-center";
  const textStyle = { fontSize: 150, textAlign: "center" as const, fontFamily: "var(--font-michroma)" };

  return (
    <motion.div
      className="fixed inset-0 bg-[#1c1d1d] flex items-center justify-center"
      initial={false}
      animate={{ opacity: titleInNavbar ? 0 : 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ pointerEvents: titleInNavbar ? "none" : "auto" }}
    >
      {!titleInNavbar && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            ref={containerRef}
            layoutId={LOGO_CONTAINER_LAYOUT_ID}
            className={`flex items-center justify-center px-6 py-3 z-50 ${
              inverted ? "bg-white" : "bg-transparent"
            }`}
            transition={{
              type: "spring",
              stiffness: 40,
              damping: 20,
              duration: 1.5,
            }}
          >
            {inverted ? (
              <motion.span
                layout
                className={`${textClass} text-black`}
                style={textStyle}
              >
                SAINT ASLAN
              </motion.span>
            ) : (
              <div className="relative inline-flex items-center justify-center">
                {/* Base layer: white text on transparent */}
                <span
                  className={`${textClass} text-white`}
                  style={textStyle}
                  aria-hidden
                >
                  SAINT ASLAN
                </span>
                {/* Reveal layer: black text on white, clipped left-to-right */}
                <div
                  ref={revealRef}
                  className="absolute inset-0 flex items-center justify-center bg-white"
                  style={{ clipPath: "inset(0 100% 0 0)" }}
                  aria-hidden
                >
                  <span
                    className={`${textClass} text-black`}
                    style={textStyle}
                  >
                    SAINT ASLAN
                  </span>
                </div>
                {/* Scan-line cursor, synced with clip-path */}
                <motion.div
                  ref={cursorRef}
                  className="absolute top-1/2 w-[3px] bg-white pointer-events-none"
                  style={{
                    left: 0,
                    height: "120%",
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-hidden
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
