import { useMemo } from "react";
import type { PixelCoord, Dimensions, PlayerWithColor } from "@/types/map";
import { worldToPixel, sortByTimestamp, buildPathD } from "@/lib/visualization";

interface PlayerPathProps {
  player: PlayerWithColor;
  dimensions: Dimensions;
}

/** Renders a single player's path as an SVG line with start/end markers. */
const PlayerPath = ({ player, dimensions }: PlayerPathProps) => {
  const { coords, pathD } = useMemo(() => {
    const sorted = sortByTimestamp(player.path);
    const c = sorted.map((pt) => worldToPixel(pt.x, pt.y, dimensions));
    return { coords: c, pathD: buildPathD(c) };
  }, [player.path, dimensions]);

  if (coords.length === 0) return null;

  const start = coords[0];
  const end = coords[coords.length - 1];

  return (
    <g>
      {/* Path line */}
      <path
        d={pathD}
        fill="none"
        stroke={player.color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={player.is_bot ? "6 4" : "none"}
        opacity={0.85}
      />

      {/* Start marker — filled circle */}
      <circle
        cx={start.x}
        cy={start.y}
        r={5}
        fill={player.color}
        stroke="hsl(var(--background))"
        strokeWidth={2}
      />

      {/* End marker — ring */}
      <circle
        cx={end.x}
        cy={end.y}
        r={5}
        fill="none"
        stroke={player.color}
        strokeWidth={2.5}
      />
      <circle
        cx={end.x}
        cy={end.y}
        r={2}
        fill={player.color}
      />
    </g>
  );
};

export default PlayerPath;
