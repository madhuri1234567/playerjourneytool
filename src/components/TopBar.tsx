import { MapPin } from "lucide-react";

const TopBar = () => (
  <header className="h-14 flex items-center px-6 gap-3 bg-topbar border-b border-border shrink-0">
    <MapPin className="w-5 h-5 text-primary" />
    <h1 className="text-lg font-semibold tracking-wide text-foreground">
      Player Journey Tool
    </h1>
  </header>
);

export default TopBar;
