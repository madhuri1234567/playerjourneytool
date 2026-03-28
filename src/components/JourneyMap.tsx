import { useMemo, useState, useCallback } from "react";
import minimapSrc from "@/assets/minimap.jpg";
import PlayerOverlay from "./map/PlayerOverlay";
import PlayerLegend from "./PlayerLegend";
import LayerControls from "./LayerControls";
import TimelineControls from "./TimelineControls";
import { useImageDimensions } from "@/hooks/useImageDimensions";
import { useTimeline } from "@/hooks/useTimeline";
import { getPlayerColor, getTimeRange } from "@/lib/visualization";
import type { Player, PlayerWithColor, GameEvent, LayerVisibility, HeatmapType } from "@/types/map";

interface JourneyMapProps {
  players: Player[];
  events: GameEvent[];
}

const JourneyMap = ({ players, events }: JourneyMapProps) => {
  const { containerRef, dimensions, measure } = useImageDimensions();

  // Player colors
  const playersWithColors: PlayerWithColor[] = useMemo(
    () => players.map((p, i) => ({ ...p, color: getPlayerColor(i) })),
    [players]
  );

  // Time range
  const { min: minTime, max: maxTime } = useMemo(
    () => getTimeRange(players.map((p) => p.path), events),
    [players, events]
  );

  // Timeline
  const timeline = useTimeline({ minTime, maxTime });

  // Player visibility
  const [hiddenPlayerIds, setHiddenPlayerIds] = useState<Set<string>>(new Set());
  const togglePlayer = useCallback((id: string) => {
    setHiddenPlayerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Layers
  const [layers, setLayers] = useState<LayerVisibility>({
    paths: true,
    events: true,
    heatmap: false,
  });
  const toggleLayer = useCallback((key: keyof LayerVisibility) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const [heatmapType, setHeatmapType] = useState<HeatmapType>("movement");

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
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
            className="block max-h-[calc(100vh-10rem)] w-auto h-auto"
            draggable={false}
          />
          {dimensions.width > 0 && (
            <PlayerOverlay
              players={playersWithColors}
              dimensions={dimensions}
              currentTime={timeline.currentTime}
              hiddenPlayerIds={hiddenPlayerIds}
              events={events}
              layers={layers}
              heatmapType={heatmapType}
            />
          )}
          <PlayerLegend
            players={playersWithColors}
            hiddenPlayerIds={hiddenPlayerIds}
            onTogglePlayer={togglePlayer}
          />
          <LayerControls
            layers={layers}
            onToggleLayer={toggleLayer}
            heatmapType={heatmapType}
            onSetHeatmapType={setHeatmapType}
          />
        </div>
      </div>
      <TimelineControls
        currentTime={timeline.currentTime}
        minTime={timeline.minTime}
        maxTime={timeline.maxTime}
        isPlaying={timeline.isPlaying}
        speed={timeline.speed}
        onTogglePlay={timeline.togglePlay}
        onCycleSpeed={timeline.cycleSpeed}
        onSeek={timeline.seek}
      />
    </div>
  );
};

export default JourneyMap;
