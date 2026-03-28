import { Map, Hash } from "lucide-react";

interface MatchOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  matchOptions: MatchOption[];
  selectedMatchId: string;
  onMatchChange: (matchId: string) => void;
  mapId: string;
}

const FilterBar = ({
  matchOptions,
  selectedMatchId,
  onMatchChange,
  mapId,
}: FilterBarProps) => {
  return (
    <div className="flex items-center gap-4 px-5 py-2 bg-card/60 backdrop-blur-sm border-b border-border/50 text-xs">
      <label className="flex items-center gap-1.5 text-muted-foreground">
        <Hash className="w-3 h-3" />
        <span className="font-medium text-[11px]">Match</span>
        <select
          value={selectedMatchId}
          onChange={(e) => onMatchChange(e.target.value)}
          className="bg-secondary/80 text-secondary-foreground rounded-md px-2 py-1 text-[11px] border border-border/40 outline-none cursor-pointer hover:bg-secondary transition-colors max-w-[320px]"
        >
          {matchOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Map className="w-3 h-3" />
        <span className="text-[11px] font-medium text-foreground/70">{mapId}</span>
      </div>
    </div>
  );
};

export default FilterBar;
