import type { Dimensions, PlayerWithColor } from "@/types/map";
import PlayerPath from "./PlayerPath";

interface PlayerOverlayProps {
  players: PlayerWithColor[];
  dimensions: Dimensions;
}

/** SVG layer rendering all player paths on the map. Pure visualization — no state. */
const PlayerOverlay = ({ players, dimensions }: PlayerOverlayProps) => {
  const { width, height } = dimensions;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {players.map((player) => (
        <PlayerPath
          key={player.id}
          player={player}
          dimensions={dimensions}
        />
      ))}
    </svg>
  );
};

export default PlayerOverlay;
