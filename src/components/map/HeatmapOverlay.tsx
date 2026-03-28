import { useMemo, memo } from "react";
import type { Dimensions, HeatmapType, PathPoint, GameEvent, MapConfig } from "@/types/map";
import { buildHeatmap, heatColor, HEAT_GRID_SIZE } from "@/lib/visualization";

interface HeatmapOverlayProps {
  type: HeatmapType;
  paths: PathPoint[][];
  events: GameEvent[];
  dimensions: Dimensions;
  mapConfig: MapConfig;
}

const HeatmapOverlay = memo(({ type, paths, events, dimensions, mapConfig }: HeatmapOverlayProps) => {
  const cells = useMemo(
    () => buildHeatmap(type, paths, events, mapConfig),
    [type, paths, events, mapConfig]
  );

  const cellW = dimensions.width / HEAT_GRID_SIZE;
  const cellH = dimensions.height / HEAT_GRID_SIZE;

  if (cells.length === 0) return null;

  return (
    <g>
      {cells.map((cell) => (
        <rect
          key={`${cell.row}-${cell.col}`}
          x={cell.col * cellW}
          y={cell.row * cellH}
          width={cellW}
          height={cellH}
          fill={heatColor(cell.intensity)}
          opacity={0.15 + cell.intensity * 0.4}
          rx={2}
        />
      ))}
    </g>
  );
});

HeatmapOverlay.displayName = "HeatmapOverlay";

export default HeatmapOverlay;
