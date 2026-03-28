import type { PlayerWithColor } from "@/types/map";
import { Eye, EyeOff } from "lucide-react";

interface PlayerLegendProps {
  players: PlayerWithColor[];
  hiddenPlayerIds: Set<string>;
  onTogglePlayer: (id: string) => void;
}

/** Compact legend with click-to-toggle player visibility. */
const PlayerLegend = ({ players, hiddenPlayerIds, onTogglePlayer }: PlayerLegendProps) => (
  <div className="absolute top-3 left-3 bg-card/92 backdrop-blur-md border border-border/80 rounded-lg px-3.5 py-2.5 pointer-events-auto shadow-lg">
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
      Players
    </p>
    <ul className="space-y-0.5">
      {players.map((player) => {
        const hidden = hiddenPlayerIds.has(player.id);
        return (
          <li
            key={player.id}
            onClick={() => onTogglePlayer(player.id)}
            className={`flex items-center gap-2 text-xs cursor-pointer select-none rounded-md px-1.5 py-1 transition-all duration-150 ${
              hidden
                ? "opacity-40 hover:opacity-60"
                : "opacity-100 hover:bg-secondary/40"
            }`}
          >
            <span className="flex items-center w-6 shrink-0">
              <svg width="24" height="6" viewBox="0 0 24 6">
                <line
                  x1="0" y1="3" x2="24" y2="3"
                  stroke={player.color}
                  strokeWidth={3}
                  strokeDasharray={player.is_bot ? "5 3" : "none"}
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className={`truncate max-w-[110px] font-medium ${hidden ? "text-muted-foreground line-through" : "text-foreground"}`}>
              {player.id}
            </span>
            {player.is_bot && (
              <span className="text-[9px] text-muted-foreground bg-muted/80 px-1 py-px rounded font-medium">
                bot
              </span>
            )}
            {hidden ? (
              <EyeOff className="w-3 h-3 text-muted-foreground ml-auto shrink-0" />
            ) : (
              <Eye className="w-3 h-3 text-muted-foreground/50 ml-auto shrink-0" />
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

export default PlayerLegend;
