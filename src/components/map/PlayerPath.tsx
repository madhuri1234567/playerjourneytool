import { useMemo, memo } from "react";
import type { Dimensions, PlayerWithColor, MapConfig } from "@/types/map";
import { worldToPixel, sortByTimestamp, buildPathD, pathUpToTime } from "@/lib/visualization";

interface PlayerPathProps {
  player: PlayerWithColor;
  dimensions: Dimensions;
  currentTime: number;
  mapConfig: MapConfig;
}

/** Renders a single player's path progressively up to currentTime. */
const PlayerPath = memo(({ player, dimensions, currentTime, mapConfig }: PlayerPathProps) => {
  const { coords, pathD } = useMemo(() => {
    const visible = pathUpToTime(player.path, currentTime);
    const c = visible.map((pt) => worldToPixel(pt.x, pt.z, mapConfig, dimensions));
    return { coords: c, pathD: buildPathD(c) };
  }, [player.path, dimensions, currentTime, mapConfig]);

  if (coords.length === 0) return null;

  const start = coords[0];
  const end = coords[coords.length - 1];

  const sorted = sortByTimestamp(player.path);
  const isComplete = sorted.length > 0 && currentTime >= sorted[sorted.length - 1].t;

  return (
    <g>
      <path
        d={pathD}
        fill="none"
        stroke="hsl(0, 0%, 0%)"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.2}
      />
      <path
        d={pathD}
        fill="none"
        stroke={player.color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={player.is_bot ? "8 5" : "none"}
        opacity={0.9}
      />

      <circle cx={start.x} cy={start.y} r={6} fill="hsl(0, 0%, 0%)" opacity={0.3} />
      <circle
        cx={start.x}
        cy={start.y}
        r={5}
        fill={player.color}
        stroke="hsl(var(--background))"
        strokeWidth={2}
      />

      {isComplete && (
        <>
          <circle cx={end.x} cy={end.y} r={6} fill="hsl(0, 0%, 0%)" opacity={0.25} />
          <circle
            cx={end.x}
            cy={end.y}
            r={5}
            fill="none"
            stroke={player.color}
            strokeWidth={2.5}
          />
          <circle cx={end.x} cy={end.y} r={2} fill={player.color} />
        </>
      )}
    </g>
  );
});

PlayerPath.displayName = "PlayerPath";

export default PlayerPath;
