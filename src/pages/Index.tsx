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
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [matchData, setMatchData] = useState<PlayerData>(sampleData);
  const [isLoading, setIsLoading] = useState(false);

  // Load match index on mount
  useEffect(() => {
    fetch("/data/matchIndex.json")
      .then((r) => r.json())
      .then((index: MatchIndexEntry[]) => {
        setMatchIndex(index);
        // Auto-select first match
        if (index.length > 0) {
          loadMatch(index[0]);
        }
      })
      .catch(() => {
        // Fallback to sample data silently
      });
  }, []);

  const loadMatch = useCallback(async (entry: MatchIndexEntry) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/data/${entry.file}`);
      const data: PlayerData = await res.json();
      setMatchData(data);
      setSelectedMatchId(entry.match_id);
      toast.success(`Loaded match: ${entry.player_count} player(s), ${formatDuration(entry.duration)}`);
    } catch {
      toast.error("Failed to load match data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMatchChange = useCallback(
    (matchId: string) => {
      const entry = matchIndex.find((m) => m.match_id === matchId);
      if (entry) {
        loadMatch(entry);
      } else if (!matchId) {
        // "All" selected — load sample/first
        setSelectedMatchId("");
        setMatchData(sampleData);
      }
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

  // Build match options for dropdown
  const matchOptions = useMemo(
    () =>
      matchIndex.map((m) => ({
        value: m.match_id,
        label: `${m.match_id.split("-")[0]} · ${m.map} · ${m.player_count}p · ${formatDuration(m.duration)}`,
      })),
    [matchIndex]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar onDataLoaded={handleDataLoaded} onError={handleError} />

      {matchOptions.length > 0 && (
        <FilterBar
          matchOptions={matchOptions}
          selectedMatchId={selectedMatchId}
          onMatchChange={handleMatchChange}
          mapId={mapId}
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

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m${s > 0 ? ` ${s}s` : ""}`;
}

export default Index;
