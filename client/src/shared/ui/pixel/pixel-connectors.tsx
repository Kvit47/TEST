"use client";

import { forwardRef } from "react";
// Импортируем и ROWS и COLS, чтобы размеры совпадали по обеим осям
import { PIXEL_ROWS, PIXEL_COLS } from "./pixel-reveal";

// Количество колонок в хвосте (можете менять, ширина подстроится сама)
const CONNECTOR_COLS = 11; 

const PixelConnectors = forwardRef<HTMLDivElement, object>((_, ref) => {
  
  // РАСЧЕТ ШИРИНЫ:
  // Если в основном блоке 20 колонок (100% ширины), 
  // то 12 колонок должны занимать (12 / 20) * 100% ширины родителя.
  const containerWidth = (CONNECTOR_COLS / PIXEL_COLS) * 100;

  return (
    <div
      ref={ref}
      className="absolute top-0 bottom-0 right-full z-10 flex"
      style={{
        height: "100%", // Высота совпадет, так как PIXEL_ROWS одинаковый
        
        // --- ИСПРАВЛЕНИЕ ЗДЕСЬ ---
        width: `${containerWidth}%`, 
        
        display: "grid",
        gridTemplateColumns: `repeat(${CONNECTOR_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${PIXEL_ROWS}, 1fr)`,
        gap: "0", 
      }}
    >
      {Array.from({ length: CONNECTOR_COLS * PIXEL_ROWS }).map((_, i) => {
        const colIndex = i % CONNECTOR_COLS;
        
        // Шум без волн
        const noiseInput = i * 43758.5453;
        const stableRandom = Math.abs((Math.sin(noiseInput) * 1000) % 1);
        
        // Логика растворения
        const progress = colIndex / (CONNECTOR_COLS - 1);
        const probability = Math.pow(progress, 1.5); 
        
        const isVisible = stableRandom < probability;

        return (
          <div
            key={i}
            className="connector-pixel"
            style={{
              backgroundColor: "#000000",
              opacity: 0, 
              visibility: isVisible ? "visible" : "hidden", 
            }}
          />
        );
      })}
    </div>
  );
});

PixelConnectors.displayName = "PixelConnectors";

export default PixelConnectors;