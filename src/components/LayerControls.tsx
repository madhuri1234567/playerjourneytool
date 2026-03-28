import { Route, Eye, EyeOff, Crosshair, Flame } from "lucide-react";
import type { LayerVisibility, HeatmapType } from "@/types/map";

interface LayerControlsProps {
  layers: LayerVisibility;
  onToggleLayer: (layer: keyof LayerVisibility) => void;
  heatmapType: HeatmapType;
  onSetHeatmapType: (type: HeatmapType) => void;
}

const HEATMAP_TYPES: { value: HeatmapType; label: string }[] = [
  { value: "movement", label: "Movement" },
  { value: "kills", label: "Kills" },
  { value: "deaths", label: "Deaths" },
];

const LayerControls = ({ layers, onToggleLayer, heatmapType, onSetHeatmapType }: LayerControlsProps) => (
  <div className="absolute top-3 right-3 bg-card/92 backdrop-blur-md border border-border/80 rounded-lg px-3.5 py-2.5 pointer-events-auto shadow-lg">
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
      Layers
    </p>
    <ul className="space-y-0.5">
      <LayerToggle
        label="Paths"
        active={layers.paths}
        icon={<Route className="w-3.5 h-3.5" />}
        onClick={() => onToggleLayer("paths")}
      />
      <LayerToggle
        label="Events"
        active={layers.events}
        icon={<Crosshair className="w-3.5 h-3.5" />}
        onClick={() => onToggleLayer("events")}
      />
      <LayerToggle
        label="Heatmap"
        active={layers.heatmap}
        icon={<Flame className="w-3.5 h-3.5" />}
        onClick={() => onToggleLayer("heatmap")}
      />
    </ul>

    {/* Heatmap sub-options */}
    {layers.heatmap && (
      <div className="mt-2 pt-2 border-t border-border/60">
        <div className="flex gap-1">
          {HEATMAP_TYPES.map((ht) => (
            <button
              key={ht.value}
              onClick={() => onSetHeatmapType(ht.value)}
              className={`text-[10px] px-2 py-0.5 rounded-md font-medium transition-all duration-150 ${
                heatmapType === ht.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
              }`}
            >
              {ht.label}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

function LayerToggle({
  label,
  active,
  icon,
  onClick,
}: {
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-2 text-xs cursor-pointer select-none rounded-md px-1.5 py-1 transition-all duration-150 ${
        active ? "opacity-100 hover:bg-secondary/40" : "opacity-40 hover:opacity-60"
      }`}
    >
      {icon}
      <span className={`font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
      {active ? (
        <Eye className="w-3 h-3 text-muted-foreground/50 ml-auto" />
      ) : (
        <EyeOff className="w-3 h-3 text-muted-foreground ml-auto" />
      )}
    </li>
  );
}

export default LayerControls;
