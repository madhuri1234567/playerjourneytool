import type { PlayerWithColor } from "@/types/map";

interface PlayerLegendProps {
  players: PlayerWithColor[];
}

/** Compact legend showing player IDs with their assigned colors. */
const PlayerLegend = ({ players }: PlayerLegendProps) => (
  <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 pointer-events-auto">
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
      Players
    </p>
    <ul className="space-y-1">
      {players.map((player) => (
        <li key={player.id} className="flex items-center gap-2 text-xs text-foreground">
          {/* Color swatch + line style preview */}
          <span className="flex items-center w-6">
            <svg width="24" height="4" viewBox="0 0 24 4">
              <line
                x1="0" y1="2" x2="24" y2="2"
                stroke={player.color}
                strokeWidth={2.5}
                strokeDasharray={player.is_bot ? "4 3" : "none"}
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="truncate max-w-[120px]">
            {player.id}
          </span>
          {player.is_bot && (
            <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">
              bot
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default PlayerLegend;
