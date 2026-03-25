import { useRef, useState, useCallback, useEffect } from "react";
import minimapSrc from "@/assets/minimap.jpg";
import MapOverlay from "./MapOverlay";
import { type MapPoint } from "@/lib/coordinates";

interface JourneyMapProps {
  points: MapPoint[];
}

const JourneyMap = ({ points }: JourneyMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [activePoint, setActivePoint] = useState<string | null>(null);

  const updateDimensions = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const img = el.querySelector("img");
    if (img) {
      setDimensions({ width: img.clientWidth, height: img.clientHeight });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  return (
    <div className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-background">
      <div ref={containerRef} className="relative inline-block rounded-lg overflow-hidden shadow-2xl border border-border">
        <img
          src={minimapSrc}
          alt="Game minimap"
          width={1024}
          height={1024}
          onLoad={updateDimensions}
          className="block max-h-[calc(100vh-6rem)] w-auto h-auto"
          draggable={false}
        />
        {dimensions.width > 0 && (
          <MapOverlay
            points={points}
            width={dimensions.width}
            height={dimensions.height}
            activePoint={activePoint}
            onPointHover={setActivePoint}
          />
        )}
      </div>
    </div>
  );
};

export default JourneyMap;
