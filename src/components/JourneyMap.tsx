import { useMemo } from "react";
import minimapSrc from "@/assets/minimap.jpg";
import PlayerOverlay from "./map/PlayerOverlay";
import PlayerLegend from "./PlayerLegend";
import { useImageDimensions } from "@/hooks/useImageDimensions";
import { getPlayerColor } from "@/lib/visualization";
import type { Player, PlayerWithColor } from "@/types/map";

interface JourneyMapProps {
  players: Player[];
}

/** Container component: layout, dimension tracking, color assignment. */
const JourneyMap = ({ players }: JourneyMapProps) => {
  const { containerRef, dimensions, measure } = useImageDimensions();

  const playersWithColors: PlayerWithColor[] = useMemo(
    () =>
      players.map((p, i) => ({
        ...p,
        color: getPlayerColor(i),
      })),
    [players]
  );

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
          <PlayerOverlay
            players={playersWithColors}
            dimensions={dimensions}
          />
        )}
        <PlayerLegend players={playersWithColors} />
      </div>
    </div>
  );
};

export default JourneyMap;
