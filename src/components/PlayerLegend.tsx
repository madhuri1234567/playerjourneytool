import type { PlayerWithColor } from "@/types/map";

interface PlayerLegendProps {
  players: PlayerWithColor[];
  hiddenPlayerIds: Set<string>;
  onTogglePlayer: (id: string) => void;
}

/** Compact legend with click-to-toggle player visibility. */
const PlayerLegend = ({ players, hiddenPlayerIds, onTogglePlayer }: PlayerLegendProps) => (
  <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 pointer-events-auto">
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
      Players
    </p>
    <ul className="space-y-1">
      {players.map((player) => {
        const hidden = hiddenPlayerIds.has(player.id);
        return (
          <li
            key={player.id}
            onClick={() => onTogglePlayer(player.id)}
            className={`flex items-center gap-2 text-xs cursor-pointer select-none rounded px-1 py-0.5 transition-opacity ${
              hidden ? "opacity-35" : "opacity-100 hover:bg-secondary/50"
            }`}
          >
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
            <span className={`truncate max-w-[120px] ${hidden ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {player.id}
            </span>
            {player.is_bot && (
              <span className="text-[10px] text-muted-foreground bg-muted px-1 rounded">
                bot
              </span>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

export default PlayerLegend;
