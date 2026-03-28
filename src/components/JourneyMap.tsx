import { useMemo, useState, useCallback } from "react";
import PlayerOverlay from "./map/PlayerOverlay";
import PlayerLegend from "./PlayerLegend";
import LayerControls from "./LayerControls";
import TimelineControls from "./TimelineControls";
import { useImageDimensions } from "@/hooks/useImageDimensions";
import { useTimeline } from "@/hooks/useTimeline";
import { getPlayerColor, getTimeRange } from "@/lib/visualization";
import { getMapConfig, getMapImage } from "@/lib/mapConfigs";
import type { Player, PlayerWithColor, GameEvent, LayerVisibility, HeatmapType } from "@/types/map";

interface JourneyMapProps {
  players: Player[];
  events: GameEvent[];
  mapId: string;
}

const JourneyMap = ({ players, events, mapId }: JourneyMapProps) => {
  const { containerRef, dimensions, measure } = useImageDimensions();

  const mapConfig = useMemo(() => getMapConfig(mapId), [mapId]);
  const mapImage = useMemo(() => getMapImage(mapId), [mapId]);

  const playersWithColors: PlayerWithColor[] = useMemo(
    () => players.map((p, i) => ({ ...p, color: getPlayerColor(i) })),
    [players]
  );

  const { min: minTime, max: maxTime } = useMemo(
    () => getTimeRange(players.map((p) => p.path), events),
    [players, events]
  );

  const timeline = useTimeline({ minTime, maxTime });

  const [hiddenPlayerIds, setHiddenPlayerIds] = useState<Set<string>>(new Set());
  const togglePlayer = useCallback((id: string) => {
    setHiddenPlayerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Reset visibility when players change (match switch)
  useMemo(() => {
    setHiddenPlayerIds(new Set());
  }, [players]);

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
      <div className="flex-1 flex items-center justify-center p-3 overflow-hidden">
        <div
          ref={containerRef}
          className="relative inline-block rounded-lg overflow-hidden shadow-2xl border border-border/60"
        >
          <img
            src={mapImage}
            alt={`${mapId} minimap`}
            width={1024}
            height={1024}
            onLoad={measure}
            className="block max-h-[calc(100vh-9rem)] w-auto h-auto"
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
              mapConfig={mapConfig}
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
