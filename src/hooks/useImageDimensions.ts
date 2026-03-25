import { useState, useCallback, useEffect, useRef } from "react";
import type { Dimensions } from "@/types/map";

/**
 * Tracks the rendered pixel dimensions of an image inside a container ref.
 * Re-measures on load and window resize.
 */
export function useImageDimensions() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });

  const measure = useCallback(() => {
    const img = containerRef.current?.querySelector("img");
    if (img) {
      setDimensions({ width: img.clientWidth, height: img.clientHeight });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return { containerRef, dimensions, measure };
}
