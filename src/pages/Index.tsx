import { useState, useCallback, useMemo } from "react";
import TopBar from "@/components/TopBar";
import FilterBar from "@/components/FilterBar";
import JourneyMap from "@/components/JourneyMap";
import sampleData from "@/data/samplePlayers";
import type { PlayerData } from "@/types/map";
import { toast } from "sonner";

const Index = () => {
  const [allData, setAllData] = useState<PlayerData[]>([sampleData]);

  // Filters
  const [selectedMap, setSelectedMap] = useState("");
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleDataLoaded = useCallback((newData: PlayerData) => {
    setAllData((prev) => [...prev, newData]);
    toast.success(`Loaded ${newData.players.length} player(s)`);
  }, []);

  const handleError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  // Extract unique filter values
  const maps = useMemo(() => [...new Set(allData.map((d) => d.map).filter(Boolean))] as string[], [allData]);
  const matchIds = useMemo(() => [...new Set(allData.map((d) => d.match_id).filter(Boolean))] as string[], [allData]);
  const dates = useMemo(() => [...new Set(allData.map((d) => d.date).filter(Boolean))] as string[], [allData]);

  // Filter and merge data
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
      <JourneyMap players={filteredData.players} events={filteredData.events} />
    </div>
  );
};

export default Index;
