import { useState, useCallback, useMemo, useEffect } from "react";
import TopBar from "@/components/TopBar";
import FilterBar from "@/components/FilterBar";
import JourneyMap from "@/components/JourneyMap";
import EmptyState from "@/components/EmptyState";
import sampleData from "@/data/samplePlayers";
import type { PlayerData, MatchIndexEntry } from "@/types/map";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [matchIndex, setMatchIndex] = useState<MatchIndexEntry[]>([]);
  const [selectedMap, setSelectedMap] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [matchData, setMatchData] = useState<PlayerData>(sampleData);
  const [isLoading, setIsLoading] = useState(true);

  // Load match index on mount
  useEffect(() => {
    fetch("/data/matchIndex.json")
      .then((r) => r.json())
      .then((index: MatchIndexEntry[]) => {
        setMatchIndex(index);
        if (index.length > 0) {
          loadMatch(index[0]);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  const loadMatch = useCallback(async (entry: MatchIndexEntry) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/data/${entry.file}`);
      const data: PlayerData = await res.json();
      setMatchData(data);
      setSelectedMatchId(entry.match_id);
    } catch {
      toast.error("Failed to load match data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // When filters change, auto-select first matching match
  const filteredIndex = useMemo(() => {
    let filtered = matchIndex;
    if (selectedMap) filtered = filtered.filter((m) => m.map === selectedMap);
    if (selectedDate) filtered = filtered.filter((m) => m.date === selectedDate);
    return filtered;
  }, [matchIndex, selectedMap, selectedDate]);

  const handleMapChange = useCallback((map: string) => {
    setSelectedMap(map);
    setSelectedDate("");
  }, []);

  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  // Auto-load first match when filtered list changes
  useEffect(() => {
    if (filteredIndex.length > 0) {
      const current = filteredIndex.find((m) => m.match_id === selectedMatchId);
      if (!current) {
        loadMatch(filteredIndex[0]);
      }
    }
  }, [filteredIndex, selectedMatchId, loadMatch]);

  const handleMatchChange = useCallback(
    (matchId: string) => {
      const entry = matchIndex.find((m) => m.match_id === matchId);
      if (entry) loadMatch(entry);
    },
    [matchIndex, loadMatch]
  );

  const handleDataLoaded = useCallback((newData: PlayerData) => {
    setMatchData(newData);
    setSelectedMatchId(newData.match_id ?? "custom");
    toast.success(`Loaded ${newData.players.length} player(s) from file`);
  }, []);

  const handleError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  const mapId = matchData.map ?? "AmbroseValley";
  const players = matchData.players;
  const events = matchData.events ?? [];
  const isEmpty = players.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar onDataLoaded={handleDataLoaded} onError={handleError} />

      {matchIndex.length > 0 && (
        <FilterBar
          matchIndex={matchIndex}
          selectedMap={selectedMap}
          selectedDate={selectedDate}
          selectedMatchId={selectedMatchId}
          onMapChange={handleMapChange}
          onDateChange={handleDateChange}
          onMatchChange={handleMatchChange}
        />
      )}

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Loading match data…</p>
          </div>
        </div>
      ) : isEmpty ? (
        <EmptyState hasFilters={false} onClearFilters={() => {}} />
      ) : (
        <JourneyMap players={players} events={events} mapId={mapId} />
      )}
    </div>
  );
};

export default Index;
