import { useState, useCallback, useMemo } from "react";
import TopBar from "@/components/TopBar";
import FilterBar from "@/components/FilterBar";
import JourneyMap from "@/components/JourneyMap";
import EmptyState from "@/components/EmptyState";
import sampleData from "@/data/samplePlayers";
import type { PlayerData } from "@/types/map";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [allData, setAllData] = useState<PlayerData[]>([sampleData]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedMap, setSelectedMap] = useState("");
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleDataLoaded = useCallback((newData: PlayerData) => {
    setIsLoading(true);
    // Small delay to let the UI show loading state for large files
    requestAnimationFrame(() => {
      setAllData((prev) => [...prev, newData]);
      setIsLoading(false);
      toast.success(`Loaded ${newData.players.length} player(s)`);
    });
  }, []);

  const handleError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const maps = useMemo(() => [...new Set(allData.map((d) => d.map).filter(Boolean))] as string[], [allData]);
  const matchIds = useMemo(() => [...new Set(allData.map((d) => d.match_id).filter(Boolean))] as string[], [allData]);
  const dates = useMemo(() => [...new Set(allData.map((d) => d.date).filter(Boolean))] as string[], [allData]);

  const filteredData = useMemo(() => {
    const filtered = allData.filter((d) => {
      if (selectedMap && d.map !== selectedMap) return false;
      if (selectedMatchId && d.match_id !== selectedMatchId) return false;
      if (selectedDate && d.date !== selectedDate) return false;
      return true;
    });

    return {
      players: filtered.flatMap((d) => d.players),
      events: filtered.flatMap((d) => d.events ?? []),
    };
  }, [allData, selectedMap, selectedMatchId, selectedDate]);

  const hasActiveFilters = selectedMap || selectedMatchId || selectedDate;
  const isEmpty = filteredData.players.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar onDataLoaded={handleDataLoaded} onError={handleError} />
      <FilterBar
        maps={maps}
        matchIds={matchIds}
        dates={dates}
        selectedMap={selectedMap}
        selectedMatchId={selectedMatchId}
        selectedDate={selectedDate}
        onMapChange={setSelectedMap}
        onMatchIdChange={setSelectedMatchId}
        onDateChange={setSelectedDate}
      />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Processing player data…</p>
          </div>
        </div>
      ) : isEmpty ? (
        <EmptyState
          hasFilters={!!hasActiveFilters}
          onClearFilters={() => {
            setSelectedMap("");
            setSelectedMatchId("");
            setSelectedDate("");
          }}
        />
      ) : (
        <JourneyMap players={filteredData.players} events={filteredData.events} />
      )}
    </div>
  );
};

export default Index;
