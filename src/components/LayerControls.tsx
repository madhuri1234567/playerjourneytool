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
  <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 pointer-events-auto">
    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
      Layers
    </p>
    <ul className="space-y-1">
      <LayerToggle
        label="Paths"
        active={layers.paths}
        icon={<Route className="w-3 h-3" />}
        onClick={() => onToggleLayer("paths")}
      />
      <LayerToggle
        label="Events"
        active={layers.events}
        icon={<Crosshair className="w-3 h-3" />}
        onClick={() => onToggleLayer("events")}
      />
      <LayerToggle
        label="Heatmap"
        active={layers.heatmap}
        icon={<Flame className="w-3 h-3" />}
        onClick={() => onToggleLayer("heatmap")}
      />
    </ul>

    {/* Heatmap sub-options */}
    {layers.heatmap && (
      <div className="mt-2 pt-1.5 border-t border-border">
        <div className="flex gap-1 flex-wrap">
          {HEATMAP_TYPES.map((ht) => (
            <button
              key={ht.value}
              onClick={() => onSetHeatmapType(ht.value)}
              className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                heatmapType === ht.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
      className={`flex items-center gap-2 text-xs cursor-pointer select-none rounded px-1 py-0.5 transition-opacity ${
        active ? "opacity-100 hover:bg-secondary/50" : "opacity-40"
      }`}
    >
      {icon}
      <span className={active ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </span>
      {active ? (
        <Eye className="w-3 h-3 text-muted-foreground ml-auto" />
      ) : (
        <EyeOff className="w-3 h-3 text-muted-foreground ml-auto" />
      )}
    </li>
  );
}

export default LayerControls;
