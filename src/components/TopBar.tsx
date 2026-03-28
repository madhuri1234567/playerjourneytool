import { MapPin } from "lucide-react";
import JsonUpload from "./JsonUpload";
import type { PlayerData } from "@/types/map";

interface TopBarProps {
  onDataLoaded: (data: PlayerData) => void;
  onError: (message: string) => void;
}

const TopBar = ({ onDataLoaded, onError }: TopBarProps) => (
  <header className="h-12 flex items-center justify-between px-5 bg-topbar border-b border-border/70 shrink-0">
    <div className="flex items-center gap-2.5">
      <MapPin className="w-4.5 h-4.5 text-primary" />
      <h1 className="text-sm font-semibold tracking-wide text-foreground">
        Player Journey Tool
      </h1>
    </div>
    <JsonUpload onDataLoaded={onDataLoaded} onError={onError} />
  </header>
);

export default TopBar;
