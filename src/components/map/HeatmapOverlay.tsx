import { useMemo } from "react";
import type { Dimensions, HeatmapType, PathPoint, GameEvent } from "@/types/map";
import { buildHeatmap, heatColor, HEAT_GRID_SIZE } from "@/lib/visualization";

interface HeatmapOverlayProps {
  type: HeatmapType;
  paths: PathPoint[][];
  events: GameEvent[];
  dimensions: Dimensions;
}

/** Canvas-free SVG heatmap rendered as semi-transparent grid cells. */
const HeatmapOverlay = ({ type, paths, events, dimensions }: HeatmapOverlayProps) => {
  const cells = useMemo(
    () => buildHeatmap(type, paths, events),
    [type, paths, events]
  );

  const cellW = dimensions.width / HEAT_GRID_SIZE;
  const cellH = dimensions.height / HEAT_GRID_SIZE;

  if (cells.length === 0) return null;

  return (
    <g opacity={0.45}>
      {cells.map((cell) => (
        <rect
          key={`${cell.row}-${cell.col}`}
          x={cell.col * cellW}
          y={cell.row * cellH}
          width={cellW}
          height={cellH}
          fill={heatColor(cell.intensity)}
          rx={1}
        />
      ))}
    </g>
  );
};

export default HeatmapOverlay;
