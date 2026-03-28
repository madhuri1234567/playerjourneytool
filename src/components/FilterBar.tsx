import { Map, Hash, Calendar } from "lucide-react";
import type { MatchIndexEntry } from "@/types/map";
import { useMemo } from "react";

interface FilterBarProps {
  matchIndex: MatchIndexEntry[];
  selectedMap: string;
  selectedDate: string;
  selectedMatchId: string;
  onMapChange: (v: string) => void;
  onDateChange: (v: string) => void;
  onMatchChange: (matchId: string) => void;
}

const FilterBar = ({
  matchIndex,
  selectedMap,
  selectedDate,
  selectedMatchId,
  onMapChange,
  onDateChange,
  onMatchChange,
}: FilterBarProps) => {
  const maps = useMemo(
    () => [...new Set(matchIndex.map((m) => m.map))].sort(),
    [matchIndex]
  );

  const filteredByMap = useMemo(
    () => (selectedMap ? matchIndex.filter((m) => m.map === selectedMap) : matchIndex),
    [matchIndex, selectedMap]
  );

  const dates = useMemo(
    () => [...new Set(filteredByMap.map((m) => m.date))].sort(),
    [filteredByMap]
  );

  const filteredByDate = useMemo(
    () => (selectedDate ? filteredByMap.filter((m) => m.date === selectedDate) : filteredByMap),
    [filteredByMap, selectedDate]
  );

  const matchOptions = useMemo(
    () =>
      filteredByDate.map((m) => ({
        value: m.match_id,
        label: `${m.match_id.split("-")[0]} · ${m.player_count}p ${m.bot_count}b · ${formatDuration(m.duration)}`,
      })),
    [filteredByDate]
  );

  return (
    <div className="flex items-center gap-4 px-5 py-2 bg-card/60 backdrop-blur-sm border-b border-border/50 text-xs">
      <FilterSelect
        label="Map"
        value={selectedMap}
        options={maps}
        onChange={onMapChange}
        icon={<Map className="w-3 h-3" />}
        allLabel="All Maps"
      />
      <FilterSelect
        label="Date"
        value={selectedDate}
        options={dates}
        onChange={onDateChange}
        icon={<Calendar className="w-3 h-3" />}
        allLabel="All Dates"
      />
      <label className="flex items-center gap-1.5 text-muted-foreground">
        <Hash className="w-3 h-3" />
        <span className="font-medium text-[11px]">Match</span>
        <select
          value={selectedMatchId}
          onChange={(e) => onMatchChange(e.target.value)}
          className="bg-secondary/80 text-secondary-foreground rounded-md px-2 py-1 text-[11px] border border-border/40 outline-none cursor-pointer hover:bg-secondary transition-colors max-w-[280px]"
        >
          {matchOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <span className="ml-auto text-[10px] text-muted-foreground/70">
        {filteredByDate.length} matches
      </span>
    </div>
  );
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
  icon,
  allLabel,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  allLabel: string;
}) {
  return (
    <label className="flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="font-medium text-[11px]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-secondary/80 text-secondary-foreground rounded-md px-2 py-1 text-[11px] border border-border/40 outline-none cursor-pointer hover:bg-secondary transition-colors"
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "< 1s";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m${s > 0 ? `${s}s` : ""}`;
}

export default FilterBar;
