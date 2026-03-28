import type { Dimensions, PlayerWithColor, GameEvent, HeatmapType, LayerVisibility } from "@/types/map";
import PlayerPath from "./PlayerPath";
import EventOverlay from "./EventOverlay";
import HeatmapOverlay from "./HeatmapOverlay";
import { useMemo } from "react";

interface PlayerOverlayProps {
  players: PlayerWithColor[];
  dimensions: Dimensions;
  currentTime: number;
  hiddenPlayerIds: Set<string>;
  events: GameEvent[];
  layers: LayerVisibility;
  heatmapType: HeatmapType;
}

/** SVG layer rendering all visualization layers on the map. */
const PlayerOverlay = ({
  players,
  dimensions,
  currentTime,
  hiddenPlayerIds,
  events,
  layers,
  heatmapType,
}: PlayerOverlayProps) => {
  const { width, height } = dimensions;

  const visiblePlayers = useMemo(
    () => players.filter((p) => !hiddenPlayerIds.has(p.id)),
    [players, hiddenPlayerIds]
  );

  const paths = useMemo(
    () => visiblePlayers.map((p) => p.path),
    [visiblePlayers]
  );

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Heatmap (lowest layer) */}
      {layers.heatmap && (
        <HeatmapOverlay
          type={heatmapType}
          paths={paths}
          events={events}
          dimensions={dimensions}
        />
      )}

      {/* Player paths */}
      {layers.paths &&
        visiblePlayers.map((player) => (
          <PlayerPath
            key={player.id}
            player={player}
            dimensions={dimensions}
            currentTime={currentTime}
          />
        ))}

      {/* Event markers (topmost, needs pointer-events for tooltips) */}
      {layers.events && (
        <g className="pointer-events-auto">
          <EventOverlay
            events={events}
            dimensions={dimensions}
            currentTime={currentTime}
            hiddenPlayerIds={hiddenPlayerIds}
          />
        </g>
      )}
    </svg>
  );
};

export default PlayerOverlay;
