import { MapPin } from "lucide-react";
import JsonUpload from "./JsonUpload";
import type { PlayerData } from "@/types/map";

interface TopBarProps {
  onDataLoaded: (data: PlayerData) => void;
  onError: (message: string) => void;
}

const TopBar = ({ onDataLoaded, onError }: TopBarProps) => (
  <header className="h-14 flex items-center justify-between px-6 bg-topbar border-b border-border shrink-0">
    <div className="flex items-center gap-3">
      <MapPin className="w-5 h-5 text-primary" />
      <h1 className="text-lg font-semibold tracking-wide text-foreground">
        Player Journey Tool
      </h1>
    </div>
    <JsonUpload onDataLoaded={onDataLoaded} onError={onError} />
  </header>
);

export default TopBar;
