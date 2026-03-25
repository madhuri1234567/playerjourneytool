import type { MapPoint, Dimensions } from "@/types/map";
import { worldToPixel, sortByOrder, buildPathD } from "@/lib/visualization";
import JourneyPath from "./JourneyPath";
import MapPointMarker from "./MapPointMarker";

interface MapOverlayProps {
  points: MapPoint[];
  dimensions: Dimensions;
  activePoint: string | null;
  onPointHover: (id: string | null) => void;
}

/** SVG layer rendered on top of the map image. Pure visualization — no state. */
const MapOverlay = ({ points, dimensions, activePoint, onPointHover }: MapOverlayProps) => {
  const { width, height } = dimensions;
  const sorted = sortByOrder(points);
  const coords = sorted.map((p) => worldToPixel(p.x, p.y, dimensions));
  const pathD = buildPathD(coords);

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <JourneyPath coords={coords} pathD={pathD} />

      {sorted.map((point, i) => (
        <MapPointMarker
          key={point.id}
          pos={coords[i]}
          order={point.order}
          label={point.label}
          isActive={activePoint === point.id}
          onMouseEnter={() => onPointHover(point.id)}
          onMouseLeave={() => onPointHover(null)}
        />
      ))}
    </svg>
  );
};

export default MapOverlay;
