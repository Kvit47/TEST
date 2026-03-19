"use client";

import { forwardRef } from "react";

export const PIXEL_COLS = 20;
export const PIXEL_ROWS = 15;

const PixelReveal = forwardRef<HTMLDivElement, object>((_, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        display: "grid",    
        gridTemplateColumns: `repeat(${PIXEL_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${PIXEL_ROWS}, 1fr)`,
      }}
    >
      {Array.from({ length: PIXEL_COLS * PIXEL_ROWS }).map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: "#000000",
            opacity: 0,
          }}
        />
      ))}
    </div>
  );
});

PixelReveal.displayName = "PixelReveal";

export default PixelReveal;

