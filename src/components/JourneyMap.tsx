import { useMemo, useState, useCallback, useEffect } from "react";
import PlayerOverlay from "./map/PlayerOverlay";
import PlayerLegend from "./PlayerLegend";
import LayerControls from "./LayerControls";
import TimelineControls from "./TimelineControls";
import { useImageDimensions } from "@/hooks/useImageDimensions";
import { useTimeline } from "@/hooks/useTimeline";
import { useZoomPan } from "@/hooks/useZoomPan";
import { getPlayerColor, getTimeRange } from "@/lib/visualization";
import { getMapConfig, getMapImage } from "@/lib/mapConfigs";
import { RotateCcw, ZoomIn } from "lucide-react";
import type { Player, PlayerWithColor, GameEvent, LayerVisibility, HeatmapType } from "@/types/map";

interface JourneyMapProps {
  players: Player[];
  events: GameEvent[];
  mapId: string;
}

const JourneyMap = ({ players, events, mapId }: JourneyMapProps) => {
  const { containerRef, dimensions, measure } = useImageDimensions();
  const { scale, transform, handlers, reset: resetZoom } = useZoomPan();

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

  // Reset visibility + zoom when players change (match switch)
  useEffect(() => {
    setHiddenPlayerIds(new Set());
    resetZoom();
  }, [players, resetZoom]);

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
          className="relative rounded-lg overflow-hidden shadow-2xl border border-border/60"
          style={{ cursor: "grab" }}
          {...handlers}
        >
          <div
            ref={containerRef}
            className="relative inline-block"
            style={{
              transform,
              transformOrigin: "0 0",
              willChange: "transform",
            }}
          >
            <img
              src={mapImage}
              alt={`${mapId} minimap`}
              width={1024}
              height={1024}
              onLoad={measure}
              className="block max-h-[calc(100vh-9rem)] w-auto h-auto select-none"
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
          </div>

          {/* Zoom indicator + reset (outside transform so it stays fixed) */}
          {scale > 1 && (
            <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] font-mono text-muted-foreground">
                <ZoomIn className="w-3 h-3" />
                {scale.toFixed(1)}×
              </div>
              <button
                onClick={resetZoom}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                title="Reset zoom"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
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
