import { Calendar, Map, Hash } from "lucide-react";

interface FilterBarProps {
  maps: string[];
  matchIds: string[];
  dates: string[];
  selectedMap: string;
  selectedMatchId: string;
  selectedDate: string;
  onMapChange: (v: string) => void;
  onMatchIdChange: (v: string) => void;
  onDateChange: (v: string) => void;
}

const FilterBar = ({
  maps,
  matchIds,
  dates,
  selectedMap,
  selectedMatchId,
  selectedDate,
  onMapChange,
  onMatchIdChange,
  onDateChange,
}: FilterBarProps) => {
  const hasFilters = maps.length > 1 || matchIds.length > 1 || dates.length > 1;

  if (!hasFilters) return null;

  return (
    <div className="flex items-center gap-4 px-5 py-2 bg-card/60 backdrop-blur-sm border-b border-border/50 text-xs">
      {maps.length > 1 && (
        <FilterSelect label="Map" value={selectedMap} options={maps} onChange={onMapChange} icon={<Map className="w-3 h-3" />} />
      )}
      {matchIds.length > 1 && (
        <FilterSelect label="Match" value={selectedMatchId} options={matchIds} onChange={onMatchIdChange} icon={<Hash className="w-3 h-3" />} />
      )}
      {dates.length > 1 && (
        <FilterSelect label="Date" value={selectedDate} options={dates} onChange={onDateChange} icon={<Calendar className="w-3 h-3" />} />
      )}
    </div>
  );
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
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
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

export default FilterBar;
