import { worldToImage, type MapPoint } from "@/lib/coordinates";

interface MapOverlayProps {
  points: MapPoint[];
  width: number;
  height: number;
  activePoint: string | null;
  onPointHover: (id: string | null) => void;
}

const MapOverlay = ({ points, width, height, activePoint, onPointHover }: MapOverlayProps) => {
  const sorted = [...points].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const coords = sorted.map((p) => worldToImage(p.x, p.y, width, height));

  const pathD = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Journey path */}
      <path
        d={pathD}
        fill="none"
        stroke="hsl(var(--journey-line))"
        strokeWidth={2.5}
        strokeDasharray="8 4"
        strokeLinecap="round"
        opacity={0.7}
      />

      {/* Points */}
      {sorted.map((point) => {
        const pos = worldToImage(point.x, point.y, width, height);
        const isActive = activePoint === point.id;
        return (
          <g
            key={point.id}
            className="pointer-events-auto cursor-pointer"
            onMouseEnter={() => onPointHover(point.id)}
            onMouseLeave={() => onPointHover(null)}
          >
            {/* Glow */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isActive ? 16 : 10}
              fill="hsl(var(--point-glow) / 0.25)"
              className="transition-all duration-200"
            />
            {/* Dot */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isActive ? 7 : 5}
              fill="hsl(var(--point-default))"
              stroke="hsl(var(--background))"
              strokeWidth={2}
              className="transition-all duration-200"
            />
            {/* Order number */}
            <text
              x={pos.x}
              y={pos.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill="hsl(var(--primary-foreground))"
              fontSize={isActive ? 9 : 7}
              fontWeight="bold"
              className="select-none transition-all duration-200"
            >
              {point.order}
            </text>
            {/* Label */}
            {isActive && point.label && (
              <g>
                <rect
                  x={pos.x + 14}
                  y={pos.y - 12}
                  width={point.label.length * 7.5 + 12}
                  height={24}
                  rx={4}
                  fill="hsl(var(--card))"
                  stroke="hsl(var(--border))"
                  strokeWidth={1}
                />
                <text
                  x={pos.x + 20}
                  y={pos.y + 1}
                  fill="hsl(var(--foreground))"
                  fontSize={12}
                  fontWeight={500}
                >
                  {point.label}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default MapOverlay;
