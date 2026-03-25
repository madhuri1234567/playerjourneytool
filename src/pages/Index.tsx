import { useState, useCallback } from "react";
import TopBar from "@/components/TopBar";
import JourneyMap from "@/components/JourneyMap";
import sampleData from "@/data/samplePlayers";
import type { PlayerData } from "@/types/map";
import { toast } from "sonner";

const Index = () => {
  const [data, setData] = useState<PlayerData>(sampleData);

  const handleDataLoaded = useCallback((newData: PlayerData) => {
    setData(newData);
    toast.success(`Loaded ${newData.players.length} player(s)`);
  }, []);

  const handleError = useCallback((message: string) => {
    toast.error(message);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopBar onDataLoaded={handleDataLoaded} onError={handleError} />
      <JourneyMap players={data.players} />
    </div>
  );
};

export default Index;
