import { useState } from "react";
import minimapSrc from "@/assets/minimap.jpg";
import MapOverlay from "./map/MapOverlay";
import { useImageDimensions } from "@/hooks/useImageDimensions";
import type { MapPoint } from "@/types/map";

interface JourneyMapProps {
  points: MapPoint[];
}

/** Container component: handles layout and dimension tracking. */
const JourneyMap = ({ points }: JourneyMapProps) => {
  const { containerRef, dimensions, measure } = useImageDimensions();
  const [activePoint, setActivePoint] = useState<string | null>(null);

  return (
    <div className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-background">
      <div
        ref={containerRef}
        className="relative inline-block rounded-lg overflow-hidden shadow-2xl border border-border"
      >
        <img
          src={minimapSrc}
          alt="Game minimap"
          width={1024}
          height={1024}
          onLoad={measure}
          className="block max-h-[calc(100vh-6rem)] w-auto h-auto"
          draggable={false}
        />
        {dimensions.width > 0 && (
          <MapOverlay
            points={points}
            dimensions={dimensions}
            activePoint={activePoint}
            onPointHover={setActivePoint}
          />
        )}
      </div>
    </div>
  );
};

export default JourneyMap;
